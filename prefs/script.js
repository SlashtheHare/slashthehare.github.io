document.addEventListener('DOMContentLoaded', () => {
  // ——— 1) Collapse Panels ———
  const collapseEls = document.querySelectorAll('.theme-card .collapse');
  const instances   = {};
  collapseEls.forEach(el => {
    instances[el.id] = new bootstrap.Collapse(el, { toggle: false });
  });

  document.querySelectorAll('.theme-card .btn').forEach(btn => {
    const targetID = btn.dataset.bsTarget.substring(1);
    const inst     = instances[targetID];
    const panel    = document.getElementById(targetID);

    btn.addEventListener('click', () => {
      const isOpen = panel.classList.contains('show');
      // close all
      Object.values(instances).forEach(i => i.hide());
      document.querySelectorAll('.theme-card .btn.active')
              .forEach(b => b.classList.remove('active'));
      // toggle this one
      if (!isOpen) {
        inst.show();
        btn.classList.add('active');
      }
    });
  });

  // ——— 2) Zoom-Into-Carousel Modal ———
  const zoomModalEl       = document.getElementById('zoomModal');
  const zoomCarouselEl    = document.getElementById('zoomCarousel');
  const zoomCarouselInner = document.getElementById('zoomCarouselInner');
  let   zoomCarouselInst;   // will hold our Carousel instance

  function initZoomCarousel() {
    if (zoomCarouselInst) zoomCarouselInst.dispose();
    zoomCarouselInst = new bootstrap.Carousel(zoomCarouselEl, {
      interval: false,
      wrap:     true,
      ride:     false
    });
    zoomCarouselInst.pause();
  }

  document.querySelectorAll('.zoomable').forEach(img => {
    img.addEventListener('click', () => {
      zoomCarouselInner.innerHTML = '';

      const slides = img.closest('.carousel-inner')
                        .querySelectorAll('img.zoomable');

      slides.forEach(el => {
        const item = document.createElement('div');
        item.className = 'carousel-item' + (el === img ? ' active' : '');

        const clone = el.cloneNode();
        clone.classList.add('d-block', 'w-100');
        item.appendChild(clone);

        zoomCarouselInner.appendChild(item);
      });

      initZoomCarousel();
      new bootstrap.Modal(zoomModalEl).show();
    });
  });

  // ——— 3) Keyboard Navigation ———
  zoomModalEl.addEventListener('keydown', e => {
    if (!zoomCarouselInst) return;
    if (e.key === 'ArrowRight') zoomCarouselInst.next();
    if (e.key === 'ArrowLeft')  zoomCarouselInst.prev();
  });
});

const tabSound = document.getElementById('tabSound');
const linkSound = document.getElementById('linkSound');

// Tabs
document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
  tab.addEventListener('click', () => {
    tabSound.currentTime = 0;
    tabSound.play();
    tabSound.volume = 0.5;
  });
});

// Social Links
document.querySelectorAll('.social-nav a').forEach(link => {
  link.addEventListener('click', () => {
    linkSound.currentTime = 0;
    linkSound.play();
    linkSound.volume = 0.3;
  });
});
