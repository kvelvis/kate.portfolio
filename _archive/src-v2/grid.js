import * as THREE from "three";
import { gsap } from "gsap";
import { isTouch, reducedMotion, dpr, makeVideo, videoReady, videoTexture, loadImage, fontsReady, clamp } from "./media";

/*
  Project index — a WebGL grid where 1 world unit = 1 CSS px and the page runs down −y.
  Each tile: skeleton shimmer → still → (hover) video crossfade, plus a frosted index chip.
  The scene renders into a multisampled target and a lens pass refracts the top/bottom 8% of the screen.
*/

const raw = (hex) => new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace);
const INK = "#ededeb";
const MUTE = "#8a8a88";
const SANS = '"Geist", "Noto Sans KR", system-ui, sans-serif';
const SERIF = '"Newsreader", "Noto Serif KR", Georgia, serif';
const GLYPHS = ".:·,;_";

const tileVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const tileFrag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex, uTex2, uChip;
uniform vec2 uS1, uS2, uSize, uChipSize;
uniform float uMix, uReveal, uTime, uOpacity, uHover;
vec2 cover(vec2 uv, vec2 s){ return (uv - 0.5) * s + 0.5; }
vec3 media(vec2 uv){
  uv = (uv - 0.5) * (1.0 - 0.035 * uHover) + 0.5;
  vec3 a = texture2D(uTex, cover(uv, uS1)).rgb;
  vec3 b = texture2D(uTex2, cover(uv, uS2)).rgb;
  return mix(a, b, uMix);
}
void main(){
  vec2 uv = vUv;
  float sweep = fract(uTime * 0.6);
  float band = smoothstep(0.18, 0.0, abs((uv.x + (1.0 - uv.y)) * 0.5 - sweep)) * 0.035;
  vec3 skel = vec3(0.085) + band;
  vec3 col = mix(skel, media(uv), uReveal);

  // frosted chip, 8px inset from top-left
  vec2 p = vec2(uv.x * uSize.x, (1.0 - uv.y) * uSize.y) - 8.0;
  vec2 lc = p / uChipSize;
  if (lc.x >= 0.0 && lc.y >= 0.0 && lc.x <= 1.0 && lc.y <= 1.0) {
    vec2 q = abs(p - uChipSize * 0.5) - (uChipSize * 0.5 - 4.0);
    float d = length(max(q, 0.0)) - 4.0;
    float mask = 1.0 - smoothstep(-0.5, 0.5, d);
    vec3 bl = vec3(0.0);
    for (int i = 0; i < 32; i++) {
      float fi = float(i);
      float r = sqrt((fi + 0.5) / 32.0) * 40.0;
      float a = fi * 2.39996323;
      vec2 off = vec2(cos(a), -sin(a)) * r / uSize;
      bl += media(clamp(uv + off, 0.0, 1.0));
    }
    bl = mix(bl / 32.0, vec3(0.05), 0.45);
    bl = mix(skel * 0.8, bl, uReveal);
    vec4 tx = texture2D(uChip, vec2(lc.x, 1.0 - lc.y));
    col = mix(col, mix(bl, tx.rgb, tx.a), mask);
  }
  gl_FragColor = vec4(col, uOpacity);
}`;

const lensFrag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D tScene;
const float B = 0.08;
void main(){
  vec2 uv = vUv;
  float t = 0.0, dir = 0.0;
  if (uv.y > 1.0 - B) { t = (uv.y - (1.0 - B)) / B; dir = -1.0; }
  else if (uv.y < B) { t = (B - uv.y) / B; dir = 1.0; }
  if (dir == 0.0) { gl_FragColor = vec4(texture2D(tScene, uv).rgb, 1.0); return; }
  float sag = 1.0 - sqrt(1.0 - t * t);
  vec2 base = uv + vec2(0.0, dir * sag * B);
  vec3 acc = vec3(0.0), ws = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    float s = float(i) / 15.0;
    float o = (s - 0.5) * 0.01 * sag * 6.0;
    vec3 w = vec3(smoothstep(0.8, 0.2, s), smoothstep(0.0, 0.5, s) * smoothstep(1.0, 0.5, s), smoothstep(0.2, 0.8, s));
    acc += texture2D(tScene, clamp(base + vec2(0.0, o * dir), 0.0, 1.0)).rgb * w;
    ws += w;
  }
  gl_FragColor = vec4(acc / ws, 1.0);
}`;

const blank = new THREE.DataTexture(new Uint8Array([22, 22, 22, 255]), 1, 1);
blank.needsUpdate = true;

function canvasTex(w, h) {
  const c = document.createElement("canvas");
  const r = dpr();
  c.width = Math.max(1, Math.ceil(w * r));
  c.height = Math.max(1, Math.ceil(h * r));
  const ctx = c.getContext("2d");
  ctx.scale(r, r);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return { c, ctx, tex, w, h };
}

export class WorkGrid {
  constructor({ host, items, text, onOpen, bubble }) {
    this.host = host;
    this.items = items;
    this.text = text; // { headA, headB, headLines, footL, footR, cat(item), meta(item) }
    this.onOpen = onOpen;
    this.bubble = bubble;
    this.reduced = reducedMotion();
    this.touch = isTouch();

    const r = (this.renderer = new THREE.WebGLRenderer({ antialias: true }));
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.setPixelRatio(dpr());
    r.setClearColor(raw(0x0c0c0d), 1);
    host.appendChild(r.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 1, 10000);
    this.rt = new THREE.WebGLRenderTarget(1, 1, { samples: 4 });
    this.post = new THREE.Scene();
    this.postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.post.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          uniforms: { tScene: { value: this.rt.texture } },
          vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
          fragmentShader: lensFrag,
          depthTest: false,
        })
      )
    );

    this.scroll = { cur: 0, target: 0, vel: 0 };
    this.time = 0;
    this.mouse = { x: -1, y: -1, in: false };
    this.hovered = null;
    this.ray = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();

    this.tiles = items.map((item, i) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTex: { value: blank },
          uTex2: { value: blank },
          uChip: { value: blank },
          uS1: { value: new THREE.Vector2(1, 1) },
          uS2: { value: new THREE.Vector2(1, 1) },
          uSize: { value: new THREE.Vector2(1, 1) },
          uChipSize: { value: new THREE.Vector2(1, 1) },
          uMix: { value: 0 },
          uReveal: { value: 0 },
          uTime: { value: 0 },
          uOpacity: { value: this.reduced ? 1 : 0 },
          uHover: { value: 0 },
        },
        vertexShader: tileVert,
        fragmentShader: tileFrag,
        transparent: true,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: this.reduced ? 1 : 0 })
      );
      this.scene.add(mesh, label);
      return { i, item, mesh, label, mat, rise: this.reduced ? 0 : 60, state: "idle", video: null, playing: false };
    });

    this.head = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    this.foot = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true }));
    this.scene.add(this.head, this.foot);
    this.scramble = { p: this.reduced ? 1 : 0 };
    this.headRand = [];

    this.bind();
    this.bubbleX = gsap.quickTo(bubble, "x", { duration: 0.5, ease: "power3.out" });
    this.bubbleY = gsap.quickTo(bubble, "y", { duration: 0.5, ease: "power3.out" });

    this.ready = fontsReady().then(() => {
      if (this.destroyed) return;
      this.layout();
      this.enter();
    });
  }

  /* ---------------- layout ---------------- */
  layout() {
    const W = (this.W = this.host.clientWidth || innerWidth);
    const H = (this.H = this.host.clientHeight || innerHeight);
    this.renderer.setSize(W, H, false);
    const pr = this.renderer.getPixelRatio();
    this.rt.setSize(W * pr, H * pr);
    this.camera.aspect = W / H;
    this.camera.position.z = H / 2 / Math.tan((17.5 * Math.PI) / 180);
    this.camera.far = this.camera.position.z * 3;
    this.camera.updateProjectionMatrix();

    this.phone = W <= 640;
    this.desktopHover = W > 1024 && !this.touch;
    const cols = (this.cols = W > 1024 ? 3 : W > 640 ? 2 : 1);
    const gap = 8;
    const tw = (this.tw = (W - 16 - gap * (cols - 1)) / cols);
    const th = (this.th = (tw * 9) / 16);

    // headline
    const lines = this.phone ? this.text.headLines : null;
    const hh = lines ? 44 : 24;
    this.drawHeadline(hh);
    this.head.scale.set(W, hh, 1);
    this.headY = 200;
    this.head.position.set(W / 2, -(200 + hh / 2), 0);

    const top = 200 + hh + 80;
    const rowStep = th + 45 + 40;
    this.tiles.forEach((t) => {
      const col = t.i % cols;
      const row = Math.floor(t.i / cols);
      t.col = col;
      t.row = row;
      t.x = 8 + col * (tw + gap);
      t.y = top + row * rowStep;
      t.mesh.scale.set(tw, th, 1);
      t.mat.uniforms.uSize.value.set(tw, th);
      this.drawChip(t);
      this.drawLabel(t);
      this.fit(t);
    });
    const rows = Math.ceil(this.tiles.length / cols);
    const footY = top + rows * rowStep - 40 + 240;
    this.drawFooter();
    this.foot.scale.set(W, 24, 1);
    this.foot.position.set(W / 2, -(footY + 12), 0);
    this.pageH = footY + 24 + 120;
    this.maxScroll = Math.max(0, this.pageH - H);
    this.scroll.target = clamp(this.scroll.target, 0, this.maxScroll);
    this.place();
  }

  fit(t) {
    const A = 16 / 9;
    const set = (v, a) => (a > A ? v.set(A / a, 1) : v.set(1, a / A));
    if (t.a1) set(t.mat.uniforms.uS1.value, t.a1);
    if (t.a2) set(t.mat.uniforms.uS2.value, t.a2);
  }

  place() {
    for (const t of this.tiles) {
      t.mesh.position.set(t.x + this.tw / 2, -(t.y + this.th / 2) - t.rise, 0);
      t.label.position.set(t.x + this.tw / 2, -(t.y + this.th + 12 + 16) - t.rise, 0);
    }
  }

  drawChip(t) {
    const label = `${String(t.i + 1).padStart(2, "0")}  ${this.text.cat(t.item)}`;
    const m = document.createElement("canvas").getContext("2d");
    m.font = `500 12px ${SANS}`;
    const w = Math.ceil(m.measureText(label).width) + 16;
    const h = 22;
    const ct = canvasTex(w, h);
    ct.ctx.font = `500 12px ${SANS}`;
    ct.ctx.fillStyle = INK;
    ct.ctx.textBaseline = "alphabetic";
    ct.ctx.fillText(label, 8, 15);
    t.chipTex?.dispose();
    t.chipTex = ct.tex;
    t.mat.uniforms.uChip.value = ct.tex;
    t.mat.uniforms.uChipSize.value.set(w, h);
  }

  drawLabel(t) {
    const ct = canvasTex(this.tw, 32);
    const { ctx } = ct;
    ctx.textBaseline = "top";
    ctx.font = `500 12px ${SANS}`;
    ctx.fillStyle = INK;
    ctx.fillText(t.item.title, 0, 0);
    ctx.font = `400 13px ${SERIF}`;
    ctx.fillStyle = MUTE;
    ctx.fillText(this.text.meta(t.item), 0, 18);
    t.label.material.map?.dispose();
    t.label.material.map = ct.tex;
    t.label.material.needsUpdate = true;
    t.label.scale.set(this.tw, 32, 1);
  }

  drawHeadline(h) {
    const W = this.W;
    if (!this.headCt || this.headCt.w !== W || this.headCt.h !== h) {
      this.head.material.map?.dispose();
      this.headCt = canvasTex(W, h);
      this.head.material.map = this.headCt.tex;
      this.head.material.needsUpdate = true;
    }
    const { ctx } = this.headCt;
    ctx.clearRect(0, 0, W, h);
    ctx.textBaseline = "alphabetic";
    const A = this.text.headA;
    const B = this.text.headB;
    const fa = `500 16px ${SANS}`;
    const fb = `400 17px ${SERIF}`;
    const total = A.length + B.length;
    if (this.headRand.length !== total) this.headRand = Array.from({ length: total }, () => Math.random());
    const p = this.scramble.p;
    let idx = 0;
    const run = (str, font, x, y) => {
      ctx.font = font;
      for (const ch of str) {
        const th = 0.7 * (idx / total) + 0.3 * this.headRand[idx];
        const show = p >= th || ch === " ";
        ctx.fillStyle = show ? (font === fb ? INK : INK) : MUTE;
        ctx.fillText(show ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y);
        x += ctx.measureText(ch).width + (font === fa ? -0.16 : 0);
        idx++;
      }
      return x;
    };
    const width = (str, font) => {
      ctx.font = font;
      return ctx.measureText(str).width + (font === fa ? -0.16 * str.length : 0);
    };
    if (this.phone) {
      const [l1, l2] = this.text.headLines;
      // line 1: sans part + start of serif part, line 2: rest of serif
      const w1 = width(l1.a, fa) + width(l1.b, fb);
      let x = run(l1.a, fa, (W - w1) / 2, 17);
      run(l1.b, fb, x, 17);
      x = (W - width(l2, fb)) / 2;
      run(l2, fb, x, 37);
    } else {
      const w = width(A, fa) + width(B, fb);
      const x = run(A, fa, (W - w) / 2, 17);
      run(B, fb, x, 17);
    }
    this.headCt.tex.needsUpdate = true;
  }

  drawFooter() {
    const W = this.W;
    this.foot.material.map?.dispose();
    const ct = canvasTex(W, 24);
    const { ctx } = ct;
    ctx.font = `400 13px ${SERIF}`;
    ctx.fillStyle = MUTE;
    ctx.textBaseline = "middle";
    if (this.phone) {
      ctx.fillText(this.text.footL, 8, 12);
      ctx.textAlign = "right";
      ctx.fillText(this.text.footR, W - 8, 12);
    } else {
      ctx.textAlign = "center";
      ctx.fillText(`${this.text.footL} — ${this.text.footR}`, W / 2, 12);
    }
    this.foot.material.map = ct.tex;
    this.foot.material.needsUpdate = true;
  }

  setText(text) {
    this.text = text;
    if (!this.W) return;
    this.headRand = [];
    this.layout();
  }

  /* ---------------- entrance ---------------- */
  enter() {
    if (this.reduced) {
      this.head.material.opacity = 1;
      this.drawHeadline(this.head.scale.y);
      return;
    }
    gsap.to(this.head.material, { opacity: 1, duration: 0.3 });
    gsap.to(this.scramble, {
      p: 1,
      duration: 1.1,
      ease: "power2.out",
      onUpdate: () => this.drawHeadline(this.head.scale.y),
    });
    for (const t of this.tiles) {
      const delay = 0.35 + 0.08 * t.col + 0.06 * Math.min(t.row, 4);
      gsap.to(t.mat.uniforms.uOpacity, { value: 1, duration: 0.9, ease: "power2.out", delay });
      gsap.to(t.label.material, { opacity: 1, duration: 0.9, ease: "power2.out", delay });
      gsap.to(t, { rise: 0, duration: 1.2, ease: "expo.out", delay });
    }
  }

  /* ---------------- media ---------------- */
  load(t) {
    t.state = "loading";
    loadImage(t.item.image).then((tex) => {
      if (this.destroyed) return;
      if (tex) {
        t.mat.uniforms.uTex.value = tex;
        t.a1 = tex.image.width / tex.image.height;
        this.fit(t);
      }
      t.state = "ready";
      gsap.to(t.mat.uniforms.uReveal, { value: 1, duration: 0.8, ease: "power2.out" });
    });
  }

  ensureVideo(t) {
    if (t.video || !t.item.video) return;
    const v = (t.video = makeVideo(t.item.video, "auto"));
    videoReady(v).then(() => {
      if (this.destroyed || !v.videoWidth) return;
      t.mat.uniforms.uTex2.value = videoTexture(v);
      t.a2 = v.videoWidth / v.videoHeight;
      this.fit(t);
      if (t.want) this.play(t, true);
    });
    v.load();
  }

  play(t, on) {
    t.want = on;
    const u = t.mat.uniforms;
    if (on) {
      this.ensureVideo(t);
      if (t.video && t.video.readyState >= 2 && this.running) {
        t.video.play().catch(() => {});
        t.playing = true;
        gsap.to(u.uMix, { value: 1, duration: 0.45, ease: "power2.out", overwrite: true });
      }
      gsap.to(u.uHover, { value: 1, duration: 0.6, ease: "power3.out", overwrite: true });
    } else {
      gsap.to(u.uMix, {
        value: 0,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          if (!t.want && t.video) {
            t.video.pause();
            t.playing = false;
          }
        },
      });
      gsap.to(u.uHover, { value: 0, duration: 0.6, ease: "power3.out", overwrite: true });
    }
  }

  /* ---------------- input ---------------- */
  bind() {
    const c = this.renderer.domElement;
    this.h = {
      wheel: (e) => {
        e.preventDefault();
        const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        this.scroll.target = clamp(this.scroll.target + d * (e.deltaMode === 1 ? 32 : 1), 0, this.maxScroll || 0);
      },
      down: (e) => {
        this.drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), touch: e.pointerType !== "mouse" };
        this.scroll.vel = 0;
      },
      move: (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.in = true;
        this.bubbleX(e.clientX - 32);
        this.bubbleY(e.clientY - 32);
        const d = this.drag;
        if (d && d.touch) {
          const dy = e.clientY - d.y;
          d.y = e.clientY;
          this.scroll.target = clamp(this.scroll.target - dy, 0, this.maxScroll);
          this.scroll.vel = -dy;
        }
      },
      up: (e) => {
        const d = this.drag;
        this.drag = null;
        if (!d) return;
        if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6) {
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;
          const t = this.pick();
          if (t) this.onOpen(t.item);
        }
      },
      leave: () => (this.mouse.in = false),
      key: (e) => {
        if (!this.running || e.target.closest?.("input,textarea,[role=dialog]")) return;
        const step = { ArrowDown: 120, ArrowUp: -120, PageDown: this.H * 0.85, PageUp: -this.H * 0.85, " ": this.H * 0.85 }[e.key];
        if (e.key === "Home") this.scroll.target = 0;
        else if (e.key === "End") this.scroll.target = this.maxScroll;
        else if (step) this.scroll.target = clamp(this.scroll.target + step, 0, this.maxScroll);
      },
      resize: () => this.W && this.layout(),
    };
    c.addEventListener("wheel", this.h.wheel, { passive: false });
    c.addEventListener("pointerdown", this.h.down);
    addEventListener("pointermove", this.h.move);
    addEventListener("pointerup", this.h.up);
    c.addEventListener("pointerleave", this.h.leave);
    addEventListener("keydown", this.h.key);
    addEventListener("resize", this.h.resize);
  }

  pick() {
    if (!this.mouse.in) return null;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.ndc.set(((this.mouse.x - rect.left) / rect.width) * 2 - 1, -((this.mouse.y - rect.top) / rect.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    const hit = this.ray.intersectObjects(this.tiles.map((t) => t.mesh))[0];
    return hit ? this.tiles.find((t) => t.mesh === hit.object) : null;
  }

  /* ---------------- frame ---------------- */
  frame(dt) {
    if (!this.W) return;
    const f = Math.min(dt * 60, 3);
    const s = this.scroll;
    if (!this.drag && Math.abs(s.vel) > 0.1) {
      s.target = clamp(s.target + s.vel * f, 0, this.maxScroll);
      s.vel *= Math.pow(0.95, f);
    }
    s.cur += (s.target - s.cur) * (1 - Math.pow(1 - 0.12, f));
    if (Math.abs(s.target - s.cur) < 0.05) s.cur = s.target;
    this.camera.position.set(this.W / 2, -this.H / 2 - s.cur, this.camera.position.z);
    this.time += dt;

    this.place();
    const top = s.cur - this.H * 0.6;
    const bottom = s.cur + this.H * 2.6;
    for (const t of this.tiles) {
      t.mat.uniforms.uTime.value = this.time;
      if (t.state === "idle" && t.y + this.th > top && t.y < bottom) this.load(t);
    }

    // which tile plays
    let target = null;
    if (this.desktopHover) {
      target = this.mouse.in && !this.drag ? this.pick() : null;
      if (target !== this.hovered) {
        gsap.to(this.bubble, {
          scale: target ? 1 : 0.6,
          opacity: target ? 1 : 0,
          duration: target ? 0.75 : 0.6,
          ease: "power4.out",
          overwrite: "auto",
        });
      }
    } else {
      const mid = s.cur + this.H / 2;
      let best = Infinity;
      for (const t of this.tiles) {
        const d = Math.abs(t.y + this.th / 2 - mid);
        if (d < best) {
          best = d;
          target = t;
        }
      }
    }
    if (target !== this.hovered) {
      if (this.hovered) this.play(this.hovered, false);
      if (target) this.play(target, true);
      this.hovered = target;
      this.renderer.domElement.style.cursor = target && this.desktopHover ? "pointer" : "default";
    }

    this.renderer.setRenderTarget(this.rt);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.post, this.postCam);
  }

  start() {
    if (this.running) return;
    this.running = true;
    let last = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      this.frame(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
    if (this.hovered?.want) this.play(this.hovered, true);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.tiles.forEach((t) => {
      t.video?.pause();
      t.playing = false;
    });
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    const c = this.renderer.domElement;
    c.removeEventListener("wheel", this.h.wheel);
    c.removeEventListener("pointerdown", this.h.down);
    removeEventListener("pointermove", this.h.move);
    removeEventListener("pointerup", this.h.up);
    c.removeEventListener("pointerleave", this.h.leave);
    removeEventListener("keydown", this.h.key);
    removeEventListener("resize", this.h.resize);
    this.tiles.forEach((t) => {
      t.video?.pause();
      t.video?.removeAttribute("src");
      t.mat.dispose();
      t.label.material.map?.dispose();
    });
    this.rt.dispose();
    this.renderer.dispose();
    c.remove();
  }
}
