
Ashley Circus — Site (HTML/CSS/JS) + example Vercel API
=====================================================

O que tem aqui
--------------
- index.html (página principal)
- styles/style.css
- scripts/script.js
- public/ (onde estão as imagens que você forneceu, se existirem)
- api/confirmar.js (exemplo de função serverless para Vercel)
- package.json

Funcionalidades
---------------
- Contador regressivo (dias) até 02/12/2025.
- Formulário RSVP que faz POST para /api/confirmar.
- Estilo responsivo (desktop + mobile) inspirado no layout fornecido.

Como rodar localmente
---------------------
1. Instale Vercel CLI (recomendado) ou serva os arquivos estáticos:
   - Para ver a versão estática localmente, basta abrir index.html no navegador (algumas funcionalidades da API não funcionarão).
   - Para rodar o API localmente, instale dependências:
       npm install
     e use `vercel dev` (precisa do Vercel CLI).

Deploy no Vercel
----------------
1. Crie uma conta e conecte ao seu repositório (GitHub/GitLab).
2. Faça push deste projeto.
3. No painel do Vercel, configure as variáveis de ambiente se quiser salvar diretamente no Google Sheets:
   - GOOGLE_SHEET_ID : ID da planilha
   - GOOGLE_SERVICE_ACCOUNT_KEY : conteúdo JSON da chave de service account (minified). *** IMPORTANTE: mantenha em segredo ***
   Caso não configure essas variáveis, o endpoint `/api/confirmar` vai gravar num arquivo CSV em /tmp (útil para testes locais).

Google Sheets (opcional)
------------------------
Se quiser que as confirmações sejam gravadas numa Google Sheet:
1. Crie um Service Account no Google Cloud.
2. Ative a API Google Sheets e crie uma chave JSON.
3. Compartilhe a planilha com o e-mail do service account (ex.: your-sa@project.iam.gserviceaccount.com) com permissão de edição.
4. Defina as variáveis de ambiente no Vercel:
   - GOOGLE_SHEET_ID : ID da planilha (ex: 1aBcDeF...)
   - GOOGLE_SERVICE_ACCOUNT_KEY : JSON da chave (colado como string)

Observações
-----------
- O exemplo da API usa o pacote `googleapis`, portanto instale as dependências antes de testar no ambiente que suporta Node.
- Em ambientes serverless, escrita em disco é efêmera. Use Google Sheets, Supabase, Airtable ou outro serviço persistente para produção.

Precisa de algo a mais?
-----------------------
Se quiser, eu posso:
- Ajustar tipografias (incluir fontes Google Fonts específicas).
- Gerar os arquivos otimizados das imagens do projeto.
- Implementar integração pronta com Google Sheets (posso dar o passo-a-passo ou preparar um script para você colar a chave).
