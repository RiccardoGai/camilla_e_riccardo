import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import * as dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import crypto from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

dotenv.config(); // <-- carica il file .env

const app = express();
const angularApp = new AngularNodeAppEngine();

// TODO: add cors
app.use(express.json());

const LOGIN_SECRET = process.env['LOGIN_SECRET'] || 'default_secret';
const AUTH_COOKIE_NAME = 'auth_token';

const createAuthToken = (password: string) =>
  crypto.createHmac('sha256', LOGIN_SECRET).update(password).digest('hex');

const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [name, ...rest] = part.trim().split('=');
    acc[name] = rest.join('=');
    return acc;
  }, {});
};

app.post('/api/login', async (req, res) => {
  const { password } = req.body ?? {};
  const expectedPassword = process.env['LOGIN_PASSWORD'];

  if (!expectedPassword) {
    return res.status(500).json({ success: false, message: 'Login non configurato.' });
  }

  if (typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Password mancante.' });
  }

  if (password === expectedPassword) {
    const token = createAuthToken(password);
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env['NODE_ENV'] === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 5, // 5 giorni
    });
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Password errata.' });
});

app.get('/api/session', (req, res) => {
  if (isAuthenticated(req)) {
    return res.json({ authenticated: true });
  }

  return res.status(401).json({ authenticated: false });
});

const isAuthenticated = (req: express.Request): boolean => {
  const expectedPassword = process.env['LOGIN_PASSWORD'];
  if (!expectedPassword) return false;

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[AUTH_COOKIE_NAME];
  if (!token) return false;

  const expectedToken = createAuthToken(expectedPassword);
  return token === expectedToken;
};

type GuestPayload = { name: string; isChild?: boolean; age?: string | number; note?: string };

const getSheetsClient = async () => {
  const clientEmail = process.env['GOOGLE_SHEETS_CLIENT_EMAIL'];
  const privateKey = process.env['GOOGLE_SHEETS_PRIVATE_KEY']?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Google Sheets credentials are missing.');
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const appendToSheet = async (guests: GuestPayload[]) => {
  const spreadsheetId = process.env['GOOGLE_SHEETS_SPREADSHEET_ID'];
  const sheetName = process.env['GOOGLE_SHEETS_SHEET_NAME'] || '';

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not configured.');
  }

  const auth = await getSheetsClient();
  const sheets = google.sheets({ version: 'v4', auth });
  const timestamp = new Date().toISOString();
  const rows = guests.map((guest) => [
    timestamp,
    guest.name.trim(),
    guest.isChild ? 'Sì' : 'No',
    guest.age ?? '',
    guest.note ?? '',
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:E`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });
};

app.post('/api/rsvp', async (req, res) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ success: false, message: 'Non autorizzato.' });
    }

    const { guests, notes: sharedNotes } = req.body ?? {};

    if (!Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ success: false, message: 'Nessun ospite fornito.' });
    }

    const normalizedGuests = guests
      .map((guest: GuestPayload) => ({
        name: typeof guest.name === 'string' ? guest.name : '',
        isChild: Boolean(guest.isChild),
        age: guest.age ?? '',
        note:
          typeof guest.note === 'string' ? guest.note : typeof sharedNotes === 'string' ? sharedNotes : '',
      }))
      .filter((guest) => guest.name.trim().length > 0);

    if (normalizedGuests.length === 0) {
      return res.status(400).json({ success: false, message: 'Nome ospite mancante.' });
    }

    await appendToSheet(normalizedGuests);

    await sendNotificationEmail(normalizedGuests);

    return res.status(200).json({ success: true, rowsAppended: normalizedGuests.length });
  } catch (error) {
    console.error('Errore durante la scrittura su Google Sheets:', error);
    return res.status(500).json({ success: false, message: 'Errore nel salvataggio RSVP.' });
  }
});

const sendNotificationEmail = async (guests: GuestPayload[]) => {
  const gmailUser = process.env['GMAIL_USER'];
  const gmailAppPassword = process.env['GMAIL_APP_PASSWORD'];
  const notificationEmail = process.env['NOTIFICATION_EMAIL'];

  if (!gmailUser || !gmailAppPassword || !notificationEmail) {
    console.error(
      'Impossibile inviare email: GMAIL_USER, GMAIL_APP_PASSWORD o NOTIFICATION_EMAIL non configurati.'
    );
    return;
  }

  const recipients = notificationEmail
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const html = `<h1>Nuovo RSVP Ricevuto</h1>
    <p>Sono stati ricevuti ${guests.length} nuovi RSVP:</p>
    <ul>
      ${guests
        .map(
          (guest) => `<li>
            <strong>Nome:</strong> ${guest.name} <br/>
            <strong>Bambino:</strong> ${guest.isChild ? 'Sì' : 'No'} <br/>
            <strong>Età:</strong> ${guest.age ?? ''} <br/>
            <strong>Note:</strong> ${guest.note ?? ''}
          </li>`
        )
        .join('')}
    </ul>`;

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: recipients,
      subject: 'RSVP Ricevuto',
      html,
    });
  } catch (error) {
    console.error("Errore durante l'invio dell'email di notifica:", error);
  }
};
/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
