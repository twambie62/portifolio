// Tools section — circular icon entrance animation
(function () {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.tools-float-icon', {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.tools-section',
            start: 'top 80%',
            once: true,
        },
    });
})();
