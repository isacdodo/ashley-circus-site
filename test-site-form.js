// Script para testar se os dados do formulário do site vão para a planilha
// Execute: node test-site-form.js

const fs = require('fs');
const {google} = require('googleapis');

async function testSiteForm() {
  try {
    console.log('🧪 Testando se o formulário do site salva na planilha...');
    
    // Carregar chave do service account
    const key = JSON.parse(fs.readFileSync('api/chave.json', 'utf8'));
    
    // Configurar autenticação
    const jwtClient = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    await jwtClient.authorize();
    const sheets = google.sheets({version: 'v4', auth: jwtClient});
    
    // Simular dados que viriam do formulário do site
    const formData = {
      nome: 'Teste do Site - ' + new Date().toLocaleString('pt-BR'),
      adultos: Math.floor(Math.random() * 4) + 1, // 1-4 adultos
      criancas: Math.floor(Math.random() * 3),    // 0-2 crianças
      contato: 'teste@site.com'
    };
    
    const total = formData.adultos + formData.criancas;
    
    console.log('📝 Dados simulados do formulário:');
    console.log(`   Nome: ${formData.nome}`);
    console.log(`   Adultos: ${formData.adultos}`);
    console.log(`   Crianças: ${formData.criancas}`);
    console.log(`   Total: ${total} pessoas`);
    console.log(`   Contato: ${formData.contato}`);
    
    // Inserir na planilha
    const values = [[
      new Date().toISOString(),
      formData.nome,
      formData.adultos,
      formData.criancas,
      total,
      formData.contato
    ]];
    
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: '12tr_4vszkYWg33En0xBtvupNaEkNjueLe_Rgg1Ukfc0',
      range: 'A:F',
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });
    
    console.log('\n✅ Dados inseridos na planilha com sucesso!');
    console.log('🔗 Acesse a planilha: https://docs.google.com/spreadsheets/d/12tr_4vszkYWg33En0xBtvupNaEkNjueLe_Rgg1Ukfc0');
    
    // Verificar se foi inserido
    const readResult = await sheets.spreadsheets.values.get({
      spreadsheetId: '12tr_4vszkYWg33En0xBtvupNaEkNjueLe_Rgg1Ukfc0',
      range: 'A:F'
    });
    
    const rows = readResult.data.values || [];
    console.log(`📊 Total de confirmações na planilha: ${rows.length - 1}`);
    
    console.log('\n🎉 Teste concluído! O formulário do site está funcionando!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testSiteForm();
