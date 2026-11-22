/* ==========================================================================
   FEEV — product page: product.html?id=gloss&shade=03
   Packshot of the chosen shade, colour picker, quantity, add to cart, wishlist, the long detail
   image (img/*_sw.jpg), product info, ingredients, how to use, shipping &
   returns, other products. Everything comes from shop-data.js.
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P = window.FEEV_PRODUCTS;
  const fmt = window.FEEV_FMT;
  const label = window.FEEV_SHADE_LABEL;
  const INFO = window.FEEV_INFO;
  const q = new URLSearchParams(location.search);
  const p = P.find((x) => x.id === q.get('id'));
  if (!p) { location.replace('./products.html'); return; }
  const D = window.FEEV_DETAILS[p.id];
  let shade = p.shades.find((s) => s.no === q.get('shade')) || p.shades[0];

  document.title = `${p.en} ${p.ko} — FEEV`;
  document.querySelector('meta[name="description"]').content = `${p.ko} ${p.shades.length}가지 컬러. ${p.desc}`;
  document.querySelector('meta[property="og:title"]').content = `${p.en} — FEEV`;

  const li = (arr) => arr.map((t) => `<li>${t}</li>`).join('');
  const swatches = p.shades.map((s) => `
    <button class="swatch" type="button" role="radio" aria-checked="${s === shade}" tabindex="${s === shade ? 0 : -1}"
            data-no="${s.no}" style="--c:${s.hex}" aria-label="${label(s)}"><span class="swatch__bubble"></span></button>`).join('');

  const main = document.getElementById('main');
  main.innerHTML = `
  <nav class="crumbs container" aria-label="현재 위치">
    <a href="./products.html">Shop</a><span aria-hidden="true">/</span><span aria-current="page" lang="en">${p.en}</span>
  </nav>

  <section class="pdp__top container" aria-labelledby="pdp-title">
    <div class="pdp__gallery">
      <div class="pdp__stage product__frame">
        <img class="pdp__pack" src="${p.img(shade.no)}-1000.webp" srcset="${p.img(shade.no)}-600.webp 600w, ${p.img(shade.no)}-1000.webp 1000w"
             sizes="(min-width: 960px) 46vw, 92vw" width="1000" height="1000" decoding="async" alt="${p.ko} ${label(shade)}">
        ${window.FEEV_BADGES(p, 'pdp__tags')}
      </div>
    </div>

    <div class="pdp__info">
      <h1 class="product__name" id="pdp-title"><span lang="en">${p.en}</span><span class="product__ko">${p.ko}</span></h1>
      <p class="pdp__price">${fmt(p.price)}</p>
      <p class="product__desc">${p.desc}</p>
      <dl class="product__meta">
        <div><dt>Finish</dt><dd>${p.finish}</dd></div>
        <div><dt>Volume</dt><dd>${D.volume}</dd></div>
        <div><dt>Colors</dt><dd>${p.shades.length}</dd></div>
      </dl>

      <div class="palette palette--${p.texture}">
        <p class="palette__head"><span>Color</span><span class="palette__label" aria-live="polite">${label(shade)}</span></p>
        <div class="palette__row" role="radiogroup" aria-label="${p.ko} 컬러">${swatches}</div>
      </div>

      <div class="pdp__qty">
        <span class="pdp__qty-label" id="qty-label">수량</span>
        <div class="qty qty--pdp" role="group" aria-labelledby="qty-label">
          <button type="button" data-step="-1" aria-label="하나 빼기" disabled>−</button>
          <output class="js-qty" aria-live="polite">1</output>
          <button type="button" data-step="1" aria-label="하나 더하기">+</button>
        </div>
      </div>

      <div class="pdp__buy">
        <button class="btn btn--gloss pdp__add" type="button">장바구니 담기</button>
        <button class="wish wish--big js-wish" type="button" data-wish="${p.id}" aria-pressed="false" aria-label="${p.ko} 찜하기">${window.FEEV_HEART}</button>
      </div>

      <ul class="pdp__perks">
        <li><b>무료배송</b> 3만 원 이상 구매 시</li>
        <li><b>당일 출고</b> 평일 오후 2시 이전 주문</li>
        <li><b>교환·반품</b> 수령 후 7일 이내</li>
      </ul>
    </div>
  </section>

  ${D.detail ? `
  <section class="pdp__detail container" aria-label="상세 이미지">
    <img src="${D.detail.src}" width="${D.detail.w}" height="${D.detail.h}" loading="lazy" decoding="async" alt="${D.detail.alt}">
  </section>` : ''}

  <section class="pdp__details container" aria-label="제품 상세 정보">
    <details class="acc" open>
      <summary>제품 정보</summary>
      <div class="acc__body">
        <dl class="spec">
          <div><dt>용량</dt><dd>${D.volume}</dd></div>
          <div><dt>피니시</dt><dd>${p.finish}</dd></div>
          <div><dt>사용 기한</dt><dd>${INFO.shelfLife}</dd></div>
          <div><dt>제조국</dt><dd>${INFO.origin}</dd></div>
          <div><dt>제조·판매</dt><dd>FEEV</dd></div>
        </dl>
        <h3 class="acc__h3">사용 시 주의사항</h3>
        <ul class="acc__list">${li(INFO.caution)}</ul>
      </div>
    </details>
    <details class="acc">
      <summary>전성분</summary>
      <div class="acc__body"><p class="acc__text">${D.ingredients}</p><p class="pdp__note">포트폴리오용 예시 전성분입니다.</p></div>
    </details>
    <details class="acc">
      <summary>사용 방법</summary>
      <div class="acc__body"><ol class="acc__steps">${li(D.how)}</ol></div>
    </details>
    <details class="acc">
      <summary>배송 · 교환/반품</summary>
      <div class="acc__body">
        <h3 class="acc__h3">배송</h3><ul class="acc__list">${li(INFO.shipping)}</ul>
        <h3 class="acc__h3">교환 · 반품</h3><ul class="acc__list">${li(INFO.returns)}</ul>
      </div>
    </details>
  </section>

  <section class="pdp__more container" aria-labelledby="more-title">
    <h2 class="pdp__h2" id="more-title">다른 제품</h2>
    <ul class="pgrid pgrid--two">${P.filter((x) => x !== p).map(window.FEEV_CARD).join('')}</ul>
  </section>`;

  /* ---------- colour ---------- */
  const stage = main.querySelector('.pdp__stage');
  const pack = main.querySelector('.pdp__pack');
  const out = main.querySelector('.palette__label');
  const radios = [...main.querySelectorAll('.swatch')];

  function select(s, focus = false) {
    const changed = s !== shade;
    shade = s;
    radios.forEach((b) => {
      const on = b.dataset.no === s.no;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    out.textContent = label(s);
    main.style.setProperty('--shade', s.hex);
    history.replaceState(null, '', window.FEEV_URL(p.id, s.no));
    const base = p.img(s.no);
    const apply = () => {
      pack.srcset = `${base}-600.webp 600w, ${base}-1000.webp 1000w`;
      pack.src = `${base}-1000.webp`;
      pack.alt = `${p.ko} ${label(s)}`;
    };
    if (!changed || reduceMotion) { apply(); return; }
    stage.classList.add('is-switching');
    setTimeout(() => {
      apply();
      const done = () => stage.classList.remove('is-switching');
      pack.decode ? pack.decode().then(done, done) : done();
    }, 180);
  }
  radios.forEach((b, i) => {
    b.addEventListener('click', () => select(p.shades.find((s) => s.no === b.dataset.no)));
    b.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (step == null && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? radios.length - 1 : (i + step + radios.length) % radios.length;
      select(p.shades[n], true);
    });
  });

  /* ---------- quantity + cart ---------- */
  let qty = 1;
  const qtyOut = main.querySelector('.js-qty');
  const [minus, plus] = main.querySelectorAll('.qty--pdp button');
  main.querySelector('.qty--pdp').addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]');
    if (!b) return;
    qty = Math.min(9, Math.max(1, qty + Number(b.dataset.step)));
    qtyOut.textContent = qty;
    minus.disabled = qty === 1;
    plus.disabled = qty === 9;
  });
  main.querySelector('.pdp__add').addEventListener('click', () => window.FEEVCart.add(p.id, shade.no, qty));
  window.FEEVWish.sync();

  /* ---------- other products ---------- */
  window.FEEV_CARDS_INIT(main.querySelector('.pdp__more'));

  /* ---------- nav: highlight this product's category ---------- */
  document.querySelector(`.nav a[data-nav="${p.id}"]`)?.classList.add('is-active');

  select(shade);
  p.shades.forEach((s) => { new Image().src = `${p.img(s.no)}-1000.webp`; });
})();
