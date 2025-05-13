/* script.js – carrousels multiples + light-box plein écran  */
document.addEventListener('DOMContentLoaded', () => {
  /* 1) initialisation de chaque carrousel            */
  document.querySelectorAll('.carousel, .project-carousel')
          .forEach(initCarousel);

  /* 2) préparation de la light-box globale           */
  buildLightbox();
});

/* ----------  CARROUSEL  ---------- */
function initCarousel(box) {
  /* — 1. piste -------------------------------------------------- */
  let track = box.querySelector('.track, .pc-track');
  if (!track) {                                    // <img> “en vrac” ?
    track = document.createElement('div');
    track.className = 'track';
    [...box.children].forEach(el => {
      if (el.tagName === 'IMG') {
        el.classList.add('slide');
        track.appendChild(el);
      }
    });
    box.appendChild(track);
  }
  const slides  = Array.from(track.children);

  /* — 2. wrapper (masque overflow) ------------------------------ */
  let wrap = track.parentElement;
  if (!wrap.classList.contains('track-wrapper')) {
    wrap = document.createElement('div');
    wrap.className = 'track-wrapper';
    box.insertBefore(wrap, track);
    wrap.appendChild(track);
  }
  wrap.style.overflow        = 'hidden';
  track.style.display        = 'flex';
  track.style.transition     = 'transform .5s ease';
  slides.forEach(s => {
    s.style.flex   = '0 0 100%';
    s.style.width  = '100%';
    s.style.cursor = 'pointer';
  });

  /* — 3. boutons ------------------------------------------------ */
  let prev = box.querySelector('.c-prev, .prev, .pc-prev');
  let next = box.querySelector('.c-next, .next, .pc-next');
  if (!prev) {
    prev = document.createElement('button');
    prev.className = 'c-prev';
    prev.innerHTML = '&#10094;';
    box.appendChild(prev);
  }
  if (!next) {
    next = document.createElement('button');
    next.className = 'c-next';
    next.innerHTML = '&#10095;';
    box.appendChild(next);
  }

  /* — 4. logique de navigation --------------------------------- */
  let idx = 0;
  const update = () => track.style.transform = `translateX(-${idx * 100}%)`;
  prev.addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; update(); });
  next.addEventListener('click', () => { idx = (idx + 1) % slides.length; update(); });

  /* — 5. ouverture light-box ----------------------------------- */
  slides.forEach((s,i) => s.addEventListener('click', () => openLightbox(slides,i)));

  update();                   // position initiale
}

/* ----------  LIGHT-BOX  ---------- */
let lb, lbImg, lbPrev, lbNext, lbClose, sources=[], pos=0;

function buildLightbox() {
  lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lb-close" aria-label="Fermer">&times;</button>
    <button class="lb-prev"  aria-label="Précédent">&#10094;</button>
    <img    class="lb-img"   alt="">
    <button class="lb-next"  aria-label="Suivant">&#10095;</button>`;
  document.body.appendChild(lb);

  lbImg   = lb.querySelector('.lb-img');
  lbPrev  = lb.querySelector('.lb-prev');
  lbNext  = lb.querySelector('.lb-next');
  lbClose = lb.querySelector('.lb-close');

  lbPrev .onclick = () => jump(-1);
  lbNext .onclick = () => jump( 1);
  lbClose.onclick = closeLightbox;
  lb.onclick      = e => { if (e.target === lb) closeLightbox(); };

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  jump(-1);
    if (e.key === 'ArrowRight') jump( 1);
  });
}
function openLightbox(slides,start=0){
  sources = slides.map(s=>s.src || s.querySelector('img')?.src);
  pos = start;  updateLB();
  lb.classList.add('open');
}
function jump(d){ pos=(pos+d+sources.length)%sources.length; updateLB(); }
function updateLB(){ lbImg.src = sources[pos]; }
function closeLightbox(){ lb.classList.remove('open'); }
