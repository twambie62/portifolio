// ── Tools section subtext — fade up on scroll ─────────────────────────
(function () {
    const sub = document.querySelector('.tools-center-text p');
    if (!sub) return;
    gsap.set(sub, { opacity: 0, y: 24 });
    gsap.to(sub, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: sub,
            start: 'top 85%',
            once: true,
        },
    });
})();
