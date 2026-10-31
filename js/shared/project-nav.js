// ── Project pages — "Next project" card, previous link and "View all projects" button ──
// The order below is the single source of truth (same order as the home page cards).
// To add a project: add one entry here, and add <nav id="project-nav"></nav> + this script to its page.
(function () {
    const PROJECTS = [
        { slug: 'blood-pressure-app',  title: 'Blood Pressure App',                desc: 'Remote blood pressure monitoring connected to an Arduino ESP-32 for real-time patient tracking.', img: 'blood-pressure-app/screens/home.webp',                 bg: 'blood-pressure-app.webp' },
        { slug: 'influencer-malawi',   title: 'Influencer Malawi App',             desc: 'A platform connecting influencers with brands for collaboration and marketing campaigns.',      img: 'influencer-malawi/screens/onboarding-profile.webp',  bg: 'influencer-malawi-app.webp' },
        { slug: 'akometsi',            title: 'Movie App',                         desc: 'A streaming platform with movie details, video player, and group viewing features.',             img: 'akometsi/screens/home-movie-details-dark.webp',      bg: 'movie-app.webp' },
        { slug: 'smart-home',          title: 'Smart Home App',                    desc: 'IoT-based smart home control with room management, automation, and device settings.',          img: 'smart-home/screens/main-screen-home.webp',           bg: 'smart-home-app.webp' },
        { slug: 'kwacha-wise',         title: 'Fintech App',                       desc: 'Personal finance analytics with income tracking, expenditure insights, and a clean dashboard.',  img: 'kwacha-wise/screens/home-mockup.webp',               bg: 'fin-tech-app.webp' },
        { slug: 'courier-app',         title: 'Courier App',                       desc: 'Live tracking courier application with real-time delivery updates and payment integration.',    img: 'courier-app/screens/home-live-tracking.webp',        bg: 'courier-app.webp' },
        { slug: 'notes-app',           title: 'Notes App',                         desc: 'A personal management app for notes, habits, and finance tracking with clean onboarding.',      img: 'notes-app/screens/home-onboarding.webp',             bg: 'notes-app.webp' },
        { slug: 'track-it-website',    title: 'Track it Website',                  desc: 'A landing page for a personal productivity, finance and task management mobile app.',           img: 'track-it-website/screens/main-image.webp',           bg: 'track-it-website.webp' },
        { slug: 'leads-desk',          title: 'LeadsDesk',                         desc: 'A full-stack lead management platform with admin and agent dashboards and audit logging.',      img: 'leads-desk/screens/dashboard.webp',                  bg: 'smart-apps-redesign.webp' },
        { slug: 'sales-verse',         title: 'SalesVerse Website',                desc: 'A B2B lead-generation agency website with service showcases and lead capture.',                 img: 'sales-verse/screens/hero-section.webp',              bg: 'sales-verse-2.webp' },
        { slug: 'nyanja-health',       title: 'Nyanja Research Institute Website', desc: 'A health research institute website with publications, team profiles, and news.',               img: 'nyanja-health/screens/hero-section-2.webp',          bg: 'courier-app.webp' },
        { slug: 'smart-apps-website',  title: 'Smart Apps Website',                desc: 'A technology company website showcasing web hosting, services, and company information.',       img: 'smart-apps-website/screens/hero-section-2-2.webp',   bg: 'smart-apps-website.webp' },
        { slug: 'smart-apps-redesign', title: 'Smart Apps Redesign',               desc: 'A fresh redesign of the Smart Apps website with a modernized hero and improved UX.',            img: 'smart-apps-redesign/screens/hero-section.webp',      bg: 'smart-apps-redesign.webp' },
    ];

    const mount = document.getElementById('project-nav');
    if (!mount) return;

    // data-slug lets a page (e.g. a preview copy) say which project it is; otherwise use the file name
    const file = mount.dataset.slug || (window.location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    const i = PROJECTS.findIndex(p => p.slug === file);
    if (i === -1) return;

    // Wrap around: the last project leads back to the first
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];

    mount.className = 'proj-nav';
    mount.setAttribute('aria-label', 'More projects');
    mount.innerHTML = `
        <div class="proj-nav-label">Next project</div>
        <a class="proj-nav-next" href="${next.slug}.html">
            <div class="proj-nav-media" style="background-image: url('../assets/home/project-cards/backgrounds/${next.bg}');">
                <img src="../assets/projects/${next.img}" alt="${next.title}" loading="lazy">
            </div>
            <div class="proj-nav-body">
                <div class="proj-nav-title">${next.title}</div>
                <div class="proj-nav-desc">${next.desc}</div>
                <span class="proj-nav-go">View project <i class="ri-arrow-right-up-line" aria-hidden="true"></i></span>
            </div>
        </a>
        <div class="proj-nav-row">
            <a class="proj-nav-prev" href="${prev.slug}.html">
                <i class="ri-arrow-left-line" aria-hidden="true"></i>
                <span>Previous: <strong>${prev.title}</strong></span>
            </a>
            <a class="proj-nav-all btn-slide" href="../projects.html">
                <span class="btn-slide-inner">
                    <span class="btn-slide-default">View all projects</span>
                    <span class="btn-slide-hover">View all projects</span>
                </span>
                <i class="ri-arrow-right-up-line proj-nav-all-arrow" aria-hidden="true"></i>
            </a>
        </div>
    `;
})();
