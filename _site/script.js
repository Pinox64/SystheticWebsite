/* script.js – carrousels multiples + responsive + light-box */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel, .project-carousel')
          .forEach(initCarousel);
  buildLightbox();
});

/* ----------  CARROUSEL  ---------- */
function initCarousel(box) {
  /* piste + slides ------------------------------------------------ */
  let track = box.querySelector('.track, .pc-track');
  if (!track) {                      // fallback : images « en vrac »
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
  const slides = Array.from(track.children);

  /* wrapper ------------------------------------------------------- */
  let wrap = track.parentElement;
  if (!wrap.classList.contains('track-wrapper')) {
    wrap = document.createElement('div');
    wrap.className = 'track-wrapper';
    box.insertBefore(wrap, track);
    wrap.appendChild(track);
  }
  wrap.style.overflow = 'hidden';
  track.style.display = 'flex';
  track.style.transition = 'transform .45s ease';

  /* boutons ------------------------------------------------------- */
  let prev = box.querySelector('.c-prev, .prev, .pc-prev'),
      next = box.querySelector('.c-next, .next, .pc-next');
  if (!prev) { prev = makeBtn('c-prev', '&#10094;'); box.appendChild(prev); }
  if (!next) { next = makeBtn('c-next', '&#10095;'); box.appendChild(next); }

  function makeBtn(cls,html){
    const b=document.createElement('button'); b.className=cls; b.innerHTML=html; return b;
  }

  /* responsive : combien d’images visibles ? --------------------- */
  let visible = 1, idx = 0, max = 0;
  const refresh = () => {
    const w = wrap.clientWidth;
    visible = w >= 1280 ? 4 : w >= 960 ? 3 : w >= 600 ? 2 : 1;
    const basis = 100 / visible;
    slides.forEach(s => { s.style.flex = `0 0 ${basis}%`; });
    max = Math.max(0, slides.length - visible +1);
    idx = Math.min(idx, max);
    update();
  };
  window.addEventListener('resize', refresh);
  window.addEventListener('load',   refresh);
  refresh();

  /* navigation ---------------------------------------------------- */
  prev.onclick = () => { idx = (idx - 1 + slides.length) % (max); update(); };
  next.onclick = () => { idx = (idx + 1) % (max); update(); };

  function update() {
    track.style.transform = `translateX(-${idx * (100 / visible)}%)`;
  }

  /* light-box ----------------------------------------------------- */
  slides.forEach((s,i)=>s.addEventListener('click',()=>openLightbox(slides,i)));
}

/* ----------  LIGHT-BOX (inchangé) ---------- */
let lb, lbImg, lbPrev, lbNext, lbClose, sources=[], pos=0;
function buildLightbox(){
  lb=document.createElement('div'); lb.className='lightbox';
  lb.innerHTML=`<button class="lb-close">&times;</button>
                <button class="lb-prev">&#10094;</button>
                <img class="lb-img" alt="">
                <button class="lb-next">&#10095;</button>`;
  document.body.appendChild(lb);
  lbImg   = lb.querySelector('.lb-img');
  lbPrev  = lb.querySelector('.lb-prev');
  lbNext  = lb.querySelector('.lb-next');
  lbClose = lb.querySelector('.lb-close');
  lbPrev .onclick = ()=>jump(-1);
  lbNext .onclick = ()=>jump( 1);
  lbClose.onclick = closeLightbox;
  lb.onclick      = e=>{if(e.target===lb)closeLightbox();};
  document.addEventListener('keydown',e=>{
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')closeLightbox();
    if(e.key==='ArrowLeft') jump(-1);
    if(e.key==='ArrowRight')jump( 1);
  });
}
function openLightbox(slides,start=0){
  sources=slides.map(s=>s.src||s.querySelector('img')?.src);
  pos=start; updateLB(); lb.classList.add('open');
}
function jump(d){ pos=(pos+d+sources.length)%sources.length; updateLB(); }
function updateLB(){ lbImg.src=sources[pos]; }
function closeLightbox(){ lb.classList.remove('open'); }
