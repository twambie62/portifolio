// Gallery carousel — draggable, auto-scrolling strip of photos
(function () {
    gsap.registerPlugin(Draggable);

    const IMAGES = [
        'assets/home/gallery/photo-01.jpeg',
        'assets/home/gallery/photo-02.jpeg',
        'assets/home/gallery/photo-03.jpeg',
        'assets/home/gallery/photo-04.jpeg',
        'assets/home/gallery/photo-05.jpeg',
        'assets/home/gallery/photo-06.jpeg',
        'assets/home/gallery/photo-07.jpeg',
        'assets/home/gallery/photo-08.jpeg',
        'assets/home/gallery/photo-09.jpeg',
        'assets/home/gallery/photo-10.jpeg',
        'assets/home/gallery/photo-11.jpeg',
        'assets/home/gallery/photo-12.jpeg',
        'assets/home/gallery/photo-13.jpeg',
        'assets/home/gallery/photo-14.jpeg',
        'assets/home/gallery/photo-15.jpeg',
        'assets/home/gallery/photo-16.jpeg',
        'assets/home/gallery/photo-17.jpeg',
        'assets/home/gallery/photo-18.jpeg',
        'assets/home/gallery/photo-19.jpeg',
    ];

    const track = document.getElementById('carouselTrack');
    if (!track) return;

    const isMob  = window.matchMedia('(max-width:640px)').matches;
    const CARD_W = isMob ? 160 : 240;
    const GAP    = 16;
    const STEP   = CARD_W + GAP;

    // 3 sets of cards for seamless loop
    const allSrc = [...IMAGES, ...IMAGES, ...IMAGES];

    allSrc.forEach(function (src, i) {
        const label = String((i % IMAGES.length) + 1).padStart(2, '0');

        const card = document.createElement('div');
        card.className = 'c-card';

        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Photo ' + label;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'c-overlay';

        card.appendChild(img);
        card.appendChild(overlay);
        track.appendChild(card);
    });

    const setLen = IMAGES.length;
    const setW   = setLen * STEP;
    const trackW = allSrc.length * STEP;
    track.style.width = trackW + 'px';

    // Start at middle set
    let xPos = -setW;
    gsap.set(track, { x: xPos });

    // ── Auto-scroll ───────────────────────────────────────────────────
    const SPEED = isMob ? 0.45 : 0.7;
    let paused = false;

    gsap.ticker.add(function () {
        if (paused) return;
        xPos -= SPEED;
        if (xPos <= -setW * 2) xPos += setW;
        gsap.set(track, { x: xPos });
    });

    // ── Draggable ─────────────────────────────────────────────────────
    let dragStartX = 0;

    Draggable.create(track, {
        type: 'x',
        inertia: false,
        onPress: function () {
            paused = true;
            dragStartX = xPos;
        },
        onDrag: function () {
            xPos = dragStartX + (this.x - this.startX);
            while (xPos > -setW)     xPos -= setW;
            while (xPos < -setW * 2) xPos += setW;
            gsap.set(track, { x: xPos });
        },
        onRelease: function () {
            const vel = this.getVelocity();
            gsap.to({ v: 0 }, {
                v: 1,
                duration: 0.7,
                ease: 'power2.out',
                onUpdate: function () {
                    xPos += vel * 0.006 * (1 - this.progress());
                    while (xPos > -setW)     xPos -= setW;
                    while (xPos < -setW * 2) xPos += setW;
                    gsap.set(track, { x: xPos });
                },
                onComplete: function () { paused = false; },
            });
        },
    });
})();
