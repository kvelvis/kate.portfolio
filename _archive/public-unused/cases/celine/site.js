/* CELINE — renewal concept · vanilla JS, no dependencies */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: solid after hero, hide on scroll down ---------- */
  const hd = $('[data-hd]');
  const hero = $('[data-hero]');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    const heroEnd = hero ? hero.offsetHeight - hd.offsetHeight : 0;
    hd.classList.toggle('is-solid', y > heroEnd);
    hd.classList.toggle('is-hidden', y > lastY && y > heroEnd + 200);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu ---------- */
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  const setMenu = (open) => {
    document.documentElement.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', !open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Hero slider ---------- */
  if (hero) {
    const slides = $$('[data-slide]', hero);
    const bars = $('[data-bars]', hero);
    const cur = $('[data-cur]', hero);
    const DUR = 7000;
    let i = 0, timer;

    $('[data-total]', hero).textContent = String(slides.length).padStart(2, '0');
    slides.forEach((_, n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hero__bar';
      b.setAttribute('aria-label', `Go to slide ${n + 1}`);
      b.innerHTML = '<i></i>';
      b.addEventListener('click', () => go(n));
      bars.appendChild(b);
    });
    const barEls = $$('.hero__bar', bars);

    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        s.classList.toggle('is-active', k === i);
        s.setAttribute('aria-hidden', k !== i);
        const v = $('video', s);
        if (v) k === i ? v.play().catch(() => {}) : v.pause();
      });
      barEls.forEach((b, k) => {
        b.classList.remove('is-active');
        b.classList.toggle('is-done', k < i);
      });
      void bars.offsetWidth;           // restart progress animation
      barEls[i].classList.add('is-active');
      cur.textContent = String(i + 1).padStart(2, '0');
      schedule();
    };

    const schedule = () => {
      clearTimeout(timer);
      hero.style.setProperty('--dur', DUR + 'ms');
      if (!reduced && !hero.classList.contains('is-paused')) timer = setTimeout(() => go(i + 1), DUR);
    };

    $('[data-next]', hero).addEventListener('click', () => go(i + 1));
    $('[data-prev]', hero).addEventListener('click', () => go(i - 1));

    // swipe on touch devices
    let sx = null;
    hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
      sx = null;
    });

    // pause when hero is off-screen or tab hidden
    let offscreen = false;
    const sync = () => {
      const p = offscreen || document.hidden;
      if (p === hero.classList.contains('is-paused')) return;
      hero.classList.toggle('is-paused', p);
      if (p) clearTimeout(timer); else go(i);
    };
    new IntersectionObserver(([en]) => { offscreen = !en.isIntersecting; sync(); }, { threshold: .15 }).observe(hero);
    document.addEventListener('visibilitychange', sync);

    go(0);
  }

  /* ---------- Campaign gallery: drag + arrows + progress ---------- */
  const gal = $('[data-gallery]');
  if (gal) {
    const track = $('[data-track]', gal);
    const bar = $('[data-progress]', gal);
    const step = () => {
      const card = $('.card', track);
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return (card.offsetWidth + gap) * (innerWidth < 640 ? 1 : 2);
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const visible = track.clientWidth / track.scrollWidth;
      const p = max > 0 ? track.scrollLeft / max : 1;
      bar.style.setProperty('--p', visible + (1 - visible) * p);
    };
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();

    $('[data-gnext]', gal).addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    $('[data-gprev]', gal).addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
    });

    // mouse drag (touch uses native scrolling)
    let down = false, startX = 0, startL = 0, moved = false;
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; startX = e.clientX; startL = track.scrollLeft;
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) { moved = true; track.classList.add('is-drag'); }
      if (moved) track.scrollLeft = startL - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (moved) {
        // let snapping settle on the nearest card
        const l = track.scrollLeft;
        track.classList.remove('is-drag');
        track.scrollLeft = l;
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Subtle parallax on story images ---------- */
  const pImgs = $$('.story__img img');
  if (!reduced && pImgs.length) {
    let ticking = false;
    const parallax = () => {
      const vh = innerHeight;
      pImgs.forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1..1
        const range = img.offsetHeight - r.height;                         // extra height
        img.style.setProperty('--py', `${(-range / 2) * (1 + p)}px`);
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });
    addEventListener('resize', parallax);
    parallax();
  }

  /* ---------- Newsletter (demo) ---------- */
  const form = $('[data-news]');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = $('input', form);
      const msg = $('[data-msg]', form);
      if (!input.checkValidity() || !input.value) {
        msg.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }
      msg.textContent = 'Thank you — you are now subscribed.';
      form.reset();
    });
  }
})();
