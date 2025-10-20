// api/init-sheet.js
// One-time helper endpoint to create header row in the configured Google Sheet.
// Writes: Timestamp | Nome | Adultos | Crianças | Total | Contato (A1:F1)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const sheetId = process.env.GOOGLE_SHEET_ID;
  let serviceKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!sheetId) return res.status(400).send('Missing GOOGLE_SHEET_ID');
  if (!serviceKey) return res.status(400).send('Missing GOOGLE_SERVICE_ACCOUNT_KEY');

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

    const headers = [[
      'Timestamp',
      'Nome',
      'Adultos',
      'Crianças',
      'Total',
      'Contato'
    ]];

    // Write headers at A1:F1
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'A1:F1',
      valueInputOption: 'RAW',
      requestBody: { values: headers }
    });

    return res.status(200).send('Headers created at A1:F1');
  } catch (err) {
    console.error('init-sheet error', err);
    return res.status(500).send('Internal error');
  }
};



