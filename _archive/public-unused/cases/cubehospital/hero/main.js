/**
 * CUBE hero — entry point.
 *
 * Scroll → one GSAP timeline (scrub 1.5) → `state.progress` → shader uniform.
 * Lenis provides the smooth scroll and drives ScrollTrigger; GSAP's ticker is
 * the single rAF loop for Lenis, the timeline and the WebGL render.
 *
 * Timeline map (timeline time == scroll fraction of the 400vh pin)
 *   0.00–0.10  intro copy visible, cube at rest
 *   0.08–0.92  morph 0 → 1 (eased in/out so it starts and lands softly)
 *   0.14–0.40  stage 01 · The Block     (shards break away)
 *   0.42–0.68  stage 02 · Balance       (rounded → organic)
 *   0.74–1.00  stage 03 · Harmony + CTA (dust settles around the form)
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.getElementById('hero');
const canvas = hero.querySelector('.hero__canvas');
const stages = [...hero.querySelectorAll('.stage')];
const ticks = [...hero.querySelectorAll('.hero__progress li')];
const bar = hero.querySelector('.hero__bar i');
document.getElementById('year').textContent = new Date().getFullYear();

/* ────────────────────────────── Smooth scroll ────────────────────────────── */
let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

}
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Shared smooth-scroll helper (also used by the inline page script, e.g. the
 * "이 시술 상담 예약" buttons). Keeps targets clear of the fixed header.
 * @param {Element} el
 * @param {{center?: boolean}} [opts] center the element in the viewport
 */
window.cubeScrollTo = (el, { center = false } = {}) => {
  const hdr = document.getElementById('header')?.offsetHeight ?? 0;
  const offset = center
    ? -Math.max(hdr, (innerHeight - el.getBoundingClientRect().height) / 2)
    : -hdr;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.6 });
  else {
    const y = el.getBoundingClientRect().top + scrollY + offset;
    scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
  }
};

// In-page anchors glide through the helper instead of jumping
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? document.body : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (id === '#top') lenis ? lenis.scrollTo(0, { duration: 1.6 }) : scrollTo({ top: 0 });
    else window.cubeScrollTo(target);
    history.replaceState(null, '', id);
  }));

const state = { progress: 0 };

/* ──────────────────────────────── Timeline ─────────────────────────────────
   Built BEFORE the 3D scene loads, so the pin/layout is final immediately and
   the page never jumps when three.js arrives (or if it never does).         */
// Soft reveal: opacity + 20px rise + slight blur. Reduced motion → crossfade only.
const IN = reducedMotion
  ? { from: { autoAlpha: 0 }, to: { autoAlpha: 1 } }
  : { from: { autoAlpha: 0, y: 20, filter: 'blur(8px)' }, to: { autoAlpha: 1, y: 0, filter: 'blur(0px)' } };
const OUT = reducedMotion
  ? { autoAlpha: 0 }
  : { autoAlpha: 0, y: -20, filter: 'blur(8px)' };

const tl = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: hero,
    start: 'top top',
    end: '+=400%',
    pin: true,
    scrub: reducedMotion ? true : 1.5,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  },
});

// The morph itself. power1.inOut = it eases out of the cube and lands gently.
tl.to(state, { progress: 1, duration: 0.84, ease: 'power1.inOut' }, 0.08);

// Copy — in/out pairs. Intro starts visible (set in CSS) and only fades out.
const reveal = (el, at, dur = 0.06) => tl.fromTo(el, IN.from, { ...IN.to, duration: dur, ease: 'power2.out' }, at);
const hide = (el, at, dur = 0.05) => tl.to(el, { ...OUT, duration: dur, ease: 'power2.in' }, at);

// GSAP can't interpolate from `filter: none`, so give the intro an explicit start value
if (!reducedMotion) gsap.set(stages[0], { filter: 'blur(0px)' });
hide(stages[0], 0.05);
reveal(stages[1], 0.14); hide(stages[1], 0.35);
reveal(stages[2], 0.42); hide(stages[2], 0.63);
reveal(stages[3], 0.74, 0.08);

// Giant 01/02/03 numerals drift upward slightly slower than the copy (parallax)
if (!reducedMotion) {
  const WINDOWS = [[0.12, 0.42], [0.40, 0.70], [0.72, 1.0]];
  hero.querySelectorAll('.stage__num').forEach((num, i) => {
    const [a, b] = WINDOWS[i];
    tl.fromTo(num, { yPercent: 22 }, { yPercent: -22, duration: b - a, ease: 'none' }, a);
  });
}
tl.set({}, {}, 1); // pad the timeline to exactly 1 so time == scroll fraction

// Web fonts change text metrics → re-measure once they're in
document.fonts?.ready.then(() => ScrollTrigger.refresh());

// Right-edge indicator follows the (smoothed) timeline, not raw scroll
const STAGE_AT = [0.14, 0.42, 0.74];
tl.eventCallback('onUpdate', () => {
  const t = tl.time();
  bar && (bar.style.transform = `scaleY(${t})`);
  ticks.forEach((li, i) => li.classList.toggle('is-on', t >= STAGE_AT[i] && t < (STAGE_AT[i + 1] ?? 2)));
});

/* ──────────────────────────────── WebGL scene ────────────────────────────── */
let scene = null;
// Probe first: creating a renderer without WebGL makes three.js log errors.
const hasWebGL = (() => {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
})();
try {
  if (!hasWebGL) throw new Error('WebGL2 not supported');
  // Loaded lazily so a WebGL/CDN failure never blocks the copy or the scroll.
  const { createScene } = await import('./scene.js');
  scene = createScene(canvas, { reducedMotion });
} catch (err) {
  console.info('[cube-hero] 3D unavailable, showing fallback:', err.message);
  document.documentElement.classList.add('no-webgl');
}

/* ──────────────────────────────── Render loop ────────────────────────────── */
if (scene) {
  // Render only while the hero is on screen
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);

  let last = performance.now() / 1000;
  gsap.ticker.add(() => {
    const now = performance.now() / 1000;
    const dt = Math.min(now - last, 0.1);
    last = now;
    if (visible) scene.update(state.progress, now, dt);
  });

  // Debounced resize → re-frame camera (ScrollTrigger handles its own refresh)
  let rz;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => scene.resize(), 120);
  });

  // Free GPU memory on bfcache/navigation away
  window.addEventListener('pagehide', (e) => { if (!e.persisted) scene.dispose(); });
}

/* Debug helper: window.__cube.seek(0.5) jumps to a stage without scrolling. */
window.__cube = {
  state,
  tl,
  seek(p) {
    const st = tl.scrollTrigger;
    const y = st.start + (st.end - st.start) * p;
    lenis ? lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
  },
};

// index.html?p=0.5 opens directly at that point of the story (handy for review)
const qp = parseFloat(new URLSearchParams(location.search).get('p'));
if (!Number.isNaN(qp)) {
  requestAnimationFrame(() => {
    window.__cube.seek(qp);
    tl.progress(qp); // skip the scrub catch-up
  });
}
