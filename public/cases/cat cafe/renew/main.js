/* Gato Pingado — renewal interactions (GSAP + ScrollTrigger + Lenis) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';

  document.documentElement.classList.add('js');
  document.body.classList.add('is-loading');

  /* ---------- text splitting ---------- */
  $$('[data-split]').forEach(el => {
    el.innerHTML = [...el.textContent].map(c => `<span class="char">${c}</span>`).join('');
  });
  $$('[data-words]').forEach(el => {
    // keep inline tags (em) but wrap every word
    const wrap = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.append(part);
            else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.append(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(el);
  });

  /* ---------- small UI (works without GSAP) ---------- */
  const header = $('.header');
  const burger = $('.burger');
  const mnav = $('.mnav');
  const toggleMenu = open => {
    burger.classList.toggle('is-open', open);
    mnav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    mnav.setAttribute('aria-hidden', !open);
  };
  burger.addEventListener('click', () => toggleMenu(!mnav.classList.contains('is-open')));

  $$('.like').forEach(b => b.addEventListener('click', () => b.classList.toggle('is-on')));

  const endLoading = () => {
    document.body.classList.remove('is-loading');
    const l = $('.loader'); if (l) l.remove();
  };

  if (!hasGsap) { endLoading(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id.length > 1 ? $(id) : null;
    if (!target) return;
    e.preventDefault();
    toggleMenu(false);
    lenis ? lenis.scrollTo(target, { duration: 1.4 }) : target.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- loader + hero intro ---------- */
  const num = $('.loader__num span');
  const counter = { v: 0 };
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });

  intro
    .to('.loader', { yPercent: -100, duration: 1, ease: 'expo.inOut' })
    .add(endLoading)
    .from('.hero__title .char', { yPercent: 120, rotate: 12, opacity: 0, duration: 1.2, stagger: 0.05 }, '-=.45')
    .from('.hero__video', { scaleX: 0, duration: 1.2 }, '<.2')
    .from(header, { yPercent: -200, duration: 1 }, '<.1')
    .from('.hero__lead, .hero__btns .btn', { y: 40, opacity: 0, duration: 1, stagger: 0.1 }, '<.2')
    .from('.sticker, .badge', { scale: 0, rotate: -30, duration: 1, ease: 'back.out(2)', stagger: 0.08 }, '<')
    .add(() => lenis && lenis.start());

  if (reduce) {
    endLoading(); lenis && lenis.start();
  } else {
    gsap.to(counter, {
      v: 100, duration: 1.4, ease: 'power2.inOut',
      onUpdate: () => (num.textContent = Math.round(counter.v)),
      onComplete: () => intro.play()
    });
  }

  if (reduce) return; // no scroll animations for reduced-motion users

  /* ---------- hero: mouse parallax + scroll out ---------- */
  if (finePointer) {
    const stickers = $$('.hero .sticker');
    window.addEventListener('mousemove', e => {
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      stickers.forEach(s => {
        const d = parseFloat(s.dataset.depth) || 1;
        gsap.to(s, { x: x * 60 * d, y: y * 60 * d, duration: 1, ease: 'power3.out' });
      });
    });
  }

  gsap.to('.hero__title', {
    yPercent: 25, opacity: .2, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ---------- marquee skew on scroll velocity ---------- */
  const skewTo = gsap.quickTo('.marquee__track', 'skewX', { duration: .4, ease: 'power3' });
  ScrollTrigger.create({
    onUpdate: self => skewTo(gsap.utils.clamp(-12, 12, self.getVelocity() / -250))
  });

  /* ---------- about ---------- */
  gsap.fromTo('.about__statement .w', { opacity: .12 }, {
    opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: '.about__statement', start: 'top 80%', end: 'bottom 45%', scrub: true }
  });

  $$('[data-speed]').forEach(el => {
    const sp = parseFloat(el.dataset.speed);
    gsap.to(el, { yPercent: sp * 100, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo(el.querySelector('img'), { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  gsap.from('.about__jump', { rotate: -40, scale: .4, opacity: 0, ease: 'back.out(2)', duration: 1, scrollTrigger: { trigger: '.about__collage', start: 'center 70%' } });

  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count;
    const o = { v: end > 1000 ? end - 40 : 0 };
    gsap.to(o, {
      v: end, duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => (el.textContent = Math.round(o.v))
    });
  });

  /* ---------- section titles ---------- */
  $$('.title').forEach(t => {
    gsap.from(t, { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 85%' } });
  });

  /* ---------- cats: horizontal pin (tablet/desktop only) ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 641px)', () => {
    const track = $('.cats__track');
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.cats', start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
      }
    });
  });

  gsap.from('.cat-card', {
    y: 120, opacity: 0, rotate: 8, duration: 1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform',
    scrollTrigger: { trigger: '.cats', start: 'top 60%' }
  });

  /* ---------- menu + goods ---------- */
  gsap.from('.tile', {
    y: 80, opacity: 0, scale: .94, duration: 1, ease: 'expo.out', stagger: 0.08,
    scrollTrigger: { trigger: '.bento', start: 'top 80%' }
  });
  gsap.from('.product', {
    y: 80, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1, clearProps: 'transform',
    scrollTrigger: { trigger: '.goods__grid', start: 'top 85%' }
  });

  // 3D tilt on bento tiles
  if (finePointer) {
    $$('.tile').forEach(tile => {
      const rx = gsap.quickTo(tile, 'rotationX', { duration: .5, ease: 'power3' });
      const ry = gsap.quickTo(tile, 'rotationY', { duration: .5, ease: 'power3' });
      gsap.set(tile, { transformPerspective: 900 });
      tile.addEventListener('mousemove', e => {
        const r = tile.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 10);
        rx(((e.clientY - r.top) / r.height - .5) * -10);
      });
      tile.addEventListener('mouseleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------- adopt: stacked cards shrink ---------- */
  const steps = $$('.step');
  steps.forEach((step, i) => {
    const next = steps[i + 1];
    if (!next) return;
    gsap.to(step, {
      scale: .92, ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 110px', scrub: true }
    });
  });

  /* ---------- visit ---------- */
  gsap.fromTo('.visit__img', { clipPath: 'inset(30% 20% 30% 20% round 400px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
    scrollTrigger: { trigger: '.visit', start: 'top 80%', end: 'center center', scrub: true }
  });
  gsap.fromTo('.visit__img img', { scale: 1.3 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  gsap.from('.visit__list > div', {
    x: 60, opacity: 0, stagger: .12, duration: .9, ease: 'expo.out',
    scrollTrigger: { trigger: '.visit__list', start: 'top 85%' }
  });

  /* ---------- footer ---------- */
  gsap.from('.footer__logo', {
    yPercent: 60, opacity: 0, duration: 1.4, ease: 'expo.out',
    scrollTrigger: { trigger: '.footer', start: 'top 70%' }
  });

  /* ---------- header: hide on scroll down + active link ---------- */
    let headerHidden = false;
  ScrollTrigger.create({
    start: 200, end: 'max',
    onUpdate: self => {
      const hide = self.direction === 1 && !mnav.classList.contains('is-open');
      if (hide === headerHidden) return;
      headerHidden = hide;
      gsap.to(header, { yPercent: hide ? -170 : 0, duration: .5, ease: 'power3.out', overwrite: true });
    },
    onLeaveBack: () => { headerHidden = false; gsap.to(header, { yPercent: 0, duration: .5, overwrite: true }); }
  });
  $$('.header__nav a').forEach(a => {
    const sec = $(a.getAttribute('href'));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top center', end: 'bottom center',
      onToggle: self => a.classList.toggle('is-active', self.isActive)
    });
  });

  /* ---------- magnetic buttons + cursor (mouse only) ---------- */
  if (finePointer) {
    $$('.magnetic').forEach(btn => {
      const mx = gsap.quickTo(btn, 'x', { duration: .5, ease: 'power3' });
      const my = gsap.quickTo(btn, 'y', { duration: .5, ease: 'power3' });
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * .35);
        my((e.clientY - r.top - r.height / 2) * .35);
      });
      btn.addEventListener('mouseleave', () => { mx(0); my(0); });
    });

    const cursor = $('.cursor');
    const label = $('.cursor__label');
    const cx = gsap.quickTo(cursor, 'x', { duration: .25, ease: 'power3' });
    const cy = gsap.quickTo(cursor, 'y', { duration: .25, ease: 'power3' });
    window.addEventListener('mousemove', e => { cursor.classList.add('is-ready'); cx(e.clientX); cy(e.clientY); });

    document.addEventListener('mouseover', e => {
      const lab = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button');
      cursor.classList.toggle('is-label', !!lab);
      cursor.classList.toggle('is-link', !lab && !!link);
      if (lab) label.textContent = lab.dataset.cursor;
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
