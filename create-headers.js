// Script temporário para criar cabeçalhos na planilha
const fs = require('fs');
const {google} = require('googleapis');

async function createHeaders() {
  try {
    // Carregar chave do service account
    const key = JSON.parse(fs.readFileSync('api/chave.json', 'utf8'));
    
    // Configurar autenticação
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    await jwtClient.authorize();
    const sheets = google.sheets({version: 'v4', auth: jwtClient});
    
    // Cabeçalhos
    const headers = [[
      'Timestamp',
      'Nome', 
      'Adultos',
      'Crianças',
      'Total',
      'Contato'
    ]];
    
    // Escrever cabeçalhos em A1:F1
    await sheets.spreadsheets.values.update({
      spreadsheetId: '12tr_4vszkYWg33En0xBtvupNaEkNjueLe_Rgg1Ukfc0',
      range: 'A1:F1',
      valueInputOption: 'RAW',
      requestBody: { values: headers }
    });
    
    console.log('✅ Cabeçalhos criados com sucesso na planilha!');
    console.log('📊 Colunas: Timestamp | Nome | Adultos | Crianças | Total | Contato');
    
  } catch (error) {
    console.error('❌ Erro ao criar cabeçalhos:', error.message);
    if (error.message.includes('Permission denied')) {
      console.log('💡 Dica: Certifique-se de que a planilha está compartilhada com:');
      console.log('   projeto-ashley@dev-range-475015-t6.iam.gserviceaccount.com');
    }
  }
}

createHeaders();




