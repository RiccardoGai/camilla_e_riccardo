const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // <-- carica il file .env

const WEBSITE_URL = `https://camillariccardo.it?password=${process.env.LOGIN_PASSWORD}`;

const OUTPUT_PATH = path.join(__dirname, '../public/images/qr-code.svg');

const options = {
  type: 'svg',
  margin: 4,
  width: 300,
  color: {
    dark: '#fff', //
    light: '#0000', // Transparent background
  },
  errorCorrectionLevel: 'H', // Alto livello di correzione errori (30%)
};

async function generateQRCode() {
  try {
    const svgString = await QRCode.toString(WEBSITE_URL, options);

    fs.writeFileSync(OUTPUT_PATH, svgString);

    console.log('✅ QR Code generato con successo!');
  } catch (error) {
    console.error('❌ Errore nella generazione del QR code:', error);
    process.exit(1);
  }
}

generateQRCode();
