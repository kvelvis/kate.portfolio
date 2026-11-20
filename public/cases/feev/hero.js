/* ==========================================================================
   FEEV Bubble Gloss — hero: a soap bubble blown from the lips, driven by scroll.
   three.js (orthographic, 1 CSS px = 1 unit). The photo is drawn by a shader so
   the bubble can refract it. Scroll inflates the bubble until it fills the
   screen and pops; tap / click pops it earlier. Small bubbles float and pop too.
   No sound; light haptics on phones. WebGL failure keeps the static photo.
   ========================================================================== */
import * as THREE from 'three';

const section = document.querySelector('.bh');
const stage = document.getElementById('bhStage');
const canvas = document.getElementById('bhGl');
const titleEl = document.getElementById('hero-title');
const msgs = document.getElementById('bhMsgs');
const hint = document.getElementById('bhHint');
const reveal = document.getElementById('bhReveal');
const pill1 = document.getElementById('bhPill1');
const pill2 = document.getElementById('bhPill2');
const tag = document.getElementById('bhTag');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- title image: jiggles on hover ---------- */
const titleImg = titleEl.querySelector('img');
titleEl.addEventListener('animationend', () => { titleEl.classList.remove('is-jiggle'); });
titleImg && titleImg.addEventListener('mouseenter', () => {
  if (reduce) return;
  titleEl.classList.remove('is-jiggle'); void titleEl.offsetWidth; titleEl.classList.add('is-jiggle');
});

/* ---------- constants ---------- */
const IMG_W = 1376, IMG_H = 768;
const LIPS = { x: 697, y: 383 };              // lips in image pixels
const BG = [239 / 255, 237 / 255, 248 / 255]; // #EFEDF8, the studio wall

/* ---------- launch poster visibility (also for screen readers / keyboard) ---------- */
const revealCta = reveal.querySelector('.bh__cta');
function setReveal(on) {
  reveal.classList.toggle('show', on);
  reveal.setAttribute('aria-hidden', String(!on));
  if (revealCta) revealCta.tabIndex = on ? 0 : -1;
}

/* ---------- haptics (no sound) ---------- */
const buzz = (ms) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (_) {} };

/* ---------- renderer (bail out to the static photo if WebGL is unavailable) ---------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (e) {
  renderer = null;
}

if (renderer) {
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(new THREE.Color().setRGB(...BG));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -6000, 6000);

  const photo = new THREE.TextureLoader().load('./img/web/main-girl-1376.webp', () => section.classList.add('is-gl'));
  photo.minFilter = THREE.LinearFilter; photo.generateMipmaps = false;

  const shared = {
    uPhoto: { value: photo },
    uImgSize: { value: new THREE.Vector2(1, 1) },
    uImgCenter: { value: new THREE.Vector2() },
    uBg: { value: new THREE.Vector3(...BG) },
    uRes: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: DPR },
    uTime: { value: 0 },
  };

  const PHOTO_GLSL = /* glsl */`
  uniform sampler2D uPhoto; uniform vec2 uImgSize; uniform vec2 uImgCenter; uniform vec3 uBg; uniform vec2 uRes; uniform float uDpr;
  vec2 screenPos(){ return gl_FragCoord.xy / uDpr - uRes * 0.5; }
  vec3 photoAt(vec2 sp){
    vec2 uv = (sp - uImgCenter) / uImgSize + 0.5;
    float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    float m = inside * smoothstep(0.0, 0.06, uv.x) * smoothstep(1.0, 0.94, uv.x) * smoothstep(1.0, 0.92, uv.y);
    vec3 c = texture2D(uPhoto, clamp(uv, 0.001, 0.999)).rgb;
    return mix(uBg, c, m);
  }`;

  /* background: full-screen quad, photo composited onto the studio colour */
  const bgMat = new THREE.ShaderMaterial({
    uniforms: shared, depthWrite: false, depthTest: false,
    vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.9999, 1.0); }',
    fragmentShader: PHOTO_GLSL + 'void main(){ gl_FragColor = vec4(photoAt(screenPos()), 1.0); }',
  });
  const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
  bgQuad.frustumCulled = false; bgQuad.renderOrder = -1;
  scene.add(bgQuad);

  /* ---------- bubble material: refraction + thin-film interference ---------- */
  const BUBBLE_VS = /* glsl */`
  uniform float uTime; uniform float uWobble; uniform vec3 uPokeDir; uniform float uPoke; uniform float uSeed;
  varying vec3 vN; varying vec3 vO;
  void main(){
    vec3 n = normal;
    float w = sin(n.x*3.1 + uTime*1.9 + uSeed) * sin(n.y*2.7 - uTime*1.4)
            + 0.6 * sin(n.z*4.3 + uTime*2.3 + uSeed*2.0);
    float poke = pow(max(dot(n, uPokeDir), 0.0), 4.0);
    vec3 p = position * (1.0 + uWobble * w * 0.5 - uPoke * poke * 0.10);
    vN = normalize(normalMatrix * n);
    vO = n;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`;
  const BUBBLE_FS = PHOTO_GLSL + /* glsl */`
  uniform float uTime; uniform float uR; uniform float uAlpha; uniform float uSeed;
  varying vec3 vN; varying vec3 vO;
  void main(){
    vec3 n = normalize(vN);
    float nz = clamp(n.z, 0.0, 1.0);
    float fr = pow(1.0 - nz, 3.0);
    vec2 sp = screenPos();
    vec2 off = -n.xy * pow(1.0 - nz, 1.6) * uR * 0.10;
    vec3 base = photoAt(sp + off);
    float t = uTime * 0.5 + uSeed;
    float thick = 0.55
      + 0.30 * sin(vO.y * 3.0 + t * 1.2 + sin(vO.x * 4.0 - t) * 1.6)
      + 0.15 * sin(vO.x * 7.0 + vO.z * 3.0 + t * 1.7);
    float phase = thick * (1.1 + 1.6 * (1.0 - nz));
    vec3 film = 0.5 + 0.5 * cos(6.28318 * (phase + vec3(0.0, 0.33, 0.67)));
    film = mix(film, vec3(1.0), 0.25);
    float amt = 0.06 + 0.50 * fr;
    vec3 col = base * (1.0 - 0.10 * fr) + (film - 0.45) * amt * 0.8;
    col = mix(col, vec3(1.0), fr * 0.22);
    col = mix(col, vec3(1.0, 0.72, 0.85), 0.10 + 0.22 * fr);   // soft pink tint of the film
    col += smoothstep(0.86, 1.0, 1.0 - nz) * 0.12;
    float a = clamp(30.0 / max(uR, 1.0), 0.03, 0.22);
    vec3 h1 = normalize(vec3(-0.38, 0.48, 1.0));
    vec3 h2 = normalize(vec3(0.42, -0.36, 1.0));
    float d1 = dot(n, h1), d2 = dot(n, h2);
    float s1 = smoothstep(cos(a), cos(a * 0.45), d1) * 0.8 + pow(max(d1, 0.0), 40.0) * 0.12;
    float s2 = smoothstep(cos(a * 0.5), cos(a * 0.2), d2) * 0.5;
    col += vec3(s1 + s2);
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), uAlpha);
  }`;

  const sphereGeo = new THREE.SphereGeometry(1, 128, 96);
  const makeBubble = (seed) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { ...shared,
        uR: { value: 1 }, uAlpha: { value: 1 }, uSeed: { value: seed },
        uWobble: { value: 0.03 }, uPoke: { value: 0 }, uPokeDir: { value: new THREE.Vector3(0, 0, 1) } },
      vertexShader: BUBBLE_VS, fragmentShader: BUBBLE_FS, transparent: true,
    });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    scene.add(mesh);
    return mesh;
  };

  /* ---------- pop droplets ---------- */
  const MAX_P = 1500;
  const pPos = new Float32Array(MAX_P * 3), pCol = new Float32Array(MAX_P * 3), pSize = new Float32Array(MAX_P), pAlpha = new Float32Array(MAX_P);
  const pVel = new Float32Array(MAX_P * 2), pAge = new Float32Array(MAX_P), pLife = new Float32Array(MAX_P);
  let pNext = 0;
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 3));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
  pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(pAlpha, 1));
  const pMat = new THREE.ShaderMaterial({
    uniforms: { uDpr: shared.uDpr }, transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `attribute vec3 aColor; attribute float aSize; attribute float aAlpha; uniform float uDpr;
      varying vec3 vC; varying float vA;
      void main(){ vC = aColor; vA = aAlpha; gl_PointSize = aSize * uDpr; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec3 vC; varying float vA;
      void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c); if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.32, d) * vA;
        float hl = smoothstep(0.22, 0.0, length(c - vec2(-0.14, -0.14)));
        vec3 col = mix(vC, vec3(1.0), hl * 0.85);
        gl_FragColor = vec4(col, a); }`,
  });
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false; points.renderOrder = 10;
  scene.add(points);
  const PALETTE = [[1, .62, .8], [.8, .72, 1], [.72, .9, 1], [1, .92, .66], [1, 1, 1], [.96, .5, .72]];

  function spawnPop(cx, cy, r) {
    const n = Math.round(Math.min(380, Math.max(28, r * (reduce ? .25 : .75))));
    const big = r > 120 ? 1.7 : 1;
    for (let i = 0; i < n; i++) {
      const k = pNext; pNext = (pNext + 1) % MAX_P;
      const a = Math.random() * Math.PI * 2, rr = r * (0.7 + Math.random() * 0.3);
      pPos[k * 3] = cx + Math.cos(a) * rr; pPos[k * 3 + 1] = cy + Math.sin(a) * rr; pPos[k * 3 + 2] = 0;
      const sp = (90 + r * 1.3) * (0.35 + Math.random() * 0.9);
      pVel[k * 2] = Math.cos(a) * sp + (Math.random() - .5) * 60;
      pVel[k * 2 + 1] = Math.sin(a) * sp + (Math.random() - .3) * 80;
      pAge[k] = 0; pLife[k] = 0.45 + Math.random() * 0.65;
      pSize[k] = (2 + Math.random() * 5.5) * big;
      const c = PALETTE[(Math.random() * PALETTE.length) | 0];
      pCol[k * 3] = c[0]; pCol[k * 3 + 1] = c[1]; pCol[k * 3 + 2] = c[2];
      pAlpha[k] = 1;
    }
  }
  function updateParticles(dt) {
    for (let k = 0; k < MAX_P; k++) {
      if (pAlpha[k] <= 0) continue;
      pAge[k] += dt;
      if (pAge[k] >= pLife[k]) { pAlpha[k] = 0; continue; }
      pVel[k * 2 + 1] -= 900 * dt;
      pVel[k * 2] *= 0.986; pVel[k * 2 + 1] *= 0.986;
      pPos[k * 3] += pVel[k * 2] * dt; pPos[k * 3 + 1] += pVel[k * 2 + 1] * dt;
      pAlpha[k] = 1 - Math.pow(pAge[k] / pLife[k], 2);
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.aAlpha.needsUpdate = true;
    pGeo.attributes.aColor.needsUpdate = true;
    pGeo.attributes.aSize.needsUpdate = true;
  }

  /* ---------- layout: photo sits on the bottom edge, pills are pinned to image coords ---------- */
  let W = 1, H = 1, S = 1;
  const lips = new THREE.Vector2(), imgC = new THREE.Vector2();
  const smalls = [];
  const imgToScreen = (x, y) => [W / 2 + imgC.x + (x / IMG_W - .5) * IMG_W * S, H / 2 - (imgC.y + (.5 - y / IMG_H) * IMG_H * S)];

  function layout() {
    W = stage.clientWidth; H = stage.clientHeight;
    const tall = W / H < 0.9;
    S = Math.min(W * 0.98 / (tall ? 560 : 760), H * 0.80 / IMG_H);
    const iw = IMG_W * S, ih = IMG_H * S;
    imgC.set(0, -H / 2 + ih / 2);
    lips.set(imgC.x + (LIPS.x / IMG_W - .5) * iw, imgC.y + (.5 - LIPS.y / IMG_H) * ih);
    renderer.setSize(W, H, false);
    camera.left = -W / 2; camera.right = W / 2; camera.top = H / 2; camera.bottom = -H / 2; camera.updateProjectionMatrix();
    shared.uRes.value.set(W, H); shared.uImgSize.value.set(iw, ih); shared.uImgCenter.value.copy(imgC);

    const fs = Math.max(12, Math.min(19, 21 * S)) + 'px';
    // Captions sit on the empty studio wall, never over the face:
    //  wide screens  -> left and right of the model (image coordinates)
    //  tall screens  -> the gap between the title and the top of the head (screen coordinates)
    let spots;
    if (tall) {
      const titleBottom = titleEl.offsetTop + titleEl.offsetHeight;   // unaffected by the inflate transform
      const headTop = imgToScreen(0, 70)[1];
      const gap = Math.max(90, headTop - titleBottom);
      spots = [[pill1, W * 0.38, titleBottom + gap * 0.22], [pill2, W * 0.62, titleBottom + gap * 0.48], [tag, W * 0.5, titleBottom + gap * 0.76]];
    } else {
      spots = [[pill1, ...imgToScreen(205, 330)], [tag, ...imgToScreen(215, 430)], [pill2, ...imgToScreen(1185, 380)]];
    }
    for (const [el, sx, sy] of spots) {
      el.style.left = sx + 'px'; el.style.top = sy + 'px'; el.style.setProperty('--fs', fs);
    }
    titleEl.classList.toggle('is-tall', tall);
    smalls.forEach((b) => { if (Math.abs(b.bx) > W / 2) b.bx = (Math.random() - .5) * W; });
  }

  /* ---------- bubbles ---------- */
  const main = { mesh: makeBubble(0.0), alive: true, inflate: 0, R: 0, cx: 0, cy: 0, regrowAt: 0 };
  main.mesh.renderOrder = 1;
  const SMALL_N = innerWidth < 768 ? 6 : 9;
  for (let i = 0; i < SMALL_N; i++) {
    const b = { mesh: makeBubble(1 + i * 1.7), r: 8 + Math.random() * 24, bx: 0, y: 0, vy: 14 + Math.random() * 26,
                ph: Math.random() * 6.28, alive: true, regrowAt: 0, inflate: 1, x: 0 };
    b.mesh.renderOrder = 2;
    smalls.push(b);
  }
  function resetSmall(b, fromBottom) {
    b.r = 8 + Math.random() * 24;
    b.bx = (Math.random() - .5) * W * 0.95;
    b.y = fromBottom ? -H / 2 - b.r - Math.random() * 120 : (Math.random() - .5) * H;
    b.alive = true; b.inflate = fromBottom ? 1 : 0;
  }

  layout();
  smalls.forEach((b) => resetSmall(b, false));
  addEventListener('resize', layout);

  /* ---------- scroll progress ----------
     The section is 460vh. The bubble animation uses the first ANIM_END of the
     scroll; the rest is a "hold": the burst poster stays pinned so it can be
     read calmly before the page moves on. */
  const ANIM_END = 0.7;
  const scrollP = () => {
    const max = section.offsetHeight - innerHeight;
    const raw = Math.min(1, Math.max(0, (scrollY - section.offsetTop) / Math.max(1, max)));
    return Math.min(1, raw / ANIM_END);
  };
  let pe = scrollP(), autoPopped = false;

  /* ---------- pointer ---------- */
  const mouse = { x: 9999, y: 9999, speed: 0, has: false };
  const toWorld = (e) => {
    const r = stage.getBoundingClientRect();
    return [e.clientX - r.left - W / 2, H / 2 - (e.clientY - r.top)];
  };
  stage.addEventListener('pointermove', (e) => {
    const [x, y] = toWorld(e);
    if (mouse.has) mouse.speed = Math.min(3000, mouse.speed + Math.hypot(x - mouse.x, y - mouse.y));
    mouse.x = x; mouse.y = y; mouse.has = true;
  });
  stage.addEventListener('pointerleave', () => { mouse.x = mouse.y = 9999; mouse.has = false; });
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    const [x, y] = toWorld(e);
    for (const b of smalls) {
      if (b.alive && Math.hypot(x - b.x, y - b.y) < b.r * 1.35 + 8) { popSmall(b); return; }
    }
    if (main.alive && main.R > 4 && Math.hypot(x - main.cx, y - main.cy) < main.R) popMain(false);
  });

  function popMain(auto) {
    main.alive = false; main.mesh.visible = false;
    spawnPop(main.cx, main.cy, main.R);
    buzz(18);
    main.regrowAt = performance.now() + 850;
    if (auto) { autoPopped = true; setReveal(true); }
  }
  function popSmall(b) {
    b.alive = false; b.mesh.visible = false;
    spawnPop(b.x, b.y, b.r * 1.4);
    buzz(10);
    b.regrowAt = performance.now() + 1400 + Math.random() * 1500;
  }

  /* ---------- loop (paused while the hero is off screen) ---------- */
  const easeOutBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const clock = new THREE.Clock();
  let wob = 0, poke = 0, running = false, rafId = 0;
  const pokeDir = new THREE.Vector3(0, 0, 1);

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const now = performance.now();
    shared.uTime.value += reduce ? dt * 0.3 : dt;
    const t = shared.uTime.value;

    pe += (scrollP() - pe) * 0.12;

    /* main bubble grows from the lips, drifts to the centre, fills the screen, pops */
    const r0 = 46 * S, rMax = Math.hypot(W, H) * 0.62;
    const breathe = reduce ? 1 : 1 + 0.035 * Math.sin(t * 2.4) * (1 - pe);
    const target = (r0 + (rMax - r0) * Math.pow(pe, 1.7)) * breathe;

    if (autoPopped && pe < 0.85) { autoPopped = false; setReveal(false); }
    if (!main.alive && !autoPopped && now > main.regrowAt) { main.alive = true; main.inflate = 0; main.mesh.visible = true; }
    if (main.alive) {
      main.inflate = Math.min(1, main.inflate + dt / 0.9);
      main.R = Math.max(0.001, target * easeOutBack(main.inflate));
      const k = smooth(0.3, 1.0, pe);
      main.cx = lips.x * (1 - k); main.cy = lips.y * (1 - k);
      main.mesh.position.set(main.cx, main.cy, 0);
      main.mesh.scale.setScalar(main.R);
      if (pe > 0.93 && !autoPopped && main.inflate >= 1) popMain(true);
    }

    /* cursor dents the film near the edge and makes it wobble */
    mouse.speed *= 0.9;
    let pokeTarget = 0;
    if (main.alive && mouse.has) {
      const dx = mouse.x - main.cx, dy = mouse.y - main.cy, d = Math.hypot(dx, dy);
      if (d > main.R * 0.55 && d < main.R * 1.35) {
        pokeDir.set(dx / main.R, dy / main.R, 0.35).normalize();
        pokeTarget = 1 - Math.min(1, Math.abs(d - main.R) / (main.R * 0.4));
      }
    }
    poke += (pokeTarget - poke) * 0.15;
    wob += ((reduce ? 0 : 0.03 + Math.min(0.06, mouse.speed * 0.00006)) - wob) * 0.08;
    const mu = main.mesh.material.uniforms;
    mu.uR.value = main.R; mu.uWobble.value = wob; mu.uPoke.value = reduce ? 0 : poke; mu.uPokeDir.value.copy(pokeDir);

    /* small bubbles */
    const smallAlpha = 1 - smooth(0.25, 0.5, pe);
    let hover = main.alive && mouse.has && Math.hypot(mouse.x - main.cx, mouse.y - main.cy) < main.R;
    for (const b of smalls) {
      if (!b.alive && now > b.regrowAt) { resetSmall(b, true); b.mesh.visible = true; }
      if (!b.alive) continue;
      b.y += b.vy * dt * (reduce ? 0.3 : 1);
      if (b.y > H / 2 + b.r + 20) resetSmall(b, true);
      b.inflate = Math.min(1, b.inflate + dt / 0.6);
      b.x = b.bx + Math.sin(t * 0.7 + b.ph) * 18;
      b.mesh.position.set(b.x, b.y, 0);
      b.mesh.scale.setScalar(b.r * easeOutBack(b.inflate));
      const u = b.mesh.material.uniforms;
      u.uR.value = b.r; u.uAlpha.value = smallAlpha; u.uWobble.value = reduce ? 0 : 0.05;
      b.mesh.visible = smallAlpha > 0.01;
      if (mouse.has && Math.hypot(mouse.x - b.x, mouse.y - b.y) < b.r * 1.35 + 8) hover = true;
    }
    stage.style.cursor = hover ? 'pointer' : '';

    /* overlays fade out as the bubble grows */
    titleEl.style.opacity = 1 - smooth(0.6, 0.85, pe);
    msgs.style.opacity = 1 - smooth(0.12, 0.3, pe);
    hint.style.opacity = 1 - smooth(0.02, 0.08, pe);

    updateParticles(dt);
    renderer.render(scene, camera);
    rafId = running ? requestAnimationFrame(frame) : 0;
  }

  const start = () => { if (running) return; running = true; clock.getDelta(); rafId = requestAnimationFrame(frame); };
  const stop = () => { running = false; cancelAnimationFrame(rafId); };
  let inView = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; inView ? start() : stop(); }).observe(section);
  } else start();
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : inView && start()));
}
