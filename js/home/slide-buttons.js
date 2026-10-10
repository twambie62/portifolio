// ── Framer-style slide-text button hover — works on any .btn-slide ──
(function () {
    const DURATION = 0.45;
    const EASE = 'power2.out';

    document.querySelectorAll('.btn-slide').forEach(function (btn) {
        const def  = btn.querySelector('.btn-slide-default');
        const dup  = btn.querySelector('.btn-slide-hover');
        if (!def || !dup) return;

        // make sure hover span starts below
        gsap.set(dup, { y: '100%' });

        btn.addEventListener('mouseenter', function () {
            gsap.to(def,  { y: '-100%', duration: DURATION, ease: EASE });
            gsap.to(dup,  { y:    '0%', duration: DURATION, ease: EASE });
        });

        btn.addEventListener('mouseleave', function () {
            gsap.to(def,  { y:    '0%', duration: DURATION, ease: EASE });
            gsap.to(dup,  { y:  '100%', duration: DURATION, ease: EASE });
        });
    });
})();
