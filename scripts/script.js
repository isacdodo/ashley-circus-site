
// script.js - handles countdown, form validation and submission (fetch to /api/confirmar)

const EVENT_DATE = new Date('2025-12-02T20:00:00');

function updateDays() {
  const diasEl = document.getElementById('dias');
  if (!diasEl) return; // skip if countdown is not present in the DOM
  const now = new Date();
  const diff = EVENT_DATE - now;
  const dias = diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
  diasEl.textContent = dias;
}
updateDays();
setInterval(updateDays, 1000 * 60 * 60); // hourly

// Simple form handling
const form = document.getElementById('rsvpForm');
const successEl = document.getElementById('success');
const qtyButtons = document.querySelectorAll('.btn-qty');
const state = { adultos: 0, criancas: 0 };

function updateQtyUI(){
  const adultosEl = document.getElementById('adultosValue');
  const criancasEl = document.getElementById('criancasValue');
  if (adultosEl) adultosEl.textContent = String(state.adultos);
  if (criancasEl) criancasEl.textContent = String(state.criancas);
}

qtyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const op = btn.getAttribute('data-op');
    if (!target || !op) return;
    if (op === 'inc') state[target]++;
    if (op === 'dec') state[target] = Math.max(0, state[target]-1);
    updateQtyUI();
  });
});
updateQtyUI();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // Mock execution for now
  successEl.textContent = '🪄 Sua presença foi confirmada';
  successEl.hidden = false;
  setTimeout(()=>{ successEl.hidden = true; }, 4000);
  // To send to API later, restore the code below and remove the mock.
  // const data = new FormData(form);
  // const payload = {
  //   nome: data.get('nome'),
  //   adultos: state.adultos,
  //   criancas: state.criancas,
  //   contato: data.get('contato'),
  //   timestamp: new Date().toISOString()
  // };
  // await fetch('/api/confirmar', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
});
