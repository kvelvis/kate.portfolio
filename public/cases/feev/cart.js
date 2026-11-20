/* ==========================================================================
   FEEV — cart (shared by index.html and products.html).
   Stored per browser in localStorage (demo shop, no checkout backend).
   API: FEEVCart.add(productId, shadeNo, qty = 1) · FEEVCart.open()
   Needs: shop-data.js loaded first; a .js-cart-open button and .js-cart-count
   in the header. The drawer markup is injected here so both pages share it.
   ========================================================================== */
(() => {
  'use strict';

  const KEY = 'feev-cart-v1';
  const P = window.FEEV_PRODUCTS || [];
  const fmt = window.FEEV_FMT;
  const find = (id, no) => {
    const p = P.find((x) => x.id === id);
    const s = p && p.shades.find((x) => x.no === no);
    return p && s ? { p, s } : null;
  };

  /* ---------- storage (falls back to memory if storage is blocked) ---------- */
  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch (_) { items = []; }
  items = items.filter((it) => find(it.id, it.no) && it.qty > 0);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (_) {} };

  /* ---------- drawer markup ---------- */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="cart" id="cart" hidden>
      <div class="cart__scrim" data-cart-close></div>
      <aside class="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1">
        <header class="cart__head">
          <h2 class="cart__title" id="cart-title">장바구니 <span class="cart__n"></span></h2>
          <button class="cart__close" type="button" data-cart-close aria-label="장바구니 닫기">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
        </header>
        <ul class="cart__list"></ul>
        <div class="cart__empty">
          <span class="cart__empty-bubble" aria-hidden="true"></span>
          <p>장바구니가 비어 있어요.</p>
          <a class="btn btn--gloss" href="./products.html">쇼핑하러 가기</a>
        </div>
        <footer class="cart__foot">
          <p class="cart__row"><span>상품 금액</span><span class="cart__sub"></span></p>
          <p class="cart__row"><span>배송비</span><span class="cart__ship"></span></p>
          <p class="cart__row cart__row--total"><span>합계</span><span class="cart__total"></span></p>
          <button class="btn btn--gloss cart__checkout" type="button">주문하기</button>
          <p class="cart__note" role="status"></p>
        </footer>
      </aside>
    </div>
    <div class="toast" role="status" aria-live="polite"></div>
  `);

  const root = document.getElementById('cart');
  const panel = root.querySelector('.cart__panel');
  const list = root.querySelector('.cart__list');
  const toastEl = document.querySelector('.toast');
  let lastFocus = null, toastTimer = 0;

  const FREE_SHIP = 30000, SHIP = 3000;

  function render() {
    const count = items.reduce((n, it) => n + it.qty, 0);
    document.querySelectorAll('.js-cart-count').forEach((el) => {
      el.textContent = count;
      el.hidden = count === 0;
    });
    document.querySelectorAll('.js-cart-open').forEach((b) => b.setAttribute('aria-label', `장바구니, ${count}개`));
    root.querySelector('.cart__n').textContent = count ? `(${count})` : '';
    root.classList.toggle('is-empty', count === 0);

    list.innerHTML = items.map((it, i) => {
      const { p, s } = find(it.id, it.no);
      const label = window.FEEV_SHADE_LABEL(s);
      return `
        <li class="cart-item">
          <img src="${p.img(s.no)}-600.webp" width="600" height="600" alt="" loading="lazy">
          <div class="cart-item__body">
            <p class="cart-item__name">${p.en}</p>
            <p class="cart-item__shade"><span class="dot dot--${p.texture}" style="--c:${s.hex}"></span>${label}</p>
            <div class="qty" role="group" aria-label="${p.ko} ${label} 수량">
              <button type="button" data-dec="${i}" aria-label="하나 빼기">−</button>
              <span aria-live="polite">${it.qty}</span>
              <button type="button" data-inc="${i}" aria-label="하나 더하기">+</button>
            </div>
          </div>
          <div class="cart-item__side">
            <p class="cart-item__price">${fmt(p.price * it.qty)}</p>
            <button class="cart-item__remove" type="button" data-remove="${i}">삭제</button>
          </div>
        </li>`;
    }).join('');

    const sub = items.reduce((n, it) => n + find(it.id, it.no).p.price * it.qty, 0);
    const ship = sub === 0 || sub >= FREE_SHIP ? 0 : SHIP;
    root.querySelector('.cart__sub').textContent = fmt(sub);
    root.querySelector('.cart__ship').textContent = ship ? fmt(ship) : (sub ? '무료' : '—');
    root.querySelector('.cart__total').textContent = fmt(sub + ship);
    root.querySelector('.cart__note').textContent = sub && sub < FREE_SHIP ? `${fmt(FREE_SHIP - sub)} 더 담으면 무료배송` : '';
  }

  list.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const i = +(b.dataset.inc ?? b.dataset.dec ?? b.dataset.remove);
    if (b.dataset.inc != null) items[i].qty = Math.min(9, items[i].qty + 1);
    if (b.dataset.dec != null) items[i].qty -= 1;
    if (b.dataset.remove != null || items[i].qty <= 0) items.splice(i, 1);
    save(); render();
    (list.querySelector(`[data-inc="${Math.min(i, items.length - 1)}"]`) || panel).focus();
  });

  /* ---------- open / close (focus trapped while open) ---------- */
  function open() {
    lastFocus = document.activeElement;
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add('is-open'));
    document.documentElement.classList.add('cart-lock');
    panel.focus();
  }
  function close() {
    root.classList.remove('is-open');
    document.documentElement.classList.remove('cart-lock');
    const done = () => { root.hidden = true; };
    matchMedia('(prefers-reduced-motion: reduce)').matches ? done() : setTimeout(done, 350);
    lastFocus && lastFocus.focus();
  }
  root.addEventListener('click', (e) => { if (e.target.closest('[data-cart-close]')) close(); });
  document.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = [...panel.querySelectorAll('button, a[href]')].filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.addEventListener('click', (e) => { if (e.target.closest('.js-cart-open')) open(); });

  root.querySelector('.cart__checkout').addEventListener('click', () => {
    root.querySelector('.cart__note').textContent = '포트폴리오 데모 페이지라 실제 주문은 진행되지 않아요.';
  });

  /* ---------- toast ---------- */
  function toast(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2400);
  }

  /* ---------- public API ---------- */
  function add(id, no, qty = 1) {
    const hit = find(id, no);
    if (!hit) return;
    const ex = items.find((it) => it.id === id && it.no === no);
    if (ex) ex.qty = Math.min(9, ex.qty + qty); else items.push({ id, no, qty });
    save(); render();
    toast(`<span class="dot dot--${hit.p.texture}" style="--c:${hit.s.hex}"></span>${hit.p.en} · ${window.FEEV_SHADE_LABEL(hit.s)} 담았어요 <button type="button" class="toast__link js-cart-open">보기</button>`);
    document.querySelectorAll('.js-cart-open .cart-btn__bubble').forEach((el) => {
      el.classList.remove('is-pop'); void el.offsetWidth; el.classList.add('is-pop');
    });
  }

  window.FEEVCart = { add, open, close };
  render();
})();
