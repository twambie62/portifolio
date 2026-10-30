// ── Animated gradient pill in the intro text ("…E-commerce and [pill] Health.") ──
// Replaces assets/home/hero-intro/gradient-bg.webp with a live WebGL gradient in the same
// colours that flows on its own and bends toward the cursor (click for a pulse).
// To go back to the static image: remove the <script src="js/home/gradient-pill.js"> line in index.html.
// The <img> stays in the markup (only hidden), so any failure here leaves the image showing.
(function () {
    const wrap = document.querySelector('.intro-text .toggle-red-orange');
    const img = wrap && wrap.querySelector('img');
    if (!wrap || !img) return;

    // Sampled from gradient-bg.webp, left → right (RGB 0–1)
    const PALETTE = [
        [0.96, 0.36, 0.17], // orange-red
        [0.96, 0.04, 0.29], // hot pink-red
        [1.00, 0.55, 0.22], // orange
        [0.97, 0.64, 0.50], // peach
        [0.87, 0.78, 0.90]  // lavender
    ];
    const SPEED = 4, MOUSE_STRENGTH = 1;
    const HOVER_SPEED = 4; // extra flow speed while the cursor is on/near the pill (×, on top of SPEED)
    const FOLLOW = 0.2;     // how fast the colours chase the cursor (0–1, higher = snappier)
    const REACH = 120; // px around the pill where the cursor still pulls the colours

    const cv = document.createElement('canvas');
    let gl = null;
    try { gl = cv.getContext('webgl', { premultipliedAlpha: false, antialias: true }); } catch (e) { gl = null; }
    if (!gl) return;

    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    // Colour comes from a left→right ramp through the palette; flowing noise warps where
    // each pixel lands on the ramp, so the bands drift and swirl but keep the image's layout.
    const fs = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float ms;uniform float pulse;
uniform vec3 c0;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 c4;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.55;for(int i=0;i<3;i++){v+=a*n(p);p=p*1.9+vec2(1.7,9.2);a*=.4;}return v/.87;}
vec3 ramp(float s){
 s=clamp(s,0.,1.);
 vec3 col=mix(c0,c1,smoothstep(.0,.2,s));
 col=mix(col,c2,smoothstep(.48,.64,s));
 col=mix(col,c3,smoothstep(.66,.82,s));
 return mix(col,c4,smoothstep(.84,.98,s));}
void main(){
 vec2 uv=gl_FragCoord.xy/r;float ax=r.x/r.y;
 vec2 p=vec2(uv.x*ax,uv.y);
 vec2 mm=vec2(m.x*ax,m.y);
 float d=distance(p,mm);
 p+=(mm-p)*exp(-d*1.8)*(.5+pulse*.6)*ms;
 vec2 w=vec2(fbm(p*.7+vec2(t*.12,0.)),fbm(p*.7+vec2(5.2,1.3)-vec2(0.,t*.1)));
 float f=fbm(p*.55+w*1.2+vec2(t*.06,-t*.04));
 float s=uv.x*1.12-.02+(f-.5)*.5+(w.x-.5)*.25+sin(t*.35+uv.y*2.)*.05;
 vec3 col=ramp(s);
 col=mix(col,c2,smoothstep(.5,.85,w.y)*(1.-smoothstep(0.,.7,uv.y))*smoothstep(.15,.45,uv.x)*.75);
 col+=exp(-d*3.)*(.12+pulse*.25)*ms*vec3(1.,.85,.8);
 gl_FragColor=vec4(col,1.);}`;

    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = {};
    ['r', 't', 'm', 'ms', 'pulse', 'c0', 'c1', 'c2', 'c3', 'c4'].forEach((k) => { u[k] = gl.getUniformLocation(pr, k); });
    ['c0', 'c1', 'c2', 'c3', 'c4'].forEach((k, i) => gl.uniform3fv(u[k], PALETTE[i]));

    cv.className = 'toggle-shader';
    cv.setAttribute('aria-hidden', 'true');
    wrap.classList.add('toggle--shader');
    wrap.append(cv);

    // Lost GPU context → put the image back
    cv.addEventListener('webglcontextlost', () => {
        cancelAnimationFrame(raf); visible = false;
        cv.remove(); wrap.classList.remove('toggle--shader');
    });

    // Cursor: full pull over the pill, fading out within REACH px around it; rests mid-right when away
    const REST = [0.62, 0.5];
    let mouse = REST.slice(), target = REST.slice(), strength = 0, strengthTarget = 0, pulse = 0;
    window.addEventListener('pointermove', (e) => {
        const b = cv.getBoundingClientRect();
        const dx = Math.max(b.left - e.clientX, 0, e.clientX - b.right);
        const dy = Math.max(b.top - e.clientY, 0, e.clientY - b.bottom);
        strengthTarget = Math.max(0, 1 - Math.hypot(dx, dy) / REACH);
        target = strengthTarget > 0
            ? [(e.clientX - b.left) / b.width, 1 - (e.clientY - b.top) / b.height]
            : REST.slice();
    }, { passive: true });
    wrap.addEventListener('pointerdown', () => { pulse = 1; });

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let time = Math.random() * 50, last = performance.now(), raf = 0, visible = false;

    function frame(now) {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
        if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
        const dt = Math.min(.05, (now - last) / 1000); last = now;
        time += dt * SPEED * (1 + (HOVER_SPEED - 1) * strength) * (reduce ? .15 : 1);
        mouse[0] += (target[0] - mouse[0]) * FOLLOW;
        mouse[1] += (target[1] - mouse[1]) * FOLLOW;
        strength += (strengthTarget - strength) * FOLLOW;
        pulse *= .94;
        gl.uniform2f(u.r, w, h);
        gl.uniform1f(u.t, time);
        gl.uniform2f(u.m, mouse[0], mouse[1]);
        gl.uniform1f(u.ms, MOUSE_STRENGTH * (.35 + .65 * strength));
        gl.uniform1f(u.pulse, pulse);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (visible) raf = requestAnimationFrame(frame);
    }
    // Only animate while the pill is on screen
    new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    }).observe(wrap);
})();
