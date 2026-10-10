// Hero heading — words blur-slide in, then the rest of the hero fades up
document.addEventListener('DOMContentLoaded', function () {

    // ── SplitType: split heading into individual words ──────────────────
    const headingEl = document.getElementById('hero-heading');
    const split = new SplitType(headingEl, { types: 'words' });

    // Hide all words initially (GSAP will animate them in)
    gsap.set(split.words, { opacity: 0, y: 46, filter: 'blur(14px)' });

    // Hide all other hero elements before timeline starts
    gsap.set('.avatar-wrap',   { opacity: 0.5, y: 60, scale:0.8  });
    gsap.set('#hero-greeting', { opacity: 0, y: 20,      });
    gsap.set('#hero-sub',      { opacity: 0, y: 20,      filter: 'blur(8px)'  });
    gsap.set(['#hero-btn-1', '#hero-btn-2'], { opacity: 0, y: 24 });
    gsap.set('.hero-lets-chat',        { opacity: 0, y: 20 });
    gsap.set('.hero-proj-marquee-wrap', { opacity: 0, y: 50,  filter: 'blur(14px)' });

    // ── Timeline ────────────────────────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Avatar — scale + fade + unblur
    tl.to('.avatar-wrap', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
    });

    // 2. Greeting tag — rise + fade + unblur
    tl.to('#hero-greeting', {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.35,
        },
        '-=0.4'
    );

    // 3. Heading words — staggered rise + fade + unblur
    tl.to(split.words, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.08,
    }, '+=0.03');

    // 4. Subtitle — rise + fade + unblur, starts after last word finishes
    tl.to('#hero-sub', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.45,
    }, '-=0.45');

    // 5. Buttons + lets-chat — rise + fade, staggered
    tl.to(['#hero-btn-1', '#hero-btn-2'], {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: 'power3.out',
    }, '-=0.2');

    // lets-chat SVG slides up alongside the buttons
    tl.to('.hero-lets-chat', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
    }, '+=0.39'); // starts 0.1s after buttons begin

    // 6. Project cards marquee — slides up after buttons/lets-chat settle
    tl.to('.hero-proj-marquee-wrap', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power3.out',
    }, '-=0.00');

    // 7. Pills — last to appear, fade + scale pop, then release CSS wander animations
    gsap.set('.hero-pill', { scale: 0.7 });
    tl.to('.hero-pill', {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.6)',
        stagger: 0.15,
        onComplete: function () {
            document.querySelectorAll('.hero-pill').forEach(function (pill) {
                pill.style.animationPlayState = 'running';
            });
        },
    }, '+=0.1');


});
