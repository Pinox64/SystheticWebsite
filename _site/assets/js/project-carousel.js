// project-carousel.js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-carousel').forEach(wrapper => {
      const images = Array.from(wrapper.querySelectorAll('img'));
      let idx = 0;
  
      images.forEach((img, i) => {
        img.style.display = i === 0 ? 'block' : 'none';
      });
  
      setInterval(() => {
        images[idx].style.display = 'none';
        idx = (idx + 1) % images.length;
        images[idx].style.display = 'block';
      }, 5000);
    });
  });
  