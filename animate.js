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
    const modalVideo = document.getElementById('modal-video');
    const closeModal = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const workLinks = document.querySelectorAll('#work a');

    function getEmbedUrl(url) {
        // If it's a local video file, return as is
        if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
            return url;
        }

        let videoId = '';
        let startTime = '';

        // Extract video ID using standard YouTube regex
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            videoId = match[2];
        }

        // Handle timestamp (t= or start=)
        const timeMatch = url.match(/[?&](t|start)=(\d+)/);
        if (timeMatch) {
            startTime = timeMatch[2];
        }

        if (videoId) {
            let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
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
            const finalUrl = getEmbedUrl(url);

            if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
                // Local video
                modalIframe.classList.add('hidden');
                modalVideo.classList.remove('hidden');
                modalVideo.src = finalUrl;
                modalVideo.play();
            } else {
                // YouTube iframe
                modalVideo.classList.add('hidden');
                modalVideo.pause();
                modalVideo.src = '';
                modalIframe.classList.remove('hidden');
                modalIframe.src = finalUrl;
            }

            videoModal.classList.remove('hidden');
            videoModal.classList.add('flex');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    function hideModal() {
        videoModal.classList.add('hidden');
        videoModal.classList.remove('flex');
        modalIframe.src = '';
        modalVideo.src = '';
        modalVideo.pause();
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