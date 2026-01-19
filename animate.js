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

    // Modal Logic
    const videoModal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const closeModal = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const workLinks = document.querySelectorAll('#work a');

    function getEmbedUrl(url) {
        let videoId = '';
        let startTime = '';

        // Handle timestamp if present (t= or start=)
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        startTime = urlObj.searchParams.get('t') || urlObj.searchParams.get('start') || '';
        if (startTime) {
            startTime = startTime.replace('s', ''); // remove 's' if present like 54s
        }

        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
        } else if (url.includes('youtube.com/watch')) {
            videoId = urlObj.searchParams.get('v');
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1].split(/[?#]/)[0];
        }

        if (videoId) {
            let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            if (startTime) {
                embedUrl += `&start=${startTime}`;
            }
            return embedUrl;
        }
        return url;
    }


    workLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.getAttribute('href');
            const embedUrl = getEmbedUrl(url);
            modalIframe.src = embedUrl;
            videoModal.classList.remove('hidden');
            videoModal.classList.add('flex');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    function hideModal() {
        videoModal.classList.add('hidden');
        videoModal.classList.remove('flex');
        modalIframe.src = '';
        document.body.style.overflow = ''; // Restore scrolling
    }

    closeModal.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', hideModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
            hideModal();
        }
    });
});