// ── Why Choose Me › Vast Knowledge — physics pills ──────────────────
// Replaces the static vast-knowledge.svg with real pills that fall into
// the card when it scrolls into view and get pushed around by the cursor.
// TO REVERT: remove the matter.js + vast-pills.js <script> tags in
// index.html. The original <img> is never removed, only hidden by the
// .wcm-vast--physics class this script adds.
(function () {
    const card = document.querySelector('.wcm-vast');
    if (!card || typeof Matter === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const imgWrap = card.querySelector('.wcm-card-img');
    if (!imgWrap) return;

    const { Engine, Runner, Bodies, Body, Composite, Events } = Matter;

    // Sizes taken from the original SVG (366 × 252 artboard)
    const BASE_W = 366;
    const BASE_H = 252;
    const PILLS = [
        { label: 'Electronics',     w: 146 },
        { label: 'UI/UX',           w: 96  },
        { label: '3D Graphics',     w: 156 },
        { label: 'Motion Graphics', w: 188 },
        { label: 'AI & ML',         w: 113 },
        { label: 'IOT',             w: 74, h: 46 },
        { label: 'Websites',        w: 134 },
        { label: 'Branding',        w: 130 },
        { label: 'Mobile Apps',     w: 156 },
    ];

    const WALL = 200;          // thick walls so pills can't tunnel through
    const PUSH_RADIUS = 80;    // cursor influence radius (base px)
    const PUSH_FORCE = 0.005; // repel strength
    const SWIPE_FORCE = 0.0007;

    card.classList.add('wcm-vast--physics');
    const stage = document.createElement('div');
    stage.className = 'wcm-vast-stage';
    stage.setAttribute('aria-hidden', 'true');
    imgWrap.appendChild(stage);

    let engine, runner, bodies = [], els = [], topWall;
    let width = 0, height = 0, scale = 1;
    let dropped = false, visible = false, topClosed = false, running = false;
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false };

    function start() {
        if (running || !runner) return;
        Runner.run(runner, engine);
        running = true;
    }
    function stop() {
        if (!running) return;
        Runner.stop(runner);
        running = false;
    }

    function build() {
        stop();
        if (engine) Engine.clear(engine);
        stage.innerHTML = '';
        bodies = [];
        els = [];
        topClosed = false;

        width = stage.clientWidth;
        height = stage.clientHeight;
        scale = width / BASE_W;

        engine = Engine.create();
        engine.gravity.y = 1;

        // Walls: floor, sides, and a top that starts high (pills drop in
        // from above) and closes over the stage once they've landed.
        const opts = { isStatic: true, friction: 0.4 };
        const floor = Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, opts);
        const left = Bodies.rectangle(-WALL / 2, -height, WALL, height * 4, opts);
        const right = Bodies.rectangle(width + WALL / 2, -height, WALL, height * 4, opts);
        topWall = Bodies.rectangle(width / 2, -height * 3, width + WALL * 2, WALL, opts);
        Composite.add(engine.world, [floor, left, right, topWall]);

        PILLS.forEach((p, i) => {
            const w = p.w * scale;
            const h = (p.h || 50) * scale;

            const el = document.createElement('span');
            el.className = 'wcm-vast-pill';
            el.textContent = p.label;
            el.style.width = w + 'px';
            el.style.height = h + 'px';
            el.style.fontSize = 18 * scale + 'px';
            el._w = w;
            el._h = h;
            stage.appendChild(el);

            // Staggered start positions above the stage
            const x = w / 2 + Math.random() * Math.max(1, width - w);
            const y = -h - i * h * 0.9 - Math.random() * 20;
            const body = Bodies.rectangle(x, y, w, h, {
                chamfer: { radius: h / 2 },
                angle: (Math.random() - 0.5) * 1.2,
                restitution: 0.25,
                friction: 0.3,
                frictionAir: 0.015,
                density: 0.002,
            });
            bodies.push(body);
            els.push(el);
            render(i);
        });
        Composite.add(engine.world, bodies);

        Events.on(engine, 'beforeUpdate', applyPointer);
        Events.on(engine, 'afterUpdate', afterStep);

        runner = Runner.create();
        if (dropped) drop();
    }

    function render(i) {
        const b = bodies[i];
        const el = els[i];
        el.style.transform =
            `translate(${b.position.x - el._w / 2}px, ${b.position.y - el._h / 2}px) rotate(${b.angle}rad)`;
    }

    function applyPointer() {
        if (!pointer.active) return;
        const r = PUSH_RADIUS * scale;
        bodies.forEach((b) => {
            const dx = b.position.x - pointer.x;
            const dy = b.position.y - pointer.y;
            const d = Math.hypot(dx, dy) || 1;
            if (d > r + b.bounds.max.x - b.bounds.min.x) return;
            // Closest point on the pill matters more than its center
            const near = Math.max(0, d - (b.bounds.max.y - b.bounds.min.y) / 2);
            if (near > r) return;
            const k = (1 - near / r) * b.mass;
            Body.applyForce(b, b.position, {
                x: (dx / d) * PUSH_FORCE * k + pointer.vx * SWIPE_FORCE * k,
                y: (dy / d) * PUSH_FORCE * k + pointer.vy * SWIPE_FORCE * k,
            });
        });
        pointer.vx *= 0.6;
        pointer.vy *= 0.6;
    }

    function afterStep() {
        // Close the lid once every pill is inside the stage
        if (!topClosed && bodies.every((b) => b.bounds.min.y > 0)) {
            Body.setPosition(topWall, { x: width / 2, y: -WALL / 2 });
            topClosed = true;
        }
        bodies.forEach((b, i) => {
            // Safety net: never let a pill escape the card
            const minY = topClosed ? 0 : -Infinity;
            if (b.position.x < 0 || b.position.x > width || b.position.y > height || b.position.y < minY) {
                Body.setPosition(b, {
                    x: Math.min(Math.max(b.position.x, 20), width - 20),
                    y: Math.min(Math.max(b.position.y, topClosed ? 30 : b.position.y), height - 30),
                });
                Body.setVelocity(b, { x: 0, y: 0 });
            }
            render(i);
        });
    }

    function drop() {
        dropped = true;
        if (visible) start();
    }

    // Pointer: positions relative to the stage, tracked across the whole card
    function onMove(e) {
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (pointer.active) {
            pointer.vx = x - pointer.x;
            pointer.vy = y - pointer.y;
        }
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
    }
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerdown', onMove);
    card.addEventListener('pointerleave', () => { pointer.active = false; });

    // Drop when the card scrolls into view; pause the sim when off-screen
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            visible = entry.isIntersecting;
            if (visible && !dropped && entry.intersectionRatio >= 0.4) drop();
            else if (visible && dropped) start();
            else if (!visible) stop();
        });
    }, { threshold: [0, 0.4] });

    build();
    io.observe(card);

    // Rebuild when the stage width changes (pills re-drop at the new size)
    let lastW = stage.clientWidth;
    let t;
    new ResizeObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => {
            if (stage.clientWidth === lastW) return;
            lastW = stage.clientWidth;
            build();
        }, 150);
    }).observe(stage);
})();
