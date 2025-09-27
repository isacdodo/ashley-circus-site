
// api/confirmar.js
// Example Vercel Serverless function to receive RSVP submissions.
// Two modes:
// 1) If GOOGLE_SERVICE_ACCOUNT_KEY and GOOGLE_SHEET_ID are set, try to append to Google Sheets (uses googleapis).
// 2) Otherwise fallback to appending to a local CSV (useful for local dev).

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const body = req.body;

  // Basic validation
  if (!body || !body.nome || !body.contato) {
    return res.status(400).send('Missing fields');
  }

  // If Google Sheets config present, attempt to use it
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (sheetId && serviceKey) {
    try {
      const {google} = require('googleapis');
      const key = JSON.parse(serviceKey);
      const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      await jwtClient.authorize();
      const sheets = google.sheets({version: 'v4', auth: jwtClient});
      const values = [
        [new Date().toISOString(), body.nome, body.acompanhantes || '', body.contato]
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'A:D',
        valueInputOption: 'USER_ENTERED',
        resource: {values}
      });
      return res.status(200).send('OK');
    } catch (err) {
      console.error('Google sheets error', err);
      // fallthrough to CSV
    }
  }

  // Fallback: append to a CSV in /tmp (note: serverless ephemeral storage)
  try {
    const line = `${new Date().toISOString()},"${(body.nome||'').replace(/"/g,'""')}",${body.acompanhantes||0},"${(body.contato||'').replace(/"/g,'""')}"\n`;
    const csvPath = path.join('/tmp', 'confirmados.csv');
    fs.appendFileSync(csvPath, line, 'utf8');
    return res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal error');
  }
};
