// ── Why Choose Me bento grid — fade up on scroll ────────────────────
(function () {
    const wrapper = document.querySelector('.wcm-wrapper');
    if (!wrapper) return;
    gsap.set(wrapper, { opacity: 0, y: 72 });
    gsap.to(wrapper, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: wrapper,
            start: 'top 95%',
            once: true,
        },
    });
})();
