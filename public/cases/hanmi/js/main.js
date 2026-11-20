/* 01 메인 — hero carousel, news filter */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- hero carousel ---- */
  const hero = document.getElementById('hero');
  if (hero) {
    const tabs = [...hero.querySelectorAll('.htab')];
    const slides = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const pauseBtn = hero.querySelector('.hero__pause');
    const DUR = 6000;
    let idx = 0, timer = null, paused = reduce;

    hero.style.setProperty('--dur', DUR + 'ms');

    const go = (n, focus) => {
      idx = (n + tabs.length) % tabs.length;
      tabs.forEach((t, i) => {
        const on = i === idx;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        // restart progress animation
        const bar = t.querySelector('.htab__bar i');
        bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
        slides[i].hidden = !on;
        slides[i].classList.toggle('is-in', on);
      });
      if (focus) tabs[idx].focus();
      schedule();
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!paused) timer = setTimeout(() => go(idx + 1), DUR);
    };
    const setPaused = p => {
      paused = p;
      hero.classList.toggle('is-paused', p);
      pauseBtn.setAttribute('aria-pressed', p);
      pauseBtn.setAttribute('aria-label', p ? '자동 재생 시작' : '자동 재생 일시정지');
      if (p) clearTimeout(timer); else go(idx); // restart current slide
    };

    tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
    tabs[0].parentElement.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') go(idx + 1, true);
      if (e.key === 'ArrowLeft') go(idx - 1, true);
    });
    hero.querySelector('.hero__arrow--prev').addEventListener('click', () => go(idx - 1));
    hero.querySelector('.hero__arrow--next').addEventListener('click', () => go(idx + 1));
    pauseBtn.addEventListener('click', () => setPaused(!paused));
    // pause while keyboard focus is inside the carousel
    hero.addEventListener('focusin', () => clearTimeout(timer));
    hero.addEventListener('focusout', () => schedule());

    if (paused) setPaused(true); else schedule();
  }

  /* ---- news filter ---- */
  const filter = document.querySelector('[data-filter="news"]');
  if (filter) {
    const items = document.querySelectorAll('#news-list [data-cat]');
    filter.querySelectorAll('[role="tab"]').forEach(btn => btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      filter.querySelectorAll('[role="tab"]').forEach(b => {
        b.setAttribute('aria-selected', b === btn); b.tabIndex = b === btn ? 0 : -1;
      });
      items.forEach(it => { it.hidden = cat !== 'all' && it.dataset.cat !== cat; it.classList.add('is-in'); });
    }));
  }

  /* ---- count-up numbers ---- */
  const nums = document.querySelectorAll('[data-count]');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
      const start = end > 1000 ? end - 60 : 0, t0 = performance.now(), d = 1400;
      const tick = now => {
        const p = Math.min((now - t0) / d, 1), v = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
        el.textContent = v + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    nums.forEach(n => io.observe(n));
  }
})();
