/* THOMe — interactions (GSAP + ScrollTrigger + Lenis) */
gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;

/* ---------- Smooth scroll ---------- */
const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* ---------- Split text into masked words (keeps <em>, <br>, .pill) ---------- */
function splitWords(root) {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const outer = document.createElement('span');
          const inner = document.createElement('span');
          outer.className = 'm';
          inner.className = 'm__i';
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR' && !n.classList.contains('pill')) {
        walk(n);
      }
    });
  };
  walk(root);
}
$$('[data-split], [data-fade]').forEach(splitWords);

/* small hero frame size from CSS — read before any animation touches it */
const frameStart = getComputedStyle($('#heroFrame')).clipPath;
/* the photo is zoomed out inside the small frame so the whole face shows */
const imgStart = innerWidth < 901 ? 0.66 : 0.5;
gsap.set('#heroFrame img', { scale: imgStart });

/* ---------- Loader + hero intro ---------- */
/* add ?noloader to the URL to skip the intro while developing */
const skipLoader = reduced || new URLSearchParams(location.search).has('noloader');

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero__line .w', { yPercent: 105, duration: 1.4, stagger: 0.08 })
    .from('#heroFrame', { clipPath: 'inset(50% 50% 50% 50% round 16px)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
    .from('.hero__frame-in', { scale: 1.5, duration: 1.8 }, 0)
    .from('.hero__at span', { yPercent: 100, opacity: 0, duration: 1.2 }, 0.5)
    .from('.hero__meta > *, .hero__foot > *', { y: 16, opacity: 0, duration: 1, stagger: 0.05 }, 0.6)
    .from('.hdr', { y: -20, opacity: 0, duration: 1 }, 0.6);
  return tl;
}

if (skipLoader) {
  document.documentElement.classList.add('skip-loader');
  start();
} else {
  lenis.stop();
  const n = { v: 0 };
  const numEl = $('#loadNum');
  gsap.timeline()
    .from('.loader__word span', { yPercent: 110, duration: 1.1, stagger: 0.06, ease: 'expo.out' }, 0)
    .to(n, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { numEl.textContent = String(Math.round(n.v)).padStart(3, '0'); } }, 0)
    .to('.loader__word span', { yPercent: -110, duration: 0.8, stagger: 0.04, ease: 'expo.in' }, 1.8)
    .to('#loader', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, 2.3)
    .add(() => { $('#loader').style.display = 'none'; lenis.start(); })
    .add(start, 2.4);
}

function start() {
  if (!reduced) heroIntro();
  buildScroll();
}

/* ---------- All scroll-driven animation ---------- */
function buildScroll() {
  if (reduced) return;
  const mm = gsap.matchMedia();

  /* Hero: words part, frame grows into the brand film */
  const htl = gsap.timeline({
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=170%', pin: true, scrub: 1, invalidateOnRefresh: true }
  });
  htl.fromTo('.hero__meta, .hero__foot, .hero__at', { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.2, immediateRender: false }, 0)
    .to('.hero__line--1', { xPercent: -45, duration: 1 }, 0)
    .to('.hero__line--2', { xPercent: 45, duration: 1 }, 0)
    .fromTo('#heroFrame', { clipPath: frameStart }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1, ease: 'power2.inOut', immediateRender: false }, 0)
    .fromTo('#heroFrame img', { scale: imgStart }, { scale: 1, duration: 1, ease: 'power2.inOut', immediateRender: false }, 0)
    .to('.hero__film', { opacity: 1, duration: 0.25 }, 0.8)
    .fromTo('.hero__film-in > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.25 }, 0.9);

  /* Headings: masked word rise */
  $$('[data-split]').forEach(el => {
    gsap.from($$('.m__i', el), {
      yPercent: 110, duration: 1.3, stagger: 0.06, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* Paragraphs: words light up as you scroll */
  $$('[data-fade]').forEach(el => {
    const words = $$('.m__i, .pill', el);
    gsap.fromTo(words, { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true }
    });
    if ($('.pill', el)) gsap.from($$('.pill', el), {
      width: 0, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true }
    });
  });

  /* Simple reveals */
  $$('[data-reveal]').forEach(el => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  /* Index rows slide in */
  /* (children, not .row itself — .row has a CSS opacity transition for hover dimming) */
  gsap.from('.row > *', {
    y: 60, opacity: 0, duration: 1.2, stagger: 0.03, ease: 'expo.out',
    scrollTrigger: { trigger: '#rows', start: 'top 85%' }
  });

  /* Image parallax */
  $$('[data-parallax]').forEach(img => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* Image clip reveals */
  $$('.prog__img').forEach(el => {
    gsap.from(el, {
      clipPath: 'inset(100% 0% 0% 0% round 18px)', duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* Counters */
  $$('[data-count]').forEach(el => {
    const o = { v: 0 };
    gsap.to(o, {
      v: +el.dataset.count, duration: 2, ease: 'power3.out',
      onUpdate: () => { el.textContent = Math.round(o.v); },
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  /* Footer wordmark letters rise */
  gsap.from('.wm span', {
    yPercent: 100, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: '.wm', start: 'top bottom', end: 'bottom bottom', scrub: true }
  });

  /* Desktop-only pinned scenes */
  mm.add('(min-width: 901px)', () => {
    /* Spotlight: three steps */
    const imgs = $$('.spot__img');
    const steps = $$('.spot__step');
    const marks = $$('#spotNav li');
    const count = $('#spotCount');
    gsap.set(imgs.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(steps.slice(1), { autoAlpha: 0, y: 50 });

    const stl = gsap.timeline({
      scrollTrigger: {
        trigger: '#spotlight', start: 'top top', end: '+=220%', pin: true, scrub: 1,
        onUpdate: self => {
          const i = Math.min(2, Math.floor(self.progress * 2.999));
          marks.forEach((m, j) => m.classList.toggle('is-on', j === i));
          count.textContent = `0${i + 1} / 03`;
        }
      }
    });
    for (let i = 1; i < imgs.length; i++) {
      stl.to(imgs[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, i - 1 + 0.3)
        .fromTo($('img', imgs[i]), { scale: 1.3 }, { scale: 1, duration: 1, ease: 'power2.out' }, '<')
        .to(steps[i - 1], { autoAlpha: 0, y: -50, duration: 0.4 }, '<')
        .to(steps[i], { autoAlpha: 1, y: 0, duration: 0.4 }, '<+0.4');
    }
    stl.to({}, { duration: 0.3 });

    /* Horizontal shop */
    const track = $('#hsTrack');
    const bar = $('#hsBar');
    const hsCount = $('#hsCount');
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#shop', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: self => {
          gsap.set(bar, { scaleX: self.progress });
          hsCount.textContent = String(Math.min(8, 1 + Math.floor(self.progress * 8))).padStart(2, '0') + ' / 08';
        }
      }
    });

    /* Packaging: objects drift at different speeds past the sticky title */
    $$('.float').forEach(el => {
      gsap.to(el, {
        y: () => -innerHeight * 0.9 * parseFloat(el.dataset.speed), ease: 'none',
        scrollTrigger: { trigger: '#packaging', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
      });
    });
  });

  /* Marquee reacts to scroll speed and direction */
  const mq = gsap.to('#mqTrack', { xPercent: -50, duration: 26, ease: 'none', repeat: -1 });
  mq.totalTime(mq.duration() * 50);
  lenis.on('scroll', e => {
    const dir = e.direction < 0 ? -1 : 1;
    gsap.to(mq, { timeScale: dir * (1 + Math.min(Math.abs(e.velocity) / 5, 5)), duration: 0.4, overwrite: true });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- Anchor links through Lenis ---------- */
$$('a[data-scroll]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    e.preventDefault();
    closeMenu();
    lenis.scrollTo(id === '#top' ? 0 : id, { duration: 1.6 });
  });
});

/* ---------- Menu overlay ---------- */
const menu = $('#menu');
const menuBtn = $('#menuBtn');
let menuOpen = false;
function openMenu() {
  menuOpen = true;
  menuBtn.textContent = 'Close';
  menuBtn.setAttribute('aria-expanded', 'true');
  lenis.stop();
  gsap.timeline()
    .set(menu, { visibility: 'visible' })
    .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
    .from('.menu__links a', { yPercent: 100, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, 0.35)
    .from('.menu__aside', { opacity: 0, y: 30, duration: 0.8, ease: 'expo.out' }, 0.5);
}
function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  menuBtn.textContent = 'Menu';
  menuBtn.setAttribute('aria-expanded', 'false');
  lenis.start();
  gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
}
menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ---------- Custom cursor ---------- */
if (canHover) {
  const cur = $('#cursor');
  const label = $('#cursorLabel');
  const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
  const cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  addEventListener('mousemove', e => { cx(e.clientX); cy(e.clientY); });
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-cursor]');
    if (t) { label.textContent = t.dataset.cursor; cur.classList.add('is-label'); }
    else cur.classList.remove('is-label');
  });
  document.addEventListener('mouseleave', () => cur.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => cur.classList.remove('is-hidden'));

  /* Magnetic buttons */
  $$('[data-magnetic]').forEach(el => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });

  /* Floating preview over the best-seller list */
  const prev = $('#preview');
  const pimgs = $$('img', prev);
  gsap.set(prev, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });
  const px = gsap.quickTo(prev, 'x', { duration: 0.7, ease: 'power3' });
  const py = gsap.quickTo(prev, 'y', { duration: 0.7, ease: 'power3' });
  const rows = $$('.row');
  let lastX = 0;
  $('#rows').addEventListener('mousemove', e => {
    px(e.clientX + 120); py(e.clientY);
    gsap.to(prev, { rotation: gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4), duration: 0.6, ease: 'power3' });
    lastX = e.clientX;
  });
  rows.forEach((r, i) => r.addEventListener('mouseenter', () => {
    gsap.to(prev, { scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' });
    pimgs.forEach((im, j) => gsap.to(im, {
      clipPath: j === i ? 'inset(0% 0% 0% 0%)' : (j < i ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)'),
      duration: 0.7, ease: 'expo.out'
    }));
  }));
  $('#rows').addEventListener('mouseleave', () => gsap.to(prev, { scale: 0.6, opacity: 0, rotation: 0, duration: 0.5, ease: 'expo.out' }));
}

/* ---------- Cart ---------- */
let cart = 0;
const countEl = $('#cartCount');
const toast = $('#toast');
let toastTimer;
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  e.preventDefault();
  cart++;
  countEl.textContent = cart;
  gsap.fromTo(countEl, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
  $('#toastImg').src = btn.dataset.img;
  $('#toastText').textContent = btn.dataset.name + ' — added';
  toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2600);
  gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
});

/* ---------- Newsletter ---------- */
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('input', e.target);
  input.value = '';
  input.placeholder = 'Thank you — check your inbox';
});
