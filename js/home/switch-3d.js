// ── 3D toggle switch in the intro text ("Helping startups [switch] build…") ──
// Replaces assets/home/hero-intro/switch.webp with an interactive Three.js model.
// To go back to the static image: remove the <script src="js/home/switch-3d.js"> line in index.html.
// The <img> stays in the markup (only hidden), so any failure here leaves the image showing.
(function () {
    const wrap = document.querySelector('.intro-text .toggle-mint-red');
    const img = wrap && wrap.querySelector('img');
    if (!wrap || !img) return;

    // Classic UMD build (r149 is the last one) so it also works when opening index.html from disk
    const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
    // On = orange + mint (the photo's look). Off = neutral grey. Colours blend as the knob travels.
    const COLORS = { body: 0xd4502c, knob: 0xa9e8d8, knobBase: 0x2b1d1a, crease: 0x6e1e0e, edge: 0xffb299 }; // --toggle-red / --toggle-mint
    const COLORS_OFF = { body: 0xa9a9ad, knob: 0xf1f1f2, crease: 0x55555a, edge: 0xe4e4e7 };

    // The intro text reveal (js/home/polaroids.js) sends "intro-switch" with true/false as it
    // scrolls past the switch. If three.js isn't ready yet, remember the latest request.
    let setState = null, pending = null;
    wrap.addEventListener('intro-switch', (e) => {
        if (setState) setState(e.detail); else pending = e.detail;
    });

    // Only fetch three.js once the switch is close to the viewport
    new IntersectionObserver((entries, io) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (window.THREE) return init();
        const s = document.createElement('script');
        s.src = THREE_URL;
        s.onload = init;
        document.head.append(s);
    }, { rootMargin: '400px' }).observe(wrap);

    // Stadium (pill) outline centred on 0,0. Built from points with no duplicates —
    // zero-length edges make ExtrudeGeometry's bevel spike outward.
    function stadium(w, h) {
        const r = h / 2, x = w / 2 - r, pts = [], N = 48;
        for (let i = 0; i <= N; i++) { const a = -Math.PI / 2 + (i / N) * Math.PI; pts.push(new THREE.Vector2(x + Math.cos(a) * r, Math.sin(a) * r)); }
        for (let i = 0; i <= N; i++) { const a = Math.PI / 2 + (i / N) * Math.PI; pts.push(new THREE.Vector2(-x + Math.cos(a) * r, Math.sin(a) * r)); }
        return new THREE.Shape(pts);
    }

    // Fine matte grain for the plastic, used as a bump map
    function grainTexture() {
        const c = document.createElement('canvas');
        c.width = c.height = 256;
        const ctx = c.getContext('2d'), d = ctx.createImageData(256, 256);
        for (let i = 0; i < d.data.length; i += 4) {
            const v = 110 + Math.random() * 40;
            d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
            d.data[i + 3] = 255;
        }
        ctx.putImageData(d, 0, 0);
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(3, 3);
        return t;
    }

    function init() {
        const THREE = window.THREE;
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch (e) { return; } // no WebGL → keep the image
        THREE.ColorManagement.legacyMode = false; // treat the hex colours as sRGB so they match the photo
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.physicallyCorrectLights = false;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // The WebGL canvas renders off-screen at SS× resolution; a 2D canvas shows it scaled down
        // with high-quality smoothing (a plain CSS downscale skips pixels and breaks up thin lines)
        const SS = 4;
        const cv = document.createElement('canvas');
        const ctx = cv.getContext('2d');
        cv.className = 'toggle-3d';
        cv.setAttribute('aria-hidden', 'true');

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(20, 396 / 213, 0.1, 50);
        camera.position.set(0, -0.4, 6.7); // framed so the pill fills the canvas edge to edge
        camera.lookAt(0, 0, 0);

        // Soft studio light from the top-left, like the photo
        scene.add(new THREE.HemisphereLight(0xffffff, 0x3a1a14, 0.42));
        const key = new THREE.DirectionalLight(0xffffff, 0.85);
        key.position.set(-3, 3.5, 7);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.radius = 10;
        key.shadow.bias = -0.002;
        Object.assign(key.shadow.camera, { left: -4, right: 4, top: 3, bottom: -3, near: 1, far: 20 });
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xfff1ea, 0.25);
        fill.position.set(4, -2, 5);
        scene.add(fill);

        const grain = grainTexture();
        const W = 3.7, H = 1.98;

        // Body: rounded pill slab
        const bodyMat = new THREE.MeshStandardMaterial({ color: COLORS.body, roughness: 0.72, bumpMap: grain, bumpScale: 0.03 });
        const body = new THREE.Mesh(new THREE.ExtrudeGeometry(stadium(W - 0.36, H - 0.36), {
            depth: 0.2, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.18, bevelSegments: 12, curveSegments: 64
        }), bodyMat);
        body.position.z = -0.4;
        body.receiveShadow = true;

        // Raised rim around the recessed track
        const rimShape = stadium(W - 0.12, H - 0.12);
        rimShape.holes.push(stadium(W - 0.36, H - 0.36));
        // taller wall + tight 3-step bevel → the edges catch a crisp highlight instead of fading flat
        const rim = new THREE.Mesh(new THREE.ExtrudeGeometry(rimShape, {
            depth: 0.09, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 3, curveSegments: 64
        }), bodyMat);
        rim.position.z = -0.02;
        rim.receiveShadow = true; // no castShadow: it drew an extra dark line inside the top of the track

        // Dark crease where the rim's inner wall meets the track floor
        const ring = (outer, inner, color, opacity, z) => {
            const sh = stadium(W - outer, H - outer);
            sh.holes.push(stadium(W - inner, H - inner));
            const m = new THREE.Mesh(new THREE.ShapeGeometry(sh, 64),
                new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
            m.position.z = z;
            return m;
        };
        const crease = ring(0.34, 0.44, COLORS.crease, 0.7, 0.002);
        // Light catching the rim's inner top edge
        const edge = ring(0.27, 0.33, COLORS.edge, 0.62, 0.108);

        // Knob: a short cylinder with a rounded top edge (lathe profile), sitting on a dark base
        const R = 0.76, KH = 0.42, B = 0.12, pts = [new THREE.Vector2(0, 0), new THREE.Vector2(R, 0), new THREE.Vector2(R, KH - B)];
        for (let i = 1; i <= 10; i++) {
            const a = (i / 10) * Math.PI / 2;
            pts.push(new THREE.Vector2(R - B + Math.cos(a) * B, KH - B + Math.sin(a) * B));
        }
        pts.push(new THREE.Vector2(0, KH));
        const knobGeo = new THREE.LatheGeometry(pts, 64);
        knobGeo.rotateX(Math.PI / 2); // lathe axis (y) → toward the camera (z)
        const knob = new THREE.Group();
        const cap = new THREE.Mesh(knobGeo, new THREE.MeshStandardMaterial({ color: COLORS.knob, roughness: 0.5, bumpMap: grain, bumpScale: 0.003 }));
        cap.position.z = 0.1;
        cap.castShadow = true;
        const base = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.05, R + 0.07, 0.16, 64), new THREE.MeshStandardMaterial({ color: COLORS.knobBase, roughness: 0.6 }));
        base.rotation.x = Math.PI / 2;
        base.position.z = 0.04;
        base.castShadow = true;
        knob.add(base, cap);

        const pill = new THREE.Group();
        pill.add(body, rim, crease, edge, knob);
        scene.add(pill);

        // ── State + animation ──
        const OFF_X = -0.80, ON_X = 0.80; // knob stops a little inside the rim at each end
        let on = false, from = OFF_X, to = OFF_X, start = 0, raf = 0;
        knob.position.x = OFF_X;
        const DUR = 420;
        const ease = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2); // ease-out with a slight overshoot

        // Colour follows the knob: 0 = off (grey) at OFF_X, 1 = on (orange) at ON_X
        const tinted = [[bodyMat, 'body'], [cap.material, 'knob'], [crease.material, 'crease'], [edge.material, 'edge']]
            .map(([mat, k]) => [mat, new THREE.Color(COLORS_OFF[k]), new THREE.Color(COLORS[k])]);
        function tint() {
            const m = Math.max(0, Math.min(1, (knob.position.x - OFF_X) / (ON_X - OFF_X)));
            tinted.forEach(([mat, off, onC]) => mat.color.copy(off).lerp(onC, m));
        }
        tint();

        function size() {
            // the canvas's own CSS box (width of the switch slot, photo aspect ratio)
            const w = Math.max(1, cv.clientWidth), h = Math.max(1, cv.clientHeight);
            const dpr = window.devicePixelRatio || 1;
            cv.width = Math.round(w * dpr);
            cv.height = Math.round(h * dpr);
            renderer.setPixelRatio(1);
            renderer.setSize(cv.width * SS, cv.height * SS, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            render();
        }
        function render() {
            renderer.render(scene, camera);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.clearRect(0, 0, cv.width, cv.height);
            ctx.drawImage(renderer.domElement, 0, 0, cv.width, cv.height);
        }

        function step(now) {
            if (start === null) start = now; // clock starts on the first frame, in rAF's own timebase
            const t = Math.min(1, (now - start) / DUR);
            knob.position.x = from + (to - from) * ease(t);
            // press: knob dips + squashes a touch mid-travel, pill tilts toward the knob
            const press = Math.sin(t * Math.PI);
            knob.position.z = -0.06 * press;
            knob.scale.set(1 + 0.05 * press, 1 - 0.03 * press, 1);
            pill.rotation.y = 0.08 * press * Math.sign(to - from);
            tint();
            render();
            if (t < 1) raf = requestAnimationFrame(step);
        }
        function flip() {
            on = !on;
            from = knob.position.x;
            to = on ? ON_X : OFF_X;
            start = null;
            wrap.setAttribute('aria-checked', on);
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(step);
        }

        // Accessible switch on the wrapper; the hidden image keeps the layout box
        wrap.setAttribute('role', 'switch');
        wrap.setAttribute('aria-checked', 'false');
        wrap.setAttribute('aria-label', 'Toggle switch');
        wrap.tabIndex = 0;
        wrap.classList.add('toggle--3d');
        wrap.addEventListener('click', flip);
        setState = (v) => { if (v !== on) flip(); };
        if (pending !== null) setState(pending);
        wrap.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
        });

        wrap.append(cv);
        size();
        new ResizeObserver(size).observe(cv);
    }
})();
