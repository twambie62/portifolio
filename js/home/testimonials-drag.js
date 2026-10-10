// Testimonial marquee drag-to-scroll
(function() {
    const track = document.querySelector('.testimonials-cards-track');
    if (!track) return;
    let isDragging = false;
    let startX, currentTranslate = 0;
    let resumeTimeout;

    function getTranslateX(el) {
        const style = window.getComputedStyle(el);
        const matrix = new DOMMatrix(style.transform);
        return matrix.m41;
    }

    track.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.pageX;
        currentTranslate = getTranslateX(track);
        track.style.animation = 'none';
        track.style.transform = `translateX(${currentTranslate}px)`;
        clearTimeout(resumeTimeout);
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = e.pageX - startX;
        track.style.transform = `translateX(${currentTranslate + dx}px)`;
    });

    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        // Resume animation after 2s
        resumeTimeout = setTimeout(function() {
            track.style.animation = '';
            track.style.transform = '';
        }, 2000);
    });

    // Touch support
    track.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].pageX;
        currentTranslate = getTranslateX(track);
        track.style.animation = 'none';
        track.style.transform = `translateX(${currentTranslate}px)`;
        clearTimeout(resumeTimeout);
    }, { passive: true });

    track.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const dx = e.touches[0].pageX - startX;
        track.style.transform = `translateX(${currentTranslate + dx}px)`;
    }, { passive: true });

    track.addEventListener('touchend', function() {
        if (!isDragging) return;
        isDragging = false;
        resumeTimeout = setTimeout(function() {
            track.style.animation = '';
            track.style.transform = '';
        }, 2000);
    });
})();
