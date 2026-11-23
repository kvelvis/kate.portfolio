/* SIYAZU: shared runtime (both pages). Korean-only.
   Bag (Bootstrap Offcanvas + Toast), film segments (Vimeo or native <video>),
   fullscreen film (Bootstrap Modal), native <dialog>s, newsletter, reveal. */

(() => {
  const S = window.SIYAZU;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const BS = () => window.bootstrap;

  /* ── Storage (never required for the page to work) ── */
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  /* ── Motion preference (live) ── */
  const rmq = matchMedia("(prefers-reduced-motion: reduce)");
  const motion = { get reduced() { return rmq.matches; } };

  /* ── Text ── */
  const t = (key, ...args) => { const v = S.t[key] ?? key; return typeof v === "function" ? v(...args) : v; };
  const L = (obj) => (obj ? obj.ko ?? obj.en ?? "" : "");
  const won = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 });
  const price = (n) => won.format(n);
  const productById = (id) => S.products.find((p) => p.id === id);
  const colorKo = (c) => c.ko || c.name;
  const sizeKo = (s) => (s === "F" ? t("sizes").F : s);
  const isSoldOut = (p, colorName, size) => !!p.soldOut?.[colorName]?.includes(size);
  const shipFee = (sub) => (sub >= S.info.freeShip || !sub ? 0 : S.info.shipFee);

  /* ── Bag ── */
  const bag = {
    items: store.get("siyazu-bag", []).filter((i) => productById(i.id)),
    last: -1,
    count() { return this.items.reduce((n, i) => n + i.qty, 0); },
    add(id, color, size) {
      let idx = this.items.findIndex((i) => i.id === id && i.color === color && i.size === size);
      if (idx > -1) this.items[idx].qty++;
      else idx = this.items.push({ id, color, size, qty: 1 }) - 1;
      this.last = idx;
      this.save();
    },
    remove(idx) { this.items.splice(idx, 1); this.last = -1; this.save(); },
    setQty(idx, qty) { this.items[idx].qty = Math.max(1, Math.min(9, qty)); this.save(); },
    // change size in the bag; merges into an existing line with the same colour + size
    setSize(idx, size) {
      const it = this.items[idx];
      const dup = this.items.findIndex((i, j) => j !== idx && i.id === it.id && i.color === it.color && i.size === size);
      if (dup > -1) { this.items[dup].qty = Math.min(9, this.items[dup].qty + it.qty); this.items.splice(idx, 1); }
      else it.size = size;
      this.save();
    },
    subtotal() { return this.items.reduce((s, it) => s + productById(it.id).price * it.qty, 0); },
    clear() { this.items = []; this.save(); },
    save() { store.set("siyazu-bag", this.items); document.dispatchEvent(new CustomEvent("bag:change")); },
  };

  /* ── Demo account (no backend): { name, email, phone, address, joined } in localStorage ── */
  const user = {
    get() { return store.get("siyazu-user", null); },
    set(u) { store.set("siyazu-user", u); },
    update(patch) { const u = this.get(); if (u) this.set({ ...u, ...patch }); },
    logout() { try { localStorage.removeItem("siyazu-user"); } catch { /* ignore */ } },
  };

  /* ── Wishlist (heart on cards, quick view and product page; the list is in 마이페이지) ── */
  const wish = {
    ids: store.get("siyazu-wish", []).filter((id) => productById(id)),
    has(id) { return this.ids.includes(id); },
    toggle(id) {
      this.ids = this.has(id) ? this.ids.filter((x) => x !== id) : [id, ...this.ids];
      store.set("siyazu-wish", this.ids);
      document.dispatchEvent(new CustomEvent("wish:change", { detail: id }));
    },
  };
  const HEART = '<svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.6-4.6-9.2-9.4C1.7 7.6 3.9 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.3 0 5.5 3.1 4.4 6.4-1.6 4.8-9.2 9.4-9.2 9.4z"/></svg>';
  const wishBtn = (p, cls = "") =>
    `<button class="wish-btn ${cls}" type="button" data-wish="${p.id}" aria-pressed="${wish.has(p.id)}" aria-label="${t("wishAdd")}: ${L(p.name)}">${HEART}</button>`;
  function syncWish() {
    $$("[data-wish]").forEach((b) => b.setAttribute("aria-pressed", String(wish.has(b.dataset.wish))));
    $$("[data-wish-count]").forEach((el) => { el.textContent = wish.ids.length; });
    renderWish();
  }
  function renderWish() {
    const list = $("#wish-list"); if (!list) return;
    if (!wish.ids.length) { list.innerHTML = `<p class="drawer__empty">${t("wishEmpty")}</p>`; return; }
    list.innerHTML = '<ul class="bag-items">' + wish.ids.map((id) => {
      const p = productById(id), col = p.colors[0];
      return `<li class="bag-item">
        <a href="product.html?id=${p.id}"><img src="${col.images[0]}" alt="" width="96" height="128" loading="lazy"></a>
        <div class="bag-item__info">
          <a class="bag-item__name" href="product.html?id=${p.id}">${L(p.name)}</a>
          <p>${price(p.price)}</p>
        </div>
        <button class="link-btn label" type="button" data-wish-remove="${p.id}">${t("remove")}</button>
      </li>`;
    }).join("") + "</ul>";
  }
  function initWish() {
    // the wishlist lives in 마이페이지 (header: 검색 · 마이페이지 · 장바구니).
    // account link: "로그인" for guests, "마이페이지" once signed in (demo)
    $$('a[href="order.html"], a[href="mypage.html"]').forEach((a) => {
      if (a.closest(".od, .co")) return;
      a.href = "mypage.html";
      a.textContent = user.get() ? t("mypage") : t("login");
    });
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-wish]");
      if (b) { e.preventDefault(); e.stopPropagation(); wish.toggle(b.dataset.wish); return; }
      const r = e.target.closest("[data-wish-remove]");
      if (r) wish.toggle(r.dataset.wishRemove);
    }, true);
    document.addEventListener("wish:change", syncWish);
    syncWish();
  }

  /* ── "N명이 보는 중": shown on about a third of the products, the number drifts every hour ── */
  const hash = (str) => [...str].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const viewers = (p) => {
    const h = hash(p.id);
    return h % 3 ? 0 : 3 + ((h >> 4) + new Date().getHours()) % 9;
  };

  function renderBagCount(bump) {
    $$("[data-bag-count]").forEach((el) => {
      el.textContent = bag.count();
      if (bump && !motion.reduced) {
        const host = el.closest(".bag-btn") || el;
        host.classList.remove("is-bump"); void host.offsetWidth; host.classList.add("is-bump");
      }
    });
  }

  function renderBag() {
    const list = $("#bag-list"); if (!list) return;
    const foot = $("#bag-foot");
    if (!bag.items.length) { list.innerHTML = `<p class="drawer__empty">${t("bagEmpty")}</p>`; foot.hidden = true; return; }
    foot.hidden = false;
    list.innerHTML = '<ul class="bag-items">' + bag.items.map((it, i) => {
      const p = productById(it.id); const col = p.colors.find((c) => c.name === it.color) || p.colors[0];
      const sizeCtl = p.sizes.length > 1
        ? `<select class="bag-item__size" data-size="${i}" aria-label="${t("changeSize")}: ${L(p.name)}">
            ${p.sizes.map((s) => `<option value="${s}" ${s === it.size ? "selected" : ""} ${isSoldOut(p, it.color, s) && s !== it.size ? "disabled" : ""}>${t("size")} ${sizeKo(s)}${isSoldOut(p, it.color, s) ? ` (${t("soldOut")})` : ""}</option>`).join("")}
          </select>`
        : `<span>${t("size")} ${sizeKo(it.size)}</span>`;
      return `<li class="bag-item${i === bag.last ? " is-new" : ""}">
        <a href="product.html?id=${p.id}"><img src="${col.images[0]}" alt="" width="96" height="128" loading="lazy"></a>
        <div class="bag-item__info">
          <a class="bag-item__name" href="product.html?id=${p.id}">${L(p.name)}</a>
          <p class="muted bag-item__opts">${colorKo(col)} · ${sizeCtl}</p>
          <div class="bag-item__row">
            <div class="qty" role="group" aria-label="수량">
              <button type="button" data-qty="${i}" data-step="-1" aria-label="${t("qtyMinus")}" ${it.qty <= 1 ? "disabled" : ""}>−</button>
              <output aria-live="polite">${it.qty}</output>
              <button type="button" data-qty="${i}" data-step="1" aria-label="${t("qtyPlus")}" ${it.qty >= 9 ? "disabled" : ""}>+</button>
            </div>
            <p>${price(p.price * it.qty)}</p>
          </div>
        </div>
        <button class="link-btn label" type="button" data-remove="${i}">${t("remove")}</button>
      </li>`;
    }).join("") + "</ul>";
    const total = bag.subtotal();
    $("#bag-subtotal").textContent = price(total);
    let ship = $("#bag-ship");
    if (!ship) {
      $("#bag-subtotal").closest(".drawer__total").insertAdjacentHTML("afterend",
        '<div class="ship-meter" id="bag-ship"><p class="ship-meter__text"></p><div class="ship-meter__bar"><i></i></div></div>');
      ship = $("#bag-ship");
    }
    const left = S.info.freeShip - total;
    $(".ship-meter__text", ship).textContent = left > 0 ? t("shipProgress", price(left)) : t("shipFree");
    $(".ship-meter__bar i", ship).style.width = Math.min(100, (total / S.info.freeShip) * 100) + "%";
    ship.classList.toggle("is-done", left <= 0);
  }

  /* Bag offcanvas + "closed quickly" toast */
  let bagShownAt = 0, bagFromAdd = false;
  function showBag(fromAdd = false) {
    const el = $("#bag"); if (!el || !BS()) return;
    bagFromAdd = fromAdd;
    renderBag();
    BS().Offcanvas.getOrCreateInstance(el).show();
  }
  function wireBag() {
    const el = $("#bag"); if (!el) return;
    el.addEventListener("show.bs.offcanvas", () => { renderBag(); bagShownAt = Date.now(); });
    el.addEventListener("hidden.bs.offcanvas", () => {
      // Closed within 2 s of an add: confirm with a toast so the add isn't missed.
      if (bagFromAdd && Date.now() - bagShownAt < 2000) BS()?.Toast.getOrCreateInstance($("#bag-toast")).show();
      bagFromAdd = false; bag.last = -1;
    });
    $("#bag-list").addEventListener("click", (e) => {
      const q = e.target.closest("[data-qty]");
      if (q) {
        const i = +q.dataset.qty;
        bag.setQty(i, bag.items[i].qty + +q.dataset.step); renderBag();
        $(`#bag-list [data-qty="${i}"][data-step="${q.dataset.step}"]`)?.focus();
        return;
      }
      const b = e.target.closest("[data-remove]"); if (!b) return;
      bag.remove(+b.dataset.remove); renderBag(); $("#bag .offcanvas-header button")?.focus();
    });
    $("#bag-list").addEventListener("change", (e) => {
      const sel = e.target.closest("[data-size]"); if (!sel) return;
      bag.setSize(+sel.dataset.size, sel.value); renderBag();
    });
    // "주문하기" → checkout page
    $$("#bag-foot .sz-btn--solid:not(.co-bag-done)").forEach((b) => b.addEventListener("click", () => { location.href = "checkout.html"; }));
  }

  /* Called by the purchase form after a successful add */
  function afterAdd() {
    renderBagCount(true);
    const qv = $("#qv");
    if (qv?.open) qv.close();          // native dialog sits in the top layer; close it first
    setTimeout(() => showBag(true), 450); // let the button's "담았어요 ✓" register first
  }

  /* ── Native <dialog>s (menu, search, quick view): scroll lock, backdrop click, focus return ── */
  function openDialog(dlg, opener) {
    if (!dlg || dlg.open) return;
    dlg._opener = opener || document.activeElement;
    dlg.showModal();
    document.documentElement.classList.add("is-locked");
  }
  function wireDialog(dlg) {
    if (!dlg || dlg._wired) return; dlg._wired = true;
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    $$("[data-close]", dlg).forEach((b) => b.addEventListener("click", () => dlg.close()));
    dlg.addEventListener("close", () => {
      if (!$$("dialog[open]").length) document.documentElement.classList.remove("is-locked");
      if (!dlg._noReturn) dlg._opener?.focus?.({ preventScroll: true });
      dlg._noReturn = false;
    });
  }

  /* ── Film segment: loops start→end. Vimeo background embed, or native <video> if seg.src ── */
  class Film {
    constructor(el, seg, title = S.film.title) {
      this.el = el; this.seg = seg; this.title = title;
      this.frame = $(".film__frame", el); this.player = null; this.video = null; this.want = false;
    }
    mount() {
      if (this.player || this.video || motion.reduced) return;
      const { id, start, src } = this.seg;
      if (src) {
        const v = (this.video = document.createElement("video"));
        Object.assign(v, { muted: true, playsInline: true, preload: "auto", src: `${src}#t=${start}` });
        v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
        v.addEventListener("timeupdate", () => { if (v.currentTime >= this.seg.end) v.currentTime = this.seg.start; });
        v.addEventListener("playing", () => this.el.classList.add("is-playing"));
        v.addEventListener("error", () => this.el.classList.add("is-failed"));
        this.frame.append(v);
        if (this.want) v.play().catch(() => {});
        return;
      }
      if (!window.Vimeo) return;
      // the hero iframe is created inline in index.html so it starts loading with the page
      let f = this.frame.querySelector("iframe");
      if (!f) {
        f = document.createElement("iframe");
        f.src = `https://player.vimeo.com/video/${id}?background=1&muted=1&autopause=0&dnt=1&quality=540p#t=${start}s`;
        f.allow = "autoplay; fullscreen; picture-in-picture";
        f.title = this.title; f.tabIndex = -1; f.setAttribute("aria-hidden", "true");
        this.frame.append(f);
      }
      const p = (this.player = new Vimeo.Player(f));
      p.on("timeupdate", ({ seconds }) => {
        const { start: s, end } = this.seg;
        if (seconds >= end || seconds < s - 0.75) p.setCurrentTime(s).catch(() => {});
      });
      p.on("play", () => this.el.classList.add("is-playing"));
      p.ready()
        .then(() => p.setCurrentTime(this.seg.start))
        .then(() => (this.want ? p.play() : p.pause()))
        .catch(() => this.el.classList.add("is-failed")); // poster stays visible
    }
    play() {
      this.want = true; if (motion.reduced) return;
      if (this.video) this.video.play().catch(() => {});
      else if (this.player) this.player.play().catch(() => {});
      else this.mount();
    }
    pause() { this.want = false; this.video?.pause(); this.player?.pause().catch(() => {}); }
  }

  /* Plays films only while ≥ 35 % visible; mounts lazily; pauses off-screen / hidden tab. */
  const films = new Set();
  const resume = (f) => f.visible && !f.held && !document.hidden && !modalOpen && f.play();
  const filmIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const film = e.target._film;
      film.visible = e.intersectionRatio >= 0.35;
      film.visible ? resume(film) : film.pause();
    });
  }, { threshold: [0, 0.35] });
  function observeFilm(film) { film.el._film = film; films.add(film); filmIO.observe(film.el); return film; }
  document.addEventListener("visibilitychange", () => films.forEach((f) => (document.hidden ? f.pause() : resume(f))));
  rmq.addEventListener("change", () => films.forEach((f) => (motion.reduced ? f.pause() : resume(f))));

  /* ── Fullscreen film (Bootstrap Modal) ── */
  let modalOpen = false;
  function openFilm(seg) {
    const el = $("#filmModal"); if (!el || !BS()) return;
    const frame = $(".film-modal__frame", el);
    frame.innerHTML = "";
    if (seg.src) {
      const v = document.createElement("video");
      Object.assign(v, { controls: true, autoplay: true, playsInline: true, src: `${seg.src}#t=${seg.start}` });
      frame.append(v);
    } else {
      const f = document.createElement("iframe");
      f.src = `https://player.vimeo.com/video/${seg.id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0#t=${seg.start}s`;
      f.allow = "autoplay; fullscreen; picture-in-picture"; f.allowFullscreen = true; f.title = S.film.title;
      frame.append(f);
    }
    BS().Modal.getOrCreateInstance(el).show();
  }
  function wireFilmModal() {
    const el = $("#filmModal"); if (!el) return;
    el.addEventListener("show.bs.modal", () => { modalOpen = true; films.forEach((f) => f.pause()); });
    el.addEventListener("hidden.bs.modal", () => {
      modalOpen = false; $(".film-modal__frame", el).innerHTML = "";
      films.forEach((f) => { f.want = false; resume(f); });
    });
  }

  /* ── Header ── */
  function initHeader() {
    const header = $(".site-header"); if (!header) return;
    const setH = () => document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    new ResizeObserver(setH).observe(header); setH();
  }

  /* ── Search ── */
  function initSearch() {
    const dlg = $("#search"); if (!dlg) return;
    $("form", dlg).addEventListener("submit", (e) => {
      e.preventDefault();
      const q = $("input", dlg).value.trim();
      dlg._noReturn = true; dlg.close();
      if (window.SIYAZU_HOME) window.SIYAZU_HOME.search(q);
      else location.href = `index.html?q=${encodeURIComponent(q)}#shop`;
    });
  }

  /* ── Newsletter: validate on blur and submit ── */
  function initNewsletter() {
    const form = $("#newsletter"); if (!form) return;
    const input = $("input", form), err = $("#nl-err"), ok = $("#nl-ok");
    const valid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    const show = (bad) => { err.hidden = !bad; input.setAttribute("aria-invalid", String(bad)); };
    input.addEventListener("blur", () => input.value && show(!valid()));
    input.addEventListener("input", () => !err.hidden && valid() && show(false));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!valid()) { show(true); input.focus(); return; }
      show(false); ok.hidden = false; form.reset();
    });
  }

  /* ── Reveal on scroll (opacity + transform only) ── */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealIO.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  const reveal = (root = document) => $$("[data-reveal]:not(.is-in)", root).forEach((el) => revealIO.observe(el));

  /* ── Boot ── */
  function boot() {
    document.documentElement.classList.add("js");
    initHeader();
    $$("dialog").forEach(wireDialog);
    $$("[data-open]").forEach((b) => b.addEventListener("click", () => {
      const dlg = document.getElementById(b.dataset.open);
      openDialog(dlg, b);
      if (b.dataset.open === "search") setTimeout(() => $("#search input")?.focus(), 30);
    }));
    wireBag();
    initWish();
    wireFilmModal();
    document.addEventListener("bag:change", () => renderBagCount(false));
    renderBagCount(false);
    initSearch();
    initNewsletter();
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
    reveal();
  }

  window.SZ = { $, $$, S, t, L, price, productById, colorKo, sizeKo, isSoldOut, shipFee, store, user, bag, wish, wishBtn, viewers, motion,
    Film, observeFilm, openFilm, openDialog, wireDialog, reveal, showBag, afterAdd, boot };
})();
