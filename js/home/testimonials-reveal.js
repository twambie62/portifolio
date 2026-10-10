// ── Testimonials marquee — fade up on scroll ──────────────────────────
(function () {
    const wrap = document.querySelector('.testimonials-cards-wrap');
    if (!wrap) return;
    gsap.set(wrap, { opacity: 0, y: 50 });
    gsap.to(wrap, {
        opacity: 1, y: 0,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: wrap, start: 'top 95%', once: true },
    });
})();

// ── Gallery carousel — blur + fade up on scroll ──────────────────────
(function () {
    const section = document.querySelector('#gallery-carousel');
    if (!section) return;
    gsap.set(section, { opacity: 0, y: 70, filter: 'blur(14px)' });
    gsap.to(section, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 95%', once: true },
    });
})();

// ── FAQ — all driven by the heading's ScrollTrigger ──────────────────
(function () {
    const heading = document.querySelector('.faq-left h2');
    const faqSub  = document.querySelector('.faq-left p');
    const faqBtn  = document.querySelector('.faq-left .btn');
    const items   = document.querySelectorAll('.faq-item');
    if (!heading) return;

    gsap.set([faqSub, faqBtn].filter(Boolean), { opacity: 0, y: 30 });
    gsap.set(items, { opacity: 0, y: 40 });

    ScrollTrigger.create({
        trigger: heading,
        start: 'top 85%',
        once: true,
        onEnter: function () {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Subtext and button follow the heading with a small delay
            if (faqSub) tl.to(faqSub, { opacity: 1, y: 0, duration: 0.6 }, '+=0.1');
            if (faqBtn) tl.to(faqBtn, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3');

            // FAQ items start at the very beginning of the timeline (position 0)
            // so they animate simultaneously with the heading, staggered
            if (items.length) {
                tl.to(items, {
                    opacity: 1, y: 0,
                    duration: 0.6,
                    stagger: 0.09,
                }, 0);
            }
        },
    });
})();
