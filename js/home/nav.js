// Home page nav: smooth scroll to sections and highlight the current one.
// The header itself (and the mobile menu) is rendered by js/shared/layout.js.
const links = document.querySelectorAll('.nav-links a');
const sections = [...document.querySelectorAll('main section')];

const headerEl = document.querySelector('header');
function syncHeaderSpacing() {
    document.body.style.paddingTop = headerEl.offsetHeight + 'px';
}
window.addEventListener('resize', syncHeaderSpacing);
syncHeaderSpacing();

const setActive = () => {
    const y = scrollY + 120;
    const current = sections.findLast(sec => y >= sec.offsetTop);
    if (!current) return;
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current.id));
};
links.forEach(link => link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
}));
window.addEventListener('scroll', setActive);
setActive();
