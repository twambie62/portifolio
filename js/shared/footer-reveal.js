// ── Footer — staggered fade-up on scroll ──────────────────────────────
(function () {
    gsap.registerPlugin(ScrollTrigger);
    const footer = document.querySelector('.app-footer');
    if (!footer) return;

    const phoneEls = Array.from(footer.querySelectorAll('.footer-contact-phone'));

    const els = [
        footer.querySelector('.footer-title'),
        footer.querySelector('.footer-sub'),
        footer.querySelector('.footer-email'),
        footer.querySelector('.footer-socials'),
        footer.querySelector('.footer-contact-title'),
        ...phoneEls,
        footer.querySelector('.footer-location-title'),
        footer.querySelector('.footer-location'),
        footer.querySelector('.footer-divider'),
        footer.querySelector('.footer-copyright'),
        footer.querySelector('.footer-svg-bg'),
        footer.querySelector('.footer-bottom-bar'),
    ].filter(Boolean);

    gsap.set(els, { opacity: 0, y: 38 }); //36

    ScrollTrigger.create({
        trigger: footer,
        start: 'top 90%',
        once: true,
        onEnter: function () {
            gsap.to(els, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.11,
            });
        },
    });
})();
