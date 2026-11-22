/* ==========================================================================
   FEEV — home page (the hero bubble lives in hero.js, the cart in cart.js).
   1. Product sections rendered from shop-data.js
   2. Palettes: colour bubbles switch the packshot, "담기" adds that shade
   3. Reveal on scroll  4. Active nav link
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const P = window.FEEV_PRODUCTS;
  const fmt = window.FEEV_FMT;
  const label = window.FEEV_SHADE_LABEL;

  /* 1. PRODUCT SECTIONS
     ------------------------------------------------------------------------ */
  const host = document.getElementById('products');
  host.innerHTML = P.map((p, i) => {
    const s0 = p.shades[0];
    const swatches = p.shades.map((s, j) => `
      <button class="swatch" type="button" role="radio" aria-checked="${j === 0}" tabindex="${j === 0 ? 0 : -1}"
              data-no="${s.no}" style="--c:${s.hex}" aria-label="${label(s)}"><span class="swatch__bubble"></span></button>`).join('');
    return `
    <section class="product product--${p.id}" id="${p.id}" aria-labelledby="${p.id}-title" data-id="${p.id}">
      <div class="container product__grid">
        <figure class="product__pack reveal">
          <div class="product__frame">
            <img class="js-pack" src="${p.img(s0.no)}-1000.webp" srcset="${p.img(s0.no)}-600.webp 600w, ${p.img(s0.no)}-1000.webp 1000w"
                 sizes="(min-width: 960px) 46vw, 92vw" width="1000" height="1000" loading="lazy" decoding="async"
                 alt="${p.ko} ${label(s0)}">
          </div>
          ${p.id === 'gloss' ? `<span class="float-bubble float-bubble--a" aria-hidden="true"></span>
          <span class="float-bubble float-bubble--b" aria-hidden="true"></span>` : ''}
        </figure>

        <div class="product__info reveal">
          <p class="product__index"><span>0${i + 1}</span> / 0${P.length}${p.tag ? ` <b class="badge badge--mini">${p.tag}</b>` : ''}</p>
          <h2 class="product__name" id="${p.id}-title"><span lang="en">${p.en}</span><span class="product__ko">${p.ko}</span></h2>
          <p class="product__desc">${p.desc}</p>
          <dl class="product__meta">
            <div><dt>Finish</dt><dd>${p.finish}</dd></div>
            <div><dt>Colors</dt><dd>${p.shades.length}</dd></div>
            <div><dt>Price</dt><dd>${fmt(p.price)}</dd></div>
          </dl>

          <div class="palette palette--${p.texture}">
            <p class="palette__head"><span>Color</span><span class="palette__label" aria-live="polite">${label(s0)}</span></p>
            <div class="palette__row" role="radiogroup" aria-label="${p.ko} 컬러">${swatches}</div>
          </div>

          <div class="product__cta">
            <button class="btn btn--gloss js-add" type="button">장바구니 담기</button>
            <a class="link" href="${window.FEEV_URL(p.id)}">자세히 보기</a>
          </div>
        </div>
      </div>
    </section>`;
  }).join('');


  /* 2. PALETTES
     ------------------------------------------------------------------------ */
  $$('.product').forEach((section) => {
    const p = P.find((x) => x.id === section.dataset.id);
    const swatches = $$('.swatch', section);
    const frame = section.querySelector('.product__frame');
    const img = section.querySelector('.js-pack');
    const out = section.querySelector('.palette__label');
    let current = p.shades[0].no;

    const select = (btn, focus) => {
      swatches.forEach((b) => {
        const on = b === btn;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      if (focus) btn.focus();
      const s = p.shades.find((x) => x.no === btn.dataset.no);
      current = s.no;
      out.textContent = label(s);
      section.style.setProperty('--shade', s.hex);
      const base = p.img(s.no);
      const apply = () => {
        img.srcset = `${base}-600.webp 600w, ${base}-1000.webp 1000w`;
        img.src = `${base}-1000.webp`;
        img.alt = `${p.ko} ${label(s)}`;
      };
      if (reduceMotion) { apply(); return; }
      frame.classList.add('is-switching');
      setTimeout(() => {
        apply();
        const done = () => frame.classList.remove('is-switching');
        img.decode ? img.decode().then(done, done) : done();
      }, 200);
    };

    swatches.forEach((b, i) => {
      b.addEventListener('click', () => { if (b.getAttribute('aria-checked') !== 'true') select(b); });
      b.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (step == null && e.key !== 'Home' && e.key !== 'End') return;
        e.preventDefault();
        const n = e.key === 'Home' ? 0 : e.key === 'End' ? swatches.length - 1 : (i + step + swatches.length) % swatches.length;
        select(swatches[n], true);
      });
    });
    section.style.setProperty('--shade', p.shades[0].hex);

    section.querySelector('.js-add').addEventListener('click', () => window.FEEVCart.add(p.id, current));

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries, obs) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        p.shades.forEach((s) => { new Image().src = `${p.img(s.no)}-1000.webp`; });
        obs.disconnect();
      }, { rootMargin: '600px 0px' }).observe(section);
    }
  });


  /* 3. REVEAL
     ------------------------------------------------------------------------ */
  const reveals = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }


  /* 4. ACTIVE NAV LINK
     ------------------------------------------------------------------------ */
  const navLinks = $$('.nav a[data-nav]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => {
          const on = a.dataset.nav === en.target.id;
          a.classList.toggle('is-active', on);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.product').forEach((s) => io.observe(s));
  }
})();
