// app_shared.js: injects header and footer into pages for reuse
function renderHeader() {
    document.getElementById('app-header').innerHTML = `
        <div class="container">
            <nav class="app-nav">
                <div class="logo"><span>t.</span></div>
                <a href="../index.html" class="active">Home</a>
                <a href="../index.html#about">About Me</a>
                <a href="../index.html#projects">Projects</a>
                <a href="../index.html#contact">Contact</a>
            </nav>
        </div>
    `;
}
function renderFooter() {
    document.getElementById('app-footer').innerHTML = `
<head>

</head>
  <div class="footer-container">
    <div class="footer-top">
      <div class="footer-left">
        <div class="footer-title">Do You have<br>any questions?</div>
        <div class="footer-sub">Feel free to email me</div>
        <div class="footer-email">twambililemusukwa@gmail.com</div>
        <div class="footer-socials">
          <a href="#" aria-label="LinkedIn" style="width:28px; height: 28px" class="footer-social"><img src="../assets/images/footer/linkedin.svg" alt="LinkedIn" /></a>
          <a href="#" aria-label="Facebook" style="width:25px; height: 25px" class="footer-social"><img src="../assets/images/footer/facebook.svg" alt="Facebook" /></a>
          <a href="#" aria-label="Instagram" style="width:25px; height: 25px" class="footer-social"><img src="../assets/images/footer/instagram.svg" alt="Instagram" /></a>
          <a href="#" aria-label="X" style="width:21px; height: 21px; margin-top: 2px" class="footer-social"><img src="../assets/images/footer/twitter_x.svg" alt="X" /></a>
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
renderHeader();
renderFooter();

