// app_shared.js: injects header and footer into pages for reuse
function renderHeader() {
    const headerEl = document.getElementById('app-header');
    if (!headerEl) return;

    // Detect if we are on the root index page or a sub-page
    const path = window.location.pathname || '';
    const isIndex = path.endsWith('index.html') || path === '/' || path === '' || /[/\\]$/.test(path);
    const base = isIndex ? '' : '../';
    const homeHref    = isIndex ? '#home'      : base + 'index.html';
    const projectsHref= isIndex ? '#projects'  : base + 'index.html#projects';
    const aboutHref   = isIndex ? '#about-me'  : base + 'index.html#about-me';
    const contactHref = isIndex ? '#contact'   : base + 'index.html#contact';

    headerEl.innerHTML = `
        <div class="container">
            <nav class="nav">
                <div class="logo"><span>t.</span></div>
                <div class="nav-links">
                    <a href="${homeHref}" class="${isIndex ? 'active' : ''}">Home</a>
                    <a href="${projectsHref}" class="${!isIndex ? 'active' : ''}">Projects</a>
                    <a href="${aboutHref}">About Me</a>
                    <a href="${contactHref}">Contact</a>
                </div>
                <button class="hamburger" id="hamburger-btn" aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </nav>
        </div>
    `;

    // Mobile menu overlay (injected into body once)
    if (!document.getElementById('shared-mobile-menu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.id = 'shared-mobile-menu';
        mobileMenu.innerHTML = `
            <a href="${homeHref}"     class="mobile-nav-link">Home</a>
            <a href="${projectsHref}" class="mobile-nav-link">Projects</a>
            <a href="${aboutHref}"    class="mobile-nav-link">About Me</a>
            <a href="${contactHref}"  class="mobile-nav-link">Contact</a>
        `;
        document.body.appendChild(mobileMenu);
    }

    // Hamburger toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('shared-mobile-menu');
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
        mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // On-page smooth scroll for hash anchors (index.html only)
    if (isIndex) {
        headerEl.addEventListener('click', function (e) {
            const a = e.target.closest('a[href^="#"]');
            if (!a) return;
            e.preventDefault();
            const target = document.getElementById(a.getAttribute('href').slice(1));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        // Also wire the mobile menu links
        if (mobileMenu) {
            mobileMenu.addEventListener('click', function (e) {
                const a = e.target.closest('a[href^="#"]');
                if (!a) return;
                e.preventDefault();
                mobileMenu.classList.remove('open');
                const target = document.getElementById(a.getAttribute('href').slice(1));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // Highlight active nav link while scrolling
        const sections = Array.from(document.querySelectorAll('main section[id]'));
        const navLinks  = Array.from(headerEl.querySelectorAll('.nav a'));
        function setActiveLink() {
            const y = window.scrollY + 140;
            let current = sections[0];
            sections.forEach(function (sec) { if (y >= sec.offsetTop) current = sec; });
            if (!current) return;
            navLinks.forEach(function (a) {
                a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
            });
        }
        window.addEventListener('scroll', setActiveLink, { passive: true });
        setActiveLink();
    }
}

function renderFooter() {
    const footerEl = document.getElementById('app-footer');
    if (!footerEl) return;

    const path = window.location.pathname || '';
    const isIndex = path.endsWith('index.html') || path === '/' || path === '' || /[/\\]$/.test(path);
    const base = isIndex ? '' : '../';

    footerEl.innerHTML = `
  <div class="footer-container">
    <div class="footer-top">
      <div class="footer-left">
        <div class="footer-title">Do You have<br>any questions?</div>
        <div class="footer-sub">Feel free to email me</div>
        <div class="footer-email">twambililemusukwa@gmail.com</div>
        <div class="footer-socials">
          <a href="https://www.linkedin.com/in/twambi-musukwa-088403271/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" style="width:28px;height:28px" class="footer-social"><img src="${base}assets/images/footer/linkedin.svg" alt="LinkedIn"/></a>
          <a href="https://www.behance.net/twambilmusukwa" aria-label="Behance" target="_blank" rel="noopener noreferrer" style="width:25px;height:25px;text-decoration:none;" class="footer-social"><i class="ri-behance-fill" style="font-size:25px;color:#2f2f2f;"></i></a>
     
          <a href="https://web.facebook.com/twambilile.musukwa.3" aria-label="Facebook" target="_blank" rel="noopener noreferrer" style="width:25px;height:25px" class="footer-social"><img src="${base}assets/images/footer/facebook.svg" alt="Facebook"/></a>
          <a href="https://www.instagram.com/twambi_boi" aria-label="Instagram" target="_blank" rel="noopener noreferrer" style="width:25px;height:25px" class="footer-social"><img src="${base}assets/images/footer/instagram.svg" alt="Instagram"/></a>
        </div>
      </div>
      <div class="footer-right">
        <div class="footer-contact-title">Contact me</div>
        <div class="footer-contact-phone">+265 99-588-64-98</div>
        <div class="footer-contact-phone">+265 88-485-08-93</div>
        <div class="footer-location-title">Location</div>
        <div class="footer-location">Lilongwe, Malawi</div>
      </div>
    </div>
    <div class="footer-divider"></div>
    <div class="footer-copyright">© 2026 Twambi. All rights reserved</div>
    <div class="footer-svg-bg">
      <img src="${base}assets/images/footer/twambi_footer.svg" alt="Twambi"/>
      <span class="footer-dot"></span>
    </div>
    <div class="footer-bottom-bar">
      Made with <span class="footer-heart">♥</span> by <span class="footer-author">Twambi</span> Thank you <span class="footer-scroll">For scrolling</span>
    </div>
  </div>
    `;

    // ── Footer staggered fade-up animation ───────────────────────────────
    function initFooterAnimation() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        const phoneEls = Array.from(footerEl.querySelectorAll('.footer-contact-phone'));
        const els = [
            footerEl.querySelector('.footer-title'),
            footerEl.querySelector('.footer-sub'),
            footerEl.querySelector('.footer-email'),
            footerEl.querySelector('.footer-socials'),
            footerEl.querySelector('.footer-contact-title'),
            ...phoneEls,
            footerEl.querySelector('.footer-location-title'),
            footerEl.querySelector('.footer-location'),
            footerEl.querySelector('.footer-divider'),
            footerEl.querySelector('.footer-copyright'),
            footerEl.querySelector('.footer-svg-bg'),
            footerEl.querySelector('.footer-bottom-bar'),
        ].filter(Boolean);

        gsap.set(els, { opacity: 0, y: 38 });

        ScrollTrigger.create({
            trigger: footerEl,
            start: 'top 90%',
            once: true,
            onEnter: function () {
                gsap.to(els, {
                    opacity: 1, y: 0,
                    duration: .6,
                    ease: 'power3.out',
                    stagger: 0.11,
                });
            },
        });
    }

    function loadScrollTriggerThenAnimate() {
        if (typeof ScrollTrigger !== 'undefined') { initFooterAnimation(); return; }
        var st = document.createElement('script');
        st.src = 'https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js';
        st.onload = function () { initFooterAnimation(); };
        document.head.appendChild(st);
    }

    if (typeof gsap !== 'undefined') {
        loadScrollTriggerThenAnimate();
    } else {
        window.addEventListener('load', function () {
            var attempts = 0;
            var poll = setInterval(function () {
                attempts++;
                if (typeof gsap !== 'undefined') { clearInterval(poll); loadScrollTriggerThenAnimate(); }
                else if (attempts > 20) clearInterval(poll);
            }, 100);
        });
    }
}

// Render after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { renderHeader(); renderFooter(); });
} else {
    renderHeader();
    renderFooter();
}


    // Mobile menu overlay (injected into body)
    if (!document.getElementById('shared-mobile-menu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.id = 'shared-mobile-menu';
        mobileMenu.innerHTML = `
            <a href="../index.html" class="mobile-nav-link">Home</a>
            <a href="../index.html#projects" class="mobile-nav-link">Projects</a>
            <a href="../index.html#about-me" class="mobile-nav-link">About Me</a>
            <a href="../index.html#contact" class="mobile-nav-link">Contact</a>
        `;
        document.body.appendChild(mobileMenu);
    }

    // Hamburger toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('shared-mobile-menu');
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
        mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // Mark "Projects" active since all sub-pages are project pages
    const links = headerEl.querySelectorAll('.nav a');
    links.forEach(function (a) {
        const href = a.getAttribute('href') || '';
        if (href.includes('#projects')) {
            a.classList.add('active');
        }
    });

    // Smooth scroll for in-page hash links when already on index
    if (!headerEl._navSmoothScrollAttached) {
        headerEl.addEventListener('click', function (e) {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href');
            if (!href) return;

            let targetUrl;
            try { targetUrl = new URL(href, window.location.href); } catch (err) { return; }

            const onIndexPage = (function () {
                const p = window.location.pathname || '';
                return p.endsWith('index.html') || p === '/' || p === '' || p.toLowerCase().endsWith('\\index.html');
            })();
            const linkPointsToIndex = (function () {
                const tp = targetUrl.pathname || '';
                return tp.endsWith('index.html') || tp === '/' || tp === '' || tp.toLowerCase().endsWith('\\index.html');
            })();

            if (onIndexPage && linkPointsToIndex) {
                const hash = targetUrl.hash || '';
                e.preventDefault();
                if (hash) {
                    const el = document.getElementById(hash.slice(1));
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        try { history.replaceState(null, '', hash); } catch (e2) { /* ignore */ }
                        return;
                    }
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                try { history.replaceState(null, '', window.location.pathname); } catch (e2) { /* ignore */ }
            }
        });
        headerEl._navSmoothScrollAttached = true;

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
          <a href="https://www.linkedin.com/in/twambi-musukwa-088403271/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" style="width:28px; height: 28px" class="footer-social"><img src="../assets/images/footer/linkedin.svg" alt="LinkedIn" /></a>
          <a href="https://www.behance.net/twambilmusukwa" aria-label="Behance" target="_blank" rel="noopener noreferrer" style="width:25px; height: 25px; text-decoration:none;" class="footer-social"><i class="ri-behance-fill" style="font-size:25px; color:#2f2f2f;"></i></a>
        
          <a href="https://github.com/twambie62" aria-label="GitHub" target="_blank" rel="noopener noreferrer" style="width:25px; height: 25px; text-decoration:none;" class="footer-social"><i class="ri-github-fill" style="font-size:25px; color:#2f2f2f;"></i></a>
          <a href="https://www.instagram.com/twambi_boi" aria-label="Instagram" target="_blank" rel="noopener noreferrer" style="width:25px; height: 25px" class="footer-social"><img src="../assets/images/footer/instagram.svg" alt="Instagram" /></a>
        </div>
      </div>
      <div class="footer-right">
        <div class="footer-contact-title">Contact me</div>
        <div class="footer-contact-phone">+265 99-588-64-98</div>
        <div class="footer-contact-phone">+265 88-485-08-93</div>
        <div class="footer-location-title">Location</div>
        <div class="footer-location">Lilongwe,Malawi</div>
      </div>
    </div>
    <div class="footer-divider"></div>
    <div class="footer-copyright">© 2026 Twambi. All rights reserved</div>
    <div class="footer-svg-bg">
      <img src="../assets/images/footer/twambi_footer.svg" alt="Twambi" />
      <span class="footer-dot"></span>
    </div>
    <div class="footer-bottom-bar">
      Made with <span class="footer-heart">♥</span> by <span class="footer-author">Twambi</span> Thank you <span class="footer-scroll">For scrolling</span>
    </div>
  </div>
    `;

    // ── Footer staggered fade-up animation (requires GSAP + ScrollTrigger) ──
    function initFooterAnimation() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const phoneEls = Array.from(footerEl.querySelectorAll('.footer-contact-phone'));
        const els = [
            footerEl.querySelector('.footer-title'),
            footerEl.querySelector('.footer-sub'),
            footerEl.querySelector('.footer-email'),
            footerEl.querySelector('.footer-socials'),
            footerEl.querySelector('.footer-contact-title'),
            ...phoneEls,
            footerEl.querySelector('.footer-location-title'),
            footerEl.querySelector('.footer-location'),
            footerEl.querySelector('.footer-divider'),
            footerEl.querySelector('.footer-copyright'),
            footerEl.querySelector('.footer-svg-bg'),
            footerEl.querySelector('.footer-bottom-bar'),
        ].filter(Boolean);

        gsap.set(els, { opacity: 0, y: 36 });

        ScrollTrigger.create({
            trigger: footerEl,
            start: 'top 90%',
            once: true,
            onEnter: function () {
                gsap.to(els, {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: 'power3.out',
                    stagger: 0.11,
                });
            },
        });
    }

    function loadScrollTriggerThenAnimate() {
        if (typeof ScrollTrigger !== 'undefined') {
            initFooterAnimation();
            return;
        }
        // Inject ScrollTrigger CDN script dynamically
        var st = document.createElement('script');
        st.src = 'https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js';
        st.onload = function () { initFooterAnimation(); };
        document.head.appendChild(st);
    }

    // Wait until GSAP core is available, then load ScrollTrigger
    if (typeof gsap !== 'undefined') {
        loadScrollTriggerThenAnimate();
    } else {
        window.addEventListener('load', function () {
            var attempts = 0;
            var poll = setInterval(function () {
                attempts++;
                if (typeof gsap !== 'undefined') {
                    clearInterval(poll);
                    loadScrollTriggerThenAnimate();
                } else if (attempts > 20) {
                    clearInterval(poll);
                }
            }, 100);
        });
    }
}

// Render after DOM is ready so elements exist regardless of script placement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        renderHeader();
        renderFooter();
    });
} else {
    renderHeader();
    renderFooter();
}
