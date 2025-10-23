// api/init-sheet.js
// One-time helper endpoint to create header row in the configured Google Sheet.
// Writes: Timestamp | Nome | Adultos | Crianças | Total | Contato (A1:F1)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const body = req.body;

  // Validação básica dos dados recebidos
  if (!body || !body.nome || !body.contato) {
    return res.status(400).send('Campos obrigatórios ausentes: nome e contato');
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) return res.status(400).send('Missing GOOGLE_SHEET_ID');
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return res.status(400).send('Missing Google service account credentials');
  }

  try {
    const { google } = require('googleapis');

    const key = {
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
    };

    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    await jwtClient.authorize();
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });

    // Escreve os cabeçalhos na primeira linha (opcional, pode remover se já estiver na planilha)
    const headers = [[
      'Timestamp',
      'Nome',
      'Adultos',
      'Crianças',
      'Total',
      'Contato'
    ]];

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'A1:F1',
      valueInputOption: 'RAW',
      requestBody: { values: headers }
    });

    // Monta os dados recebidos para adicionar na planilha
    const values = [[
      new Date().toISOString(),
      body.nome,
      body.adultos || '',
      body.criancas || '',
      body.total || '',
      body.contato
    ]];

    // Adiciona os dados na próxima linha disponível
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:F',
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    return res.status(200).send('Dados adicionados com sucesso à planilha!');
  } catch (err) {
    console.error('Erro ao acessar o Google Sheets:', err);
    return res.status(500).send('Erro interno ao acessar a planilha');
  }
};

