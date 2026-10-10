// Smooth scroll and active state
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


// Hamburger menu
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
hamburgerBtn.addEventListener('click', function() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});
// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        mobileMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
