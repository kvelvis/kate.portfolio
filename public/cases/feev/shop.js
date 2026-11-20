/* ==========================================================================
   FEEV — Shop page: one card per colour (SKU), filter by product, add to cart.
   URL hash (#gloss / #tint / #blush) preselects the filter.
   ========================================================================== */
(() => {
  'use strict';

  const P = window.FEEV_PRODUCTS;
  const fmt = window.FEEV_FMT;
  const label = window.FEEV_SHADE_LABEL;
  const grid = document.getElementById('grid');
  const filters = [...document.querySelectorAll('.filter')];

  grid.innerHTML = P.flatMap((p) => p.shades.map((s) => `
    <li class="card" data-id="${p.id}" style="--c:${s.hex}">
      <div class="card__frame">
        <img src="${p.img(s.no)}-600.webp" srcset="${p.img(s.no)}-600.webp 600w, ${p.img(s.no)}-1000.webp 1000w"
             sizes="(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw"
             width="600" height="600" loading="lazy" decoding="async" alt="${p.ko} ${label(s)}">
        ${p.tag ? `<span class="badge badge--mini card__tag">${p.tag}</span>` : ''}
      </div>
      <div class="card__body">
        <p class="card__product">${p.en}</p>
        <p class="card__shade"><span class="dot dot--${p.texture}" aria-hidden="true"></span>${label(s)}</p>
        <p class="card__price">${fmt(p.price)}</p>
      </div>
      <button class="card__add" type="button" data-id="${p.id}" data-no="${s.no}" aria-label="${p.ko} ${label(s)} 장바구니 담기">
        <span aria-hidden="true">+</span>
      </button>
    </li>`)).join('');

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.card__add');
    if (!b) return;
    window.FEEVCart.add(b.dataset.id, b.dataset.no);
    b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop');
  });

  function apply(f) {
    filters.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
    grid.querySelectorAll('.card').forEach((c) => { c.hidden = f !== 'all' && c.dataset.id !== f; });
  }
  filters.forEach((b) => b.addEventListener('click', () => {
    apply(b.dataset.filter);
    history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : `#${b.dataset.filter}`);
  }));
  const fromHash = () => {
    const h = location.hash.slice(1);
    apply(P.some((p) => p.id === h) ? h : 'all');
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();

  document.querySelector('.nav a[data-nav="shop"]')?.setAttribute('aria-current', 'page');
  document.querySelector('.nav a[data-nav="shop"]')?.classList.add('is-active');
})();
