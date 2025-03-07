// script.js
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section, .full-page');
  const carousel = document.querySelector('.carousel');
  const carouselItems = document.querySelectorAll('.carousel-item');
  let currentIndex = 0;
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpen = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');

  menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      menuOpen.classList.toggle('hidden');
      menuClose.classList.toggle('hidden');
  });

  function nextSlide() {
      currentIndex = (currentIndex + 1) % carouselItems.length;
      updateCarousel();
  }

  function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  setInterval(nextSlide, 3000);

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              animate(entry.target, {
                  opacity: [0, 1],
                  translateY: [50, 0],
                  duration: 1000,
                  easing: 'easeOutQuad'
              });
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));
});