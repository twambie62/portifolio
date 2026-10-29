// ── Contact section — tabs, booking calendar, message form, WebGL card ──
// Ported from docs/contact-page-reference.html. Styles: css/contact.css.
// Replaces js/home/contact-form.js (kept on disk for easy revert).
(function () {
    const section = document.getElementById('contact');
    if (!section || !section.querySelector('.contact-card')) return;

    /* ===================== CONFIG ===================== */
    const CALENDLY_URL = 'https://calendly.com/twambililemusukwa/30min';
    const WEB3FORMS_KEY = 'cd25ece4-b23a-42f8-8a0e-c66b41cab804';
    const MY_EMAIL = 'twambililemusukwa@gmail.com';
    const WA_NUMBER = '265884950893'; // +265 88 495 0893 (no + or spaces)
    const SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00'];   // visual only
    const MAX_MONTHS_AHEAD = 2;
    const PALETTE = [ // dark, orange, pink, teal, violet (RGB 0–1)
        [0.08, 0.03, 0.09], [1.0, 0.42, 0.17], [0.90, 0.20, 0.43], [0.18, 0.77, 0.71], [0.36, 0.17, 0.84]
    ];
    const SPEED = 1, MOUSE_STRENGTH = 1, GRAIN = 0.09;
    // true = fluted-glass shader + soft CSS grain; false = the original reference shader
    const GLASS = true;

    const $ = (id) => document.getElementById(id);

    /* ===================== WHATSAPP ===================== */
    const wa = $('contactWhatsApp');
    if (wa) {
        wa.href = 'https://wa.me/' + WA_NUMBER + '?text=' +
            encodeURIComponent('Hi Twambi, I found your portfolio and would like to get in touch.');
    }

    /* ===================== TABS ===================== */
    const tabBook = $('contactTabBook'), tabMsg = $('contactTabMsg');
    const paneBook = $('contactPaneBook'), paneMsg = $('contactPaneMsg');
    function setTab(book) {
        tabBook.setAttribute('aria-selected', book);
        tabMsg.setAttribute('aria-selected', !book);
        paneBook.hidden = !book;
        paneMsg.hidden = book;
    }
    tabBook.addEventListener('click', () => setTab(true));
    tabMsg.addEventListener('click', () => setTab(false));

    /* ===================== TOPIC DROPDOWN ===================== */
    // Native <select> popups can't be styled, so build a listbox on top of it.
    // The real <select> stays (hidden) in the form and keeps the submitted value.
    (function enhanceSelect() {
        const select = section.querySelector('select[name="topic"]');
        const label = select && select.closest('label');
        if (!label) return;

        // A <label> would re-click the trigger when an option inside it is clicked → use a div
        const field = document.createElement('div');
        field.className = 'contact-field';
        const caption = document.createElement('span');
        caption.id = 'contactTopicLabel';
        caption.textContent = label.firstChild.textContent.trim();
        field.append(caption);

        const wrap = document.createElement('div');
        wrap.className = 'contact-select';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'contact-inp contact-select-btn';
        btn.setAttribute('aria-haspopup', 'listbox');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-labelledby', 'contactTopicLabel contactTopicValue');
        btn.innerHTML = '<span id="contactTopicValue"></span><svg class="contact-select-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
        const valueEl = btn.firstChild;

        const list = document.createElement('ul');
        list.className = 'contact-select-list';
        list.setAttribute('role', 'listbox');
        list.setAttribute('aria-labelledby', 'contactTopicLabel');
        list.tabIndex = -1;
        list.hidden = true;

        const items = Array.from(select.options).map((opt, i) => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.id = 'contactTopicOpt' + i;
            li.innerHTML = '<span></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
            li.firstChild.textContent = opt.text;
            li.addEventListener('click', () => { choose(i); close(true); });
            li.addEventListener('mousemove', () => highlight(i));
            list.append(li);
            return li;
        });

        let active = select.selectedIndex;
        function choose(i) {
            select.selectedIndex = i;
            valueEl.textContent = select.options[i].text;
            items.forEach((li, j) => li.setAttribute('aria-selected', j === i));
        }
        function highlight(i) {
            active = (i + items.length) % items.length;
            items.forEach((li, j) => li.classList.toggle('is-active', j === active));
            list.setAttribute('aria-activedescendant', items[active].id);
            items[active].scrollIntoView({ block: 'nearest' });
        }
        function open() {
            list.hidden = false;
            btn.setAttribute('aria-expanded', 'true');
            wrap.classList.add('is-open');
            highlight(select.selectedIndex);
            list.focus();
        }
        function close(refocus) {
            if (list.hidden) return;
            list.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
            wrap.classList.remove('is-open');
            if (refocus) btn.focus();
        }

        btn.addEventListener('click', () => (list.hidden ? open() : close(true)));
        btn.addEventListener('keydown', (e) => {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); open(); }
        });
        list.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); highlight(active + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(active - 1); }
            else if (e.key === 'Home') { e.preventDefault(); highlight(0); }
            else if (e.key === 'End') { e.preventDefault(); highlight(items.length - 1); }
            else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); close(true); }
            else if (e.key === 'Escape') { e.preventDefault(); close(true); }
            else if (e.key === 'Tab') close(false);
        });
        document.addEventListener('pointerdown', (e) => { if (!wrap.contains(e.target)) close(false); });
        // form.reset() puts the hidden select back to its first option → mirror it
        select.form.addEventListener('reset', () => setTimeout(() => choose(select.selectedIndex)));

        select.hidden = true;
        select.tabIndex = -1;
        wrap.append(btn, list, select);
        field.append(wrap);
        label.replaceWith(field);
        choose(select.selectedIndex);
    })();

    /* ===================== CALENDAR ===================== */
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const isAvailable = (d) => d > today && d.getDay() !== 0 && d.getDay() !== 6;
    let picked = new Date(today); picked.setDate(picked.getDate() + 1);
    while (!isAvailable(picked)) picked.setDate(picked.getDate() + 1);
    let offset = 0, slot = null;

    const daysEl = $('contactDays'), slotsEl = $('contactSlots');
    const monthLabel = $('contactMonthLabel'), dayLabel = $('contactDayLabel');
    const prevBtn = $('contactPrevMonth'), nextBtn = $('contactNextMonth');
    const confirmBtn = $('contactConfirm'), confirmLabel = $('contactConfirmLabel');
    const pad = (n) => String(n).padStart(2, '0');

    function render() {
        const base = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const y = base.getFullYear(), m = base.getMonth();
        monthLabel.textContent = base.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        prevBtn.disabled = offset <= 0;
        nextBtn.disabled = offset >= MAX_MONTHS_AHEAD;

        daysEl.innerHTML = '';
        const lead = (base.getDay() + 6) % 7;
        for (let i = 0; i < lead; i++) {
            const b = document.createElement('span');
            b.className = 'contact-day blank';
            daysEl.append(b);
        }
        const count = new Date(y, m + 1, 0).getDate();
        for (let d = 1; d <= count; d++) {
            const dt = new Date(y, m, d), ok = isAvailable(dt), sel = dt.getTime() === picked.getTime();
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'contact-day' + (ok ? ' available' : '');
            b.textContent = d;
            b.disabled = !ok;
            b.setAttribute('aria-pressed', sel);
            b.setAttribute('aria-label', dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + (ok ? '' : ', unavailable'));
            if (ok) b.addEventListener('click', () => { picked = dt; slot = null; render(); });
            daysEl.append(b);
        }

        dayLabel.textContent = picked.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
        slotsEl.innerHTML = '';
        SLOTS.forEach((t) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'contact-slot';
            b.textContent = t;
            b.setAttribute('aria-pressed', slot === t);
            b.addEventListener('click', () => { slot = t; render(); });
            slotsEl.append(b);
        });

        const ym = picked.getFullYear() + '-' + pad(picked.getMonth() + 1);
        confirmBtn.href = `${CALENDLY_URL}?month=${ym}&date=${ym}-${pad(picked.getDate())}`;
        confirmBtn.classList.toggle('is-disabled', !slot);
        confirmBtn.setAttribute('aria-disabled', !slot);
        confirmLabel.textContent = slot
            ? `Confirm ${picked.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at ${slot}`
            : 'Pick a time to continue';
    }
    prevBtn.addEventListener('click', () => { offset = Math.max(0, offset - 1); render(); });
    nextBtn.addEventListener('click', () => { offset = Math.min(MAX_MONTHS_AHEAD, offset + 1); render(); });
    render();

    /* ===================== MESSAGE FORM (Web3Forms) ===================== */
    const form = paneMsg, sendBtn = $('contactSend'), status = $('contactStatus');
    const ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    const ICON_ERR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    function showStatus(ok, html) {
        status.className = 'contact-status ' + (ok ? 'is-success' : 'is-error');
        status.innerHTML = (ok ? ICON_OK : ICON_ERR) + '<span>' + html + '</span>';
        status.hidden = false;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        if (data.botcheck) return; // honeypot filled → bot

        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending…';
        status.hidden = true;

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    subject: 'Portfolio: ' + data.topic + ' — ' + data.name,
                    from_name: 'Portfolio contact form',
                    name: data.name,
                    email: data.email,
                    topic: data.topic,
                    message: data.message,
                }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || !json.success) throw new Error(json.message || 'Request failed');
            form.reset();
            showStatus(true, "Thanks — your message is on its way. I'll get back to you within 24 hours.");
        } catch (err) {
            showStatus(false, `Something went wrong sending your message. Please try again, or email me directly at <a href="mailto:${MY_EMAIL}">${MY_EMAIL}</a>.`);
        } finally {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send message →';
        }
    });

    /* ===================== WEBGL BACKGROUND ===================== */
    const card = section.querySelector('.contact-card'), cv = $('contactGL');
    if (GLASS) card.classList.add('contact-card--glass'); // grain overlay, also over the CSS fallback
    let gl = null;
    try { gl = cv.getContext('webgl', { premultipliedAlpha: false, antialias: false }); } catch (e) { gl = null; }
    // Any failure: remove the canvas so the CSS gradient on the card shows
    const fallback = () => { cv.remove(); };
    if (!gl) { fallback(); return; }

    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    // Fluted glass: ribs vary along x only, so every line they draw is vertical.
    // Each rib bends + vertically smears the flowing colour behind it. Grain is a CSS overlay.
    const fsGlass = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float ms;
uniform vec3 c0;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 c4;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h(vec2(i,.5)),h(vec2(i+1.,.5)),f);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;float ax=r.x/r.y;float X=uv.x*ax;
 float a=n1(X*6.+3.),b=n1(X*19.+11.),c=n1(X*55.+7.);
 float flute=a*.5+b*.32+c*.18;
 float rib=fract(X*11.+a*2.);
 vec2 p=vec2(X,uv.y);
 p.x+=(rib-.5)*.045+(b-.5)*.05;
 p.y+=(flute-.5)*.32;
 vec2 mm=m;mm.x*=ax;
 float d=distance(vec2(X,uv.y),mm);
 p+=(mm-p)*exp(-d*2.2)*.45*ms;
 vec2 q=p*vec2(1.,.75);
 vec2 w=vec2(fbm(q*1.4+t*.05),fbm(q*1.4+vec2(5.2,1.3)-t*.04));
 float f=fbm(q*1.1+w*1.6+vec2(t*.035,0.));
 vec3 col=mix(c0,c4,smoothstep(.32,.72,f));
 col=mix(col,c2,smoothstep(.38,.8,f+w.x*.25-.1));
 col=mix(col,c1,smoothstep(.5,.9,w.y*.7+f*.45));
 col=mix(col,c3,smoothstep(.6,.95,w.x*.8+(1.-f)*.3));
 col+=exp(-d*3.5)*.15*ms*c1;
 float edge=smoothstep(0.,.12,rib)*smoothstep(1.,.88,rib);
 col*=.9+.1*edge;
 col*=.86+.22*b;
 col+=pow(c,8.)*.16;
 col*=1.-.35*pow(length(uv-.5),2.);
 gl_FragColor=vec4(col,1.);}`;

    const fsOriginal = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float ms;uniform float gr;
uniform vec3 c0;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 c4;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;vec2 p=uv;p.x*=r.x/r.y;
 vec2 mm=m;mm.x*=r.x/r.y;
 float d=distance(p,mm);
 p+=(mm-p)*exp(-d*2.2)*.55*ms;
 mat2 rot=mat2(.82,-.57,.57,.82);vec2 q=rot*p;
 vec2 w=vec2(fbm(q*1.6+t*.06),fbm(q*1.6+vec2(5.2,1.3)-t*.05));
 float f=fbm(q*1.2+w*1.8+vec2(t*.04,0.));
 float bands=sin(q.y*6.+w.x*4.+t*.25)*.5+.5;
 vec3 col=mix(c0,c4,smoothstep(.15,.6,f));
 col=mix(col,c2,smoothstep(.35,.85,f*bands+.1));
 col=mix(col,c1,smoothstep(.55,.95,w.y*bands+f*.4));
 col=mix(col,c3,smoothstep(.62,1.,w.x*(1.-bands)+.15));
 col+=exp(-d*3.5)*.18*ms*c1;
 float streak=smoothstep(.0,.9,sin(gl_FragCoord.x*.9+n(vec2(gl_FragCoord.x*.05,t*.2))*6.)*.5+.5);
 col*=.94+.06*streak;
 col+=(h(gl_FragCoord.xy+fract(t)*91.)-.5)*gr;
 col*=1.-.35*pow(length(uv-.5),2.);
 gl_FragColor=vec4(col,1.);}`;

    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, GLASS ? fsGlass : fsOriginal));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { fallback(); return; }
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = {};
    ['r', 't', 'm', 'ms', 'gr', 'c0', 'c1', 'c2', 'c3', 'c4'].forEach((k) => { u[k] = gl.getUniformLocation(pr, k); });
    ['c0', 'c1', 'c2', 'c3', 'c4'].forEach((k, i) => gl.uniform3fv(u[k], PALETTE[i]));
    gl.uniform1f(u.ms, MOUSE_STRENGTH);
    gl.uniform1f(u.gr, GRAIN);

    // Lost GPU context (driver reset, too many contexts) → fall back too
    cv.addEventListener('webglcontextlost', () => { cancelAnimationFrame(raf); visible = false; fallback(); });

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let mouse = [.5, .5], target = [.5, .5], time = 0, last = performance.now(), raf = 0, visible = true;
    card.addEventListener('pointermove', (e) => {
        const b = card.getBoundingClientRect();
        target = [(e.clientX - b.left) / b.width, 1 - (e.clientY - b.top) / b.height];
    });

    function frame(now) {
        const dpr = Math.min(devicePixelRatio || 1, 1.5) * 0.6; // render at reduced res — it's blurry anyway
        const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
        if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
        const dt = Math.min(.05, (now - last) / 1000); last = now;
        time += dt * SPEED * (reduce ? .15 : 1);
        mouse[0] += (target[0] - mouse[0]) * .05;
        mouse[1] += (target[1] - mouse[1]) * .05;
        gl.uniform2f(u.r, w, h);
        gl.uniform1f(u.t, time);
        gl.uniform2f(u.m, mouse[0], mouse[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (visible) raf = requestAnimationFrame(frame);
    }
    // Only animate while the section is on screen
    new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    }).observe(card);
})();
