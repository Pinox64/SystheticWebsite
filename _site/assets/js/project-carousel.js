// project-carousel.js
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-carousel').forEach(wrapper => {
    /* ---- build the track ---- */
    const imgs   = Array.from(wrapper.querySelectorAll('img'));
    const track  = document.createElement('div');
    track.className = 'pc-track';
    imgs.forEach(img => {
      track.appendChild(img);            // move <img> into the track
      img.style.flex = '0 0 100%';       // each slide = 100% width
      img.style.width = '100%';
    });
    wrapper.appendChild(track);

    /* ---- navigation buttons ---- */
    const prev = document.createElement('button');
    const next = document.createElement('button');
    prev.className = 'pc-prev'; prev.textContent = '‹';
    next.className = 'pc-next'; next.textContent = '›';
    wrapper.append(prev, next);

    let idx = 0;
    const update = () => {
      track.style.transform = `translateX(-${idx * 100}%)`;
    };

    prev.addEventListener('click', () => {
      idx = (idx - 1 + imgs.length) % imgs.length;
      update();
    });
    next.addEventListener('click', () => {
      idx = (idx + 1) % imgs.length;
      update();
    });

    /* ---- auto-play ---- */
    let auto = setInterval(() => next.click(), 5000);
    [prev, next, wrapper].forEach(el =>
      el.addEventListener('mouseenter', () => clearInterval(auto))
    );

    update(); // initial position
  });
});
