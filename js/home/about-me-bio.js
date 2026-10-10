// ── About Me bio — image from left, text from right ───────────────────
(function () {
    const img  = document.querySelector('.about-me-img');
    const text = document.querySelector('.about-me-text');
    if (!img || !text) return;

    gsap.set(img,  { opacity: 0, x: -26 });
    gsap.set(text, { opacity: 0, x:  26 });

    const trigger = { trigger: document.querySelector('.about-me-bio'), start: 'top 82%', once: true };

    gsap.to(img, {
        opacity: 1, x: 0,
        duration: 1, ease: 'power3.out',
        scrollTrigger: trigger,
    });
    gsap.to(text, {
        opacity: 1, x: 0,
        duration: 0.9, ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: trigger,
    });
})();
