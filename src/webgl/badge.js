import * as THREE from "three";
import { gsap } from "gsap";
import { isTouch, reducedMotion, dpr, clamp } from "./media";

/*
  ID badge on a lanyard.
  - The lanyard is a verlet rope (fixed above the screen) drawn as a woven ribbon that twists with the card.
  - The card hangs from the rope's last point as a pendulum, reacting to the pivot's acceleration.
  - Drag to swing it, fling sideways to spin it (it always settles front side up).
  - World units = CSS px, origin at the screen centre, y up.
  Card art: badge_card.png (880×1984, clip included, transparent around the card).
*/

const ASPECT = 880 / 1984;
const CLIP = 0.157; // top share of the image taken by the metal clip (card body starts below it)

/** Card art → texture. */
function loadCard(url) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const t = new THREE.Texture(img);
      t.colorSpace = THREE.NoColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
      res(t);
    };
    img.onerror = () => res(null);
    img.src = url;
  });
}
const N = 18; // rope points
const STEP = 1 / 120;
const MAX_TWIST = Math.PI * 4; // two full turns of the lanyard

const cardFrag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMap;
uniform float uGlare, uIsBack, uReveal, uTime;
void main(){
  vec2 fu = uIsBack > 0.5 ? vec2(1.0 - vUv.x, vUv.y) : vUv;     // the back mirrors the front
  vec4 front = texture2D(uMap, fu);
  float a = front.a;
  // liquid reveal: a wavy front line rises from the bottom
  float wave = sin(vUv.x * 9.0 + uTime * 2.2) * 0.02 + sin(vUv.x * 23.0 - uTime * 3.1) * 0.008;
  float line = uReveal * 1.25 - 0.1 + wave * (1.0 - uReveal);
  if (vUv.y > line || a < 0.02) discard;
  vec3 col = front.rgb;
  // meniscus just under the liquid front
  float men = smoothstep(0.06, 0.0, line - vUv.y) * (1.0 - uReveal);
  col = mix(col, vec3(0.56, 0.63, 1.0), men * 0.5) + vec3(0.09, 0.13, 1.0) * pow(men, 3.0) * 1.4;
  // plastic glare that slides with the card's angle
  float d = (vUv.x * 0.8 + vUv.y * 0.6) - (0.7 + uGlare);
  float g = exp(-d * d * 30.0) * 0.26;
  vec3 iri = 0.5 + 0.5 * cos(6.2831 * (vUv.y * 0.7 + uGlare * 1.3 + vec3(0.0, 0.33, 0.67)));
  col += g * mix(vec3(1.0), iri, 0.25);
  gl_FragColor = vec4(col, a);
}`;

const ribbonFrag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMap;
void main(){
  vec4 c = texture2D(uMap, vUv);
  vec3 col = gl_FrontFacing ? c.rgb : c.rgb * 0.62;
  gl_FragColor = vec4(col, 1.0);
}`;

const vert = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";

function ribbonTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 1024;
  const x = c.getContext("2d");
  x.fillStyle = "#1621ff";
  x.fillRect(0, 0, 64, 1024);
  // woven ribs
  for (let y = 0; y < 1024; y += 3) {
    x.fillStyle = y % 6 ? "rgba(0,0,40,0.18)" : "rgba(255,255,255,0.05)";
    x.fillRect(0, y, 64, 1);
  }
  // edge seams
  x.fillStyle = "rgba(0,0,30,0.35)";
  x.fillRect(0, 0, 4, 1024);
  x.fillRect(60, 0, 4, 1024);
  x.save();
  x.translate(32, 0);
  x.rotate(Math.PI / 2);
  x.font = '600 20px "Geist", sans-serif';
  x.fillStyle = "rgba(255,255,255,0.78)";
  x.textBaseline = "middle";
  const s = "KATE  ·  OPEN TO WORK  ·  케이트  ·  ";
  let off = 20;
  while (off < 1024) {
    x.fillText(s, off, 0);
    off += x.measureText(s).width;
  }
  x.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

export class Badge {
  constructor({ host, image }) {
    this.host = host;
    this.reduced = reducedMotion();
    this.touch = isTouch();

    const r = (this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }));
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.setPixelRatio(dpr());
    r.setClearColor(0x000000, 0);
    host.appendChild(r.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 1, 10000);

    // card
    this.cardU = {
      uMap: { value: null },
      uGlare: { value: 0 },
      uIsBack: { value: 0 },
      uReveal: { value: this.reduced ? 1 : 0 },
      uTime: { value: 0 },
    };
    const mk = (isBack) =>
      new THREE.ShaderMaterial({
        uniforms: { ...this.cardU, uIsBack: { value: isBack } },
        vertexShader: vert,
        fragmentShader: cardFrag,
        transparent: true,
        side: THREE.FrontSide,
      });
    this.pivot = new THREE.Group();
    this.spin = new THREE.Group();
    this.front = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mk(0));
    this.back = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mk(1));
    this.back.rotation.y = Math.PI;
    this.spin.add(this.front, this.back);
    this.pivot.add(this.spin);
    this.scene.add(this.pivot);
    this.front.visible = this.back.visible = false;

    // ribbon
    this.ribbonGeo = new THREE.BufferGeometry();
    this.ribbonPos = new Float32Array(N * 2 * 3);
    this.ribbonUv = new Float32Array(N * 2 * 2);
    const idx = [];
    for (let i = 0; i < N - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    this.ribbonGeo.setIndex(idx);
    this.ribbonGeo.setAttribute("position", new THREE.BufferAttribute(this.ribbonPos, 3));
    this.ribbonGeo.setAttribute("uv", new THREE.BufferAttribute(this.ribbonUv, 2));
    this.ribbon = new THREE.Mesh(
      this.ribbonGeo,
      new THREE.ShaderMaterial({ uniforms: { uMap: { value: ribbonTexture() } }, vertexShader: vert, fragmentShader: ribbonFrag, side: THREE.DoubleSide })
    );
    this.ribbon.frustumCulled = false;
    this.ribbon.renderOrder = -1;
    this.scene.add(this.ribbon);

    // physics
    this.pts = Array.from({ length: N }, () => ({ x: 0, y: 0, px: 0, py: 0 }));
    this.theta = 0;
    this.omega = 0;
    this.phi = 0;
    this.phiV = 0;
    this.tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    this.pv = { x: 0, y: 0 }; // pivot velocity (for acceleration)
    this.acc = 0;
    this.mouse = { x: 0, y: 0, moved: false };
    this.ray = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();

    this.resize(true);
    this.bind();

    loadCard(image).then((tex) => {
      if (!tex || this.destroyed) return;
      this.cardU.uMap.value = tex;
      this.front.visible = this.back.visible = true;
      this.ready = true;
      this.drop();
    });
  }

  /* ---------------- layout ---------------- */
  resize(init) {
    const W = (this.W = this.host.clientWidth || innerWidth);
    const H = (this.H = this.host.clientHeight || innerHeight);
    this.renderer.setSize(W, H, false);
    this.camera.aspect = W / H;
    this.camera.position.set(0, 0, H / 2 / Math.tan((17.5 * Math.PI) / 180));
    this.camera.far = this.camera.position.z * 4;
    this.camera.updateProjectionMatrix();

    // phones: badge hangs in the upper part, the text sits below it.
    // wider screens: badge hangs in the right half, the text takes the left half.
    const phone = (this.phone = W <= 720);
    this.cardH = phone ? clamp(H * 0.36, 230, 360) : clamp(Math.min(H * 0.6, (W * 0.34) / ASPECT), 300, 640);
    this.cardW = this.cardH * ASPECT;
    this.front.scale.set(this.cardW, this.cardH, 1);
    this.back.scale.set(this.cardW, this.cardH, 1);
    this.front.position.y = this.back.position.y = -this.cardH / 2;
    this.ribbonW = this.cardW * 0.19;
    const cx = phone ? W * 0.14 : W * 0.24;
    const cy = phone ? H * 0.2 : -H * 0.02; // card centre, world y (up)
    this.anchor = { x: cx, y: H / 2 + 40 };
    const clipTop = cy + this.cardH / 2;
    this.ropeLen = this.anchor.y - clipTop;
    this.seg = this.ropeLen / (N - 1);
    this.lc = this.cardH * 0.56; // pendulum length to the card's centre of mass
    if (init) this.layRope(0, 0);
  }

  layRope(dx, lift) {
    const { x: ax, y: ay } = this.anchor;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const p = this.pts[i];
      p.x = ax + dx * t;
      p.y = ay - (this.ropeLen - lift) * t;
      p.px = p.x;
      p.py = p.y;
    }
  }

  drop() {
    if (this.reduced) return;
    // swing in from the upper right, liquid-fill the card
    this.layRope(this.W * (this.phone ? 0.3 : 0.24), this.ropeLen * 0.55);
    this.theta = 0.9;
    gsap.to(this.cardU.uReveal, { value: 1, duration: 2.6, ease: "power2.out", delay: 0.35 });
  }

  /* ---------------- input ---------------- */
  toWorld(cx, cy) {
    const r = this.host.getBoundingClientRect();
    return { x: cx - r.left - this.W / 2, y: this.H / 2 - (cy - r.top) };
  }

  hit(cx, cy) {
    if (!this.ready) return null;
    const r = this.host.getBoundingClientRect();
    this.ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    const h = this.ray.intersectObjects([this.front, this.back])[0];
    if (!h) return null;
    // ignore transparent corners
    return h.uv.y < 1.0 ? h : null;
  }

  bind() {
    this.h = {
      down: (e) => {
        if (this.cardU.uReveal.value < 0.8) return false;
        const h = this.hit(e.clientX, e.clientY);
        if (!h) return false;
        const w = this.toWorld(e.clientX, e.clientY);
        const P = this.pts[N - 1];
        this.drag = { ox: P.x - w.x, oy: P.y - w.y, lx: e.clientX };
        return true;
      },
      move: (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.moved = true;
        const d = this.drag;
        if (!d) return;
        // horizontal flicks spin the card
        this.phiV += (e.clientX - d.lx) * 0.0016;
        d.lx = e.clientX;
      },
      up: () => {
        this.drag = null;
      },
    };
    this.onResize = () => this.resize(false);
    addEventListener("resize", this.onResize);
  }

  /* ---------------- physics ---------------- */
  step(dt) {
    const g = 2400;
    const pts = this.pts;
    const last = pts[N - 1];
    const prevPx = last.x;
    const prevPy = last.y;

    // verlet
    for (let i = 1; i < N; i++) {
      const p = pts[i];
      const vx = (p.x - p.px) * 0.992;
      const vy = (p.y - p.py) * 0.992;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy - g * dt * dt;
    }
    if (this.drag) {
      const w = this.toWorld(this.mouse.x, this.mouse.y);
      let tx = w.x + this.drag.ox;
      let ty = w.y + this.drag.oy;
      const dx = tx - this.anchor.x;
      const dy = ty - this.anchor.y;
      const dist = Math.hypot(dx, dy);
      const max = this.ropeLen * 1.04;
      if (dist > max) {
        tx = this.anchor.x + (dx / dist) * max;
        ty = this.anchor.y + (dy / dist) * max;
      }
      last.x = tx;
      last.y = ty;
    }
    // constraints (the last point carries the card, so it is heavier)
    for (let k = 0; k < 14; k++) {
      pts[0].x = this.anchor.x;
      pts[0].y = this.anchor.y;
      for (let i = 0; i < N - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1e-6;
        const diff = (d - this.seg) / d;
        const wa = i === 0 ? 0 : 1;
        const wb = i + 1 === N - 1 ? (this.drag ? 0 : 0.25) : 1;
        const s = wa + wb;
        if (!s) continue;
        a.x += dx * diff * (wa / s);
        a.y += dy * diff * (wa / s);
        b.x -= dx * diff * (wb / s);
        b.y -= dy * diff * (wb / s);
      }
    }

    // pendulum on an accelerating pivot
    const vx = (last.x - prevPx) / dt;
    const vy = (last.y - prevPy) / dt;
    const ax = clamp((vx - this.pv.x) / dt, -60000, 60000);
    const ay = clamp((vy - this.pv.y) / dt, -60000, 60000);
    this.pv.x = vx;
    this.pv.y = vy;
    const alpha = (-(g + ay) * Math.sin(this.theta) - ax * Math.cos(this.theta)) / this.lc;
    this.omega += alpha * dt;
    this.omega *= Math.pow(0.35, dt); // damping
    this.theta += this.omega * dt;
    this.theta = clamp(this.theta, -1.4, 1.4);

    // spin around the vertical axis: always settles front side up (back = unstable)
    this.phiV += -9 * Math.sin(this.phi) * dt;
    this.phiV *= Math.pow(0.12, dt);
    this.phi += this.phiV * dt * 60 * 0.06;
    // the lanyard winds up at most two full turns either way, then bounces back
    if (Math.abs(this.phi) > MAX_TWIST) {
      this.phi = Math.sign(this.phi) * MAX_TWIST;
      if (Math.sign(this.phiV) === Math.sign(this.phi)) this.phiV *= -0.35;
    }
  }

  frame(dt) {
    if (!this.ready) return this.renderer.render(this.scene, this.camera);
    this.acc += dt;
    let n = 0;
    while (this.acc >= STEP && n < 8) {
      this.step(this.reduced ? STEP * 0.5 : STEP);
      this.acc -= STEP;
      n++;
    }
    if (n === 8) this.acc = 0;
    this.cardU.uTime.value += dt;

    // gentle tilt towards the cursor
    if (!this.touch) {
      const nx = this.mouse.moved ? (this.mouse.x - innerWidth / 2) / (innerWidth / 2) : 0;
      const ny = this.mouse.moved ? (this.mouse.y - innerHeight / 2) / (innerHeight / 2) : 0;
      this.tilt.ty = clamp(nx, -1, 1) * 0.32;
      this.tilt.tx = clamp(ny, -1, 1) * 0.18;
    }
    const k = 1 - Math.pow(1 - 0.08, dt * 60);
    this.tilt.x += (this.tilt.tx - this.tilt.x) * k;
    this.tilt.y += (this.tilt.ty - this.tilt.y) * k;

    const last = this.pts[N - 1];
    this.pivot.position.set(last.x, last.y, 0);
    this.pivot.rotation.z = this.theta;
    this.spin.rotation.set(this.tilt.x, this.phi + this.tilt.y, 0);
    this.cardU.uGlare.value = this.theta * 0.6 + this.tilt.y * 0.8 + Math.sin(this.phi) * 0.4;

    // hover (Hero switches the cursor to "grab")
    this.hovering = !this.touch && this.mouse.moved && !!this.hit(this.mouse.x, this.mouse.y);

    this.updateRibbon();
    this.renderer.render(this.scene, this.camera);
  }

  updateRibbon() {
    const pts = this.pts;
    const P = this.ribbonPos;
    const U = this.ribbonUv;
    const hw = this.ribbonW / 2;
    let len = 0;
    for (let i = 0; i < N; i++) {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(N - 1, i + 1)];
      let tx = b.x - a.x;
      let ty = b.y - a.y;
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      // twist grows towards the card
      const w = Math.pow(i / (N - 1), 2);
      const ang = (this.phi + this.tilt.y) * w;
      const c = Math.cos(ang);
      const s = Math.sin(ang);
      // side vector: perpendicular to the tangent in-plane, rotated about the tangent by the twist
      const sx = -ty * c;
      const sy = tx * c;
      const sz = s;
      const p = pts[i];
      if (i > 0) len += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y);
      const o = i * 6;
      P[o] = p.x - sx * hw;
      P[o + 1] = p.y - sy * hw;
      P[o + 2] = -sz * hw;
      P[o + 3] = p.x + sx * hw;
      P[o + 4] = p.y + sy * hw;
      P[o + 5] = sz * hw;
      const v = -len / (this.ribbonW * 16);
      U[i * 4] = 0;
      U[i * 4 + 1] = v;
      U[i * 4 + 2] = 1;
      U[i * 4 + 3] = v;
    }
    this.ribbonGeo.attributes.position.needsUpdate = true;
    this.ribbonGeo.attributes.uv.needsUpdate = true;
  }

  /** Card body in DOM px (origin top-left): centre and half extents, for the text keep-out zone. */
  bounds() {
    const last = this.pts[N - 1];
    const bodyH = this.cardH * (1 - CLIP);
    const dist = this.cardH * CLIP + bodyH / 2;
    const cx = last.x + Math.sin(this.theta) * dist;
    const cy = last.y - Math.cos(this.theta) * dist;
    const hw = (this.cardW / 2) * Math.max(Math.abs(Math.cos(this.phi + this.tilt.y)), 0.12);
    const hh = bodyH / 2;
    const c = Math.abs(Math.cos(this.theta));
    const s = Math.abs(Math.sin(this.theta));
    return {
      x: cx,
      y: -cy, // DOM y grows downwards; both relative to the screen centre
      hw: c * hw + s * hh,
      hh: s * hw + c * hh,
    };
  }

  destroy() {
    this.destroyed = true;
    removeEventListener("resize", this.onResize);
    gsap.killTweensOf(this.cardU.uReveal);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
