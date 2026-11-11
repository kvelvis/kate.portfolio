/* ==========================================================
   Fairy Tales — GSAP + ScrollTrigger + Lenis
   ========================================================== */
gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- split text into words / chars ---------- */
function splitText(el) {
  const words = [];
  const chars = [];
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.setAttribute('aria-hidden', 'true');
          [...part].forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'c';
            c.textContent = ch;
            w.append(c);
            chars.push(c);
          });
          words.push(w);
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) {
        walk(n);
      }
    });
  };
  if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
  walk(el);
  return { words, chars };
}

const splits = new Map();
$$('.split, .reveal').forEach((el) => splits.set(el, splitText(el)));

/* ---------- smooth scroll ---------- */
let lenis = null;
if (!reduce && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

$$('[data-scroll]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.8 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
});

/* ---------- starry sky (canvas) ---------- */
(function stars() {
  const cv = $('#stars');
  const ctx = cv.getContext('2d');
  let w, h, dpr, list = [], shooting = null, nextShoot = 3000;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((w * h) / 5500);
    list = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      p: Math.random() * Math.PI * 2,
      s: Math.random() * 0.002 + 0.0006,
      d: Math.random() * 0.4 + 0.1, // parallax depth
    }));
  }
  resize();
  addEventListener('resize', resize);

  let scrollY = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    if (document.hidden || getComputedStyle(root).getPropertyValue('--stars').trim() === '0') return;
    scrollY = window.scrollY;
    ctx.clearRect(0, 0, w, h);
    for (const s of list) {
      const a = reduce ? 0.7 : 0.35 + Math.sin(t * s.s + s.p) * 0.35 + 0.3;
      const y = ((s.y - scrollY * s.d) % h + h) % h;
      ctx.globalAlpha = a;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (reduce) return;
    // shooting star
    if (!shooting && t > nextShoot) {
      shooting = { x: Math.random() * w * 0.7 + w * 0.2, y: Math.random() * h * 0.4, l: 0, life: 0 };
      nextShoot = t + 4000 + Math.random() * 5000;
    }
    if (shooting) {
      shooting.life += 1;
      shooting.x -= 9; shooting.y += 4.5;
      const len = Math.min(shooting.life * 10, 140);
      const g = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x + len, shooting.y - len / 2);
      g.addColorStop(0, 'rgba(255,255,255,.9)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = Math.max(0, 1 - shooting.life / 60);
      ctx.strokeStyle = g; ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(shooting.x, shooting.y);
      ctx.lineTo(shooting.x + len, shooting.y - len / 2);
      ctx.stroke();
      if (shooting.life > 60) shooting = null;
    }
  }
  requestAnimationFrame(frame);
})();

/* ---------- loader ---------- */
function loadImages(imgs) {
  return Promise.all(imgs.map((img) => (img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; }))));
}

const counter = { v: 0 };
const loaderTl = gsap.timeline();
loaderTl
  .to(counter, {
    v: 100, duration: reduce ? 0.2 : 1.6, ease: 'power2.inOut',
    onUpdate: () => { $('.loader__count').textContent = Math.round(counter.v); },
  })
  .to('.loader__shadow', { xPercent: 110, duration: reduce ? 0.2 : 1.6, ease: 'power2.inOut' }, 0);

Promise.all([loadImages($$('.hero img')), loaderTl.then(), document.fonts ? document.fonts.ready : null]).then(() => {
  const out = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove('is-loading');
      $('.loader').remove();
      lenis && lenis.start();
      ScrollTrigger.refresh();
    },
  });
  out
    .to('.loader__moon', { scale: 30, opacity: 0, duration: 1.1, ease: 'power3.in' })
    .to('.loader__text', { opacity: 0, y: -20, duration: 0.4 }, 0)
    .to('.loader', { opacity: 0, duration: 0.5 }, '-=0.3')
    .add(heroIntro(), '-=0.5');
});

/* ---------- hero ---------- */
function heroIntro() {
  const { chars } = splits.get($('.hero__title'));
  const tl = gsap.timeline();
  if (reduce) return tl;
  tl.from('.hero__arch', {
      yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', stagger: 0.12,
    })
    .from('.hero__arch img', { scale: 1.5, duration: 2, ease: 'expo.out', stagger: 0.12 }, 0)
    .from(chars, {
      yPercent: 70, opacity: 0, rotate: () => gsap.utils.random(-25, 25), filter: 'blur(10px)',
      duration: 1.4, ease: 'expo.out', stagger: { each: 0.06, from: 'random' },
    }, 0.25)
    .from('.hero__eyebrow, .hero__year, .hero__scroll, .nav', { opacity: 0, y: 16, duration: 1, stagger: 0.08 }, 0.8);
  return tl;
}

if (!reduce) {
  // mouse parallax on arches
  if (finePointer) {
    const arches = $$('.hero__arch').map((el) => ({
      d: +el.dataset.depth,
      x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
    }));
    $('.hero').addEventListener('mousemove', (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      arches.forEach((a) => { a.x(-nx * a.d); a.y(-ny * a.d); });
    });
  }

  // scroll out
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__arch--l', { yPercent: -45, ease: 'none' }, 0)
    .to('.hero__arch--c', { yPercent: -18, ease: 'none' }, 0)
    .to('.hero__arch--r', { yPercent: -75, ease: 'none' }, 0)
    .to('.hero__title', { yPercent: 35, opacity: 0.1, scale: 0.92, ease: 'none' }, 0);
}

/* ---------- theme: background / ink / accent per section ---------- */
const themed = $$('[data-bg]');
function setTheme(sec) {
  gsap.to(root, {
    '--bg': sec.dataset.bg,
    '--ink': sec.dataset.ink,
    '--accent': sec.dataset.accent,
    '--stars': sec.dataset.stars ?? 1,
    duration: reduce ? 0 : 1.1,
    ease: 'power2.out',
    overwrite: 'auto',
  });
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = sec.dataset.bg;
}
themed.forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 55%',
    end: 'bottom 55%',
    onToggle: (self) => self.isActive && setTheme(sec),
  });
});

/* active nav link */
$$('.chapter[id]').forEach((sec) => {
  const link = $(`.nav__links a[href="#${sec.id}"]`);
  const endEl = sec.id === 'ch4' ? $('.ch-kitty-end') : sec;
  ScrollTrigger.create({
    trigger: sec,
    endTrigger: endEl,
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: (self) => link && link.classList.toggle('is-active', self.isActive),
  });
});

/* nav progress */
gsap.to('.nav__progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

/* ---------- text reveals ---------- */
if (!reduce) {
  $$('.chapter__title, .finale__title').forEach((el) => {
    gsap.from(splits.get(el).chars, {
      yPercent: 60, opacity: 0, rotate: () => gsap.utils.random(-20, 20), filter: 'blur(8px)',
      duration: 1.3, ease: 'expo.out', stagger: { each: 0.035, from: 'random' },
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
  $$('.chapter__head .label').forEach((el) => {
    gsap.from(el, { opacity: 0, letterSpacing: '1em', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  $$('.reveal').forEach((el) => {
    gsap.from(splits.get(el).words, {
      opacity: 0, y: 18, filter: 'blur(6px)',
      duration: 0.9, ease: 'power3.out', stagger: 0.035,
      scrollTrigger: { trigger: el, start: 'top 82%' },
    });
  });
}

/* ---------- marquee ---------- */
if (!reduce) {
  const mq = gsap.to('.marquee__inner', { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
  let dir = 1;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      dir = self.direction;
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5);
      gsap.timeline({ overwrite: true })
        .to(mq, { timeScale: dir * boost, duration: 0.2 })
        .to(mq, { timeScale: dir, duration: 1.2, ease: 'power2.out' });
    },
  });
}

/* ---------- contents: floating preview ---------- */
if (finePointer && !reduce) {
  const pv = $('.toc__preview');
  const pvImg = $('img', pv);
  const px = gsap.quickTo(pv, 'x', { duration: 0.6, ease: 'power3' });
  const py = gsap.quickTo(pv, 'y', { duration: 0.6, ease: 'power3' });
  const pr = gsap.quickTo(pv, 'rotate', { duration: 0.8, ease: 'power3' });
  let lastX = 0;
  $('.toc').addEventListener('mousemove', (e) => {
    px(e.clientX); py(e.clientY);
    pr(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  });
  $$('.toc a').forEach((a) => {
    a.addEventListener('mouseenter', () => {
      pvImg.src = a.dataset.img;
      gsap.to(pv, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
      gsap.fromTo(pvImg, { scale: 1.3 }, { scale: 1, duration: 0.8, ease: 'power3.out' });
    });
  });
  $('.toc').addEventListener('mouseleave', () => gsap.to(pv, { opacity: 0, scale: 0.6, duration: 0.4 }));
}

/* ---------- Chapter I: sticky story ---------- */
(function story() {
  const frames = $$('.story__frame img');
  const current = $('.story__current');
  let active = 0;
  function show(i) {
    if (i === active) return;
    active = i;
    current.textContent = String(i + 1).padStart(2, '0');
    frames.forEach((img, j) => {
      const on = j <= i;
      gsap.to(img, {
        clipPath: on ? 'circle(150% at 50% 75%)' : 'circle(0% at 50% 75%)',
        duration: reduce ? 0 : 1.3,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
      if (on && j === i && !reduce) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power3.out' });
    });
  }
  $$('.step').forEach((step, i) => {
    ScrollTrigger.create({
      trigger: $('.step__card', step),
      start: 'top 75%',
      end: 'bottom 25%',
      onToggle: (self) => self.isActive && show(i),
    });
  });
})();

/* ---------- responsive motion ---------- */
const mm = gsap.matchMedia();

/* Chapter II: horizontal scroll on tablet / desktop */
mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
  const wrap = $('.hscroll');
  const track = $('.hscroll__track');
  wrap.classList.add('is-pinned');
  const distance = () => track.scrollWidth - innerWidth;

  const move = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: wrap,
      start: 'top top',
      end: () => '+=' + distance(),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // clip-path reveal inside the horizontal track (homage to the old version)
  $$('.panel', track).forEach((panel) => {
    const fig = $('.panel__img', panel);
    const img = $('img', panel);
    gsap.timeline({
      scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left 100%', end: 'center 55%', scrub: true },
    })
      .fromTo(fig, { clipPath: 'inset(22% 22% 22% 22% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', ease: 'none' }, 0)
      .fromTo(img, { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
      .from($('.panel__cap', panel), { opacity: 0, x: 60, ease: 'none' }, 0.4);
  });

  return () => wrap.classList.remove('is-pinned');
});

/* parallax for collage / duo images (all sizes) */
mm.add('(prefers-reduced-motion: no-preference)', () => {
  $$('[data-speed]').forEach((el) => {
    const s = parseFloat(el.dataset.speed) || 0;
    gsap.fromTo(el, { yPercent: s * 12 }, {
      yPercent: -s * 12, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    const img = $('img', el);
    if (img) {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  });

  // sparkles float + twinkle
  $$('.sparkle').forEach((sp, i) => {
    gsap.to(sp, { y: -24, rotate: 90, opacity: 0.35, duration: 2.4 + i * 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  });

  // Portal: tiny circle opens into the whole screen
  const ptl = gsap.timeline({
    scrollTrigger: { trigger: '.portal', start: 'top top', end: '+=160%', pin: true, scrub: 1 },
  });
  ptl
    .fromTo('.portal__mask', { clipPath: 'circle(16% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', ease: 'power1.inOut', duration: 1 })
    .fromTo('.portal__mask img', { scale: 1.6 }, { scale: 1, ease: 'power1.inOut', duration: 1 }, 0)
    .to('.portal__ring', { scale: 2.4, opacity: 0, rotate: 60, ease: 'power1.in', duration: 0.7 }, 0)
    .from(splits.get($('.portal__text')).chars, {
      opacity: 0, yPercent: 60, filter: 'blur(10px)', stagger: { each: 0.02, from: 'random' }, duration: 0.4,
    }, 0.55);

  // ring spins slowly while waiting
  gsap.to('.portal__ring', { rotation: '+=360', duration: 40, repeat: -1, ease: 'none' });
  gsap.to('.finale__seal svg', { rotation: 360, duration: 24, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
});

/* ---------- cursor + sparkle trail ---------- */
if (finePointer && !reduce) {
  const cur = $('.cursor');
  const cx = gsap.quickTo(cur, 'x', { duration: 0.25, ease: 'power3' });
  const cy = gsap.quickTo(cur, 'y', { duration: 0.25, ease: 'power3' });
  let last = 0;
  const glyphs = ['✦', '✧', '·', '⋆'];
  addEventListener('mousemove', (e) => {
    gsap.set(cur, { opacity: 1 });
    cx(e.clientX); cy(e.clientY);
    const now = performance.now();
    if (now - last < 45) return;
    last = now;
    const sp = document.createElement('span');
    sp.className = 'spark';
    sp.textContent = glyphs[(Math.random() * glyphs.length) | 0];
    document.body.append(sp);
    gsap.set(sp, { x: e.clientX, y: e.clientY, scale: gsap.utils.random(0.6, 1.4) });
    gsap.to(sp, {
      x: `+=${gsap.utils.random(-30, 30)}`, y: `+=${gsap.utils.random(10, 50)}`,
      rotate: gsap.utils.random(-180, 180), opacity: 0, duration: gsap.utils.random(0.8, 1.4),
      ease: 'power2.out', onComplete: () => sp.remove(),
    });
  });
  $$('a, .hero__arch, .duo__img, .collage__img').forEach((el) => {
    el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
  });
}

/* keep trigger order correct with several pins */
ScrollTrigger.sort();
addEventListener('load', () => ScrollTrigger.refresh());
