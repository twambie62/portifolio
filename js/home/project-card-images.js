// ── Project cards — inner device image smooth rise + fade ───────────
(function () {
    const images = document.querySelectorAll('.projects .card-media img');
    if (!images.length) return;

    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    gsap.set(images, { opacity: 0, y: isMobile ? 24 : 40, scale:  isMobile ? 0.85 :0.8 });

    images.forEach(function (img) {
        gsap.to(img, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: .9,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: img,
                start: 'top 99%',
                once: true,
            },
            clearProps: 'transform,opacity',
        });
    });
})();
