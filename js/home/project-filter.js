// Projects section — filter buttons show/hide cards by category
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.card-link');
    let pendingTimeouts = [];

    function clearPending() {
        pendingTimeouts.forEach(id => clearTimeout(id));
        pendingTimeouts = [];
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;

            clearPending(); // cancel any in-flight filter animation

            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => card.classList.add('card-hidden'));

            const t1 = setTimeout(() => {
                let visibleIndex = 0;

                projectCards.forEach(card => {
                    const categories = (card.dataset.category || '').split(' ');
                    const shouldShow = filter === 'all' || categories.includes(filter);

                    card.style.display = shouldShow ? '' : 'none';

                    if (shouldShow) {
                        const t2 = setTimeout(() => {
                            card.classList.remove('card-hidden');
                        }, visibleIndex * 60);
                        pendingTimeouts.push(t2);
                        visibleIndex++;
                    }
                });
                gsap.getTweensOf(".projects .card-media img").forEach(tween => tween.progress(1));

                // Let everything settle, then tell ScrollTrigger the
                // page geometry changed so later sections recalc correctly.
                const t3 = setTimeout(() => {
                    if (window.ScrollTrigger) ScrollTrigger.refresh();
                }, visibleIndex * 60 + 50);
                pendingTimeouts.push(t3);

            }, 400);
            pendingTimeouts.push(t1);
        });
    });
});
