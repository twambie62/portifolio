// ── Two-tone section headings — whole-element fade-up on scroll ───────
(function () {
    const headingSelectors = [
        '.services-heading',
        '.wcm-heading',
        '.tools-center-text h2',
        '.about-me-heading h2',
        '.testimonials-heading h2',
        '.faq-left h2',
        '.carousel-title',
        '.projects-title',
        '.filter-bar',
    ];

    const els = headingSelectors
        .map(function (sel) { return document.querySelector(sel); })
        .filter(Boolean);

    // Set all hidden upfront
    gsap.set(els, { opacity: 0, y: 64 });

    // Each heading animates as one whole element when it enters the viewport
    els.forEach(function (el) {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                once: true,
            },
        });
    });
})();
