import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import * as dotenv from 'dotenv';
import express from 'express';
import crypto from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

dotenv.config(); // <-- carica il file .env

const app = express();
const angularApp = new AngularNodeAppEngine();

// TODO: add cors
app.use(express.json());

const LOGIN_SECRET = process.env['LOGIN_SECRET'] || 'default_secret';
const AUTH_COOKIE_NAME = 'wedding_auth';

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
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[AUTH_COOKIE_NAME];
  const expectedPassword = process.env['LOGIN_PASSWORD'];

  if (!expectedPassword) {
    return res.status(500).json({ authenticated: false, message: 'Login non configurato.' });
  }

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  const expectedToken = createAuthToken(expectedPassword);
  if (token === expectedToken) {
    return res.json({ authenticated: true });
  }

  return res.status(401).json({ authenticated: false });
});
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
