/* ==========================================================================
   CELINE — Printemps 2027. Vanilla JS, no jQuery.
   1. Reveal on scroll  2. Menu  3. Lookbook lightbox  4. Films (inline video)
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* 1. REVEAL ON SCROLL — fade + translate via IntersectionObserver
     ------------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    revealEls.forEach((el) => io.observe(el));
  }


  /* 2. MENU — close offcanvas first, then scroll to the anchor
     ------------------------------------------------------------------------ */
  const menuEl = document.getElementById('siteMenu');
  const menuBtn = document.querySelector('.site-header__menu');

  if (menuEl && window.bootstrap) {
    const menu = bootstrap.Offcanvas.getOrCreateInstance(menuEl);
    let pendingTarget = null;

    menuEl.querySelectorAll('.menu__list a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        pendingTarget = document.querySelector(link.getAttribute('href'));
        menu.hide();
      });
    });

    menuEl.addEventListener('shown.bs.offcanvas', () => {
      menuBtn.setAttribute('aria-expanded', 'true');
    });

    menuEl.addEventListener('hidden.bs.offcanvas', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      if (!pendingTarget) return;
      pendingTarget.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      // move focus to the section for keyboard / screen reader users
      pendingTarget.setAttribute('tabindex', '-1');
      pendingTarget.focus({ preventScroll: true });
      pendingTarget = null;
    });
  }


  /* 3. LOOKBOOK LIGHTBOX — Bootstrap modal, text controls, arrow keys
     ------------------------------------------------------------------------ */
  const lightboxEl = document.getElementById('lightbox');
  const lookBtns = [...document.querySelectorAll('.look__btn')];

  if (lightboxEl && window.bootstrap && lookBtns.length) {
    const lightbox = bootstrap.Modal.getOrCreateInstance(lightboxEl);
    const imgEl = lightboxEl.querySelector('.lightbox__img');
    const captionEl = lightboxEl.querySelector('.caption');
    const countEl = lightboxEl.querySelector('.lightbox__count');
    const total = lookBtns.length;
    const pad = (n) => String(n).padStart(2, '0');

    // Build the slide list from the markup, so HTML stays the single source
    const looks = lookBtns.map((btn) => {
      const thumb = btn.querySelector('img');
      return {
        src: thumb.dataset.full || thumb.src,
        alt: thumb.alt,
        caption: btn.closest('figure').querySelector('figcaption').textContent.trim(),
      };
    });

    let current = 0;
    let opener = null;

    const show = (index) => {
      current = (index + total) % total;
      const look = looks[current];
      imgEl.src = look.src;
      imgEl.alt = look.alt;
      captionEl.textContent = look.caption;
      countEl.textContent = `${pad(current + 1)} / ${pad(total)}`;

      // preload neighbours for instant prev/next
      [current - 1, current + 1].forEach((i) => {
        const pre = new Image();
        pre.src = looks[(i + total) % total].src;
      });
    };

    lookBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        opener = btn;
        show(Number(btn.dataset.look));
        lightbox.show();
      });
    });

    lightboxEl.querySelectorAll('[data-dir]').forEach((btn) => {
      btn.addEventListener('click', () => show(current + Number(btn.dataset.dir)));
    });

    lightboxEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });

    // return focus to the look that opened the lightbox
    lightboxEl.addEventListener('hidden.bs.modal', () => {
      if (opener) opener.focus();
    });
  }


  /* 4. FILMS — inline video: muted autoplay while in view, pause when out;
     Play/Pause and Sound buttons per film. Reduced motion: no autoplay.
     ------------------------------------------------------------------------ */
  const films = [...document.querySelectorAll('.film')]
    .map((film) => ({
      video: film.querySelector('.film__video'),
      playBtn: film.querySelector('.film__play'),
      soundBtn: film.querySelector('.film__sound'),
      userPaused: reduceMotion, // reduced motion: wait for an explicit Play
      inView: false,
    }))
    .filter((f) => f.video);

  const syncPlay = (f) => {
    const playing = !f.video.paused;
    f.playBtn.textContent = playing ? 'Pause' : 'Play';
    f.playBtn.setAttribute('aria-pressed', String(playing));
  };
  const syncSound = (f) => {
    const on = !f.video.muted;
    f.soundBtn.textContent = on ? 'Sound on' : 'Sound off';
    f.soundBtn.setAttribute('aria-pressed', String(on));
  };

  films.forEach((f) => {
    f.video.addEventListener('play', () => syncPlay(f));
    f.video.addEventListener('pause', () => syncPlay(f));
    f.video.addEventListener('volumechange', () => syncSound(f));

    f.playBtn.addEventListener('click', () => {
      if (f.video.paused) {
        f.userPaused = false;
        f.video.play().catch(() => {});
      } else {
        f.userPaused = true;
        f.video.pause();
      }
    });

    f.soundBtn.addEventListener('click', () => {
      f.video.muted = !f.video.muted;
      // only one film with sound at a time
      if (!f.video.muted) films.forEach((o) => { if (o !== f) o.video.muted = true; });
      if (f.video.paused) { f.userPaused = false; f.video.play().catch(() => {}); }
    });
  });

  if ('IntersectionObserver' in window) {
    const filmIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const f = films.find((x) => x.video === entry.target);
        f.inView = entry.isIntersecting;
        if (f.inView && !f.userPaused) f.video.play().catch(() => {}); // autoplay may be blocked; Play button stays available
        if (!f.inView) f.video.pause();
      });
    }, { threshold: 0.35 });
    films.forEach((f) => filmIO.observe(f.video));
  }
})();
