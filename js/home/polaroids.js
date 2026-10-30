// Hero-intro polaroid photos — spin and settle into place on scroll
gsap.registerPlugin(ScrollTrigger);

// Each polaroid gets its own "settled" rotation (read from CSS) and a
// slightly wilder starting rotation/scale so the reveal has somewhere to travel from.
const polaroids = document.querySelectorAll(".polaroid");

const startState = {
    ".polaroid-1": { rotate: -35, x: -30, y: -20 },
    ".polaroid-2": { rotate: 30,  x: 30,  y: -20 },
    ".polaroid-3": { rotate: -25, x: -30, y: 20  },
    ".polaroid-4": { rotate: 28,  x: 30,  y: 20  }
};

const endRotation = {
    ".polaroid-1": -10,
    ".polaroid-2": 9,
    ".polaroid-3": -7,
    ".polaroid-4": 8
};

polaroids.forEach(el => {
    const key = "." + el.classList[1];
    gsap.set(el, {
        opacity: 0,
        scale: 0.6,
        rotate: startState[key].rotate,
        x: startState[key].x,
        y: startState[key].y
    });
});

function revealImages() {
    polaroids.forEach((el, i) => {
        const key = "." + el.classList[1];
        gsap.to(el, {
            opacity: 1,
            scale: 1,
            rotate: endRotation[key],
            x: 0,
            y: 0,
            duration: 0.9,
            delay: i * 0.12,
            ease: "back.out(1.6)",
            overwrite: true
        });
    });
}

function hideImages() {
    polaroids.forEach((el, i) => {
        const key = "." + el.classList[1];
        gsap.to(el, {
            opacity: 0,
            scale: 0.6,
            rotate: startState[key].rotate,
            x: startState[key].x,
            y: startState[key].y,
            duration: 0.5,
            ease: "power2.in",
            overwrite: true
        });
    });
}

// The 3D switch (js/home/switch-3d.js) turns on once the word just before it is fully
// revealed, and off again when scrolling back un-reveals it. It only hears about
// crossings, so a manual click stays put until the reveal crosses it again.
const introSwitch = document.querySelector(".intro-text .toggle-mint-red");
const introWords = gsap.utils.toArray(".intro-text .words");
const WORD_DUR = 0.5, WORD_STAGGER = 0.4;
const switchAt = introSwitch
    ? introWords.indexOf(introSwitch.previousElementSibling) * WORD_STAGGER + WORD_DUR
    : Infinity;
let switchRevealed = false;

// Text color reveal, scrubbed with scroll. Once it completes going forward,
// the images pop in. Scrolling back up past the start hides them again.
const introTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".intro-text",
        start: "top 52%",
        end: "bottom 64%",
        scrub: 0.6,
        onLeave: revealImages,        // scrolled past the end, moving down
        onEnterBack: hideImages       // scrolled back above the start, moving up
    },
    onUpdate() {
        const revealed = this.time() >= switchAt;
        if (revealed === switchRevealed) return;
        switchRevealed = revealed;
        introSwitch.dispatchEvent(new CustomEvent("intro-switch", { detail: revealed }));
    }
})
    .to(".words", {
        color: "#1A1A1A",
        duration: WORD_DUR,
        stagger: WORD_STAGGER,
        ease: "none"
    });

// "enterprise" pill: a highlighter swipe. Starts grey like the unrevealed words, then yellow
// sweeps in left → right while the text darkens. Slotted between its neighbouring words.
// Set from JS so the CSS default (solid yellow) still shows if GSAP never runs.
const highlight = document.querySelector(".intro-text .highlight-pill");
if (highlight) {
    const nextWord = introWords.indexOf(highlight.nextElementSibling);
    gsap.set(highlight, {
        color: getComputedStyle(introWords[0]).color,
        backgroundColor: "#EFEFEF",
        backgroundImage: "linear-gradient(#FFCC33, #FFCC33)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "0% 100%"
    });
    introTl.to(highlight, {
        backgroundSize: "100% 100%",
        color: "#111",
        duration: WORD_DUR * 1.4,
        ease: "power1.inOut"
    }, (nextWord - 0.5) * WORD_STAGGER);
}
