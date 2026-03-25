// app_shared.js: injects header and footer into pages for reuse
function renderHeader() {
    const headerEl = document.getElementById('app-header');
    if (!headerEl) return;
    headerEl.innerHTML = `
        <div class="container">
            <nav class="app-nav">
                <div class="logo"><span>t.</span></div>
                <a href="../index.html#home" >Home</a>
                <a href="../index.html#projects" class="active">Projects</a>
                <a href="../index.html#about-me">About Me</a>
                <a href="../index.html#contact">Contact</a>
            </nav>
        </div>
    `;
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
