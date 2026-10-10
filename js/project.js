// Shared behaviour for every project page (projects/*.html):
// action buttons, back button, screenshot grid height, entrance animation.
(function () {
    // ── Action buttons ──────────────────────────────────────────────────
    // Markup: <a class="top-tag" data-icon="website|code|behance|playstore" href="…" target="_blank"
    //            rel="noopener noreferrer">Label</a>, inside <div class="top-right-actions">.
    const ICONS = {
        website: '<svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
        code: '<svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>',
        behance: '<svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;"><path d="M7.5 11.5c.97 0 1.75-.78 1.75-1.75S8.47 8 7.5 8H4v3.5h3.5zm.25 2H4V17h3.75c1.1 0 2-.9 2-2s-.9-1.5-2-1.5zM0 6h10.5C12.43 6 14 7.57 14 9.5c0 1.18-.6 2.22-1.5 2.84C13.71 12.95 14.5 14.15 14.5 15.5 14.5 17.71 12.71 19.5 10.5 19.5H0V6zm16 1.5h6v1H16v-1zm3 1.5c1.93 0 3.5 1.57 3.5 3.5H17c0 1.1.9 2 2 2 .74 0 1.38-.4 1.72-1h2.72C23.02 15.54 21.63 17 19 17c-2.21 0-4-1.79-4-4s1.79-4 4-4z"/></svg>',
        playstore: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;"><path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198 2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658 16.802 8.99l-2.303 2.303-8.635-8.635z"/></svg>',
    };

    // On Android, open the Play Store app directly (falls back to the web page if it isn't installed)
    function openPlayStoreApp(link) {
        if (!/Android/i.test(navigator.userAgent)) return;
        const web = link.href;
        const appId = new URL(web).searchParams.get('id');
        if (!appId) return;
        link.href = 'intent://details?id=' + appId + '#Intent;scheme=market;package=com.android.vending;S.browser_fallback_url=' + encodeURIComponent(web) + ';end';
        link.removeAttribute('target');
    }

    document.querySelectorAll('a.top-tag[data-icon]').forEach(function (link) {
        const icon = ICONS[link.dataset.icon];
        if (icon) link.insertAdjacentHTML('afterbegin', icon);
        if (link.dataset.icon === 'playstore') openPlayStoreApp(link);
    });

    document.addEventListener('DOMContentLoaded', function () {
        const topbar = document.querySelector('.project-topbar');

        // ── Back button (circle + "Projects"): hover state together, click goes home ──
        if (topbar) {
            const circle = topbar.querySelector('.circle');
            const text   = topbar.querySelector('.project-text');

            function setHover()   { topbar.classList.add('hovering'); }
            function clearHover() { topbar.classList.remove('hovering'); }
            function goHome(e) {
                if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
                window.location.href = '../index.html';
            }
            function keyActivate(e) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    goHome(e);
                }
            }
            [circle, text].forEach(el => {
                if (!el) return;
                el.addEventListener('mouseenter', setHover);
                el.addEventListener('mouseleave', clearHover);
                el.addEventListener('focus',      setHover);
                el.addEventListener('blur',       clearHover);
                el.addEventListener('click',      goHome);
                el.addEventListener('keydown',    keyActivate);
            });
        }

        // ── First screenshot card matches its image's height ────────────────
        // (only where the card opts in with data-match-image-height)
        const img   = document.getElementById('first-grid-img');
        const media = document.querySelector('#first-grid-media[data-match-image-height]');
        if (img && media) {
            function syncHeight() { media.style.height = img.offsetHeight + 'px'; }
            if (img.complete) { syncHeight(); } else { img.onload = syncHeight; }
            window.addEventListener('resize', syncHeight);
        }

        // ── Entrance animation: right → left fade-in, staggered ─────────────
        const targets = [
            topbar,
            document.querySelector('.header-row-1'),
            document.querySelector('.header-hero-img'),
            document.querySelector('.proj-meta-card'),
            document.querySelector('.overview-title'),
            document.querySelector('.header-row-3'),
        ].filter(Boolean);

        gsap.set(targets, { opacity: 0, x: 60 });
        gsap.to(targets, {
            opacity: 1, x: 0, duration: 0.75,
            ease: 'power3.out', stagger: 0.14, delay: 0.1,
        });

        // Hero video (full-width, or video + image row) slides in, then the video starts
        const heroVideo = document.getElementById('hero-video');
        const heroWrap  = document.querySelector('.header-hero-video') || document.querySelector('.header-row-2');
        if (heroWrap) {
            gsap.set(heroWrap, { opacity: 0, x: 60 });
            gsap.to(heroWrap, {
                opacity: 1, x: 0, duration: 0.75,
                ease: 'power3.out', delay: 0.38,
                onComplete: function () {
                    if (heroVideo) heroVideo.play();
                },
            });
        }

        // Tag chips get their own tighter stagger
        const tags = document.querySelectorAll('.header-tags span');
        if (tags.length) {
            gsap.set(tags, { opacity: 0, x: 40 });
            gsap.to(tags, {
                opacity: 1, x: 0, duration: 0.55,
                ease: 'power3.out', stagger: 0.07, delay: 0.35,
            });
        }
    });
})();
