/* ════════════════════════════════
   CHAR COUNTER
════════════════════════════════ */
const msg     = document.getElementById('f-msg');
const counter = document.getElementById('char-count');

msg.addEventListener('input', () => {
  const len = msg.value.length;
  counter.textContent = `${len} / 1000`;
  counter.classList.toggle('warn', len > 850);
});

/* ════════════════════════════════
   ANON TOGGLE
════════════════════════════════ */
const anonCheck = document.getElementById('f-anon');
const nameField = document.getElementById('f-name');

anonCheck.addEventListener('change', () => {
  if (anonCheck.checked) {
    nameField.value       = '';
    nameField.disabled    = true;
    nameField.placeholder = 'anonymous';
  } else {
    nameField.disabled    = false;
    nameField.placeholder = 'or leave blank';
  }
});

/* ════════════════════════════════
   FORM SUBMIT
   TODO: replace the fetch URL with your Cloudflare Worker URL
   e.g. 'https://your-worker.your-subdomain.workers.dev'
════════════════════════════════ */
const form    = document.getElementById('request-form');
const success = document.getElementById('form-success');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = form.querySelector('.submit-btn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';

  const payload = {
    name:      nameField.value.trim() || 'Anonymous',
    type:      document.getElementById('f-type').value,
    message:   msg.value.trim(),
    anonymous: anonCheck.checked,
  };

  try {
    // ── Swap this URL for your Worker endpoint ──
    const WORKER_URL = 'https://slashrequests.rudacpbaptista.workers.dev';

    const res = await fetch(WORKER_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Server responded ${res.status}`);

    // success
    form.style.display = 'none';
    success.classList.add('visible');

  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message ↗';
    alert('Something went wrong. Please try again.');
  }
});

/* ════════════════════════════════
   TAB SWITCHING
════════════════════════════════ */
document.querySelectorAll('.form-tab-label').forEach(tab => {
  tab.addEventListener('click', () => {
    // update active tab
    document.querySelectorAll('.form-tab-label').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // show matching panel, hide others
    const target = tab.dataset.tab;
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.style.display = panel.id === `panel-${target}` ? 'block' : 'none';
    });
  });
});