// app_shared.js: injects header and footer into pages for reuse
function renderHeader() {
    const headerEl = document.getElementById('app-header');
    if (!headerEl) return;
    headerEl.innerHTML = `
        <div class="container">
            <nav class="app-nav">
                <div class="logo"><span>t.</span></div>
                <a href="../index.html" class="active">Home</a>
                <a href="../index.html#projects">Projects</a>
                <a href="../index.html#about-me">About Me</a>
                
                <a href="../index.html#contact">Contact</a>
            </nav>
        </div>
    `;

    // Attach delegated click listener once to handle smooth in-page scrolling
    if (!headerEl._navSmoothScrollAttached) {
        headerEl.addEventListener('click', function(e) {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href');
            if (!href) return;

            // Try to resolve the link relative to current location
            let targetUrl;
            try {
                targetUrl = new URL(href, window.location.href);
            } catch (err) {
                return; // invalid URL, let browser handle
            }

            // Helper: are we on the index page?
            const onIndexPage = (function() {
                const p = window.location.pathname || '';
                // Normalize Windows file paths and trailing slashes
                return p.endsWith('index.html') || p === '/' || p === '' || p.toLowerCase().endsWith('\\index.html');
            })();

            // If we're already on the index page and the link points to index (or includes a hash), handle smooth scroll
            const linkPointsToIndex = (function() {
                const tp = targetUrl.pathname || '';
                return tp.endsWith('index.html') || tp === '/' || tp === '' || tp.toLowerCase().endsWith('\\index.html');
            })();

            // If there's a hash (e.g. #about) or the link explicitly points to index and we're on index, do smooth scroll
            if ((onIndexPage && linkPointsToIndex) || (linkPointsToIndex && targetUrl.hash)) {
                // If link has a hash, scroll to that element. If no hash, scroll to top.
                const hash = targetUrl.hash || '';
                // Only intercept when target is same page (index) to avoid preventing cross-page navigation
                if (onIndexPage) {
                    e.preventDefault();
                    if (hash) {
                        const id = hash.slice(1);
                        const el = document.getElementById(id);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
                            return;
                        }
                        // if element not found, fall back to top
                    }
                    // No hash or element missing -> scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    try { history.replaceState(null, '', window.location.pathname); } catch (e) { /* ignore */ }
                }
            }
            // Otherwise allow normal navigation (e.g., from other pages to index.html)
        });
        headerEl._navSmoothScrollAttached = true;
    }
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
          <a href="https://www.linkedin.com/in/twambi-musukwa-088403271/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" style="width:26px; height: 26px" class="footer-social"><img src="../assets/images/footer/linkedin.svg" alt="LinkedIn" /></a>
          <a href="https://web.facebook.com/twambilile.musukwa.3" aria-label="Facebook" target="_blank" rel="noopener noreferrer" style="width:24px; height: 24px" class="footer-social"><img src="../assets/images/footer/facebook.svg" alt="Facebook" /></a>
          <a href="https://www.instagram.com/twambi_boi" aria-label="Instagram" target="_blank" rel="noopener noreferrer" style="width:24px; height: 24px" class="footer-social"><img src="../assets/images/footer/instagram.svg" alt="Instagram" /></a>
          <a href="https://x.com/influx_ix" aria-label="X" target="_blank" rel="noopener noreferrer" style="width:20px; height: 20px; margin-top: 2px" class="footer-social"><img src="../assets/images/footer/twitter_x.svg" alt="X" /></a>
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
      Made with <span class="footer-heart">♥</span> by <span class="footer-author">Twambi Musukwa</span> Thank you <span class="footer-scroll">For scrolling</span>
    </div>
  </div>

    `;
}

// Render after DOM is ready so elements exist regardless of script placement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        renderHeader();
        renderFooter();
    });
} else {
    renderHeader();
    renderFooter();
}
