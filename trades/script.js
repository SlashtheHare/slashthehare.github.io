/* ════════════════════════════════
   IMAGE DATA
════════════════════════════════ */
const ART_IMAGES = [
  'https://slashthehare.com/img/flat10.webp',
  'https://slashthehare.com/img/flat11.webp',
  'https://slashthehare.com/img/flat12.webp',
  'https://slashthehare.com/img/flat14.webp',
  'https://slashthehare.com/img/bw13.webp',
  'https://slashthehare.com/img/bw.webp',
  'https://slashthehare.com/img/sketch17.webp',
  'https://slashthehare.com/img/sketch2.webp',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/111179207_vwkwTiWhOPwzHqU.jpg',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/111179206_q0M7C3s7uV09Ame.jpg',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/111179204_A1io4fBF6I9Ybgu.jpg',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/111148269_FlDQCbwIIqDKbFH.png',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/109781395_qY0y3KbjMH9FrrD.jpg',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/115871725_XpoJajCuLmWwqmq.png',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/115828727_WYGGbZJMQePXqzd.png?1772329324',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/115823094_2miqdQBKIVos5Lf.png?1772197291',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/112184555_QiAh04pihUy2BLC.png',
  'https://slashthehare.com/img/flat8.webp',
  'https://slashthehare.com/img/bw4.webp',
  'https://slashthehare.com/img/bw5.webp',
  'https://slashthehare.com/img/bw8.webp',
  'https://slashthehare.com/img/bw11.webp',
  'https://slashthehare.com/img/bw15.webp',
  'https://slashthehare.com/img/sketch16.webp',
  'https://slashthehare.com/img/sketch15.webp',
  'https://slashthehare.com/img/sketch13.webp',
  'https://slashthehare.com/img/sketch12.webp',
  'https://slashthehare.com/img/sketch6.webp',
  'https://slashthehare.com/img/sketch7.webp',
  'https://slashthehare.com/img/sketch8.webp',
];

const CUSTOM_IMAGES = [
  'https://f2.toyhou.se/file/f2-toyhou-se/images/80072675_pz7DbLhSXMA9n9w.png?1760458715',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/114114416_v21iiehhvq1na3U.png',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/103275967_2bjTvRiwaCYD4UK.jpg?1766205188',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/107201251_35kRNBuA4HfRkYY.png?1760458656',
  'https://slashthehare.com/img/ref1.webp',
  'https://slashthehare.com/img/ref16.webp',
  'https://f2.toyhou.se/file/f2-toyhou-se/images/103276549_IYT4a6lrzVUqy0L.jpg?1760459165',
  'https://slashthehare.com/img/ref15.webp',
  'https://slashthehare.com/img/ref23.webp',
  'https://slashthehare.com/img/ref19.webp',
  'https://slashthehare.com/img/ref18.webp',
  'https://slashthehare.com/img/ref17.webp',
  'https://slashthehare.com/img/ref13.webp',
  'https://slashthehare.com/img/ref12.webp',
  'https://slashthehare.com/img/ref11.webp',
  'https://slashthehare.com/img/ref8.webp',
  'https://slashthehare.com/img/ref10.webp',
  'https://slashthehare.com/img/ref5.webp',
  'https://slashthehare.com/img/ref3.webp',
];

/* ════════════════════════════════
   GALLERY BUILDER
════════════════════════════════ */
function buildGallery(images, thumbsId, mainImgId) {
  const thumbs = document.getElementById(thumbsId);
  const mainImg = document.getElementById(mainImgId);
  if (!thumbs || !mainImg) return;

  images.forEach((src, i) => {
    const btn = document.createElement('button');
    btn.className = 'thumb-btn' + (i === 0 ? ' active' : '');
    btn.innerHTML = `<img src="${src}" alt="Sample ${i + 1}" loading="lazy"/>`;
    btn.addEventListener('click', () => {
      thumbs.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mainImg.classList.remove('loaded');
      mainImg.src = src;
    });
    thumbs.appendChild(btn);
  });

  if (images.length) {
    mainImg.src = images[0];
    mainImg.addEventListener('load', () => mainImg.classList.add('loaded'));
    if (mainImg.complete) mainImg.classList.add('loaded');
  }
}

/* ════════════════════════════════
   TRELLO CONFIG
════════════════════════════════ */
const TRELLO = {
  apiKey:  'ce6649368393f966fd02936780bb489e',
  token:   'ATTA442550ef487a3c20985aef122d65795a5be04f94fe981f88fb2d5bbca6ee2147710D6253',
  boardId: 'gsqAd4Xw',
  hideLists: [],
  listColours: {
    'to do':       'list-todo',
    'queue':       'list-todo',
    'pending':     'list-todo',
    'in progress': 'list-wip',
    'wip':         'list-wip',
    'working':     'list-wip',
    'sketch':      'list-sketch',
    'sketching':   'list-sketch',
    'lineart':     'list-sketch',
    'done':        'list-done',
    'complete':    'list-done',
    'completed':   'list-done',
    'finished':    'list-done',
  }
};

/* ════════════════════════════════
   ADMIN STATE
════════════════════════════════ */
let adminMode = false;
let boardLabels = [];

const ADMIN_KEY  = 'slash_admin_auth';
const ADMIN_HASH = 'cbe6beb26479b568e5f15b50217c6c83c0ee051dc4e522b9840d8e291d6aaf46';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function fetchBoardLabels() {
  if (boardLabels.length) return;
  const { apiKey, token, boardId } = TRELLO;
  const res = await fetch(
    `https://api.trello.com/1/boards/${boardId}/labels?key=${apiKey}&token=${token}&limit=50`
  );
  if (res.ok) boardLabels = await res.json();
}

function applyAdminMode(active) {
  adminMode = active;
  const btn = document.getElementById('admin-toggle-btn');
  if (btn) {
    btn.textContent = active ? '🔒 Exit Admin' : '⚙ Admin';
    btn.classList.toggle('admin-active', active);
  }
  const bar = document.getElementById('admin-mode-bar');
  if (bar) bar.style.display = active ? 'flex' : 'none';
  document.getElementById('queue-output').innerHTML =
    '<div class="queue-loading"><div class="spinner"></div><br/>Reloading…</div>';
  loadQueue();
}

function toggleAdminMode() {
  if (adminMode) {
    applyAdminMode(false);
    return;
  }
  // If password was previously verified and saved, skip the prompt
  if (localStorage.getItem(ADMIN_KEY) === 'true') {
    applyAdminMode(true);
    return;
  }
  openAdminPasswordModal();
}

function openAdminPasswordModal() {
  let modal = document.getElementById('admin-pw-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'admin-pw-modal';
    modal.className = 'admin-pw-backdrop';
    modal.innerHTML = `
      <div class="admin-pw-panel">
        <div class="admin-pw-header">
          <span class="admin-pw-eyebrow">⚙ Admin Access</span>
          <button class="admin-modal-close" onclick="closeAdminPasswordModal()">✕</button>
        </div>
        <div class="admin-pw-body">
          <p class="admin-pw-hint">Enter the passphrase to unlock admin controls.</p>
          <input id="admin-pw-input" class="admin-input" type="password" placeholder="Passphrase…" autocomplete="current-password"/>
          <div id="admin-pw-error" class="admin-error" style="display:none">Incorrect passphrase.</div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn-secondary" onclick="closeAdminPasswordModal()">Cancel</button>
          <button class="admin-btn-primary" onclick="submitAdminPassword()">Unlock</button>
        </div>
      </div>
    `;
    modal.addEventListener('click', e => { if (e.target === modal) closeAdminPasswordModal(); });
    document.body.appendChild(modal);
    document.getElementById('admin-pw-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') submitAdminPassword();
    });
  }
  document.getElementById('admin-pw-input').value = '';
  document.getElementById('admin-pw-error').style.display = 'none';
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('admin-pw-input').focus(), 50);
}

function closeAdminPasswordModal() {
  const modal = document.getElementById('admin-pw-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

async function submitAdminPassword() {
  const input = document.getElementById('admin-pw-input').value;
  const errEl = document.getElementById('admin-pw-error');
  const hash  = await sha256(input);
  if (hash === ADMIN_HASH) {
    localStorage.setItem(ADMIN_KEY, 'true');
    closeAdminPasswordModal();
    applyAdminMode(true);
  } else {
    errEl.style.display = '';
    document.getElementById('admin-pw-input').value = '';
    document.getElementById('admin-pw-input').focus();
  }
}


/* ════════════════════════════════
   TRELLO WRITE HELPERS
════════════════════════════════ */
async function trelloRequest(method, path, body = null) {
  const { apiKey, token } = TRELLO;
  const sep = path.includes('?') ? '&' : '?';
  const url = `https://api.trello.com/1${path}${sep}key=${apiKey}&token=${token}`;
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const txt = await res.text().catch(() => res.status);
    throw new Error(`Trello ${method} ${path} → ${res.status}: ${txt}`);
  }
  return res.json();
}

/* ── Upload a file blob as an attachment ── */
async function uploadAttachmentFile(cardId, blob, filename) {
  const { apiKey, token } = TRELLO;
  const form = new FormData();
  form.append('file', blob, filename || 'pasted-image.png');
  form.append('name', filename || 'pasted-image.png');
  const res = await fetch(
    `https://api.trello.com/1/cards/${cardId}/attachments?key=${apiKey}&token=${token}`,
    { method: 'POST', body: form }
  );
  if (!res.ok) {
    const txt = await res.text().catch(() => res.status);
    throw new Error(`Trello upload → ${res.status}: ${txt}`);
  }
  return res.json();
}

/* ── Add label to card ── */
async function addLabelToCard(cardId, labelId) {
  await trelloRequest('POST', `/cards/${cardId}/idLabels?value=${encodeURIComponent(labelId)}`);
  refreshQueue();
}

/* ── Remove label from card ── */
async function removeLabelFromCard(cardId, labelId) {
  await trelloRequest('DELETE', `/cards/${cardId}/idLabels/${labelId}`);
  refreshQueue();
}

/* ── Add attachment (image URL or embed link) to card ── */
async function addAttachmentToCard(cardId, url, name) {
  await trelloRequest('POST', `/cards/${cardId}/attachments`, { url, name: name || url });
  refreshQueue();
}

/* ── Update card description ── */
async function updateCardDesc(cardId, desc) {
  await trelloRequest('PUT', `/cards/${cardId}`, { desc });
  refreshQueue();
}

/* ── Create a new card in a list ── */
async function createCard(listId, name, desc, attachmentUrl) {
  const card = await trelloRequest('POST', `/cards`, { idList: listId, name, desc: desc || '' });
  if (attachmentUrl && card.id) {
    await trelloRequest('POST', `/cards/${card.id}/attachments`, { url: attachmentUrl });
  }
  refreshQueue();
}

/* ── Delete a card ── */
async function deleteCard(cardId) {
  await trelloRequest('DELETE', `/cards/${cardId}`);
  refreshQueue();
}

/* ── Delete an attachment from a card ── */
async function deleteAttachment(cardId, attachmentId) {
  await trelloRequest('DELETE', `/cards/${cardId}/attachments/${attachmentId}`);
  refreshQueue();
}

/* ── Create a new list on the board ── */
async function createList(name) {
  const { boardId } = TRELLO;
  return await trelloRequest('POST', `/lists`, { name, idBoard: boardId, pos: 'bottom' });
}

/* ── Move (reorder) a list by setting its position ── */
async function moveList(listId, pos) {
  return await trelloRequest('PUT', `/lists/${listId}`, { pos });
}

/* ── Image order storage (localStorage, keyed by card ID) ── */
const IMG_ORDER_KEY = 'slash_img_order';
function getImageOrder(cardId) {
  try { return JSON.parse(localStorage.getItem(IMG_ORDER_KEY) || '{}')[cardId] || null; }
  catch { return null; }
}
function saveImageOrder(cardId, ids) {
  try {
    const all = JSON.parse(localStorage.getItem(IMG_ORDER_KEY) || '{}');
    all[cardId] = ids;
    localStorage.setItem(IMG_ORDER_KEY, JSON.stringify(all));
  } catch {}
}
function applyImageOrder(cardId, attachments) {
  const order = getImageOrder(cardId);
  if (!order) return attachments;
  const map = {};
  attachments.forEach(a => map[a.id] = a);
  const sorted = order.map(id => map[id]).filter(Boolean);
  const rest = attachments.filter(a => !order.includes(a.id));
  return [...sorted, ...rest];
}

function refreshQueue() {
  document.getElementById('queue-output').innerHTML =
    '<div class="queue-loading"><div class="spinner"></div><br/>Syncing…</div>';
  loadQueue();
}

/* ════════════════════════════════
   ADMIN MODALS
════════════════════════════════ */
function ensureAdminModals() {
  if (document.getElementById('admin-modal-root')) return;
  const root = document.createElement('div');
  root.id = 'admin-modal-root';
  root.innerHTML = `
    <!-- ADD CARD MODAL -->
    <div id="admin-add-card-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-add-card-modal')">
      <div class="admin-modal-panel">
        <div class="admin-modal-header">
          <span>Add New Card</span>
          <button class="admin-modal-close" onclick="closeAdminModal('admin-add-card-modal')">✕</button>
        </div>
        <div class="admin-modal-body">
          <input id="acm-list-id" type="hidden"/>
          <label class="admin-label">Card Name <span class="admin-req">*</span></label>
          <input id="acm-name" class="admin-input" type="text" placeholder="e.g. Trade with SomeUser"/>
          <label class="admin-label">Description / Notes</label>
          <textarea id="acm-desc" class="admin-textarea" placeholder="Any notes, links, character info…"></textarea>
          <label class="admin-label">Image / Embed URL <span class="admin-hint">(optional — attached to card)</span></label>
          <input id="acm-img" class="admin-input" type="url" placeholder="https://…"/>
          <div id="acm-preview" class="admin-img-preview" style="display:none"><img id="acm-preview-img" src="" alt="preview"/></div>
          <div id="acm-error" class="admin-error" style="display:none"></div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn-secondary" onclick="closeAdminModal('admin-add-card-modal')">Cancel</button>
          <button class="admin-btn-primary" id="acm-submit" onclick="submitAddCard()">Add Card</button>
        </div>
      </div>
    </div>

    <!-- LABEL PICKER MODAL -->
    <div id="admin-label-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-label-modal')">
      <div class="admin-modal-panel admin-modal-sm">
        <div class="admin-modal-header">
          <span>Manage Labels</span>
          <button class="admin-modal-close" onclick="closeAdminModal('admin-label-modal')">✕</button>
        </div>
        <div class="admin-modal-body">
          <p class="admin-hint-text">Toggle labels on this card. Changes save to Trello instantly.</p>
          <input id="alm-card-id" type="hidden"/>
          <div id="alm-card-current-labels" type="hidden" style="display:none"></div>
          <div id="alm-label-list" class="admin-label-list"></div>
          <div id="alm-error" class="admin-error" style="display:none"></div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn-secondary" onclick="closeAdminModal('admin-label-modal')">Done</button>
        </div>
      </div>
    </div>

    <!-- ADD ATTACHMENT MODAL -->
    <div id="admin-attach-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-attach-modal')">
      <div class="admin-modal-panel admin-modal-sm">
        <div class="admin-modal-header">
          <span>Add Image / Embed</span>
          <button class="admin-modal-close" onclick="closeAdminModal('admin-attach-modal')">✕</button>
        </div>
        <div class="admin-modal-body">
          <input id="aam-card-id" type="hidden"/>
          <!-- Paste zone -->
          <div id="aam-paste-zone" class="admin-paste-zone" tabindex="0">
            <span id="aam-paste-hint">📋 Click here then paste an image (Ctrl+V / ⌘V)</span>
            <img id="aam-paste-preview" src="" alt="pasted" style="display:none;max-width:100%;max-height:160px;border-radius:4px;margin-top:0.5rem;"/>
            <button id="aam-paste-clear" style="display:none;margin-top:0.4rem;font-size:0.7rem;background:none;border:1px solid var(--faded);color:var(--faded);border-radius:3px;padding:2px 8px;cursor:pointer;" onclick="clearPastedImage()">✕ Clear</button>
          </div>
          <div class="admin-attach-or"><span>— or attach by URL —</span></div>
          <label class="admin-label">URL <span class="admin-hint">(optional if image pasted above)</span></label>
          <input id="aam-url" class="admin-input" type="url" placeholder="https://…"/>
          <label class="admin-label">Label / Name <span class="admin-hint">(optional)</span></label>
          <input id="aam-name" class="admin-input" type="text" placeholder="e.g. Reference image"/>
          <div id="aam-preview" class="admin-img-preview" style="display:none"><img id="aam-preview-img" src="" alt="preview"/></div>
          <div id="aam-error" class="admin-error" style="display:none"></div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn-secondary" onclick="closeAdminModal('admin-attach-modal')">Cancel</button>
          <button class="admin-btn-primary" onclick="submitAddAttachment()">Attach</button>
        </div>
      </div>
    </div>

    <!-- MANAGE IMAGES MODAL -->
    <div id="admin-img-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-img-modal')">
      <div class="admin-modal-panel admin-modal-sm">
        <div class="admin-modal-header">
          <span>Manage Images</span>
          <button class="admin-modal-close" onclick="closeAdminModal('admin-img-modal')">✕</button>
        </div>
        <div class="admin-modal-body">
          <input id="aim-card-id" type="hidden"/>
          <p class="admin-hint-text">Drag to reorder · click ✕ to delete. Reorder is saved locally.</p>
          <div id="aim-image-list" class="aim-image-list"></div>
          <div id="aim-error" class="admin-error" style="display:none"></div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn-secondary" onclick="closeAdminModal('admin-img-modal')">Done</button>
          <button class="admin-btn-primary" onclick="saveImgOrder()">Save Order</button>
        </div>
      </div>
    </div>

    <!-- ADD LIST MODAL -->
    <div id="admin-add-list-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-add-list-modal')">
      <div class="admin-modal-panel admin-modal-sm">
        <div class="admin-modal-header">
          <span>Add New List</span>
          <button class="admin-modal-close" onclick="closeAdminModal('admin-add-list-modal')">✕</button>
        </div>
        <div class="admin-modal-body">
          <label class="admin-label">List Name <span class="admin-req">*</span></label>
          <input id="alim-name" class="admin-input" type="text" placeholder="e.g. In Progress"/>
          <div id="alim-error" class="admin-error" style="display:none"></div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn-secondary" onclick="closeAdminModal('admin-add-list-modal')">Cancel</button>
          <button class="admin-btn-primary" id="alim-submit" onclick="submitAddList()">Create List</button>
        </div>
      </div>
    </div>

    <!-- EDIT DESC MODAL -->
    <div id="admin-desc-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-desc-modal')">
      <div class="admin-modal-panel">
        <div class="admin-modal-header">
          <span>Edit Description</span>
          <button class="admin-modal-close" onclick="closeAdminModal('admin-desc-modal')">✕</button>
        </div>
        <div class="admin-modal-body">
          <input id="adm-card-id" type="hidden"/>
          <label class="admin-label">Description / Notes</label>
          <textarea id="adm-desc" class="admin-textarea admin-textarea-lg" placeholder="Notes, links, character refs…"></textarea>
          <div id="adm-error" class="admin-error" style="display:none"></div>
        </div>
        <div class="admin-modal-footer">
          <button class="admin-btn-secondary" onclick="closeAdminModal('admin-desc-modal')">Cancel</button>
          <button class="admin-btn-primary" onclick="submitEditDesc()">Save</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // Live image preview for add-card modal
  document.getElementById('acm-img').addEventListener('input', function() {
    const prev = document.getElementById('acm-preview');
    const img  = document.getElementById('acm-preview-img');
    if (this.value.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
      img.src = this.value; prev.style.display = '';
    } else { prev.style.display = 'none'; }
  });
  // Live image preview for attach modal
  document.getElementById('aam-url').addEventListener('input', function() {
    const prev = document.getElementById('aam-preview');
    const img  = document.getElementById('aam-preview-img');
    if (this.value.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
      img.src = this.value; prev.style.display = '';
    } else { prev.style.display = 'none'; }
  });

  // Paste zone — global paste listener (active when modal is open)
  document.addEventListener('paste', function(e) {
    const modal = document.getElementById('admin-attach-modal');
    if (!modal || modal.style.display === 'none') return;
    const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (!blob) return;
        window._aamPastedBlob = blob;
        const reader = new FileReader();
        reader.onload = ev => {
          const preview = document.getElementById('aam-paste-preview');
          const hint    = document.getElementById('aam-paste-hint');
          const clearBtn = document.getElementById('aam-paste-clear');
          const zone    = document.getElementById('aam-paste-zone');
          preview.src = ev.target.result;
          preview.style.display = 'block';
          hint.style.display = 'none';
          clearBtn.style.display = 'inline-block';
          zone.classList.add('has-image');
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  });
}

function closeAdminModal(id) {
  const el = document.getElementById(id);
  if (el) { el.style.display = 'none'; document.body.style.overflow = ''; }
}

function openAddCardModal(listId) {
  ensureAdminModals();
  document.getElementById('acm-list-id').value = listId;
  document.getElementById('acm-name').value = '';
  document.getElementById('acm-desc').value = '';
  document.getElementById('acm-img').value = '';
  document.getElementById('acm-preview').style.display = 'none';
  document.getElementById('acm-error').style.display = 'none';
  document.getElementById('admin-add-card-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('acm-name').focus(), 50);
}

async function submitAddCard() {
  const btn    = document.getElementById('acm-submit');
  const listId = document.getElementById('acm-list-id').value;
  const name   = document.getElementById('acm-name').value.trim();
  const desc   = document.getElementById('acm-desc').value.trim();
  const imgUrl = document.getElementById('acm-img').value.trim();
  const errEl  = document.getElementById('acm-error');

  if (!name) { showAdminError(errEl, 'Card name is required.'); return; }
  errEl.style.display = 'none';
  btn.textContent = 'Adding…'; btn.disabled = true;
  try {
    await createCard(listId, name, desc, imgUrl || null);
    closeAdminModal('admin-add-card-modal');
  } catch(e) {
    showAdminError(errEl, 'Failed to create card: ' + e.message);
  } finally {
    btn.textContent = 'Add Card'; btn.disabled = false;
  }
}

function openAddListModal() {
  ensureAdminModals();
  document.getElementById('alim-name').value = '';
  document.getElementById('alim-error').style.display = 'none';
  document.getElementById('admin-add-list-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('alim-name').focus(), 50);
}

async function submitAddList() {
  const btn   = document.getElementById('alim-submit');
  const name  = document.getElementById('alim-name').value.trim();
  const errEl = document.getElementById('alim-error');
  if (!name) { showAdminError(errEl, 'List name is required.'); return; }
  errEl.style.display = 'none';
  btn.textContent = 'Creating…'; btn.disabled = true;
  try {
    await createList(name);
    closeAdminModal('admin-add-list-modal');
    refreshQueue();
  } catch(e) {
    showAdminError(errEl, 'Failed to create list: ' + e.message);
  } finally {
    btn.textContent = 'Create List'; btn.disabled = false;
  }
}

async function openLabelModal(cardId, currentLabelIds) {
  ensureAdminModals();
  await fetchBoardLabels();
  document.getElementById('alm-card-id').value = cardId;
  document.getElementById('alm-card-current-labels').textContent = JSON.stringify(currentLabelIds);
  document.getElementById('alm-error').style.display = 'none';

  const listEl = document.getElementById('alm-label-list');
  const colors = {
    green:'#3a8a3a', yellow:'#b8a020', orange:'#c07010',
    red:'#a01818', purple:'#7a3aaa', blue:'#1a4a9a',
    sky:'#1a90a8', lime:'#3aaa6a', pink:'#b840a0', black:'#303040'
  };

  listEl.innerHTML = boardLabels.map(lbl => {
    const active = currentLabelIds.includes(lbl.id);
    const bg = colors[lbl.color] || '#888';
    return `<button class="admin-label-toggle ${active ? 'active' : ''}"
      style="--lbl-color:${bg}"
      data-label-id="${lbl.id}"
      data-active="${active}"
      onclick="toggleLabelOnCard('${cardId}', '${lbl.id}', this)">
      <span class="admin-label-dot"></span>
      ${esc(lbl.name || lbl.color || '(unnamed)')}
      <span class="admin-label-check">${active ? '✓' : ''}</span>
    </button>`;
  }).join('') || '<p class="admin-hint-text">No labels found on this board.</p>';

  document.getElementById('admin-label-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

async function toggleLabelOnCard(cardId, labelId, btnEl) {
  const isActive = btnEl.dataset.active === 'true';
  const errEl = document.getElementById('alm-error');
  btnEl.disabled = true;
  try {
    if (isActive) {
      await removeLabelFromCard(cardId, labelId);
      btnEl.classList.remove('active');
      btnEl.dataset.active = 'false';
      btnEl.querySelector('.admin-label-check').textContent = '';
    } else {
      await addLabelToCard(cardId, labelId);
      btnEl.classList.add('active');
      btnEl.dataset.active = 'true';
      btnEl.querySelector('.admin-label-check').textContent = '✓';
    }
    errEl.style.display = 'none';
  } catch(e) {
    showAdminError(errEl, 'Failed: ' + e.message);
  } finally {
    btnEl.disabled = false;
  }
}

function openAttachModal(cardId) {
  ensureAdminModals();
  document.getElementById('aam-card-id').value = cardId;
  document.getElementById('aam-url').value = '';
  document.getElementById('aam-name').value = '';
  document.getElementById('aam-preview').style.display = 'none';
  document.getElementById('aam-error').style.display = 'none';
  // Reset paste zone
  clearPastedImage();
  document.getElementById('admin-attach-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Focus paste zone so global paste fires immediately
  setTimeout(() => document.getElementById('aam-paste-zone').focus(), 50);
}

function clearPastedImage() {
  window._aamPastedBlob = null;
  const preview  = document.getElementById('aam-paste-preview');
  const hint     = document.getElementById('aam-paste-hint');
  const clearBtn = document.getElementById('aam-paste-clear');
  const zone     = document.getElementById('aam-paste-zone');
  if (preview)  { preview.src = ''; preview.style.display = 'none'; }
  if (hint)     hint.style.display = '';
  if (clearBtn) clearBtn.style.display = 'none';
  if (zone)     zone.classList.remove('has-image');
}

async function submitAddAttachment() {
  const cardId = document.getElementById('aam-card-id').value;
  const url    = document.getElementById('aam-url').value.trim();
  const name   = document.getElementById('aam-name').value.trim();
  const errEl  = document.getElementById('aam-error');
  const blob   = window._aamPastedBlob || null;

  if (!blob && !url) { showAdminError(errEl, 'Paste an image or enter a URL.'); return; }
  errEl.style.display = 'none';

  const submitBtn = document.querySelector('#admin-attach-modal .admin-btn-primary');
  if (submitBtn) { submitBtn.textContent = 'Attaching…'; submitBtn.disabled = true; }

  try {
    if (blob) {
      const ext = blob.type.split('/')[1] || 'png';
      const filename = name ? `${name}.${ext}` : `pasted-image.${ext}`;
      await uploadAttachmentFile(cardId, blob, filename);
      // Also attach URL if one was provided
      if (url) await addAttachmentToCard(cardId, url, name || url);
    } else {
      await addAttachmentToCard(cardId, url, name);
    }
    window._aamPastedBlob = null;
    closeAdminModal('admin-attach-modal');
  } catch(e) {
    showAdminError(errEl, 'Failed: ' + e.message);
  } finally {
    if (submitBtn) { submitBtn.textContent = 'Attach'; submitBtn.disabled = false; }
  }
}

/* ── Manage Images modal ── */
let _aimAttachments = []; // working copy of attachments for the modal

function handleManageImagesClick(btn) {
  const cardId = btn.dataset.cardId;
  const attachments = JSON.parse(btn.getAttribute('data-atts').replace(/&quot;/g, '"'));
  openManageImagesModal(cardId, attachments);
}

function openManageImagesModal(cardId, attachments) {
  ensureAdminModals();
  document.getElementById('aim-card-id').value = cardId;
  document.getElementById('aim-error').style.display = 'none';
  // Apply saved order
  _aimAttachments = applyImageOrder(cardId, attachments);
  renderAimList();
  document.getElementById('admin-img-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function renderAimList() {
  const list = document.getElementById('aim-image-list');
  list.innerHTML = '';
  _aimAttachments.forEach((att, i) => {
    const thumb = (att.previews && att.previews.length)
      ? att.previews.sort((a, b) => b.width - a.width)[0].url
      : att.url;
    const item = document.createElement('div');
    item.className = 'aim-item';
    item.draggable = true;
    item.dataset.idx = i;
    item.innerHTML = `
      <span class="aim-drag-handle" title="Drag to reorder">⠿</span>
      <img class="aim-thumb" src="${esc(thumb)}" alt="${esc(att.name || 'image')}" loading="lazy"/>
      <span class="aim-name">${esc(att.name || 'Attachment')}</span>
      <div class="aim-actions">
        <button class="aim-btn aim-up" title="Move up" onclick="aimMove(${i}, -1)">↑</button>
        <button class="aim-btn aim-down" title="Move down" onclick="aimMove(${i}, 1)">↓</button>
        <button class="aim-btn aim-del" title="Delete" onclick="aimDelete('${esc(att.id)}', ${i})">✕</button>
      </div>
    `;
    // Drag-and-drop
    item.addEventListener('dragstart', e => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', i);
      item.classList.add('aim-dragging');
    });
    item.addEventListener('dragend', () => item.classList.remove('aim-dragging'));
    item.addEventListener('dragover', e => { e.preventDefault(); item.classList.add('aim-over'); });
    item.addEventListener('dragleave', () => item.classList.remove('aim-over'));
    item.addEventListener('drop', e => {
      e.preventDefault();
      item.classList.remove('aim-over');
      const from = parseInt(e.dataTransfer.getData('text/plain'));
      const to   = parseInt(item.dataset.idx);
      if (from !== to) {
        const [moved] = _aimAttachments.splice(from, 1);
        _aimAttachments.splice(to, 0, moved);
        renderAimList();
      }
    });
    list.appendChild(item);
  });
  // Disable first ↑ and last ↓
  const items = list.querySelectorAll('.aim-item');
  if (items.length) {
    items[0].querySelector('.aim-up').disabled = true;
    items[items.length - 1].querySelector('.aim-down').disabled = true;
  }
}

function aimMove(idx, dir) {
  const target = idx + dir;
  if (target < 0 || target >= _aimAttachments.length) return;
  [_aimAttachments[idx], _aimAttachments[target]] = [_aimAttachments[target], _aimAttachments[idx]];
  renderAimList();
}

async function aimDelete(attachmentId, idx) {
  const cardId = document.getElementById('aim-card-id').value;
  if (!confirm('Delete this image from Trello? This cannot be undone.')) return;
  const errEl = document.getElementById('aim-error');
  const btn = document.querySelector(`[data-idx="${idx}"] .aim-del`);
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  try {
    await deleteAttachment(cardId, attachmentId);
    _aimAttachments.splice(idx, 1);
    renderAimList();
    errEl.style.display = 'none';
  } catch(e) {
    showAdminError(errEl, 'Delete failed: ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = '✕'; }
  }
}

function saveImgOrder() {
  const cardId = document.getElementById('aim-card-id').value;
  saveImageOrder(cardId, _aimAttachments.map(a => a.id));
  closeAdminModal('admin-img-modal');
  refreshQueue();
}

function openEditDescModal(cardId, currentDesc) {
  ensureAdminModals();
  document.getElementById('adm-card-id').value = cardId;
  document.getElementById('adm-desc').value = currentDesc || '';
  document.getElementById('adm-error').style.display = 'none';
  document.getElementById('admin-desc-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('adm-desc').focus(), 50);
}

async function submitEditDesc() {
  const cardId = document.getElementById('adm-card-id').value;
  const desc   = document.getElementById('adm-desc').value;
  const errEl  = document.getElementById('adm-error');
  try {
    await updateCardDesc(cardId, desc);
    closeAdminModal('admin-desc-modal');
  } catch(e) {
    showAdminError(errEl, 'Failed: ' + e.message);
  }
}

async function confirmDeleteCard(cardId, cardName) {
  if (!confirm(`Delete card "${cardName}"?\nThis cannot be undone.`)) return;
  try {
    await deleteCard(cardId);
  } catch(e) {
    alert('Failed to delete: ' + e.message);
  }
}

function showAdminError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}

/* ════════════════════════════════
   LOAD TRELLO QUEUE
════════════════════════════════ */
async function loadQueue() {
  const out = document.getElementById('queue-output');
  const { apiKey, token, boardId, hideLists, listColours } = TRELLO;
  const base = 'https://api.trello.com/1';
  const auth = `key=${apiKey}${token ? '&token=' + token : ''}`;

  try {
    const [lRes, cRes] = await Promise.all([
      fetch(`${base}/boards/${boardId}/lists?${auth}&fields=name,id`),
      fetch(`${base}/boards/${boardId}/cards?${auth}&fields=name,idList,due,labels,url,desc,id&attachments=true&attachment_fields=url,previews,name,mimeType`)
    ]);
    if (!lRes.ok || !cRes.ok) throw new Error(`HTTP ${lRes.status}`);

    const lists = await lRes.json();
    const cards = await cRes.json();

    const hideLow = hideLists.map(n => n.toLowerCase());
    const visible = lists
      .slice(1)
      .filter(l => !hideLow.includes(l.name.toLowerCase()));

    if (!visible.length) {
      out.innerHTML = `<div class="queue-empty">No lists found.</div>`;
      return;
    }

    const byList = {};
    visible.forEach(l => byList[l.id] = []);
    cards.forEach(c => { if (byList[c.idList] !== undefined) byList[c.idList].push(c); });

    const slotEl = document.getElementById('slot-count');
    const slotElInfo = document.getElementById('slot-count-info');
    const cardsWithImages = cards.filter(c =>
      (c.attachments || []).some(a =>
        (a.mimeType && a.mimeType.startsWith('image/')) ||
        (a.previews && a.previews.length > 0)
      )
    );
    if (slotEl) slotEl.textContent = cardsWithImages.length;
    if (slotElInfo) slotElInfo.textContent = cardsWithImages.length;

    let html = '<div class="list-group" id="list-group-root">';
    visible.forEach(list => {
      const cls = listColours[list.name.toLowerCase()] || 'list-default';
      const lc = byList[list.id] || [];
      const addBtn = adminMode
        ? `<button class="admin-add-card-btn" onclick="openAddCardModal('${esc(list.id)}')">+ Add Card</button>`
        : '';
      const dragHandle = adminMode
        ? `<span class="list-drag-handle" title="Drag to reorder list">⠿</span>`
        : '';
      html += `<div class="trello-list ${cls}${adminMode ? ' list-draggable' : ''}" data-list-id="${esc(list.id)}" draggable="${adminMode}">
        <div class="trello-list-header">
          ${dragHandle}<span>${esc(list.name)}</span>
          <span class="count">${lc.length}</span>
        </div>
        <div class="trello-cards">${lc.length
          ? lc.map(c => buildCard(c)).join('')
          : '<span style="font-size:0.68rem;color:var(--faded);font-style:italic;display:block;text-align:center;">— empty —</span>'
        }</div>
        ${addBtn}
      </div>`;
    });
    html += '</div>';
    if (adminMode) {
      html += `<div style="margin-top:1rem;text-align:right;">
        <button class="admin-add-list-btn" onclick="openAddListModal()">＋ New List</button>
      </div>`;
    }
    out.innerHTML = html;

    if (adminMode) initListDragDrop();

  } catch (err) {
    console.error(err);
    out.innerHTML = `<div class="queue-error">
      Failed to load queue.<br/>
      <span style="opacity:0.6;font-size:0.7rem">${esc(err.message)}</span>
    </div>`;
  }
}

/* ════════════════════════════════
   LIST DRAG-TO-REORDER
════════════════════════════════ */
function initListDragDrop() {
  const group = document.getElementById('list-group-root');
  if (!group) return;

  let draggingEl = null;

  group.querySelectorAll('.list-draggable').forEach(el => {
    el.addEventListener('dragstart', e => {
      draggingEl = el;
      el.classList.add('list-dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', async () => {
      el.classList.remove('list-dragging');
      group.querySelectorAll('.list-draggable').forEach(e => e.classList.remove('list-drag-over'));
      // Persist new order to Trello
      const ordered = [...group.querySelectorAll('.list-draggable')];
      const total = ordered.length;
      for (let i = 0; i < total; i++) {
        const lid = ordered[i].dataset.listId;
        // Trello positions: space them out so there's room between them
        const pos = (i + 1) * 16384;
        try { await moveList(lid, pos); } catch(e) { console.warn('Reorder failed', e); }
      }
      draggingEl = null;
    });
    el.addEventListener('dragover', e => {
      e.preventDefault();
      if (!draggingEl || draggingEl === el) return;
      group.querySelectorAll('.list-draggable').forEach(e => e.classList.remove('list-drag-over'));
      el.classList.add('list-drag-over');
      // Reorder DOM for visual feedback
      const els = [...group.querySelectorAll('.list-draggable')];
      const fromIdx = els.indexOf(draggingEl);
      const toIdx   = els.indexOf(el);
      if (fromIdx < toIdx) group.insertBefore(draggingEl, el.nextSibling);
      else group.insertBefore(draggingEl, el);
    });
    el.addEventListener('dragleave', () => el.classList.remove('list-drag-over'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('list-drag-over');
    });
  });
}

/* ════════════════════════════════
   LINK EXTRACTION HELPERS
════════════════════════════════ */
function extractLinks(text) {
  if (!text) return [];
  const matches = text.match(/https?:\/\/[^\s\)\]\>\"\']+/g) || [];
  return [...new Set(matches)];
}

function linkLabel(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    const path = u.pathname.replace(/\/$/, '');
    const label = path ? host + path : host;
    return label.length > 45 ? label.slice(0, 43) + '…' : label;
  } catch {
    return url.length > 45 ? url.slice(0, 43) + '…' : url;
  }
}

function renderLinkPills(links) {
  if (!links.length) return '';
  return `<div class="card-links">${links.map(u =>
    `<a class="card-link-pill" href="${esc(u)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${esc(linkLabel(u))}</a>`
  ).join('')}</div>`;
}

function buildCard(card) {
  const colors = {
    green:  '#3a8a3a', yellow: '#b8a020', orange: '#c07010',
    red:    '#a01818', purple: '#7a3aaa', blue:   '#1a4a9a',
    sky:    '#1a90a8', lime:   '#3aaa6a', pink:   '#b840a0', black: '#303040'
  };

  const labels = card.labels?.length
    ? `<div class="card-labels">${card.labels.map(l =>
        `<span class="card-label-pill" style="background:${colors[l.color] || '#888'}">${esc(l.name || l.color || '')}</span>`
      ).join('')}</div>`
    : '';

  let due = '';
  if (card.due) {
    const d = new Date(card.due);
    const cls = d < new Date() ? ' overdue' : '';
    due = `<div class="card-due${cls}">Due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>`;
  }

  let imgStrip = '';
  const rawImageAttachments = (card.attachments || []).filter(a =>
    (a.mimeType && a.mimeType.startsWith('image/')) ||
    (a.previews && a.previews.length > 0)
  );
  const imageAttachments = applyImageOrder(card.id, rawImageAttachments);
  if (imageAttachments.length > 0) {
    const imgs = imageAttachments.map(a => {
      const src = (a.previews && a.previews.length)
        ? a.previews.sort((x, y) => y.width - x.width)[0].url
        : a.url;
      const fullSrc = a.url || src;
      return `<img class="card-img" src="${esc(src)}" data-full="${esc(fullSrc)}" alt="${esc(a.name || 'attachment')}" loading="lazy" onclick="event.stopPropagation();openLightbox('${esc(fullSrc)}')"/>`;
    }).join('');
    imgStrip = `<div class="card-img-strip">${imgs}</div>`;
  }

  const descLinks = extractLinks(card.desc || '');
  const attachLinks = (card.attachments || [])
    .filter(a => !imageAttachments.includes(a) && a.url && a.url.startsWith('http'))
    .map(a => a.url);
  const allLinks = [...new Set([...descLinks, ...attachLinks])];
  const linkPills = renderLinkPills(allLinks);

  const cardData = JSON.stringify({
    name: card.name,
    desc: card.desc || '',
    url:  card.url  || '',
    due:  card.due  || '',
    labels: (card.labels || []).map(l => ({ name: l.name, color: l.color })),
    links: allLinks,
    images: imageAttachments.map(a => ({
      thumb: (a.previews && a.previews.length)
        ? (a.previews.sort((x, y) => y.width - x.width)[0]?.url || a.url)
        : a.url,
      full: a.url
    }))
  }).replace(/'/g, '&#39;').replace(/"/g, '&quot;');

  // Admin controls
  const currentLabelIds = JSON.stringify((card.labels || []).map(l => l.id))
    .replace(/'/g, '&#39;').replace(/"/g, '&quot;');
  const descEscaped = esc(card.desc || '').replace(/&quot;/g, '\\&quot;');

  const imgAttachData = JSON.stringify(imageAttachments.map(a => ({
    id: a.id, url: a.url, name: a.name || '',
    previews: (a.previews || []).map(p => ({ url: p.url, width: p.width }))
  }))).replace(/"/g, '&quot;');

  const adminControls = adminMode ? `
    <div class="admin-card-controls">
      <button class="admin-card-btn admin-card-btn-label"
        onclick="event.stopPropagation();openLabelModal('${esc(card.id)}', ${currentLabelIds})">
        ⬛ Labels
      </button>
      <button class="admin-card-btn admin-card-btn-attach"
        onclick="event.stopPropagation();openAttachModal('${esc(card.id)}')">
        🖼 Attach
      </button>
      ${imageAttachments.length ? `<button class="admin-card-btn admin-card-btn-imgs"
        onclick="event.stopPropagation();handleManageImagesClick(this)"
        data-card-id="${esc(card.id)}"
        data-atts="${imgAttachData}">
        ✏ Images
      </button>` : ''}
      <button class="admin-card-btn admin-card-btn-desc"
        onclick="event.stopPropagation();openEditDescModal('${esc(card.id)}', '${esc(card.desc || '')}')">
        ✏ Notes
      </button>
      <button class="admin-card-btn admin-card-btn-delete"
        onclick="event.stopPropagation();confirmDeleteCard('${esc(card.id)}', '${esc(card.name)}')">
        🗑
      </button>
    </div>` : '';

  return `<div class="trello-card ${adminMode ? 'admin-card-mode' : ''}">
    ${labels}${imgStrip}
    <div class="card-name">${esc(card.name)}</div>
    ${due}
    ${linkPills}
    ${adminControls}
    <div class="card-footer-row">
      <button class="card-details-btn" onclick="event.stopPropagation();openCardDetail(this)" data-card="${cardData}">Show Details</button>
      ${card.url ? `<a class="card-trello-link" href="${esc(card.url)}" target="_blank" onclick="event.stopPropagation()">Trello ↗</a>` : ''}
    </div>
  </div>`;
}

/* ════════════════════════════════
   LIGHTBOX
════════════════════════════════ */
function openLightbox(src) {
  let lb = document.getElementById('img-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'img-lightbox';
    lb.innerHTML = `
      <div class="lb-backdrop" onclick="closeLightbox()"></div>
      <button class="lb-close" onclick="closeLightbox()">✕</button>
      <img class="lb-img" src="" alt=""/>
    `;
    document.body.appendChild(lb);
  }
  const img = lb.querySelector('.lb-img');
  img.src = '';
  img.classList.remove('lb-anim');
  void img.offsetWidth;
  img.classList.add('lb-anim');
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('img-lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════
   CARD DETAIL OVERLAY
════════════════════════════════ */
function openCardDetail(btn) {
  const colors = {
    green:'#3a8a3a', yellow:'#b8a020', orange:'#c07010',
    red:'#a01818', purple:'#7a3aaa', blue:'#1a4a9a',
    sky:'#1a90a8', lime:'#3aaa6a', pink:'#b840a0', black:'#303040'
  };

  const raw = btn.getAttribute('data-card')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const card = JSON.parse(raw);

  let overlay = document.getElementById('card-detail-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'card-detail-overlay';
    document.body.appendChild(overlay);
  }

  const labelHtml = card.labels.length
    ? card.labels.map(l =>
        `<span class="cd-label-pill" style="background:${colors[l.color] || '#888'}">${esc(l.name || '')}</span>`
      ).join('')
    : '<span class="cd-no-labels">Not started</span>';

  const dueHtml = card.due
    ? (() => {
        const d = new Date(card.due);
        const cls = d < new Date() ? ' overdue' : '';
        return `<div class="cd-due${cls}">Due ${d.toLocaleDateString('en-US', { weekday:'short', month:'long', day:'numeric', year:'numeric' })}</div>`;
      })()
    : '';

  const imgHtml = card.images.length
    ? `<div class="cd-images">${card.images.map(img =>
        `<img class="cd-img" src="${esc(img.thumb)}" data-full="${esc(img.full)}" alt="attachment" loading="lazy"
          onclick="closeCardDetail();openLightbox('${esc(img.full)}')" />`
      ).join('')}</div>`
    : '';

  const descHtml = card.desc
    ? `<div class="cd-section-label">Notes</div>
       <div class="cd-desc">${esc(card.desc).replace(/\n/g, '<br/>')}</div>`
    : '';

  const linksHtml = (card.links && card.links.length)
    ? `<div class="cd-section-label">Links</div>
       <div class="cd-links">${card.links.map(u =>
         `<a class="cd-link-pill" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(linkLabel(u))}</a>`
       ).join('')}</div>`
    : '';

  overlay.innerHTML = `
    <div class="cd-backdrop" onclick="closeCardDetail()"></div>
    <div class="cd-panel">
      <div class="cd-header">
        <span class="cd-eyebrow">Case File</span>
        <button class="cd-close" onclick="closeCardDetail()">✕</button>
      </div>
      <div class="cd-body">
        <h2 class="cd-title">${esc(card.name)}</h2>
        ${dueHtml}
        <div class="cd-section-label">Status</div>
        <div class="cd-labels">${labelHtml}</div>
        ${descHtml}
        ${linksHtml}
        ${card.images.length ? `<div class="cd-section-label">Attachments</div>${imgHtml}` : ''}
        ${card.url
          ? `<a class="cd-trello-btn" href="${esc(card.url)}" target="_blank">Open on Trello ↗</a>`
          : ''}
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  overlay.querySelectorAll('.cd-img').forEach(img => {
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  });
}

function closeCardDetail() {
  const ov = document.getElementById('card-detail-overlay');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeCardDetail();
    ['admin-add-card-modal','admin-label-modal','admin-attach-modal','admin-desc-modal']
      .forEach(id => closeAdminModal(id));
  }
});

function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

/* ════════════════════════════════
   HEADER TABS
════════════════════════════════ */
document.querySelectorAll('.header-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.header-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.header-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('hpanel-' + btn.dataset.htab).classList.add('active');
  });
});

/* ════════════════════════════════
   TABS
════════════════════════════════ */
document.querySelectorAll('.folder-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.folder-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

/* ════════════════════════════════
   INIT
════════════════════════════════ */
buildGallery(ART_IMAGES,    'art-thumbs',    'art-main-img');
buildGallery(CUSTOM_IMAGES, 'custom-thumbs', 'custom-main-img');
loadQueue();

const queueObserver = new MutationObserver(() => {
  document.querySelectorAll('.card-img:not(.loaded)').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    }
  });
});
queueObserver.observe(document.getElementById('queue-output'), { childList: true, subtree: true });
