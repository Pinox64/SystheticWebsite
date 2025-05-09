// script.js
// Carousel sliding with proper bounds and fully functional left/right arrows

document.addEventListener('DOMContentLoaded', () => {
    const track        = document.querySelector('.track');
    const slides       = Array.from(track.children);
    const prevBtn      = document.querySelector('.prev');
    const nextBtn      = document.querySelector('.next');
    const wrapper      = document.querySelector('.track-wrapper');
  
    // width of one slide (assumed consistent)
    const slideWidth   = slides[0].getBoundingClientRect().width;
  
    // how many slides can fit in the viewport
    const slidesToShow = Math.floor(wrapper.clientWidth / slideWidth);
  
    // maximum starting index so we never scroll into empty space
    const maxIndex     = slides.length - slidesToShow;
    let   current      = 0;
  
    // move carousel to a given index, clamped between 0 and maxIndex
    const moveTo = idx => {
      const i = Math.max(0, Math.min(idx, maxIndex));
      track.style.transform = `translateX(-${i * slideWidth}px)`;
      current = i;
    };
  
    // Prev button: only move left if we're past the first slide
    prevBtn.addEventListener('click', () => {
      if (current > 0) moveTo(current - 1);
    });
  
    // Next button: only move right if we haven't reached the last full group
    nextBtn.addEventListener('click', () => {
      if (current < maxIndex) moveTo(current + 1);
    });
  
    // initialize to the first slide
    moveTo(0);
  
    // Optional autoplay (pauses on hover)
    let auto = setInterval(() => {
      if (current < maxIndex) nextBtn.click();
      else moveTo(0);
    }, 6000);
  
    [prevBtn, nextBtn, wrapper].forEach(el =>
      el.addEventListener('mouseenter', () => clearInterval(auto))
    );
  });
  