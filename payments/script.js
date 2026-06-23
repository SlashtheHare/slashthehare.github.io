// Alice: Madness Returns Menu - Half Circle Navigation
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item:not(.menu-item-link)');
    const contentSections = document.querySelectorAll('.content-section');
    const titleWraps = document.querySelectorAll('.section-title-wrap');

    // ── Tab switching ──────────────────────────────────────────────
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item.getAttribute('data-tab'));
            setActiveMenuItem(item);
        });
    });

    function switchTab(tabName) {
        // Toggle content sections
        contentSections.forEach(s => s.classList.remove('active'));
        const targetSection = document.querySelector(`.content-section[data-tab="${tabName}"]`);
        if (targetSection) targetSection.classList.add('active');

        // Toggle title wraps
        titleWraps.forEach(t => t.classList.remove('active'));
        const targetTitle = document.querySelector(`.section-title-wrap[data-tab="${tabName}"]`);
        if (targetTitle) targetTitle.classList.add('active');

        document.querySelector('.book-page').scrollTo({ top: 0, behavior: 'smooth' });
    }

    function setActiveMenuItem(item) {
        menuItems.forEach(mi => mi.classList.remove('active'));
        item.classList.add('active');
    }

    // Activate the default tab title on load
    const defaultTab = document.querySelector('.menu-item.active')?.getAttribute('data-tab') || 'general';
    const defaultTitle = document.querySelector(`.section-title-wrap[data-tab="${defaultTab}"]`);
    if (defaultTitle) defaultTitle.classList.add('active');

    // ── Inner tabs (Looking For) ──────────────────────────────────
    document.querySelectorAll('.inner-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const group = tab.closest('.content-section');
            const target = tab.getAttribute('data-inner');
            group.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
            group.querySelectorAll('.inner-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            group.querySelector(`.inner-panel[data-inner="${target}"]`).classList.add('active');
        });
    });

    // ── Offer accordion ────────────────────────────────────────────
    document.querySelectorAll('.offer-item.expandable').forEach(item => {
        const header = item.querySelector('.offer-header');
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.offer-item.expandable.open').forEach(o => {
                if (o !== item) o.classList.remove('open');
            });
            item.classList.toggle('open', !isOpen);
        });
    });

    // ── Carousels ──────────────────────────────────────────────────
    document.querySelectorAll('.offer-item.expandable').forEach(item => {
        initCarousel(item);
    });

    function initCarousel(container) {
        const trackWrap = container.querySelector('.carousel-track-wrap');
        const track     = container.querySelector('.carousel-track');
        const slides    = container.querySelectorAll('.carousel-slide');
        const prevBtn   = container.querySelector('.carousel-btn.prev');
        const nextBtn   = container.querySelector('.carousel-btn.next');
        const dotsWrap  = container.querySelector('.carousel-dots');

        if (!slides.length) return;

        let current = 0;
        const total = slides.length;

        // Fix: size slides explicitly to the wrapper width so wide images don't bleed
        function sizeSlidesToWrapper() {
            const w = trackWrap.offsetWidth;
            slides.forEach(s => { s.style.minWidth = w + 'px'; s.style.width = w + 'px'; });
            track.style.transform = `translateX(-${current * trackWrap.offsetWidth}px)`;
        }

        sizeSlidesToWrapper();
        new ResizeObserver(sizeSlidesToWrapper).observe(trackWrap);

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * trackWrap.offsetWidth}px)`;
            dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
        nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

        // Click-to-zoom on slide images
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (!img) return;
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => openLightbox(img.src));
        });
    }

    // ── Lightbox ───────────────────────────────────────────────────
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = '<div id="lightbox-backdrop"></div><img id="lightbox-img" alt=""><button id="lightbox-close">✕</button>';
    document.body.appendChild(lightbox);

    const lbImg = document.getElementById('lightbox-img');
    const lbClose = document.getElementById('lightbox-close');
    const lbBackdrop = document.getElementById('lightbox-backdrop');

    function openLightbox(src) {
        lbImg.src = src;
        lightbox.classList.add('open');
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lbImg.src = '';
    }

    lbClose.addEventListener('click', closeLightbox);
    lbBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    // ── Entrance animation ─────────────────────────────────────────
    const bookPage = document.querySelector('.book-page');
    const menuContainer = document.querySelector('.menu-container');
    setTimeout(() => {
        bookPage.style.animation = 'slideInLeft 0.8s ease-out';
        menuContainer.style.animation = 'fadeIn 1s ease-out 0.3s both';
    }, 100);

    // ── Keyboard navigation (tabs) ─────────────────────────────────
    document.addEventListener('keydown', e => {
        const activeIndex = Array.from(menuItems).findIndex(i => i.classList.contains('active'));
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            menuItems[(activeIndex + 1) % menuItems.length].click();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            menuItems[(activeIndex - 1 + menuItems.length) % menuItems.length].click();
        }
    });
});

// Entrance keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-50px); }
        to   { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);

/* ════════════════════════════════
   TRELLO CONFIG
════════════════════════════════ */
const TRELLO = {
    apiKey:  'ce6649368393f966fd02936780bb489e',
    token:   'ATTA442550ef487a3c20985aef122d65795a5be04f94fe981f88fb2d5bbca6ee2147710D6253',
    boardId: 'XAPgth50',
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
let visibleLists = []; // cache for move-card dropdown

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
    const shortcut = document.getElementById('add-list-shortcut-btn');
    if (shortcut) shortcut.style.display = active ? 'inline-flex' : 'none';
    const bar = document.getElementById('admin-mode-bar');
    if (bar) bar.style.display = active ? 'flex' : 'none';
    const out = document.getElementById('queue-container');
    if (out) out.innerHTML = '<div class="queue-loading">Reloading…</div>';
    loadQueue();
}

function toggleAdminMode() {
    if (adminMode) { applyAdminMode(false); return; }
    if (localStorage.getItem(ADMIN_KEY) === 'true') { applyAdminMode(true); return; }
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

async function compressImageBlob(blob, { maxWidth = 2048, maxHeight = 2048, quality = 0.85, maxBytes = 4 * 1024 * 1024 } = {}) {
    // If already small enough, skip compression
    if (blob.size <= maxBytes) return blob;
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            const scale = Math.min(1, maxWidth / width, maxHeight / height);
            width  = Math.round(width  * scale);
            height = Math.round(height * scale);
            const canvas = document.createElement('canvas');
            canvas.width  = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            // Always compress to JPEG — clipboard PNGs are uncompressed and huge
            canvas.toBlob(compressed => {
                if (!compressed) { reject(new Error('Canvas toBlob failed')); return; }
                resolve(compressed);
            }, 'image/jpeg', quality);
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
        img.src = url;
    });
}

async function uploadAttachmentFile(cardId, blob, filename) {
    const { apiKey, token } = TRELLO;
    const safeBlob = await compressImageBlob(blob);
    // Always .jpg since compression always outputs JPEG
    const safeName = (filename || 'pasted-image.jpg').replace(/\.[^.]+$/, '.jpg');
    const form = new FormData();
    form.append('file', safeBlob, safeName);
    form.append('name', safeName);
    const res = await fetch(
        `https://api.trello.com/1/cards/${cardId}/attachments?key=${apiKey}&token=${token}`,
        { method: 'POST', body: form }
    );
    if (!res.ok) throw new Error(`Trello upload → ${res.status}`);
    return res.json();
}

async function addLabelToCard(cardId, labelId) {
    await trelloRequest('POST', `/cards/${cardId}/idLabels?value=${encodeURIComponent(labelId)}`);
    refreshQueue();
}
async function removeLabelFromCard(cardId, labelId) {
    await trelloRequest('DELETE', `/cards/${cardId}/idLabels/${labelId}`);
    refreshQueue();
}
async function addAttachmentToCard(cardId, url, name) {
    await trelloRequest('POST', `/cards/${cardId}/attachments`, { url, name: name || url });
    refreshQueue();
}
async function updateCardDesc(cardId, desc) {
    await trelloRequest('PUT', `/cards/${cardId}`, { desc });
    refreshQueue();
}
async function updateCardName(cardId, name) {
    await trelloRequest('PUT', `/cards/${cardId}`, { name });
    refreshQueue();
}
async function moveCardToList(cardId, listId) {
    await trelloRequest('PUT', `/cards/${cardId}`, { idList: listId, pos: 'bottom' });
    refreshQueue();
}
async function createCard(listId, name, desc, attachmentUrl) {
    const card = await trelloRequest('POST', `/cards`, { idList: listId, name, desc: desc || '' });
    if (attachmentUrl && card.id)
        await trelloRequest('POST', `/cards/${card.id}/attachments`, { url: attachmentUrl });
    refreshQueue();
}
async function deleteCard(cardId) {
    await trelloRequest('DELETE', `/cards/${cardId}`);
    refreshQueue();
}
async function deleteAttachment(cardId, attachmentId) {
    await trelloRequest('DELETE', `/cards/${cardId}/attachments/${attachmentId}`);
    refreshQueue();
}
async function createList(name) {
    // The Trello API requires the full 24-char board ID, not the short URL ID.
    if (!TRELLO.fullBoardId) {
        const board = await trelloRequest('GET', `/boards/${TRELLO.boardId}?fields=id`);
        TRELLO.fullBoardId = board.id;
    }
    return await trelloRequest('POST', `/lists`, { name, idBoard: TRELLO.fullBoardId, pos: 'bottom' });
}
async function archiveList(listId) {
    return await trelloRequest('PUT', `/lists/${listId}/closed`, { value: true });
}
async function updateListName(listId, name) {
    return await trelloRequest('PUT', `/lists/${listId}`, { name });
}
async function moveList(listId, pos) {
    return await trelloRequest('PUT', `/lists/${listId}`, { pos });
}

/* Image order storage */
const IMG_ORDER_KEY = 'slash_img_order';
function getImageOrder(cardId) {
    try { return JSON.parse(localStorage.getItem(IMG_ORDER_KEY) || '{}')[cardId] || null; } catch { return null; }
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
    const out = document.getElementById('queue-container');
    if (out) out.innerHTML = '<div class="queue-loading">Syncing…</div>';
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
          <div class="admin-modal-header"><span>Add New Card</span><button class="admin-modal-close" onclick="closeAdminModal('admin-add-card-modal')">✕</button></div>
          <div class="admin-modal-body">
            <input id="acm-list-id" type="hidden"/>
            <label class="admin-label">Card Name <span class="admin-req">*</span></label>
            <input id="acm-name" class="admin-input" type="text" placeholder="e.g. Commission for SomeUser"/>
            <label class="admin-label">Description / Notes</label>
            <textarea id="acm-desc" class="admin-textarea" placeholder="Any notes, links, character info…"></textarea>
            <label class="admin-label">Image / Embed URL <span class="admin-hint">(optional)</span></label>
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
          <div class="admin-modal-header"><span>Manage Labels</span><button class="admin-modal-close" onclick="closeAdminModal('admin-label-modal')">✕</button></div>
          <div class="admin-modal-body">
            <p class="admin-hint-text">Toggle labels on this card. Changes save to Trello instantly.</p>
            <input id="alm-card-id" type="hidden"/>
            <div id="alm-card-current-labels" style="display:none"></div>
            <div id="alm-label-list" class="admin-label-list"></div>
            <div id="alm-error" class="admin-error" style="display:none"></div>
          </div>
          <div class="admin-modal-footer"><button class="admin-btn-secondary" onclick="closeAdminModal('admin-label-modal')">Done</button></div>
        </div>
      </div>

      <!-- ADD ATTACHMENT MODAL -->
      <div id="admin-attach-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-attach-modal')">
        <div class="admin-modal-panel admin-modal-sm">
          <div class="admin-modal-header"><span>Add Image / Embed</span><button class="admin-modal-close" onclick="closeAdminModal('admin-attach-modal')">✕</button></div>
          <div class="admin-modal-body">
            <input id="aam-card-id" type="hidden"/>
            <div id="aam-paste-zone" class="admin-paste-zone" tabindex="0">
              <span id="aam-paste-hint">📋 Click here then paste an image (Ctrl+V / ⌘V)</span>
              <img id="aam-paste-preview" src="" alt="pasted" style="display:none;max-width:100%;max-height:160px;border-radius:4px;margin-top:0.5rem;"/>
              <button id="aam-paste-clear" style="display:none;margin-top:0.4rem;font-size:0.7rem;background:none;border:1px solid var(--bronze);color:var(--bronze);border-radius:3px;padding:2px 8px;cursor:pointer;" onclick="clearPastedImage()">✕ Clear</button>
            </div>
            <div class="admin-attach-or"><span>— or attach by URL —</span></div>
            <label class="admin-label">URL</label>
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
          <div class="admin-modal-header"><span>Manage Images</span><button class="admin-modal-close" onclick="closeAdminModal('admin-img-modal')">✕</button></div>
          <div class="admin-modal-body">
            <input id="aim-card-id" type="hidden"/>
            <p class="admin-hint-text">Drag to reorder · click ✕ to delete.</p>
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
          <div class="admin-modal-header"><span>Add New List</span><button class="admin-modal-close" onclick="closeAdminModal('admin-add-list-modal')">✕</button></div>
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
          <div class="admin-modal-header"><span>Edit Description</span><button class="admin-modal-close" onclick="closeAdminModal('admin-desc-modal')">✕</button></div>
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

      <!-- MOVE CARD MODAL -->
      <div id="admin-move-card-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-move-card-modal')">
        <div class="admin-modal-panel admin-modal-sm">
          <div class="admin-modal-header"><span>Move Card</span><button class="admin-modal-close" onclick="closeAdminModal('admin-move-card-modal')">✕</button></div>
          <div class="admin-modal-body">
            <input id="amv-card-id" type="hidden"/>
            <label class="admin-label">Move to List</label>
            <select id="amv-list-select" class="admin-input admin-select"></select>
            <div id="amv-error" class="admin-error" style="display:none"></div>
          </div>
          <div class="admin-modal-footer">
            <button class="admin-btn-secondary" onclick="closeAdminModal('admin-move-card-modal')">Cancel</button>
            <button class="admin-btn-primary" id="amv-submit" onclick="submitMoveCard()">Move</button>
          </div>
        </div>
      </div>

      <!-- RENAME LIST MODAL -->
      <div id="admin-rename-list-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-rename-list-modal')">
        <div class="admin-modal-panel admin-modal-sm">
          <div class="admin-modal-header"><span>Rename List</span><button class="admin-modal-close" onclick="closeAdminModal('admin-rename-list-modal')">✕</button></div>
          <div class="admin-modal-body">
            <input id="arl-list-id" type="hidden"/>
            <label class="admin-label">List Name <span class="admin-req">*</span></label>
            <input id="arl-name" class="admin-input" type="text" placeholder="List name…"/>
            <div id="arl-error" class="admin-error" style="display:none"></div>
          </div>
          <div class="admin-modal-footer">
            <button class="admin-btn-secondary" onclick="closeAdminModal('admin-rename-list-modal')">Cancel</button>
            <button class="admin-btn-primary" id="arl-submit" onclick="submitRenameList()">Save Name</button>
          </div>
        </div>
      </div>

      <!-- RENAME CARD MODAL -->
      <div id="admin-rename-modal" class="admin-modal-backdrop" style="display:none" onclick="if(event.target===this)closeAdminModal('admin-rename-modal')">
        <div class="admin-modal-panel admin-modal-sm">
          <div class="admin-modal-header"><span>Rename Card</span><button class="admin-modal-close" onclick="closeAdminModal('admin-rename-modal')">✕</button></div>
          <div class="admin-modal-body">
            <input id="arn-card-id" type="hidden"/>
            <label class="admin-label">Card Name <span class="admin-req">*</span></label>
            <input id="arn-name" class="admin-input" type="text" placeholder="Commission name…"/>
            <div id="arn-error" class="admin-error" style="display:none"></div>
          </div>
          <div class="admin-modal-footer">
            <button class="admin-btn-secondary" onclick="closeAdminModal('admin-rename-modal')">Cancel</button>
            <button class="admin-btn-primary" id="arn-submit" onclick="submitRenameCard()">Save Name</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    document.getElementById('arn-name').addEventListener('keydown', e => {
        if (e.key === 'Enter') submitRenameCard();
    });
    document.getElementById('arl-name').addEventListener('keydown', e => {
        if (e.key === 'Enter') submitRenameList();
    });

    document.getElementById('acm-img').addEventListener('input', function() {
        const prev = document.getElementById('acm-preview');
        const img  = document.getElementById('acm-preview-img');
        if (this.value.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
            img.src = this.value; prev.style.display = '';
        } else { prev.style.display = 'none'; }
    });
    document.getElementById('aam-url').addEventListener('input', function() {
        const prev = document.getElementById('aam-preview');
        const img  = document.getElementById('aam-preview-img');
        if (this.value.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
            img.src = this.value; prev.style.display = '';
        } else { prev.style.display = 'none'; }
    });

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
                window._aamPastedUrl  = null;
                const reader = new FileReader();
                reader.onload = ev => {
                    document.getElementById('aam-paste-preview').src = ev.target.result;
                    document.getElementById('aam-paste-preview').style.display = 'block';
                    document.getElementById('aam-paste-hint').style.display = 'none';
                    document.getElementById('aam-paste-clear').style.display = 'inline-block';
                    document.getElementById('aam-paste-zone').classList.add('has-image');
                };
                reader.readAsDataURL(blob);
                break;
            }
        }
    });}

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
        showAdminError(errEl, 'Failed: ' + e.message);
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
        showAdminError(errEl, 'Failed: ' + e.message);
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
    const rawColorNames = new Set(['green','yellow','orange','red','purple','blue','sky','lime','pink','black']);
    const namedLabels = boardLabels.filter(lbl => lbl.name && !rawColorNames.has(lbl.name.trim().toLowerCase()));
    listEl.innerHTML = namedLabels.map(lbl => {
        const active = currentLabelIds.includes(lbl.id);
        const bg = colors[lbl.color] || '#888';
        return `<button class="admin-label-toggle ${active ? 'active' : ''}"
          style="--lbl-color:${bg}" data-label-id="${lbl.id}" data-active="${active}"
          onclick="toggleLabelOnCard('${cardId}', '${lbl.id}', this)">
          <span class="admin-label-dot"></span>
          ${qesc(lbl.name || lbl.color || '(unnamed)')}
          <span class="admin-label-check">${active ? '✓' : ''}</span>
        </button>`;
    }).join('') || '<p class="admin-hint-text">No custom labels found on this board.</p>';
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
            btnEl.classList.remove('active'); btnEl.dataset.active = 'false';
            btnEl.querySelector('.admin-label-check').textContent = '';
        } else {
            await addLabelToCard(cardId, labelId);
            btnEl.classList.add('active'); btnEl.dataset.active = 'true';
            btnEl.querySelector('.admin-label-check').textContent = '✓';
        }
        errEl.style.display = 'none';
    } catch(e) {
        showAdminError(errEl, 'Failed: ' + e.message);
    } finally { btnEl.disabled = false; }
}

function openAttachModal(cardId) {
    ensureAdminModals();
    document.getElementById('aam-card-id').value = cardId;
    document.getElementById('aam-url').value = '';
    document.getElementById('aam-name').value = '';
    document.getElementById('aam-preview').style.display = 'none';
    document.getElementById('aam-error').style.display = 'none';
    clearPastedImage();
    document.getElementById('admin-attach-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('aam-paste-zone').focus(), 50);
}

function clearPastedImage() {
    window._aamPastedBlob = null;
    window._aamPastedUrl  = null;
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
    const blob = window._aamPastedBlob || null;
    if (!blob && !url) { showAdminError(errEl, 'Paste an image or enter a URL.'); return; }
    errEl.style.display = 'none';
    const submitBtn = document.querySelector('#admin-attach-modal .admin-btn-primary');
    if (submitBtn) { submitBtn.textContent = 'Attaching…'; submitBtn.disabled = true; }
    try {
        if (blob) {
            const ext = blob.type.split('/')[1] || 'png';
            await uploadAttachmentFile(cardId, blob, name ? `${name}.${ext}` : `pasted-image.${ext}`);
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

let _aimAttachments = [];

function handleManageImagesClick(btn) {
    const cardId = btn.dataset.cardId;
    const attachments = JSON.parse(btn.getAttribute('data-atts').replace(/&quot;/g, '"'));
    openManageImagesModal(cardId, attachments);
}

function openManageImagesModal(cardId, attachments) {
    ensureAdminModals();
    document.getElementById('aim-card-id').value = cardId;
    document.getElementById('aim-error').style.display = 'none';
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
          <img class="aim-thumb" src="${qesc(thumb)}" alt="${qesc(att.name || 'image')}" loading="lazy"/>
          <span class="aim-name">${qesc(att.name || 'Attachment')}</span>
          <div class="aim-actions">
            <button class="aim-btn aim-up" title="Move up" onclick="aimMove(${i}, -1)">↑</button>
            <button class="aim-btn aim-down" title="Move down" onclick="aimMove(${i}, 1)">↓</button>
            <button class="aim-btn aim-del" title="Delete" onclick="aimDelete('${qesc(att.id)}', ${i})">✕</button>
          </div>
        `;
        item.addEventListener('dragstart', e => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', i); item.classList.add('aim-dragging'); });
        item.addEventListener('dragend', () => item.classList.remove('aim-dragging'));
        item.addEventListener('dragover', e => { e.preventDefault(); item.classList.add('aim-over'); });
        item.addEventListener('dragleave', () => item.classList.remove('aim-over'));
        item.addEventListener('drop', e => {
            e.preventDefault(); item.classList.remove('aim-over');
            const from = parseInt(e.dataTransfer.getData('text/plain'));
            const to   = parseInt(item.dataset.idx);
            if (from !== to) { const [m] = _aimAttachments.splice(from, 1); _aimAttachments.splice(to, 0, m); renderAimList(); }
        });
        list.appendChild(item);
    });
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
    } catch(e) { showAdminError(errEl, 'Failed: ' + e.message); }
}

function openMoveCardModal(cardId, currentListId) {
    ensureAdminModals();
    document.getElementById('amv-card-id').value = cardId;
    document.getElementById('amv-error').style.display = 'none';
    const sel = document.getElementById('amv-list-select');
    sel.innerHTML = visibleLists
        .map(l => `<option value="${qesc(l.id)}"${l.id === currentListId ? ' selected' : ''}>${qesc(l.name)}</option>`)
        .join('');
    document.getElementById('admin-move-card-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => sel.focus(), 50);
}

async function submitMoveCard() {
    const btn    = document.getElementById('amv-submit');
    const cardId = document.getElementById('amv-card-id').value;
    const listId = document.getElementById('amv-list-select').value;
    const errEl  = document.getElementById('amv-error');
    if (!listId) { showAdminError(errEl, 'Please select a list.'); return; }
    errEl.style.display = 'none';
    btn.textContent = 'Moving…'; btn.disabled = true;
    try {
        await moveCardToList(cardId, listId);
        closeAdminModal('admin-move-card-modal');
    } catch(e) {
        showAdminError(errEl, 'Failed: ' + e.message);
    } finally {
        btn.textContent = 'Move'; btn.disabled = false;
    }
}

function openRenameCardModal(cardId, currentName) {
    ensureAdminModals();
    document.getElementById('arn-card-id').value = cardId;
    document.getElementById('arn-name').value = currentName || '';
    document.getElementById('arn-error').style.display = 'none';
    document.getElementById('admin-rename-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const inp = document.getElementById('arn-name');
    setTimeout(() => { inp.focus(); inp.select(); }, 50);
}

async function submitRenameCard() {
    const btn    = document.getElementById('arn-submit');
    const cardId = document.getElementById('arn-card-id').value;
    const name   = document.getElementById('arn-name').value.trim();
    const errEl  = document.getElementById('arn-error');
    if (!name) { showAdminError(errEl, 'Name cannot be empty.'); return; }
    errEl.style.display = 'none';
    btn.textContent = 'Saving…'; btn.disabled = true;
    try {
        await updateCardName(cardId, name);
        closeAdminModal('admin-rename-modal');
    } catch(e) {
        showAdminError(errEl, 'Failed: ' + e.message);
    } finally {
        btn.textContent = 'Save Name'; btn.disabled = false;
    }
}

async function confirmDeleteCard(cardId, cardName) {
    if (!confirm(`Delete card "${cardName}"?\nThis cannot be undone.`)) return;
    try { await deleteCard(cardId); } catch(e) { alert('Failed to delete: ' + e.message); }
}

function openRenameListModal(listId, currentName) {
    ensureAdminModals();
    document.getElementById('arl-list-id').value = listId;
    document.getElementById('arl-name').value = currentName || '';
    document.getElementById('arl-error').style.display = 'none';
    document.getElementById('admin-rename-list-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const inp = document.getElementById('arl-name');
    setTimeout(() => { inp.focus(); inp.select(); }, 50);
}

async function submitRenameList() {
    const btn    = document.getElementById('arl-submit');
    const listId = document.getElementById('arl-list-id').value;
    const name   = document.getElementById('arl-name').value.trim();
    const errEl  = document.getElementById('arl-error');
    if (!name) { showAdminError(errEl, 'Name cannot be empty.'); return; }
    errEl.style.display = 'none';
    btn.textContent = 'Saving…'; btn.disabled = true;
    try {
        await updateListName(listId, name);
        closeAdminModal('admin-rename-list-modal');
        refreshQueue();
    } catch(e) {
        showAdminError(errEl, 'Failed: ' + e.message);
    } finally {
        btn.textContent = 'Save Name'; btn.disabled = false;
    }
}

async function confirmDeleteList(listId, listName) {
    if (!confirm(`Archive list "${listName}" and all its cards?\nThis will close the list on Trello.`)) return;
    try {
        await archiveList(listId);
        refreshQueue();
    } catch(e) { alert('Failed to archive list: ' + e.message); }
}

async function confirmDeleteEmbed(cardId, attachmentId, label) {
    if (!confirm(`Remove embed "${label}"?\nThis cannot be undone.`)) return;
    try {
        await deleteAttachment(cardId, attachmentId);
        refreshQueue();
    } catch(e) { alert('Failed to delete embed: ' + e.message); }
}

function showAdminError(el, msg) { el.textContent = msg; el.style.display = 'block'; }

/* ════════════════════════════════
   LOAD TRELLO QUEUE
════════════════════════════════ */
async function loadQueue() {
    const out = document.getElementById('queue-container');
    if (!out) return;
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
        // skip first card (info card) per list[0], and filter hidden lists
        const visible = lists.slice(1).filter(l => !hideLow.includes(l.name.toLowerCase()));

        if (!visible.length) {
            out.innerHTML = `<div class="queue-loading" style="opacity:0.6">No lists found.</div>`;
            return;
        }

        visibleLists = visible; // keep in sync for move-card modal
        const byList = {};
        visible.forEach(l => byList[l.id] = []);
        cards.forEach(c => { if (byList[c.idList] !== undefined) byList[c.idList].push(c); });

        let html = '<div class="q-list-group" id="list-group-root">';
        visible.forEach(list => {
            const cls = listColours[list.name.toLowerCase()] || 'list-default';
            const lc = byList[list.id] || [];
            const addBtn = adminMode
                ? `<button class="admin-add-card-btn" onclick="openAddCardModal('${qesc(list.id)}')">+ Add Card</button>`
                : '';
            const dragHandle = adminMode
                ? `<span class="list-drag-handle" title="Drag to reorder list">⠿</span>`
                : '';
            const deleteListBtn = adminMode
                ? `<button class="admin-delete-list-btn" title="Archive this list" onclick="event.stopPropagation();confirmDeleteList('${qesc(list.id)}','${qesc(list.name)}')">🗑</button>`
                : '';
            const renameListBtn = adminMode
                ? `<button class="admin-rename-list-btn" title="Rename this list" onclick="event.stopPropagation();openRenameListModal('${qesc(list.id)}','${qesc(list.name)}')">✏</button>`
                : '';
            html += `<div class="q-trello-list ${cls}${adminMode ? ' list-draggable' : ''}" data-list-id="${qesc(list.id)}" draggable="${adminMode}">
              <div class="q-list-header">
                <div class="q-list-header-left">${dragHandle}</div>
                <span>${qesc(list.name)}</span>
                <div class="q-list-header-right"><span class="q-count">${lc.length}</span>${renameListBtn}${deleteListBtn}</div>
              </div>
              <div class="q-cards">${lc.length
                ? lc.map(c => buildCard(c)).join('')
                : '<span class="q-empty-col">— empty —</span>'
              }</div>
              ${addBtn}
            </div>`;
        });
        html += '</div>';
        out.innerHTML = html;

        if (adminMode) initListDragDrop();

        // Image load observer
        out.querySelectorAll('.q-card-img:not(.loaded)').forEach(img => {
            if (img.complete) img.classList.add('loaded');
            else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        });

    } catch (err) {
        console.error(err);
        out.innerHTML = `<div class="queue-error">Failed to load queue.<br/><span style="opacity:0.6;font-size:0.7rem">${qesc(err.message)}</span></div>`;
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
            draggingEl = el; el.classList.add('list-dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        el.addEventListener('dragend', async () => {
            el.classList.remove('list-dragging');
            group.querySelectorAll('.list-draggable').forEach(e => e.classList.remove('list-drag-over'));
            const ordered = [...group.querySelectorAll('.list-draggable')];
            for (let i = 0; i < ordered.length; i++) {
                const lid = ordered[i].dataset.listId;
                try { await moveList(lid, (i + 1) * 16384); } catch(e) { console.warn('Reorder failed', e); }
            }
            draggingEl = null;
        });
        el.addEventListener('dragover', e => {
            e.preventDefault();
            if (!draggingEl || draggingEl === el) return;
            group.querySelectorAll('.list-draggable').forEach(e => e.classList.remove('list-drag-over'));
            el.classList.add('list-drag-over');
            const els = [...group.querySelectorAll('.list-draggable')];
            const fromIdx = els.indexOf(draggingEl);
            const toIdx   = els.indexOf(el);
            if (fromIdx < toIdx) group.insertBefore(draggingEl, el.nextSibling);
            else group.insertBefore(draggingEl, el);
        });
        el.addEventListener('dragleave', () => el.classList.remove('list-drag-over'));
        el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('list-drag-over'); });
    });
}

/* ════════════════════════════════
   LINK / CARD HELPERS
════════════════════════════════ */
function extractLinks(text) {
    if (!text) return [];
    const matches = text.match(/https?:\/\/[^\s\)\]\>\"\'\,]+/g) || [];
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
    return `<div class="q-card-links">${links.map(u =>
        `<a class="q-card-link-pill" href="${qesc(u)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${qesc(linkLabel(u))}</a>`
    ).join('')}</div>`;
}

function buildCard(card) {
    const colors = {
        green:'#3a8a3a', yellow:'#b8a020', orange:'#c07010',
        red:'#a01818', purple:'#7a3aaa', blue:'#1a4a9a',
        sky:'#1a90a8', lime:'#3aaa6a', pink:'#b840a0', black:'#303040'
    };

    const labels = card.labels?.length
        ? `<div class="q-card-labels">${card.labels.map(l =>
            `<span class="q-card-label-pill" style="background:${colors[l.color] || '#888'}">${qesc(l.name || l.color || '')}</span>`
          ).join('')}</div>`
        : '';

    let due = '';
    if (card.due) {
        const d = new Date(card.due);
        const cls = d < new Date() ? ' overdue' : '';
        due = `<div class="q-card-due${cls}">Due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>`;
    }

    const rawImageAttachments = (card.attachments || []).filter(a =>
        (a.mimeType && a.mimeType.startsWith('image/')) || (a.previews && a.previews.length > 0)
    );
    const imageAttachments = applyImageOrder(card.id, rawImageAttachments);
    let imgStrip = '';
    if (imageAttachments.length > 0) {
        const imgs = imageAttachments.map(a => {
            const src = (a.previews && a.previews.length)
                ? a.previews.sort((x, y) => y.width - x.width)[0].url : a.url;
            const fullSrc = a.url || src;
            return `<img class="q-card-img" src="${qesc(src)}" data-full="${qesc(fullSrc)}" alt="${qesc(a.name || 'attachment')}" loading="lazy" onclick="event.stopPropagation();openQueueLightbox('${qesc(fullSrc)}')"/>`;
        }).join('');
        imgStrip = `<div class="q-card-img-strip">${imgs}</div>`;
    }

    const descLinks = extractLinks(card.desc || '');
    const nonImageAttachments = (card.attachments || [])
        .filter(a => !imageAttachments.includes(a) && a.url && a.url.startsWith('http'));
    const attachLinks = nonImageAttachments.map(a => a.url);
    const allLinks = [...new Set([...descLinks, ...attachLinks])];

    // In admin mode, render embeds with a delete button per attachment
    let linkPills = '';
    if (adminMode && nonImageAttachments.length) {
        linkPills = `<div class="q-card-links">${nonImageAttachments.map(a => {
            const label = linkLabel(a.url);
            const safeId  = qesc(a.id);
            const safeUrl = qesc(a.url);
            const safeLbl = qesc(label);
            return `<span class="q-card-link-pill-wrap">
              <a class="q-card-link-pill" href="${safeUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${safeLbl}</a>
              <button class="admin-embed-del-btn" title="Delete embed" onclick="event.stopPropagation();confirmDeleteEmbed('${qesc(card.id)}','${safeId}','${safeLbl}')">✕</button>
            </span>`;
        }).join('')}</div>`;
        // Also render any desc-only links (not in attachments) as plain pills
        const descOnlyLinks = descLinks.filter(u => !attachLinks.includes(u));
        if (descOnlyLinks.length) linkPills += renderLinkPills(descOnlyLinks);
    } else {
        linkPills = renderLinkPills(allLinks);
    }

    const cardData = JSON.stringify({
        name: card.name, desc: card.desc || '', url: card.url || '',
        due: card.due || '',
        labels: (card.labels || []).map(l => ({ name: l.name, color: l.color })),
        links: allLinks,
        images: imageAttachments.map(a => ({
            thumb: (a.previews && a.previews.length)
                ? (a.previews.sort((x, y) => y.width - x.width)[0]?.url || a.url)
                : a.url,
            full: a.url
        }))
    }).replace(/'/g, '&#39;').replace(/"/g, '&quot;');

    const currentLabelIds = JSON.stringify((card.labels || []).map(l => l.id))
        .replace(/'/g, '&#39;').replace(/"/g, '&quot;');

    const imgAttachData = JSON.stringify(imageAttachments.map(a => ({
        id: a.id, url: a.url, name: a.name || '',
        previews: (a.previews || []).map(p => ({ url: p.url, width: p.width }))
    }))).replace(/"/g, '&quot;');

    const adminControls = adminMode ? `
      <div class="admin-card-controls">
        <button class="admin-card-btn" onclick="event.stopPropagation();openLabelModal('${qesc(card.id)}', ${currentLabelIds})">⬛ Labels</button>
        <button class="admin-card-btn" onclick="event.stopPropagation();openAttachModal('${qesc(card.id)}')">🖼 Attach</button>
        ${imageAttachments.length ? `<button class="admin-card-btn" onclick="event.stopPropagation();handleManageImagesClick(this)" data-card-id="${qesc(card.id)}" data-atts="${imgAttachData}">✏ Images</button>` : ''}
        <button class="admin-card-btn" onclick="event.stopPropagation();openRenameCardModal('${qesc(card.id)}', '${qesc(card.name)}')">✏ Rename</button>
        <button class="admin-card-btn" onclick="event.stopPropagation();openMoveCardModal('${qesc(card.id)}', '${qesc(card.idList)}')">↪ Move</button>
        <button class="admin-card-btn" onclick="event.stopPropagation();openEditDescModal('${qesc(card.id)}', '${qesc(card.desc || '')}')">✏ Notes</button>
        <button class="admin-card-btn admin-card-btn-delete" onclick="event.stopPropagation();confirmDeleteCard('${qesc(card.id)}', '${qesc(card.name)}')">🗑</button>
      </div>` : '';

    return `<div class="q-card${adminMode ? ' admin-card-mode' : ''}">
      ${labels}${imgStrip}
      <div class="q-card-name">${qesc(card.name)}</div>
      ${due}${linkPills}${adminControls}
      <div class="q-card-footer">
        <button class="q-details-btn" onclick="event.stopPropagation();openQueueCardDetail(this)" data-card="${cardData}">Show Details</button>
        ${card.url ? `<a class="q-trello-link" href="${qesc(card.url)}" target="_blank" onclick="event.stopPropagation()">Trello ↗</a>` : ''}
      </div>
    </div>`;
}

/* ════════════════════════════════
   QUEUE LIGHTBOX
════════════════════════════════ */
function openQueueLightbox(src) {
    let lb = document.getElementById('queue-lightbox');
    if (!lb) {
        lb = document.createElement('div');
        lb.id = 'queue-lightbox';
        lb.innerHTML = `<div class="qlb-backdrop" onclick="closeQueueLightbox()"></div>
          <button class="qlb-close" onclick="closeQueueLightbox()">✕</button>
          <img class="qlb-img" src="" alt=""/>`;
        document.body.appendChild(lb);
    }
    const img = lb.querySelector('.qlb-img');
    img.src = '';          // clear previous image so it doesn't flash while the new one loads
    lb.classList.add('open');
    img.src = src;
    document.body.style.overflow = 'hidden';
}
function closeQueueLightbox() {
    const lb = document.getElementById('queue-lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
}

/* ════════════════════════════════
   QUEUE CARD DETAIL OVERLAY
════════════════════════════════ */
function openQueueCardDetail(btn) {
    const colors = {
        green:'#3a8a3a', yellow:'#b8a020', orange:'#c07010',
        red:'#a01818', purple:'#7a3aaa', blue:'#1a4a9a',
        sky:'#1a90a8', lime:'#3aaa6a', pink:'#b840a0', black:'#303040'
    };
    const raw = btn.getAttribute('data-card').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    const card = JSON.parse(raw);

    let overlay = document.getElementById('queue-card-detail');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'queue-card-detail';
        document.body.appendChild(overlay);
    }

    const labelHtml = card.labels.length
        ? card.labels.map(l => `<span class="qcd-label-pill" style="background:${colors[l.color] || '#888'}">${qesc(l.name || '')}</span>`).join('')
        : '<span style="font-style:italic;opacity:0.5;font-size:0.8rem;">Not started</span>';

    const dueHtml = card.due
        ? (() => { const d = new Date(card.due); const cls = d < new Date() ? ' overdue' : '';
            return `<div class="qcd-due${cls}">Due ${d.toLocaleDateString('en-US', { weekday:'short', month:'long', day:'numeric', year:'numeric' })}</div>`; })()
        : '';

    const imgHtml = card.images.length
        ? `<div class="qcd-images">${card.images.map(img =>
            `<img class="qcd-img" src="${qesc(img.thumb)}" data-full="${qesc(img.full)}" alt="attachment" loading="lazy"
              onclick="closeQueueCardDetail();openQueueLightbox('${qesc(img.full)}')" />`
          ).join('')}</div>`
        : '';

    const descHtml = card.desc
        ? `<div class="qcd-section-label">Notes</div>
           <div class="qcd-desc">${qesc(card.desc).replace(/\n/g, '<br/>')}</div>`
        : '';

    const linksHtml = (card.links && card.links.length)
        ? `<div class="qcd-section-label">Links</div>
           <div class="qcd-links">${card.links.map(u =>
             `<a class="qcd-link-pill" href="${qesc(u)}" target="_blank" rel="noopener noreferrer">${qesc(linkLabel(u))}</a>`
           ).join('')}</div>`
        : '';

    overlay.innerHTML = `
      <div class="qcd-backdrop" onclick="closeQueueCardDetail()"></div>
      <div class="qcd-panel">
        <div class="qcd-header">
          <span class="qcd-eyebrow">Commission File</span>
          <button class="qcd-close" onclick="closeQueueCardDetail()">✕</button>
        </div>
        <div class="qcd-body">
          <h2 class="qcd-title">${qesc(card.name)}</h2>
          ${dueHtml}
          <div class="qcd-section-label">Status</div>
          <div class="qcd-labels">${labelHtml}</div>
          ${descHtml}${linksHtml}
          ${card.images.length ? `<div class="qcd-section-label">Attachments</div>${imgHtml}` : ''}
          ${card.url ? `<a class="qcd-trello-btn" href="${qesc(card.url)}" target="_blank">Open on Trello ↗</a>` : ''}
        </div>
      </div>`;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    overlay.querySelectorAll('.qcd-img').forEach(img => {
        if (img.complete) img.classList.add('loaded');
        else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    });
}

function closeQueueCardDetail() {
    const ov = document.getElementById('queue-card-detail');
    if (ov) ov.classList.remove('open');
    document.body.style.overflow = '';
}

function qesc(s) {
    return String(s).replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeQueueLightbox();
        closeQueueCardDetail();
        ['admin-add-card-modal','admin-label-modal','admin-attach-modal',
         'admin-desc-modal','admin-img-modal','admin-add-list-modal','admin-pw-modal','admin-rename-modal','admin-rename-list-modal','admin-move-card-modal']
            .forEach(id => closeAdminModal(id));
    }
});

// ── Init queue on load ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadQueue();
});
