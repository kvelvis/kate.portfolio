/* ==========================================================================
   FEEV — Shop page: one card per product, tabs by type (All / Gloss / Tint / Blush / 찜).
   products.html?cat=tint opens with that tab (the header links use this);
   old links like products.html#tint work the same way.
   The colour dots on a card preview each shade; the card opens product.html.
   ========================================================================== */
(() => {
  'use strict';

  const P = window.FEEV_PRODUCTS;
  const grid = document.getElementById('grid');
  const filters = [...document.querySelectorAll('.filter')];
  const navLinks = [...document.querySelectorAll('.nav a[data-nav]')];

  grid.innerHTML = P.map(window.FEEV_CARD).join('');
  window.FEEV_CARDS_INIT(grid);
  window.FEEVWish.sync();
  const empty = document.getElementById('wish-empty');
  let current = 'all';

  const total = P.reduce((n, p) => n + p.shades.length, 0);
  const sub = document.querySelector('.shop__sub');
  if (sub) sub.textContent = `${P.length}가지 제품 · ${total}가지 컬러`;

  const valid = (c) => (c === 'wish' || P.some((p) => p.id === c) ? c : 'all');
  function apply(cat) {
    filters.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
    current = cat;
    const show = (id) => cat === 'all' || (cat === 'wish' ? window.FEEVWish.has(id) : id === cat);
    grid.querySelectorAll('.pcard').forEach((c) => { c.hidden = !show(c.dataset.id); });
    empty.hidden = !(cat === 'wish' && !window.FEEVWish.list().length);
    // header: the chosen type, or "Shop" for all
    navLinks.forEach((a) => {
      const on = a.dataset.nav === (cat === 'all' || cat === 'wish' ? 'shop' : cat);
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  const fromUrl = () => valid(new URLSearchParams(location.search).get('cat') || location.hash.slice(1));

  filters.forEach((b) => b.addEventListener('click', () => {
    apply(b.dataset.filter);
    history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : `?cat=${b.dataset.filter}`);
  }));
  // header links to the same page (products.html?cat=…) switch the tab without a reload
  navLinks.forEach((a) => a.addEventListener('click', (e) => {
    const url = new URL(a.href);
    if (url.pathname !== location.pathname) return;
    e.preventDefault();
    const cat = valid(url.searchParams.get('cat'));
    apply(cat);
    history.replaceState(null, '', cat === 'all' ? location.pathname : `?cat=${cat}`);
  }));
  window.addEventListener('hashchange', () => apply(fromUrl()));
  // un-hearting a card while on the 찜 tab removes it from the list
  document.addEventListener('feev:wish', () => { if (current === 'wish') apply('wish'); });
  document.querySelector('.js-show-all').addEventListener('click', () => {
    apply('all');
    history.replaceState(null, '', location.pathname);
  });
  // the header heart (products.html?cat=wish) on this page: switch tab without a reload
  document.querySelector('.wish-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    apply('wish');
    history.replaceState(null, '', '?cat=wish');
  });
  apply(fromUrl());
})();
