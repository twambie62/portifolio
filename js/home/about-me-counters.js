// ── About Me counters — count up on scroll ────────────────────────────
(function () {
    const counters = [
        { selector: '.about-me-stat:nth-child(1) .stat-number', target: 25, suffix: '+' },
        { selector: '.about-me-stat:nth-child(2) .stat-number', target: 4,  suffix: '+' },
        { selector: '.about-me-stat:nth-child(3) .stat-number', target: 99, suffix: '%' },
    ];

    counters.forEach(function (c) {
        const el = document.querySelector(c.selector);
        if (!el) return;

        const obj = { val: 0 };

        gsap.to(obj, {
            val: c.target,
            duration: 2,
            ease: 'power3.out',
            onUpdate: function () {
                el.textContent = Math.round(obj.val) + c.suffix;
            },

            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                once: true,
            },
        });
    });
})();
