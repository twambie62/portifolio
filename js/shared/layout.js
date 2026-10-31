// Shared page chrome for every page: header (nav + mobile menu) and footer.
// Each page has <header id="app-header"></header> and <footer id="app-footer" class="app-footer"></footer>
// and loads this script after both. Home-only nav behaviour (smooth scroll, active section) is in js/home/nav.js.
(function () {
    const path = window.location.pathname || '';
    const isHome = path.endsWith('index.html') || path === '/' || path === '' || /[/\\]$/.test(path);
    // Pages inside projects/ or pages/ need '../' to reach the site root; root-level pages (e.g. projects.html) don't
    const inSubdir = /\/(projects|pages)\/[^/]*$/.test(path);
    const base = inSubdir ? '../' : '';
    const activeId = isHome ? 'home' : 'projects';
    const LINKS = [
        ['home', 'Home'],
        ['projects', 'Projects'],
        ['about-me', 'About Me'],
        ['contact', 'Contact'],
    ];
    const href = id => (isHome ? '' : base + 'index.html') + '#' + id;

    function renderHeader() {
        const headerEl = document.getElementById('app-header');
        if (!headerEl) return;

        const navLinks = LINKS.map(([id, label]) => `
                <a href="${href(id)}" class="${id === activeId ? 'active ' : ''}btn-slide">
                    <span class="btn-slide-inner">
                        <span class="btn-slide-default">${label}</span>
                        <span class="btn-slide-hover">${label}</span>
                    </span>
                </a>`).join('');

        headerEl.innerHTML = `
    <div class="container">
        <nav class="nav">
            <div class="logo"><span>t.</span></div>
            <div class="nav-links">${navLinks}
            </div>
            <button class="hamburger" id="hamburger-btn" aria-label="Menu">
                <span></span><span></span><span></span>
            </button>
        </nav>
    </div>
`;

        // Full-screen mobile menu, placed right after the header
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.id = 'mobile-menu';
        mobileMenu.innerHTML = LINKS.map(([id, label]) => `
    <a href="${href(id)}" class="mobile-nav-link">${label}</a>`).join('') + '\n';
        headerEl.insertAdjacentElement('afterend', mobileMenu);

        const hamburgerBtn = document.getElementById('hamburger-btn');
        function setMenuOpen(isOpen) {
            mobileMenu.classList.toggle('open', isOpen);
            hamburgerBtn.classList.toggle('active', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }
        hamburgerBtn.addEventListener('click', function () {
            setMenuOpen(!mobileMenu.classList.contains('open'));
        });
        // Close the menu when a link is clicked; on the home page scroll to the section instead of jumping
        mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
            link.addEventListener('click', function (e) {
                setMenuOpen(false);
                if (!isHome) return;
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function renderFooter() {
        const footerEl = document.getElementById('app-footer');
        if (!footerEl) return;

        footerEl.innerHTML = `
    <div class="footer-container">
        <div class="footer-top">
            <div class="footer-left">
                <div class="footer-title">Do You have<br>any questions?</div>
                <div class="footer-sub">Feel free to email me</div>
                <div class="footer-email">twambililemusukwa@gmail.com</div>
                <div class="footer-socials">
                    <a href="https://www.linkedin.com/in/twambi-musukwa-088403271/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" style="width:28px; height: 28px" class="footer-social"><img src="${base}assets/shared/footer/linkedin.svg" alt="LinkedIn" /></a>
                    <a href="https://www.behance.net/twambilmusukwa" aria-label="Behance" target="_blank" rel="noopener noreferrer" style="width:25px; height: 25px; text-decoration:none;" class="footer-social"><i class="ri-behance-fill" style="font-size:25px; color:#2f2f2f;"></i></a>

                    <a href="https://github.com/twambie62" aria-label="GitHub" target="_blank" rel="noopener noreferrer" style="width:25px; height: 25px; text-decoration:none;" class="footer-social"><i class="ri-github-fill" style="font-size:25px; color:#2f2f2f;"></i></a>

                    <a href="https://www.instagram.com/twambi_boi" aria-label="Instagram" target="_blank" rel="noopener noreferrer" style="width:25px; height: 25px" class="footer-social"><img src="${base}assets/shared/footer/instagram.svg" alt="Instagram" /></a>
                </div>
            </div>
            <div class="footer-right">
                <div class="footer-contact-title">Contact me</div>
                <div class="footer-contact-phone">+265 99-588-64-98</div>
                <div class="footer-contact-phone">+265 88-495-08-93</div>
                <div class="footer-location-title">Location</div>
                <div class="footer-location">Lilongwe,Malawi</div>
            </div>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-copyright">© 2026 Twambi. All rights reserved</div>
        <div class="footer-svg-bg">
            <img src="${base}assets/shared/footer/twambi-wordmark.svg" alt="Twambi" />
            <span class="footer-dot"></span>
        </div>
        <div class="footer-bottom-bar">
            Made with <span class="footer-heart">♥</span> by <span class="footer-author">Twambi</span> Thank you <span class="footer-scroll">For scrolling</span>
        </div>
    </div>
`;
    }

    renderHeader();
    renderFooter();
})();
