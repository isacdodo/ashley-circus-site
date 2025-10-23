
// api/confirmar.js
// Example Vercel Serverless function to receive RSVP submissions.
// Two modes:
// 1) If GOOGLE_SERVICE_ACCOUNT_KEY and GOOGLE_SHEET_ID are set, try to append to Google Sheets (uses googleapis).
// 2) Otherwise fallback to appending to a local CSV (useful for local dev).


module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const body = req.body;

  // Validação básica
  if (!body || !body.nome || !body.contato) {
    return res.status(400).send('Campos obrigatórios ausentes: nome e contato');
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;

  const key = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
    ? {
        type: process.env.GOOGLE_TYPE || 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN || 'googleapis.com'
      }
    : null;

  if (!sheetId || !key) {
    return res.status(500).send('Credenciais ou ID da planilha ausentes');
  }

  try {
    const { google } = require('googleapis');
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    await jwtClient.authorize();
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });

    const adultos = Number(body.adultos || 0);
    const criancas = Number(body.criancas || 0);
    const total = adultos + criancas;

    const values = [[
      new Date().toISOString(),
      String(body.nome),
      adultos,
      criancas,
      total,
      String(body.contato)
    ]];

    const range = process.env.GOOGLE_SHEET_RANGE || 'A:F';

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    return res.status(200).send('Dados confirmados com sucesso!');
  } catch (err) {
    console.error('Erro ao gravar no Google Sheets:', err);
    return res.status(500).send('Não foi possível confirmar os dados no momento');
  }
};