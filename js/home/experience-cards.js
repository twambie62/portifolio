// ── Experience & Education cards — slide in from right on scroll ──────
(function () {
    const weCards = document.querySelectorAll('#work .we-card, #education .we-card');
    if (!weCards.length) return;

    // Also animate the section headings
    const weHeadings = document.querySelectorAll('#work .about-me-heading, #education .about-me-heading');

    // Set initial state — pushed to the right, invisible
    gsap.set(weCards,    { opacity: 0, x: 28 });
    gsap.set(weHeadings, { opacity: 0, x: 24 });

    // Headings slide in first, then cards follow per-entry
    weHeadings.forEach(function (heading) {
        gsap.to(heading, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                once: true,
            },
        });
    });

    // Each card slides in from the right with a subtle stagger per section
    weCards.forEach(function (card, i) {
        // Find the index of the card within its own parent so stagger resets per section
        const siblings = card.parentElement.querySelectorAll('.we-card');
        const localIndex = Array.from(siblings).indexOf(card);

        gsap.to(card, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            delay: localIndex * 0.12,
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true,
            },
        });
    });
})();
