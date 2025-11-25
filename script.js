/* script.js – carousels (desktop arrows + mobile swipe), multi-instances, lightbox, hamburger */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel, .project-carousel').forEach(initCarousel);
  buildLightbox();
  initHamburger();
});

/* ----------  CAROUSEL  ---------- */

function initCarousel(box) {
  /* track + slides ------------------------------------------------ */
  let track = box.querySelector('.track, .pc-track');

  // If no explicit track, build one from IMG children
  if (!track) {
    track = document.createElement('div');
    track.className = 'track';

    Array.from(box.children).forEach(el => {
      if (el.tagName === 'IMG') {
        el.classList.add('slide');
        track.appendChild(el);
      }
    });

    box.appendChild(track);
  }

  const slides = Array.from(track.children);
  if (!slides.length) return;

  /* wrapper ------------------------------------------------------- */
  let wrap = track.parentElement;
  if (!wrap || !wrap.classList.contains('track-wrapper')) {
    wrap = document.createElement('div');
    wrap.className = 'track-wrapper';
    box.insertBefore(wrap, track);
    wrap.appendChild(track);
  }

  wrap.style.overflow = 'hidden';
  track.style.transition = 'transform .45s ease';

  /* buttons ------------------------------------------------------- */
  let prev = box.querySelector('.c-prev, .prev, .pc-prev');
  let next = box.querySelector('.c-next, .next, .pc-next');

  if (!prev) {
    prev = makeBtn('c-prev', '&#10094;');
    box.appendChild(prev);
  }
  if (!next) {
    next = makeBtn('c-next', '&#10095;');
    box.appendChild(next);
  }

  function makeBtn(cls, html) {
    const btn = document.createElement('button');
    btn.className = `${cls} ctrl`;
    btn.innerHTML = html;
    return btn;
  }

  /* responsive: visible count (desktop) / native scroll (mobile) -- */
  const mq = window.matchMedia('(max-width: 899px)');
  let mobile = mq.matches;

  mq.addEventListener?.('change', e => {
    mobile = e.matches;
    refresh();
  });

  let visible = 1;
  let idx = 0;
  let maxIndex = 0;

  const refresh = () => {
    const w = wrap.clientWidth;

    if (mobile) {
      // Mobile: native scrolling
      wrap.style.overflowX = 'auto';
      wrap.style.overflowY = 'hidden';
      track.style.transform = 'none';
      track.style.transition = 'none';
      wrap.style.scrollBehavior = 'auto';

      visible = 1;
      slides.forEach(s => { s.style.flex = '0 0 auto'; });
    } else {
      // Desktop: transform-based carousel
      wrap.style.overflowX = 'hidden';
      track.style.transition = 'transform .45s ease';

      visible =
        w >= 1280 ? 4 :
        w >= 960  ? 3 :
        w >= 600  ? 2 :
                    1;

      slides.forEach(s => { s.style.flex = '0 0 auto'; });
    }

    maxIndex = Math.max(0, slides.length - visible);
    if (idx > maxIndex) idx = maxIndex;

    update();

    const showArrows = slides.length > visible;
    prev.style.display = showArrows ? '' : 'none';
    next.style.display = showArrows ? '' : 'none';
  };

  window.addEventListener('resize', refresh);
  window.addEventListener('load',   refresh);
  refresh();

  /* buttons behavior ---------------------------------------------- */
  prev.onclick = () => {
    idx = (idx - 1 < 0) ? maxIndex : idx - 1;
    update(true);
  };

  next.onclick = () => {
    idx = (idx + 1 > maxIndex) ? 0 : idx + 1;
    update(true);
  };

  /* utility: compute pixel offset for index ----------------------- */

  function calcOffsetForIndex(i) {
    if (i <= 0) return 0;

    const gapPx = getGapPx(track);
    let sum = 0;

    for (let k = 0; k < i; k++) {
      sum += slides[k].getBoundingClientRect().width;
    }

    sum += gapPx * i;

    const maxScroll = track.scrollWidth - wrap.clientWidth;
    return Math.min(sum, Math.max(0, maxScroll));
  }

  function getGapPx(el) {
    const cs = getComputedStyle(el);
    const colGap = cs.columnGap && cs.columnGap !== 'normal' ? cs.columnGap : cs.gap;
    const n = parseFloat(colGap || '0');
    return Number.isNaN(n) ? 0 : n;
  }

  /* update position: scroll on mobile, transform on desktop ------- */

  function update(smooth = false) {
    const offset = calcOffsetForIndex(idx);

    if (mobile) {
      wrap.scrollTo({ left: offset, behavior: smooth ? 'smooth' : 'auto' });
    } else {
      track.style.transform = `translateX(-${offset}px)`;
    }
  }

  /* lightbox hookup ----------------------------------------------- */
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => openLightbox(slides, i));
  });

  /* touch/drag enhancements --------------------------------------- */
  enableDragScroll(wrap);
}

/* drag-to-scroll helper for mobile/desktop touchpads --------------- */

function enableDragScroll(container) {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  const onDown = e => {
    isDown = true;
    startX = (e.touches ? e.touches[0].pageX : e.pageX);
    startScroll = container.scrollLeft;
  };

  const onMove = e => {
    if (!isDown) return;
    const x = (e.touches ? e.touches[0].pageX : e.pageX);
    container.scrollLeft = startScroll - (x - startX);
  };

  const onUp = () => {
    isDown = false;
  };

  container.addEventListener('mousedown',  onDown);
  container.addEventListener('mousemove',  onMove);
  container.addEventListener('mouseleave', onUp);
  container.addEventListener('mouseup',    onUp);

  container.addEventListener('touchstart', onDown, { passive: true });
  container.addEventListener('touchmove',  onMove, { passive: true });
  container.addEventListener('touchend',   onUp,   { passive: true });
}

/* ----------  LIGHTBOX  ---------- */

let lb, lbImg, lbPrev, lbNext, lbClose;
let sources = [];
let pos = 0;

function buildLightbox() {
  lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lb-close" aria-label="Close">&times;</button>
    <button class="lb-prev" aria-label="Previous">&#10094;</button>
    <img class="lb-img" alt="">
    <button class="lb-next" aria-label="Next">&#10095;</button>
  `;

  document.body.appendChild(lb);

  lbImg   = lb.querySelector('.lb-img');
  lbPrev  = lb.querySelector('.lb-prev');
  lbNext  = lb.querySelector('.lb-next');
  lbClose = lb.querySelector('.lb-close');

  lbPrev.onclick  = () => jump(-1);
  lbNext.onclick  = () => jump(1);
  lbClose.onclick = closeLightbox;

  lb.onclick = e => {
    if (e.target === lb) closeLightbox();
  };

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;

    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  jump(-1);
    if (e.key === 'ArrowRight') jump(1);
  });
}

function openLightbox(slidesArr, start = 0) {
  sources = slidesArr
    .map(s => s.src || s.querySelector('img')?.src)
    .filter(Boolean);

  if (!sources.length) return;

  pos = Math.min(Math.max(start, 0), sources.length - 1);
  updateLB();
  lb.classList.add('open');
}

function jump(delta) {
  if (!sources.length) return;
  pos += delta;

  if (pos < 0) pos = sources.length - 1;
  else if (pos >= sources.length) pos = 0;

  updateLB();
}

function updateLB() {
  lbImg.src = sources[pos];
}

function closeLightbox() {
  lb.classList.remove('open');
}

/* ----------  HAMBURGER NAV  ---------- */

function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
  });

  // Close menu when clicking a link (mobile)
  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });
}
