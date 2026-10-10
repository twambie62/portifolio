// ── Process cards — staggered slide up on scroll ──────────────────────
(function () {
    const processGrid = document.querySelector('.processes-grid');
    if (!processGrid) return;

    const cards = processGrid.querySelectorAll('.process-card');
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 40 });

    gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
            trigger: processGrid,
            start: 'top 90%',
            once: true,
        },
    });
})();

// ── Service cards — staggered slide up on scroll ───────────────────────
(function () {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    const cards = servicesGrid.querySelectorAll('.svc-card');
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 40 });

    gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
            trigger: servicesGrid,
            start: 'top 90%',
            once: true,
        },
    });
})();
