// ── Quote section — staggered blur-slide-up words (mirrors hero heading) ──
(function () {
    const section    = document.querySelector('.quote-section');
    const quoteEl    = document.querySelector('.quote-section .quote-text');
    const authorEl   = document.querySelector('.quote-section .quote-author');
    const startMark  = document.querySelector('.quote-section .start-quote');
    const endMark    = document.querySelector('.quote-section .end-quote');
    const ctaBtn     = document.querySelector('.quote-section .btn-outline');
    if (!section || !quoteEl) return;

    // Split quote text into words
    const split = new SplitType(quoteEl, { types: 'words' });

    // ── Initial hidden states ────────────────────────────────────────
    gsap.set(split.words, { opacity: 0, y: 44, filter: 'blur(14px)' });
    gsap.set(startMark,   { opacity: 0, scale: 0.4, transformOrigin: 'top left'   });
    gsap.set(endMark,     { opacity: 0, scale: 0.4, transformOrigin: 'bottom right' });
    if (authorEl) gsap.set(authorEl, { opacity: 0, y: 20, filter: 'blur(6px)' });
    if (ctaBtn)   gsap.set(ctaBtn,   { opacity: 0, y: 20 });

    // ── ScrollTrigger timeline ───────────────────────────────────────
    ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: function () {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // 1. Opening quote mark — scale pop in
            tl.to(startMark, {
                opacity: 1,
                scale: 1,
                duration: 0.55,
                ease: 'back.out(1.8)',
            });

            // 2. Quote words — staggered blur + rise (same as hero heading)
            tl.to(split.words, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.75,
                stagger: 0.055,
            }, '-=0.15');

            // 3. Author line — fades up after last word settles
            if (authorEl) {
                tl.to(authorEl, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.55,
                }, '-=0.2');
            }

            // 4. Closing quote mark — scale pop in, mirrored timing
            tl.to(endMark, {
                opacity: 1,
                scale: 1,
                duration: 0.55,
                ease: 'back.out(1.8)',
            }, '-=0.4');

            // 5. CTA button — gentle rise after everything settles
            if (ctaBtn) {
                tl.to(ctaBtn, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                }, '-=0.1');
            }
        },
    });
})();
