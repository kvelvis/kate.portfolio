import * as THREE from "three";
import { gsap } from "gsap";
import { isTouch, reducedMotion, dpr, loadImage, lerp, clamp } from "./media";
import { loadGif } from "./gif";

/*
  Project sphere.
  Planes sit on a Fibonacci sphere and always face the camera. Drag / wheel spin it with inertia,
  click opens a project: its plane slides to the right half, the text panel fades in on the left.
  First visit plays an intro: counter → circle of ten → collapse → explode into the sphere.
*/

const DEG = Math.PI / 180;
const CAM_Z = 12;
const raw = (hex) => new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace);
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export class SphereGallery {
  constructor({ host, items, ui, onZoom }) {
    this.host = host;
    this.ui = ui;
    this.onZoom = onZoom;
    this.reduced = reducedMotion();
    this.touch = isTouch();

    const r = (this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !this.touch }));
    r.outputColorSpace = THREE.LinearSRGBColorSpace; // textures and colours pass through untouched
    r.setPixelRatio(dpr());
    r.setClearColor(0x000000, 0);
    host.appendChild(r.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    this.camera.position.z = CAM_Z;

    // spin state
    this.q = new THREE.Quaternion();
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.sm = { x: 0, y: 0 };
    this.touched = this.reduced;
    this.tilt = new THREE.Vector3(Math.sin(23 * DEG), Math.cos(23 * DEG), 0).normalize();

    // intro / zoom state
    this.phase = "intro";
    this.circle = { rot: 0, speed: 1, collapse: 0 };
    this.ex = 0; // zoom 0→1
    this.ovf = 0; // overview band 0→1
    this.zoomed = null;
    this.overview = false;
    this.hovered = null;

    this.planes = items.map((item, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: raw(0x1b1b1d),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      mesh.visible = false;
      this.scene.add(mesh);
      const N = items.length;
      const y = i * (2 / N) - 1 + 1 / N;
      const rr = Math.sqrt(1 - y * y);
      const a = Math.PI * (3 - Math.sqrt(5)) * i;
      return {
        i,
        item,
        mesh,
        base: new THREE.Vector3(Math.cos(a) * rr, y, Math.sin(a) * rr),
        world: new THREE.Vector3(),
        aspect: 16 / 9,
        ready: false,
        video: null,
        playing: false,
        // intro values (px)
        ix: 0,
        iy: 0,
        iz: 0,
        is: 0.01,
        io: 0,
        // explode
        e: 0,
        from: new THREE.Vector3(),
        fromS: 0,
        fromO: 0,
      };
    });
    this.meshes = this.planes.map((p) => p.mesh);

    this.ray = new THREE.Raycaster();
    this.ndc = new THREE.Vector2(9, 9);
    this.mouse = { x: -1, y: -1, in: false };
    this.needsRay = false;
    this._tmp = new THREE.Vector3();
    this._qa = new THREE.Quaternion();
    this._qb = new THREE.Quaternion();

    this.bind();
    this.resize();
    // start states live here, not in CSS: GSAP would read a CSS translate(%) as px and keep it
    gsap.set(ui.sides, { yPercent: 100 });
    gsap.set(ui.counterInner, { yPercent: 100 });
    gsap.set(ui.captionInner, { yPercent: 110 });
    this.cursorX = gsap.quickTo(ui.cursor, "x", { duration: 0.5, ease: "power3.out" });
    this.cursorY = gsap.quickTo(ui.cursor, "y", { duration: 0.5, ease: "power3.out" });
    this.videoTimer = setInterval(() => this.manageVideos(), 300);
    // stills load as soon as the sphere is built (a screen before it shows), GIFs once the intro plays
    this.whenPlayed = new Promise((r) => (this._playedResolve = r));
    this.loadMedia();
  }

  /** Runs the intro once — called when the section first scrolls into view. */
  play() {
    if (this.played) return;
    this.played = true;
    this._playedResolve();
    if (this.reduced) this.skipIntro();
    else this.runIntro();
  }

  /* ---------------- layout ---------------- */
  resize() {
    const w = (this.W = this.host.clientWidth || innerWidth);
    const h = (this.H = this.host.clientHeight || innerHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.unit = (2 * CAM_Z * Math.tan(30 * DEG)) / h;
    const mid = w > 1024 && w <= 1440;
    this.phone = w <= 640;
    this.planePx = this.phone ? 72 : 104 * (mid ? 0.8 : 1);
    this.R = this.phone ? w / 2 - 24 - this.planePx / 2 : 250 * (mid ? 0.8 : 1);
    this.centerPx = (this.planePx * 120) / 82;
  }

  /* ---------------- input ---------------- */
  bind() {
    const c = this.renderer.domElement;
    this.h = {
      down: (e) => {
        const touch = e.pointerType !== "mouse";
        this.drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, path: 0, touch };
        this.touched = true;
        // a tap has no pointermove before it, so the pointer position is set here too
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.in = true;
        // touch keeps vertical panning for the page (touch-action: pan-y), so no capture there
        if (!touch) c.setPointerCapture?.(e.pointerId);
        this.setCursor();
      },
      cancel: () => {
        this.drag = null;
        this.setCursor();
      },
      move: (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.in = true;
        this.overUi = e.target !== this.renderer.domElement;
        this.needsRay = true;
        this.cursorX(e.clientX + 14);
        this.cursorY(e.clientY + 14);
        const d = this.drag;
        if (!d) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        d.path += Math.hypot(dx, dy);
        d.x = e.clientX;
        d.y = e.clientY;
        if (!this.zoomed && this.phase === "sphere") {
          this.vel.x += dx * 0.001;
          if (!d.touch) this.vel.y += dy * 0.001;
        }
      },
      up: (e) => {
        const d = this.drag;
        this.drag = null;
        this.setCursor();
        if (!d) return;
        const moved = Math.hypot(e.clientX - d.sx, e.clientY - d.sy);
        if (moved < 6 && d.path < 10) {
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;
          this.mouse.in = true;
          this.click(this.pick());
        }
      },
      leave: () => {
        this.mouse.in = false;
        this.needsRay = true;
      },
      key: (e) => {
        if (e.key === "Escape" && this.zoomed && this.running) this.collapse();
      },
      resize: () => this.resize(),
    };
    c.addEventListener("pointerdown", this.h.down);
    addEventListener("pointermove", this.h.move);
    addEventListener("pointerup", this.h.up);
    c.addEventListener("pointerleave", this.h.leave);
    c.addEventListener("pointercancel", this.h.cancel);
    addEventListener("keydown", this.h.key);
    addEventListener("resize", this.h.resize);
  }

  pick() {
    if (!this.mouse.in) return null;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.ndc.set(((this.mouse.x - rect.left) / rect.width) * 2 - 1, -((this.mouse.y - rect.top) / rect.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    const hits = this.ray.intersectObjects(this.meshes.filter((m) => m.visible && m.material.opacity > 0.2));
    if (!hits.length) return null;
    // zoomed plane always wins
    const z = this.zoomed && hits.find((h) => h.object === this.zoomed.mesh);
    return this.planes.find((p) => p.mesh === (z || hits[0]).object) || null;
  }

  setCursor() {
    const c = this.renderer.domElement;
    if (this.drag && !this.zoomed) return (c.style.cursor = "grabbing");
    if (this.hovered) return (c.style.cursor = "pointer");
    const dx = this.mouse.x - this.W / 2;
    const dy = this.mouse.y - this.H / 2;
    c.style.cursor = this.phase === "sphere" && !this.zoomed && Math.hypot(dx, dy) < 250 ? "grab" : "default";
  }

  click(p) {
    if (this.phase !== "sphere") return;
    // one click opens the project (media right, text left); any click on the canvas closes it
    if (!this.zoomed) {
      if (p) {
        this.zoom(p);
        this.openOverview();
      }
      return;
    }
    this.collapse();
  }

  /* ---------------- zoom / overview ---------------- */
  /** Opens project i (used by the project list). Waits for the intro if it is still running. */
  open(i) {
    const p = this.planes[i];
    if (!p) return;
    if (this.phase !== "sphere") {
      this._pendingOpen = i;
      if (!this.played) this.play();
      return;
    }
    if (this.zoomed === p) return;
    if (this.zoomed) this.collapse();
    this.zoom(p);
    this.openOverview();
  }

  zoom(p) {
    this.zoomed = p;
    p.mesh.renderOrder = 10;
    this.ensureVideo(p);
    // the opened project always plays from its first frame
    if (p.video?.restart) p.video.restart();
    else if (p.video) p.video.currentTime = 0;
    gsap.to(this, { ex: 1, duration: 0.8, ease: "power4.out", overwrite: true });
    this.onZoom?.(p.item);
    this.caption(null);
    gsap.to(this.ui.sides, { opacity: 0, duration: 0.3, overwrite: "auto" });
    this.manageVideos();
  }

  collapse() {
    if (!this.zoomed) return;
    if (this.overview) this.closeOverview();
    const p = this.zoomed;
    this.onZoom?.(null);
    this.label(null);
    gsap.to(this.ui.sides, { opacity: 1, duration: 0.6, delay: 0.3, overwrite: "auto" });
    gsap.to(this, {
      ex: 0,
      duration: 0.8,
      ease: "power4.out",
      overwrite: true,
      onComplete: () => {
        p.mesh.renderOrder = 0;
        if (this.zoomed === p) this.zoomed = null;
        this.manageVideos();
      },
    });
    this.zoomed = null;
    this._collapsing = p;
  }

  openOverview() {
    this.overview = true;
    gsap.to(this, { ovf: 1, duration: 0.8, ease: "power4.out" });
    gsap.fromTo(this.ui.overview, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out", delay: 0.2 });
  }

  closeOverview() {
    this.overview = false;
    gsap.to(this, { ovf: 0, duration: 0.8, ease: "power4.out" });
    gsap.to(this.ui.overview, { y: 16, autoAlpha: 0, duration: 0.35, ease: "power2.in" });
  }

  /* ---------------- caption + cursor label ---------------- */
  caption(item) {
    if (this._cap === item) return;
    this._cap = item;
    const { captionInner } = this.ui;
    gsap.killTweensOf(captionInner);
    gsap.to(captionInner, {
      yPercent: -110,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        if (!item) return;
        this.ui.setCaption(item);
        gsap.fromTo(captionInner, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" });
      },
    });
  }

  label(text) {
    const el = this.ui.cursor;
    if (this.touch) text = null;
    if (this._label === text) return;
    this._label = text;
    if (text) {
      el.textContent = text;
      gsap.to(el, { scale: 1, opacity: 1, duration: 0.6, ease: "power4.out", overwrite: "auto" });
    } else gsap.to(el, { scale: 0.6, opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  }

  setLang(t) {
    this.t = t;
    if (this._label) this.ui.cursor.textContent = t.close;
  }

  /* ---------------- media ---------------- */
  loadMedia() {
    if (this.firstReady) return;
    let first = 0;
    const firstN = Math.min(10, this.planes.length);
    let resolveFirst;
    this.firstReady = new Promise((r) => (resolveFirst = r));
    this.planes.forEach((p) => {
      const done = (tex, w, h) => {
        if (tex) {
          p.mesh.material.map = tex;
          p.mesh.material.color = raw(0xffffff);
          p.mesh.material.needsUpdate = true;
          if (w && h) p.aspect = w / h;
        }
        p.ready = true;
        if (p.i < firstN) {
          first++;
          this._frac = first / firstN;
          this.onProgress?.(this._frac);
          if (first === firstN) resolveFirst();
        }
      };
      if (p.item.gif) {
        // still first (so the intro isn't held up by a multi-MB download), then the GIF on desktop
        const still = p.item.image ? loadImage(p.item.image) : Promise.resolve(null);
        still.then((t) => {
          if (t) done(t, t.image?.width, t.image?.height);
          if (!t) this.ensureVideo(p, done);
          else if (!this.touch) this.whenPlayed.then(() => this.ensureVideo(p));
        });
      } else {
        loadImage(p.item.image).then((t) => done(t, t?.image?.width, t?.image?.height));
      }
    });
  }

  /** Loads the plane's GIF player (p.video: same play/pause shape as a <video>). */
  ensureVideo(p, done) {
    if (p.video || p._gifLoading || !p.item.gif) return;
    p._gifLoading = true;
    loadGif(p.item.gif).then((g) => {
      if (this.destroyed) return g?.destroy();
      if (!g) return done?.(null);
      p.video = g;
      if (done) done(g.texture, g.videoWidth, g.videoHeight);
      else {
        p.mesh.material.map?.dispose();
        p.mesh.material.map = g.texture;
        p.mesh.material.color = raw(0xffffff);
        p.mesh.material.needsUpdate = true;
        p.aspect = g.videoWidth / g.videoHeight;
      }
      this.manageVideos();
    });
  }

  manageVideos() {
    for (const p of this.planes) {
      if (!p.video || !p.ready) continue;
      let want;
      if (!this.running) want = false;
      else if (this.zoomed || this._collapsing) want = p === (this.zoomed || this._collapsing);
      else if (this.phase !== "sphere") want = p.mesh.visible;
      else {
        const dir = p.world.z / (p.world.length() || 1);
        want = p.playing ? dir > -0.25 : dir > -0.1;
      }
      if (want && !p.playing) {
        p.playing = true;
        p.video.play().catch(() => (p.playing = false));
      } else if (!want && p.playing) {
        p.playing = false;
        p.video.pause();
      }
    }
    if (this._collapsing && this.ex === 0) this._collapsing = null;
  }

  /* ---------------- intro ---------------- */
  async runIntro() {
    const { ui } = this;
    const count = { v: 1 };
    const paint = () => (ui.counterNum.textContent = String(Math.round(count.v)).padStart(3, "0"));
    paint();
    gsap.fromTo(ui.wordmark, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.2 });
    gsap.fromTo(ui.sides, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: 0.5 });
    gsap.fromTo(ui.counterInner, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: "power4.out", delay: 0.5 });
    this.onProgress = (f) =>
      gsap.to(count, { v: Math.min(99, Math.max(1, Math.round(f * 100))), duration: 0.5, ease: "power1.out", onUpdate: paint });

    if (this._frac) this.onProgress(this._frac); // stills were preloaded before the section showed
    await wait(200);
    this.loadMedia();
    await Promise.all([wait(1200), Promise.race([this.firstReady, wait(30000)])]);
    if (this.destroyed) return;

    gsap.to(count, { v: 100, duration: 0.45, ease: "power1.out", onUpdate: paint });
    gsap.to(ui.counterInner, { yPercent: -110, duration: 0.6, ease: "power3.in", delay: 0.5 });

    const ring = this.planes.slice(0, 10);
    const tl = gsap.timeline({ delay: 0.3 });
    ring.forEach((p, i) => {
      p.mesh.visible = true;
      tl.fromTo(p, { io: 0 }, { io: 1, duration: 1, ease: "power3.out" }, i * 0.1);
      tl.fromTo(p, { is: 0.01 }, { is: 70, duration: 1, ease: "back.out(1.7)" }, i * 0.1);
    });
    tl.to(this.circle, { speed: 7.3, duration: 1, ease: "power2.in" }, 1.3);
    tl.addLabel("collapse", 1.3 + 1 + 0.8);
    tl.to(ui.wordmark, { opacity: 0, duration: 0.75, ease: "power2.inOut" }, "collapse");
    tl.to(ui.sides, { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.05 }, "collapse");
    ring.forEach((p, i) => {
      p.c = 0;
      tl.to(p, { c: 1, is: this.centerPx, duration: 1.25, ease: "power2.inOut" }, `collapse+=${i * 0.05}`);
    });
    tl.call(() => this.explode(), null, `collapse+=${1.25 + 0.45 + 0.2}`);
  }

  skipIntro() {
    this.loadMedia();
    gsap.set(this.ui.counterInner, { yPercent: 110 });
    gsap.set(this.ui.wordmark, { opacity: 0 });
    this.phase = "sphere";
    this.planes.forEach((p) => {
      p.e = 1;
      p.fromO = 1;
      p.mesh.visible = true;
    });
    gsap.set(this.ui.sides, { yPercent: 0 });
    this.onIntroDone?.();
  }

  explode() {
    this.phase = "sphere";
    this.planes.forEach((p, i) => {
      if (i < 10 && p.mesh.visible) {
        p.from.copy(p.mesh.position);
        p.fromS = p.is;
        p.fromO = p.io;
      } else {
        p.from.set(0, 0, 0);
        p.fromS = this.planePx * 0.2;
        p.fromO = 0;
        p.mesh.visible = true;
      }
      p.e = 0;
      gsap.to(p, { e: 1, duration: 1, ease: "power3.out", delay: i < 10 ? 0 : 0.04 * (i - 10) });
    });
    gsap.fromTo(this.ui.sides, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: 0.3 });
    gsap.delayedCall(1 + 0.04 * Math.max(0, this.planes.length - 10), () => {
      this.onIntroDone?.();
      if (this._pendingOpen != null) {
        const i = this._pendingOpen;
        this._pendingOpen = null;
        this.open(i);
      }
    });
  }

  /* ---------------- frame ---------------- */
  frame(dt) {
    const s = this.unit;
    const f = Math.min(dt * 60, 3);

    // spin
    if (this.phase === "sphere") {
      this.vel.x *= Math.pow(0.94, f);
      this.vel.y *= Math.pow(0.94, f);
      this.acc.x += this.vel.x * f;
      this.acc.y += this.vel.y * f;
      const k = 1 - Math.pow(1 - 0.11, f);
      const nx = lerp(this.sm.x, this.acc.x, k);
      const ny = lerp(this.sm.y, this.acc.y, k);
      this._qa.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, nx - this.sm.x);
      this._qb.setFromAxisAngle(new THREE.Vector3(1, 0, 0), ny - this.sm.y);
      this.q.premultiply(this._qa).premultiply(this._qb);
      this.sm.x = nx;
      this.sm.y = ny;
      if (!this.touched) this.q.premultiply(this._qa.setFromAxisAngle(this.tilt, 0.001 * f));
      this.q.normalize();
    } else {
      this.circle.rot += 0.5 * DEG * this.circle.speed * f;
    }

    // zoom geometry (px)
    // wide screens: media in the right half, text panel on the left.
    // narrow screens: media at the top under the header, the text panel fills the rest (see --media-b).
    const split = this.W > 900;
    const z = this.zoomed || this._collapsing;
    let zw = 0;
    let zh = 0;
    let zx = 0;
    let zy = 0;
    if (z && split) {
      zh = 0.66 * this.H;
      zw = zh * z.aspect;
      // text panel takes the left ~56%, the media the right ~44%
      const maxW = this.W * 0.44 - 64;
      if (zw > maxW) {
        zw = maxW;
        zh = zw / z.aspect;
      }
      zx = (this.W * 0.28 - 16) * this.ovf;
    } else if (z) {
      const top = 72; // under the fixed header
      zw = this.W - (this.phone ? 32 : 48);
      zh = zw / z.aspect;
      const maxH = this.H * 0.36;
      if (zh > maxH) {
        zh = maxH;
        zw = zh * z.aspect;
      }
      zy = (this.H / 2 - top - zh / 2) * this.ovf;
      const b = Math.round(top + zh);
      if (b !== this._mediaB) {
        this._mediaB = b;
        this.ui.overview?.style.setProperty("--media-b", b + "px");
      }
    }

    // "visit the site" button pinned under the zoomed media, right-aligned (wide screens)
    const go = this.ui.go;
    if (go) {
      const k = z && split ? this.ex * this.ovf : 0;
      if (k > 0.01) {
        const x = this.W / 2 + zx + zw / 2;
        const y = this.H / 2 - zy + zh / 2 + 20;
        go.style.transform = `translate(${x}px, ${y + 12 * (1 - k)}px) translateX(-100%)`;
        go.style.opacity = k;
        go.style.visibility = "visible";
        go.style.pointerEvents = k > 0.6 ? "auto" : "none";
      } else if (go.style.visibility !== "hidden") {
        go.style.visibility = "hidden";
        go.style.pointerEvents = "none";
      }
    }

    const R = this.R * s;
    const circR = 240 * (this.phone ? 0.75 : 1);
    for (const p of this.planes) {
      const m = p.mesh;
      if (!m.visible) continue;
      p.world.copy(p.base).multiplyScalar(R).applyQuaternion(this.q);
      let size;
      let op;
      if (this.phase === "intro") {
        const a = -90 * DEG + p.i * 36 * DEG + this.circle.rot;
        const cx = Math.cos(a) * circR;
        const cy = Math.sin(a) * circR;
        const c = p.c || 0;
        m.position.set(lerp(cx, 0, c) * s, lerp(cy, 0, c) * s, p.i * 1.5 * c * s);
        size = p.is;
        op = p.io;
      } else {
        const e = p.e;
        const over = 1 + 0.1 * Math.sin(Math.PI * e);
        this._tmp.copy(p.world).multiplyScalar(over);
        m.position.copy(p.from).lerp(this._tmp, e);
        size = lerp(p.fromS, this.planePx, e);
        const depth = 0.4 + 0.6 * smooth(-1, 0.6, p.world.z / (R || 1));
        op = lerp(p.fromO, depth, e);
      }

      let w = p.aspect >= 1 ? size : size * p.aspect;
      let h = p.aspect >= 1 ? size / p.aspect : size;
      if (z && this.ex > 0) {
        if (p === z) {
          m.position.lerp(this._tmp.set(zx * s, zy * s, 0.5), this.ex);
          w = lerp(w, zw, this.ex);
          h = lerp(h, zh, this.ex);
          op = lerp(op, 1, this.ex);
        } else {
          m.position.multiplyScalar(lerp(1, 1.8, this.ex));
          op *= lerp(1, 0.1 - 0.08 * this.ovf, this.ex);
        }
      }
      m.scale.set(Math.max(w, 0.01) * s, Math.max(h, 0.01) * s, 1);
      m.material.opacity = op;
    }

    // hover
    if (this.needsRay) {
      this.needsRay = false;
      const p = this.phase === "sphere" && !this.drag ? this.pick() : null;
      this.hovered = p;
      if (!this.zoomed) this.caption(p ? p.item : null);
      if (this.zoomed && !this.overUi) this.label(this.t?.close);
      else this.label(null);
      this.setCursor();
    }

    this.renderer.render(this.scene, this.camera);
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
    this.manageVideos();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.manageVideos();
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    clearInterval(this.videoTimer);
    const c = this.renderer.domElement;
    c.removeEventListener("pointerdown", this.h.down);
    removeEventListener("pointermove", this.h.move);
    removeEventListener("pointerup", this.h.up);
    c.removeEventListener("pointerleave", this.h.leave);
    c.removeEventListener("pointercancel", this.h.cancel);
    removeEventListener("keydown", this.h.key);
    removeEventListener("resize", this.h.resize);
    this.planes.forEach((p) => {
      p.video?.destroy();
      p.mesh.material.map?.dispose();
      p.mesh.material.dispose();
      p.mesh.geometry.dispose();
    });
    gsap.killTweensOf(this);
    this.renderer.dispose();
    c.remove();
  }
}
