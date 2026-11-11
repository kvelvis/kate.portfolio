/* =========================================================
   청와대 리디자인 — main.js (GSAP 3 + ScrollTrigger)
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (hasGsap) gsap.defaults({ overwrite: 'auto' });

  /* ---------- toast ---------- */
  const toastEl = $('.toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2800);
  };

  /* ---------- split text (keeps <em>, <br>) ---------- */
  const split = (el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span');
            w.className = 'word';
            [...part].forEach((ch) => {
              const c = document.createElement('span');
              c.className = 'char';
              c.textContent = ch;
              w.append(c);
            });
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    walk(el);
    $$('.word', el).forEach((w) => w.setAttribute('aria-hidden', 'true'));
    return $$('.char', el);
  };

  /* =========================================================
     HEADER — scroll state, mega menu, hide on scroll down
     ========================================================= */
  const header = $('#header');
  const gnb = $('.gnb');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    const heroH = $('.hero').offsetHeight;
    header.classList.toggle('is-hidden', y > heroH && y > lastY && !header.classList.contains('is-open'));
    $('.totop').classList.toggle('is-show', y > 800);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  gnb.addEventListener('mouseenter', () => header.classList.add('is-open'));
  header.addEventListener('mouseleave', () => header.classList.remove('is-open'));
  gnb.addEventListener('focusin', () => header.classList.add('is-open'));
  header.addEventListener('focusout', (e) => { if (!header.contains(e.relatedTarget)) header.classList.remove('is-open'); });
  $$('.gnb a').forEach((a) => a.addEventListener('click', () => header.classList.remove('is-open')));

  /* =========================================================
     SITEMAP / MOBILE DRAWER (built from GNB)
     ========================================================= */
  const sitemap = $('#sitemap');
  const allBtn = $('.util__all');
  const list = $('.sitemap__list');
  $$('.gnb__item').forEach((item, i) => {
    const title = $(':scope > a', item).textContent;
    const li = document.createElement('li');
    li.className = 'sitemap__group';
    li.innerHTML = `<button type="button" aria-expanded="false" aria-controls="sm-${i}">${title}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>`;
    const sub = $('.gnb__sub', item).cloneNode(true);
    sub.className = '';
    sub.id = `sm-${i}`;
    li.append(sub);
    list.append(li);
  });
  $$('.sitemap__group > button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const g = btn.parentElement;
      const open = !g.classList.contains('is-open');
      $$('.sitemap__group').forEach((x) => { x.classList.remove('is-open'); $('button', x).setAttribute('aria-expanded', 'false'); });
      g.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  const openSitemap = (open) => {
    sitemap.classList.toggle('is-open', open);
    sitemap.setAttribute('aria-hidden', String(!open));
    allBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
    if (open) {
      $('.sitemap__close').focus();
      if (hasGsap && !reduce) {
        gsap.fromTo('.sitemap__group', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, delay: 0.2, ease: 'power3.out' });
      }
    } else {
      allBtn.focus();
    }
  };
  allBtn.addEventListener('click', () => openSitemap(true));
  $('.sitemap__close').addEventListener('click', () => openSitemap(false));
  sitemap.addEventListener('click', (e) => { if (e.target.closest('a')) openSitemap(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sitemap.classList.contains('is-open')) openSitemap(false); });

  /* =========================================================
     HERO SLIDER
     ========================================================= */
  const slides = $$('.hero__slide');
  const texts = $$('.hero__text');
  const total = slides.length;
  const DURATION = 6;
  const bar = $('.hero__bar i');
  const playBtn = $('.hero__play');
  let current = 0;
  let paused = false;
  let progressTween = null;
  let busy = false;

  $('.hero__total').textContent = String(total).padStart(2, '0');
  const titleChars = texts.map((t) => split($('.hero__title', t)));

  const setCount = (i) => { $('.hero__cur').textContent = String(i + 1).padStart(2, '0'); };

  const runProgress = () => {
    if (!hasGsap) return;
    if (progressTween) progressTween.kill();
    gsap.set(bar, { scaleX: 0 });
    progressTween = gsap.to(bar, {
      scaleX: 1, duration: DURATION, ease: 'none',
      onComplete: () => go(current + 1),
    });
    if (paused) progressTween.pause();
  };

  const showText = (i) => {
    const t = texts[i];
    gsap.fromTo($('.hero__eyebrow', t), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    gsap.fromTo(titleChars[i], { yPercent: 60, opacity: 0, rotateX: -40 }, { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.025, ease: 'power3.out', delay: 0.15 });
  };

  const go = (next, dir = 1) => {
    if (busy) return;
    next = (next + total) % total;
    if (next === current) return;
    busy = true;
    const prevSlide = slides[current];
    const nextSlide = slides[next];
    const prevText = texts[current];
    const nextText = texts[next];

    if (!hasGsap || reduce) {
      prevSlide.classList.remove('is-active'); nextSlide.classList.add('is-active');
      prevText.classList.remove('is-active'); nextText.classList.add('is-active');
      current = next; setCount(current); busy = false;
      if (hasGsap) runProgress();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => { busy = false; } });
    tl.to(prevText, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in', onComplete: () => { prevText.classList.remove('is-active'); gsap.set(prevText, { clearProps: 'all' }); } })
      .set(nextSlide, { zIndex: 2, visibility: 'visible' }, 0)
      .fromTo(nextSlide, { clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', opacity: 1 }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.2, ease: 'expo.inOut' }, 0)
      .fromTo($('img', nextSlide), { scale: 1.25, xPercent: dir * 6 }, { scale: 1.08, xPercent: 0, duration: 1.4, ease: 'expo.out' }, 0.1)
      .to($('img', prevSlide), { xPercent: -dir * 8, duration: 1.2, ease: 'expo.inOut' }, 0)
      .add(() => {
        prevSlide.classList.remove('is-active');
        gsap.set(prevSlide, { clearProps: 'all' });
        gsap.set($('img', prevSlide), { xPercent: 0 });
        nextSlide.classList.add('is-active');
        gsap.set(nextSlide, { clearProps: 'all' });
        // Ken Burns
        gsap.to($('img', nextSlide), { scale: 1, duration: DURATION + 1, ease: 'none' });
      })
      .add(() => { nextText.classList.add('is-active'); showText(next); }, 0.55);

    current = next;
    setCount(current);
    runProgress();
  };

  $('.hero__next').addEventListener('click', () => go(current + 1, 1));
  $('.hero__prev').addEventListener('click', () => go(current - 1, -1));
  playBtn.addEventListener('click', () => {
    paused = !paused;
    playBtn.setAttribute('aria-pressed', String(paused));
    playBtn.setAttribute('aria-label', paused ? '자동 재생 시작' : '자동 재생 정지');
    if (progressTween) paused ? progressTween.pause() : progressTween.resume();
  });

  // swipe
  let sx = 0;
  const heroEl = $('.hero');
  heroEl.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  heroEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) dx < 0 ? go(current + 1, 1) : go(current - 1, -1);
  });
  // pause when hero is off-screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      if (!progressTween || paused) return;
      en.isIntersecting ? progressTween.resume() : progressTween.pause();
    }).observe(heroEl);
  }

  /* =========================================================
     BOOKING + TODAY (Seoul time)
     ========================================================= */
  const seoulNow = () => {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date()).reduce((o, x) => (o[x.type] = x.value, o), {});
    return { day: p.weekday, h: +p.hour, m: +p.minute, date: `${p.year}-${p.month}-${p.day}` };
  };
  const now = seoulNow();
  const status = $('[data-status]');
  const isOpen = now.day !== 'Tue' && (now.h * 60 + now.m) >= 540 && (now.h * 60 + now.m) < 1050;
  status.classList.add(isOpen ? 'is-open' : 'is-closed');
  $('.status__txt', status).textContent = now.day === 'Tue' ? '오늘 휴관' : isOpen ? '지금 관람 가능' : '운영 종료';

  // crowd: simple daily curve (demo)
  const meter = $('.meter');
  const crowdVal = isOpen ? Math.round(25 + 60 * Math.sin(Math.PI * Math.min(1, Math.max(0, (now.h - 9 + now.m / 60) / 9)))) : 0;
  const crowdLabel = !isOpen ? '운영 종료' : crowdVal < 45 ? '여유' : crowdVal < 70 ? '보통' : '혼잡';
  const crowdColor = crowdVal < 45 ? 'var(--green)' : crowdVal < 70 ? 'var(--amber)' : 'var(--red)';

  const dateInput = $('#b-date');
  dateInput.min = now.date;
  dateInput.value = now.date;
  const num = $('#b-num');
  $$('.stepper button').forEach((b) => b.addEventListener('click', () => {
    num.value = Math.min(6, Math.max(1, (+num.value || 1) + +b.dataset.step));
  }));
  $('#booking').addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new Date(dateInput.value + 'T12:00:00');
    if (isNaN(d)) { toast('관람일을 선택해 주세요.'); return; }
    if (d.getDay() === 2) { toast('선택한 날짜는 화요일 휴관일입니다.'); return; }
    toast(`${dateInput.value.replace(/-/g, '.')} · ${$('#b-time').value} · ${num.value}명 — 예약 가능 (데모)`);
  });

  /* ---------- culture slider buttons ---------- */
  const events = $('.events');
  $$('[data-slide]').forEach((b) => b.addEventListener('click', () => {
    const card = $('.event', events);
    const step = card.offsetWidth + 24;
    events.scrollBy({ left: step * +b.dataset.slide, behavior: 'smooth' });
  }));

  /* =========================================================
     TABS (WAI-ARIA)
     ========================================================= */
  const tabs = $$('[role="tab"]');
  const ink = $('.tabs__ink');
  const moveInk = (t) => { ink.style.width = t.offsetWidth + 'px'; ink.style.transform = `translateX(${t.offsetLeft}px)`; };
  const select = (t) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    });
    moveInk(t);
    const panel = $('#' + t.getAttribute('aria-controls'));
    if (hasGsap && !reduce) gsap.fromTo(panel.firstElementChild.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out' });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      let n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') n = tabs[0];
      if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); n.focus(); select(n); }
    });
  });
  const syncInk = () => moveInk($('[role="tab"][aria-selected="true"]'));
  window.addEventListener('resize', syncInk);
  document.fonts?.ready.then(syncInk);
  syncInk();

  /* ---------- to top ---------- */
  $('.totop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* =========================================================
     NO GSAP → stop here (everything is visible by default)
     ========================================================= */
  const finishLoader = () => {
    document.body.classList.remove('is-loading');
    const l = $('.loader');
    if (l) l.remove();
  };

  const fillMeter = () => {
    meter.setAttribute('aria-valuenow', crowdVal);
    $('i', meter).style.width = crowdVal + '%';
    $('i', meter).style.background = crowdColor;
    $('[data-crowd]').textContent = crowdLabel;
  };

  if (!hasGsap) { finishLoader(); fillMeter(); return; }

  /* ---------- loader → intro ---------- */
  const loaderNum = $('.loader__num span');
  const counter = { v: 0 };
  const firstImg = $('img', slides[0]);
  const imgReady = new Promise((res) => (firstImg.complete ? res() : (firstImg.onload = firstImg.onerror = res)));

  const intro = () => {
    const tl = gsap.timeline();
    tl.to('.loader', { yPercent: -100, duration: 1, ease: 'expo.inOut', onComplete: finishLoader })
      .fromTo($('img', slides[0]), { scale: 1.35 }, { scale: 1.08, duration: 2, ease: 'expo.out' }, 0.3)
      .from('.header__bar > *', { y: -30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 0.7)
      .add(() => showText(0), 0.8)
      .from('.hero__ctrl', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, 1.2)
      .from('.quick__grid > *', { y: 60, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out' }, 1.1)
      .add(() => {
        gsap.to($('img', slides[0]), { scale: 1, duration: DURATION, ease: 'none' });
        runProgress();
      });
  };

  gsap.to(counter, {
    v: 90, duration: 1.2, ease: 'power2.out',
    onUpdate: () => (loaderNum.textContent = Math.round(counter.v)),
  });
  Promise.all([imgReady, new Promise((r) => setTimeout(r, 1200))]).then(() => {
    gsap.to(counter, { v: 100, duration: 0.3, onUpdate: () => (loaderNum.textContent = Math.round(counter.v)), onComplete: intro });
  });
  // safety: never trap the page behind the loader
  setTimeout(() => { if (document.body.classList.contains('is-loading')) intro(); }, 5000);

  if (reduce) { fillMeter(); return; }

  /* =========================================================
     SCROLL ANIMATIONS
     ========================================================= */
  // pin first, so every trigger below it accounts for the pin spacing
  // places: horizontal pin (≥1024)
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const track = $('.places__track');
    const dist = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.places', pin: '.places__pin', start: 'top top',
        end: () => '+=' + dist(), scrub: 0.8, invalidateOnRefresh: true,
      },
    });
    gsap.to('.places__progress i', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.places', start: 'top top', end: () => '+=' + dist(), scrub: true },
    });
    // each card image subtle parallax inside the horizontal move
    $$('.place__img img').forEach((img) => {
      gsap.fromTo(img, { xPercent: -8, scale: 1.15 }, {
        xPercent: 8, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
    });
  });
  mm.add('(max-width: 1023px)', () => {
    gsap.from('.place', { x: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.places__track', start: 'top 82%' } });
  });

  ScrollTrigger.create({ trigger: '.today', start: 'top 90%', once: true, onEnter: fillMeter });

  // section titles: char reveal
  $$('[data-split]').forEach((el) => {
    const chars = split(el);
    gsap.from(chars, {
      yPercent: 80, opacity: 0, duration: 0.8, stagger: 0.02, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // generic fade-up groups
  const fadeUp = (targets, trigger, opts = {}) => gsap.from(targets, {
    y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger, start: 'top 82%' }, clearProps: 'transform,opacity', ...opts,
  });
  fadeUp('.about__txt > *', '.about__txt');
  fadeUp('.links3 li', '.links3');
  fadeUp('.culture__txt > :not(h2)', '.culture__txt');
  fadeUp('.event', '.events', { x: 80, y: 0 });
  fadeUp('.route__side > *', '.route__side');
  fadeUp('.board__grid > *', '.board__grid');
  fadeUp('#panel-review .review', '.stories__head');

  // about image clip reveal + parallax
  gsap.fromTo('.reveal-clip', { clipPath: 'inset(18% 12% 18% 12% round 24px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none',
    scrollTrigger: { trigger: '.reveal-clip', start: 'top 90%', end: 'top 35%', scrub: true },
  });
  gsap.to('.about__img img', {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.about__img', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  // counters
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count;
    const o = { v: end > 1000 ? 1900 : 0 };
    gsap.to(o, {
      v: end, duration: 1.8, ease: 'power2.out',
      onUpdate: () => (el.textContent = Math.round(o.v)),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // route parallax + timeline line draw
  gsap.fromTo('.route__bg', { yPercent: -8 }, {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.route', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.fromTo('.steps__line', { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: true },
  });
  gsap.from('.steps li', {
    x: -24, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.steps', start: 'top 75%' },
  });


  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
