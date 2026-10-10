// Custom cursor that follows the mouse and grows over project cards
const cursor = document.querySelector(".cursor-follower");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let currentX = mouseX;
let currentY = mouseY;

let previousX = mouseX;
let previousY = mouseY;

let velocityX = 0;
let velocityY = 0;

let rotation = 0;


// ------------------------------------
// MOUSE MOVEMENT
// ------------------------------------

window.addEventListener("mousemove", (e) => {

    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.opacity = "1";

});


// ------------------------------------
// CURSOR ANIMATION
// ------------------------------------

function animateCursor() {

    // Smooth spring movement
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;


    // Calculate movement velocity
    velocityX = mouseX - previousX;
    velocityY = mouseY - previousY;


    // Calculate total velocity
    const velocity = Math.sqrt(
        velocityX * velocityX +
        velocityY * velocityY
    );


    // Limit velocity so the cursor doesn't get crazy
    const maxVelocity = 40;

    const limitedVelocity = Math.min(
        velocity,
        maxVelocity
    );


    // --------------------------------
    // STRETCH
    // --------------------------------

    const stretch = 1 + (limitedVelocity / maxVelocity) * 0.8;


    // --------------------------------
    // ROTATION
    // --------------------------------

    if (velocity > 0.5) {

        rotation = Math.atan2(
            velocityY,
            velocityX
        ) * (180 / Math.PI);

    }


    // --------------------------------
    // APPLY TRANSFORM
    // --------------------------------

    gsap.set(cursor, {

        x: currentX,
        y: currentY,

        // rotation: rotation,

        scaleX: stretch,
        scaleY: 1 / Math.sqrt(stretch),

        transformOrigin: "center center"

    });


    previousX = mouseX;
    previousY = mouseY;


    requestAnimationFrame(animateCursor);

}

animateCursor();


// ------------------------------------
// HOVER INTERACTIONS
// ------------------------------------

const interactiveElements = document.querySelectorAll(
    // "a, button, input, textarea, select"
    ".card-media"
);

interactiveElements.forEach((element) => {

    element.addEventListener("mouseenter", () => {

        gsap.to(cursor, {

            width: 60,
            height: 60,
            duration: 0.35,
            ease: "elastic.out(1, 0.6)"
        });

        gsap.to(cursor.querySelector("span"), {
            opacity: 1,
            duration: 0.2
        });

        gsap.to(cursor, {

            width: 60,
            height: 60,
            scaleX: 1,
            scaleY: 1,
            duration: 0.35,
            ease: "elastic.out(1, 0.6)"
        });
        cursor.classList.add("cursor-follower-enter");


    });


    element.addEventListener("mouseleave", () => {

        gsap.to(cursor, {
            x:0,
            y:0,
            width: 14,
            height: 14,
            duration: 0.35,
            ease: "elastic.out(1, 0.6)"
        });

        gsap.to(cursor.querySelector("span"), {
            opacity: 0,
            duration: 0.15
        });

        cursor.classList.remove("cursor-follower-enter");
        cursor.classList.add("default");
        cursor.classList.add("cursor-follower-leave");

    });


});
