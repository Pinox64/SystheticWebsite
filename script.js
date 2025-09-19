/* script.js – carousels (desktop arrows + mobile swipe), multi-instances, lightbox, hamburger */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel, .project-carousel').forEach(initCarousel);
  buildLightbox();
  initHamburger();
  loadProjectImages(); // Load project images
});

/* ----------  CAROUSEE ---------- */
function initCarousel(box) {
  /* track + slides ------------------------------------------------ */
  let track = box.querySelector('.track, .pc-track');
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

  /* wrapper ------------------------------------------------------- */
  let wrap = track.parentElement;
  if (!wrap || !wrap.classList?.contains('track-wrapper')) {
    wrap = document.createElement('div');
    wrap.className = 'track-wrapper';
    box.insertBefore(wrap, track);
    wrap.appendChild(track);
  }
  wrap.style.overflow = 'hidden';
  track.style.transition = 'transform .45s ease';

  /* buttons ------------------------------------------------------- */
  let prev = box.querySelector('.c-prev, .prev, .pc-prev'),
      next = box.querySelector('.c-next, .next, .pc-next');
  if (!prev) { prev = makeBtn('c-prev', '&#10094;'); box.appendChild(prev); }
  if (!next) { next = makeBtn('c-next', '&#10095;'); box.appendChild(next); }
  function makeBtn(cls, html) {
    const b = document.createElement('button');
    b.className = cls + ' ctrl';
    b.innerHTML = html;
    return b;
  }

  /* responsive: visible count (desktop) / native scroll (mobile) -- */
  const mq = window.matchMedia('(max-width: 899px)');
  let mobile = mq.matches;
  mq.addEventListener?.('change', e => { mobile = e.matches; refresh(); });

  let visible = 1, idx = 0, maxIndex = 0;

  const refresh = () => {
    const w = wrap.clientWidth;

    if (mobile) {
      // Mobile: native scrolling
      wrap.style.overflowX = 'auto';
      wrap.style.overflowY = 'hidden';
      track.style.transform = 'none'; // disable translate in mobile mode
      track.style.transition = 'none'; // no transform transitions
      wrap.style.scrollBehavior = 'auto'; // we control smooth with scrollTo below
      visible = 1;
      // Ensure slides are non-shrinking and reasonably wide for swipe
      slides.forEach(s => s.style.flex = '0 0 auto');
    } else {
      // Desktop: transform-based
      wrap.style.overflowX = 'hidden';
      track.style.transition = 'transform .45s ease';
      visible = w >= 1280 ? 4
              : w >= 960  ? 3
              : w >= 600  ? 2
              : 1;
      slides.forEach(s => s.style.flex = '0 0 auto');
    }

    maxIndex = Math.max(0, slides.length - visible);
    if (idx > maxIndex) idx = maxIndex;

    update();

    // show/hide arrows
    const showArrows = slides.length > visible;
    prev.style.display = showArrows ? '' : 'none';
    next.style.display = showArrows ? '' : 'none';
  };

  window.addEventListener('resize', refresh);
  window.addEventListener('load',   refresh);
  refresh();

  /* buttons behavior ---------------------------------------------- */
  prev.onclick = () => { idx = (idx - 1 < 0) ? maxIndex : idx - 1; update(true); };
  next.onclick = () => { idx = (idx + 1 > maxIndex) ? 0 : idx + 1; update(true); };

  /* utility: compute pixel offset for index ----------------------- */
  function calcOffsetForIndex(i) {
    if (i <= 0) return 0;
    const gapPx = getGapPx(track);
    // Sum widths of previous slides + gaps
    let sum = 0;
    for (let k = 0; k < i; k++) {
      sum += slides[k].getBoundingClientRect().width;
    }
    sum += gapPx * i;
    // Keep within scroll range
    const maxScroll = track.scrollWidth - wrap.clientWidth;
    return Math.min(sum, Math.max(0, maxScroll));
  }

  function getGapPx(el) {
    const cs = getComputedStyle(el);
    // `gap` may be reported as "row-gap / column-gap"; we want the horizontal one
    const colGap = cs.columnGap && cs.columnGap !== 'normal' ? cs.columnGap : cs.gap;
    const n = parseFloat(colGap || '0');
    return isNaN(n) ? 0 : n;
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
  slides.forEach((s, i) => {
    s.addEventListener('click', () => openLightbox(slides, i));
  });

  /* touch/drag enhancements (optional but nice on mobile) ---------- */
  enableDragScroll(wrap);
}

/* drag-to-scroll helper for mobile/desktop touchpads */
function enableDragScroll(container) {
  let isDown = false, startX = 0, startScroll = 0;
  const onDown = (e) => {
    isDown = true;
    startX = (e.touches ? e.touches[0].pageX : e.pageX);
    startScroll = container.scrollLeft;
  };
  const onMove = (e) => {
    if (!isDown) return;
    const x = (e.touches ? e.touches[0].pageX : e.pageX);
    container.scrollLeft = startScroll - (x - startX);
  };
  const onUp = () => { isDown = false; };

  container.addEventListener('mousedown', onDown, { passive: true });
  container.addEventListener('mousemove', onMove, { passive: true });
  container.addEventListener('mouseleave', onUp, { passive: true });
  container.addEventListener('mouseup', onUp, { passive: true });

  container.addEventListener('touchstart', onDown, { passive: true });
  container.addEventListener('touchmove', onMove, { passive: true });
  container.addEventListener('touchend', onUp, { passive: true });
}

/* ----------  LIGHTBOX  ---------- */
let lb, lbImg, lbPrev, lbNext, lbClose, sources = [], pos = 0;

function buildLightbox() {
  lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lb-close" aria-label="Close">&times;</button>
    <button class="lb-prev" aria-label="Previous">&#10094;</button>
    <img class="lb-img" alt="">
    <button class="lb-next" aria-label="Next">&#10095;</button>`;
  document.body.appendChild(lb);

  lbImg   = lb.querySelector('.lb-img');
  lbPrev  = lb.querySelector('.lb-prev');
  lbNext  = lb.querySelector('.lb-next');
  lbClose = lb.querySelector('.lb-close');

  lbPrev.onclick  = () => jump(-1);
  lbNext.onclick  = () => jump( 1);
  lbClose.onclick = closeLightbox;
  lb.onclick      = e => { if (e.target === lb) closeLightbox(); };

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   jump(-1);
    if (e.key === 'ArrowRight')  jump( 1);
  });
}

function openLightbox(slidesArr, start = 0) {
  sources = slidesArr.map(s => s.src || s.querySelector('img')?.src);
  pos = start;
  updateLB();
  lb.classList.add('open');
}

function jump(delta) {
  pos += delta;
  if (pos < 0)                     pos = sources.length - 1;
  else if (pos >= sources.length)  pos = 0;
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

/* ----------- Projects ------------- */
async function loadProjectImages() {
  const projectCarousels = document.querySelectorAll('.project-carousel');
  if (projectCarousels.length === 0) return;

  // Create a map of project IDs to their image files
  const projectImageData = {
    project1: ["assets/images/projects/project1/1.webp","assets/images/projects/project1/20250219_144539.webp","assets/images/projects/project1/20250225_161010.webp","assets/images/projects/project1/20250328_175127.webp","assets/images/projects/project1/20250402_105535.webp","assets/images/projects/project1/20250402_114535.webp","assets/images/projects/project1/20250407_134350.webp","assets/images/projects/project1/20250407_135756.webp","assets/images/projects/project1/20250411_011843.webp","assets/images/projects/project1/20250411_013235.webp"],
    project2: ["assets/images/projects/project2/20240303_182413.webp","assets/images/projects/project2/20240303_190107.webp","assets/images/projects/project2/20240303_192521.webp","assets/images/projects/project2/20240303_192609.webp","assets/images/projects/project2/20240303_192613.webp","assets/images/projects/project2/20240303_192632.webp","assets/images/projects/project2/20240304_125227.webp","assets/images/projects/project2/20240304_135718.webp","assets/images/projects/project2/20240304_181255.webp","assets/images/projects/project2/20240305_193524.webp","assets/images/projects/project2/20240305_215303.webp","assets/images/projects/project2/20240305_231024.webp","assets/images/projects/project2/20240305_231034.webp","assets/images/projects/project2/20240306_224552.webp","assets/images/projects/project2/20240306_225355.webp","assets/images/projects/project2/20240316_122229.webp","assets/images/projects/project2/20240316_122232.webp","assets/images/projects/project2/20240316_162105.webp","assets/images/projects/project2/20240316_185531.webp","assets/images/projects/project2/20240316_214213.webp","assets/images/projects/project2/20240330_131001.webp","assets/images/projects/project2/20240330_134703.webp","assets/images/projects/project2/20240330_134708.webp","assets/images/projects/project2/20240330_211420.webp","assets/images/projects/project2/20240330_223709.webp","assets/images/projects/project2/20240330_223720.webp","assets/images/projects/project2/20240420_153319.webp","assets/images/projects/project2/20240601_182643.webp","assets/images/projects/project2/20240602_155243.webp","assets/images/projects/project2/20240602_202539.webp","assets/images/projects/project2/20240602_202546.webp"],
    MiniLu: ["assets/images/projects/MiniLu/20230601_145725.webp","assets/images/projects/MiniLu/20230612_170113.webp","assets/images/projects/MiniLu/20230614_111945.webp","assets/images/projects/MiniLu/20230809_191627.webp","assets/images/projects/MiniLu/20230809_191630.webp","assets/images/projects/MiniLu/20231023_142457.webp","assets/images/projects/MiniLu/20231024_095214.webp","assets/images/projects/MiniLu/20231024_150644.webp","assets/images/projects/MiniLu/20231024_155901.webp","assets/images/projects/MiniLu/20231024_155911.webp","assets/images/projects/MiniLu/20231024_155919.webp","assets/images/projects/MiniLu/20231024_182900.webp"]
  };

  projectCarousels.forEach(carousel => {
    const projectId = carousel.dataset.id;
    const images = projectImageData[projectId];

    if (images) {
      const track = document.createElement('div');
      track.className = 'pc-track';

      images.forEach(src => {
        const slide = document.createElement('img');
        slide.src = src;
        slide.className = 'slide';
        track.appendChild(slide);
      });

      carousel.appendChild(track);
      initCarousel(carousel);
    }
  });
}
