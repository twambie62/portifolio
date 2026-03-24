// app_shared.js: injects header and footer into pages for reuse
function renderHeader() {
    document.getElementById('app-header').innerHTML = `
        <div class="container">
            <nav class="app-nav">
                <div class="logo"><span>t.</span></div>
                <a href="../index.html" class="active">Home</a>
                <a href="#about">About</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    `;
}
// function renderFooter() {
//     document.getElementById('app-footer').innerHTML = `
//         <footer class="socials">
//             <a class="icon-btn" href="#"><i class="ri-linkedin-fill"></i></a>
//             <a class="icon-btn" href="#"><i class="ri-facebook-circle-fill"></i></a>
//             <a class="icon-btn" href="#"><i class="ri-instagram-line"></i></a>
//             <a class="icon-btn" href="#"><i class="ri-twitter-x-line"></i></a>
//         </footer>
//     `;
// }
renderHeader();
// renderFooter();

