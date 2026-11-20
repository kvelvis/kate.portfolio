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
  // Speed limit: the scroll target may never run more than MAX_AHEAD px ahead of
  // what is actually on screen, so a hard flick can't skip past the animations.
  const MAX_AHEAD = () => Math.min(innerHeight * 0.4, 360);
  lenis = new Lenis({
    lerp: 0.07,
    wheelMultiplier: 0.8,
    smoothWheel: true,
    virtualScroll: (d) => {
      if (!lenis || d.event.ctrlKey) return true;
      const ahead = lenis.targetScroll - lenis.animatedScroll;
      const max = MAX_AHEAD();
      let dy = d.deltaY;
      if (dy > 0) dy = Math.min(dy, Math.max(0, max - ahead));
      else if (dy < 0) dy = Math.max(dy, Math.min(0, -max - ahead));
      if (dy === 0 && d.deltaY !== 0) {
        d.event.cancelable && d.event.preventDefault(); // swallow, don't let native scroll take over
        return false;
      }
      d.deltaY = dy;
      return true;
    },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  // Lenis must not move the page while ScrollTrigger measures pinned sections
  // (e.g. a resize mid-glide), otherwise a pin is measured from the wrong spot.
  let lenisWasRunning = false;
  ScrollTrigger.addEventListener('refreshInit', () => {
    lenisWasRunning = !lenis.isStopped;
    lenis.stop();
  });
  ScrollTrigger.addEventListener('refresh', () => { if (lenisWasRunning) lenis.start(); });
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

/* ---------- loader: the story begins ---------- */
/* No numbers, no bar: a page turns and "옛날 옛적에…" is written letter by letter. */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function loadImages(imgs) {
  return Promise.all(imgs.map((img) => (img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; }))));
}

const loaderChars = splitText($('.loader__text')).chars;
gsap.set(loaderChars, { opacity: 0, y: 6, filter: 'blur(4px)' });

// wait (briefly) for the title face so the letters don't swap font mid-fade
const titleFont = document.fonts
  ? Promise.race([document.fonts.load('26px "Song Myung"', '옛날'), wait(900)])
  : Promise.resolve();

const loaderWritten = titleFont.then(() => gsap.to(loaderChars, {
  opacity: 1, y: 0, filter: 'blur(0px)',
  duration: reduce ? 0 : 1.1, ease: 'sine.inOut', stagger: reduce ? 0 : 0.16,
}).then());

Promise.all([
  loadImages($$('.hero img')),
  loaderWritten,
  wait(reduce ? 0 : 2800), // let at least one page turn
  document.fonts ? document.fonts.ready : null,
]).then(() => {
  const out = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove('is-loading');
      $('.loader').remove();
      lenis && lenis.start();
      ScrollTrigger.refresh();
    },
  });
  out
    .to('.book', { opacity: 0, y: -12, duration: reduce ? 0 : 1, ease: 'sine.inOut' })
    .to('.loader__text', { opacity: 0, y: -8, duration: reduce ? 0 : 1, ease: 'sine.inOut' }, 0.15)
    .to('.loader', { opacity: 0, duration: reduce ? 0 : 1.2, ease: 'power1.inOut' }, '-=0.5')
    .add(heroIntro(), '-=0.8');
});

/* ---------- hero ---------- */
function heroIntro() {
  const { chars } = splits.get($('.hero__title'));
  const tl = gsap.timeline();
  if (reduce) return tl;
  tl.from('.hero__arch', {
      yPercent: 18, opacity: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.15,
    })
    .from('.hero__arch img', { scale: 1.3, duration: 1.2, ease: 'power2.inOut', stagger: 0.15 }, 0)
    .from(chars, {
      yPercent: 25, opacity: 0, rotate: () => gsap.utils.random(-4, 4), filter: 'blur(8px)',
      duration: 1.2, ease: 'sine.inOut', stagger: 0.14,
    }, 0.3)
    .from('.hero__eyebrow, .hero__year, .hero__scroll, .nav', { opacity: 0, y: 10, duration: 1, ease: 'sine.inOut', stagger: 0.1 }, 0.9);
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
    duration: reduce ? 0 : 1.2,
    ease: 'power2.inOut',
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
    // hangul is written in reading order, like ink settling on paper
    gsap.from(splits.get(el).chars, {
      yPercent: 20, opacity: 0, rotate: () => gsap.utils.random(-3, 3), filter: 'blur(6px)',
      duration: 1.1, ease: 'sine.inOut', stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
  $$('.chapter__head .label').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 8, duration: 1, ease: 'sine.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  $$('.reveal').forEach((el) => {
    gsap.from(splits.get(el).words, {
      opacity: 0, y: 10, filter: 'blur(4px)',
      duration: 1, ease: 'sine.inOut', stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 82%' },
    });
  });
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
        duration: reduce ? 0 : 1.2,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
      if (on && j === i && !reduce) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.2, ease: 'power2.inOut' });
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
      // pins must be measured top-to-bottom: this one first, so the portal below
      // includes its pin spacing (otherwise the portal opens ~1 screen too early)
      refreshPriority: 2,
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

  // ink doodles drift slowly, like they were drawn on a breathing page
  $$('.doodle').forEach((sp, i) => {
    gsap.to(sp, { y: -14, rotate: i % 2 ? -8 : 8, opacity: 0.5, duration: 3.2 + i * 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  });

  // Portal: tiny circle opens into the whole screen
  const ptl = gsap.timeline({
    scrollTrigger: { trigger: '.portal', start: 'top top', end: '+=160%', pin: true, scrub: 1, refreshPriority: 1 },
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

/* ---------- cursor + star dust ---------- */
if (finePointer && !reduce) {
  const cur = $('.cursor');
  const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power2' });
  const cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power2' });
  let last = 0;
  const kinds = ['spark', 'spark', 'spark spark--star', 'spark spark--big'];
  function spawn(x, y) {
    const sp = document.createElement('span');
    sp.className = kinds[(Math.random() * kinds.length) | 0];
    document.body.append(sp);
    gsap.set(sp, { x, y, scale: gsap.utils.random(0.6, 1.4), rotate: gsap.utils.random(0, 90), opacity: 1 });
    gsap.timeline({ onComplete: () => sp.remove() })
      .to(sp, {
        x: `+=${gsap.utils.random(-26, 26)}`, y: `+=${gsap.utils.random(14, 46)}`,
        rotate: `+=${gsap.utils.random(-120, 120)}`,
        duration: gsap.utils.random(1, 1.5), ease: 'sine.out',
      }, 0)
      .to(sp, { scale: 0, opacity: 0, duration: 0.6, ease: 'sine.in' }, '-=0.6');
  }
  addEventListener('mousemove', (e) => {
    gsap.set(cur, { opacity: 1 });
    cx(e.clientX); cy(e.clientY);
    const now = performance.now();
    if (now - last < 35) return;
    last = now;
    spawn(e.clientX, e.clientY);
    if (Math.random() < 0.5) spawn(e.clientX + gsap.utils.random(-8, 8), e.clientY + gsap.utils.random(-8, 8));
  });
  // a small burst of dust on click
  addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) spawn(e.clientX + gsap.utils.random(-14, 14), e.clientY + gsap.utils.random(-14, 14));
  });
  $$('a, .hero__arch, .duo__img, .collage__img').forEach((el) => {
    el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
  });
}

/* keep trigger order correct with several pins */
ScrollTrigger.sort();
addEventListener('load', () => ScrollTrigger.refresh());
