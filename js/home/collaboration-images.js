// ── Collaboration images — scroll-driven converge / diverge ───────────
// Left image starts pushed left, right image pushed right.
// Scrolling down brings them together; scrolling back pulls them apart.
// Parent has overflow:hidden so nothing bleeds outside the card.
(function () {
    const imgLeft  = document.querySelector('.collab-img-left');
    const imgRight = document.querySelector('.collab-img-right');
    const trigger  = document.querySelector('.wcm-collab');
    if (!imgLeft || !imgRight || !trigger) return;

    // Initial pushed-apart state
    gsap.set(imgLeft,  { x: '-40%' });
    gsap.set(imgRight, { x:  '40%' });

    gsap.to(imgLeft,  {
        x: '0%',
        ease: 'none',
        scrollTrigger: {
            trigger: trigger,
            start: 'top 85%',
            end:   'top 20%',
            scrub: 1.4,
        },
    });

    gsap.to(imgRight, {
        x: '0%',
        ease: 'none',
        scrollTrigger: {
            trigger: trigger,
            start: 'top 85%',
            end:   'top 20%',
            scrub: 1.4,
        },
    });
})();
