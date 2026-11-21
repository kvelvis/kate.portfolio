/* SIYAZU: home page.
   Hero (film inside the SIYAZU letters), NEW FORM clips, sillage trail,
   catalog (룩 rail), Quick view, journal strip. */

(() => {
  const { $, $$, S, t, L } = SZ;
  SZ.boot();

  /* ═════════ 1. HERO: video only, seen through the letters ═════════ */
  const hero = $(".hero"), word = $(".hero__word"), mask = $(".hero__mask");
  const header = $(".site-header"), pauseBtn = $("#hero-pause");
  const heroFilm = SZ.observeFilm(new SZ.Film($(".hero .film"), S.film.hero));

  // Zoom origin = centre of the "I" stem, so the scaled letter turns into a full-screen window.
  function setOrigin() {
    const i = $(".is-origin", word);
    word.style.transformOrigin = `${i.offsetLeft + i.offsetWidth / 2}px ${i.offsetTop + i.offsetHeight * 0.55}px`;
  }
  /* One-way: progress can only grow. At 100 % the final state is locked,
     listeners are removed and the scroll spacer collapses with scroll compensation. */
  let heroAnimationDone = false, maxProgress = 0, ticking = false;
  const heroRange = () => Math.max(1, hero.offsetHeight - innerHeight);

  function finishHero(compensate = true) {
    if (heroAnimationDone) return;
    heroAnimationDone = true;
    removeEventListener("scroll", requestHero);
    removeEventListener("resize", onHeroResize);
    // Lock final state
    mask.style.opacity = "0";
    word.style.willChange = "auto";
    header.classList.remove("is-intro");
    // Collapse the spacer (260vh → 100svh) and shift scroll by the removed height,
    // so whatever is on screen stays exactly where it is.
    const before = hero.offsetHeight, y = scrollY;
    hero.classList.add("is-done");
    const removed = before - hero.offsetHeight;
    if (compensate && removed > 0 && y > 0) scrollTo({ top: Math.max(0, y - removed), behavior: "instant" });
  }

  function onHeroScroll() {
    ticking = false;
    if (heroAnimationDone) return;
    if (SZ.motion.reduced) { finishHero(); return; }
    const raw = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / heroRange()));
    const p = (maxProgress = Math.max(maxProgress, raw)); // never decreases
    if (p >= 0.999) { finishHero(); return; }            // also covers one-jump scrolls past the hero
    const ease = p * p * p;
    word.style.transform = `scale(${1 + ease * 90})`;
    mask.style.opacity = p < 0.8 ? 1 : Math.max(0, 1 - (p - 0.8) / 0.2);
    header.classList.toggle("is-intro", p < 0.92);
  }
  function requestHero() { if (!ticking && !heroAnimationDone) { ticking = true; requestAnimationFrame(onHeroScroll); } }
  function onHeroResize() { setOrigin(); requestHero(); }

  addEventListener("scroll", requestHero, { passive: true });
  addEventListener("resize", onHeroResize);
  document.fonts?.ready.then(() => { if (!heroAnimationDone) { setOrigin(); requestHero(); } });
  /* Entry points that land past the hero: apply the final state up front, without animation.
     Native scroll restoration / fragment scrolling would race the spacer collapse, so both are
     handled here against the collapsed layout. */
  const SAVE_KEY = "siyazu-hero";
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  addEventListener("pagehide", () => {
    try { sessionStorage.setItem(SAVE_KEY, JSON.stringify({ y: scrollY, done: heroAnimationDone })); } catch { /* ignore */ }
  });
  const navType = performance.getEntriesByType?.("navigation")[0]?.type;
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(SAVE_KEY) || "null"); } catch { /* ignore */ }
  const hashTarget = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  let restore = null;                                   // () => scroll to where the visitor should be
  if ((navType === "reload" || navType === "back_forward") && saved) {
    if (saved.done && saved.y > 0) finishHero(false);   // saved y was measured on the collapsed layout; at the very top the intro replays
    restore = () => scrollTo({ top: saved.y, behavior: "instant" });
  } else if (hashTarget && hero.compareDocumentPosition(hashTarget) & Node.DOCUMENT_POSITION_FOLLOWING) {
    finishHero(false);
    restore = () => hashTarget.scrollIntoView({ behavior: "instant", block: "start" });
  }
  if (restore) {
    let userScrolled = false;
    const mark = () => { userScrolled = true; };
    ["wheel", "touchstart", "keydown"].forEach((ev) => addEventListener(ev, mark, { once: true, passive: true }));
    restore();
    // Re-apply once fonts/images have settled, unless the visitor already moved.
    addEventListener("load", () => { if (!userScrolled) restore(); requestHero(); }, { once: true });
  } else {
    addEventListener("load", requestHero, { once: true });
  }
  // In-page jumps (nav links, search) would be interrupted by the spacer collapse: finish first.
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"], a[href^="index.html#"]');
    if (a && !heroAnimationDone && a.hash && a.hash !== "#main") finishHero();
  }, true);
  setOrigin(); onHeroScroll();

  function syncPause() {
    const paused = heroFilm.held || SZ.motion.reduced;
    pauseBtn.setAttribute("aria-label", t(paused ? "playFilm" : "pauseFilm"));
    pauseBtn.classList.toggle("is-paused", paused);
  }
  pauseBtn.addEventListener("click", () => {
    if (SZ.motion.reduced) { SZ.openFilm({ ...S.film.hero, start: 0 }); return; } // user-initiated
    heroFilm.held = !heroFilm.held;
    heroFilm.held ? heroFilm.pause() : heroFilm.play();
    syncPause();
  });
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => { syncPause(); requestHero(); });
  syncPause();

  /* ═════════ 2. NEW FORM: looping clips, fullscreen on click ═════════ */
  $$(".ed__tile[data-clip]").forEach((btn) => {
    const item = S.newForm[+btn.dataset.clip];
    SZ.observeFilm(new SZ.Film($(".film", btn), item.seg));
    btn.addEventListener("click", () => SZ.openFilm(item.seg));
  });

  /* ═════════ 3. SILLAGE trail: faint warm haze + grain following the cursor ═════════ */
  function initTrail() {
    const section = $(".sillage"), canvas = $(".sillage__trail");
    if (!canvas || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, raf = 0, idle = 0, last = null, queue = [];
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = section.clientWidth; h = section.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    new ResizeObserver(resize).observe(section);
    const blob = (x, y) => {
      const r = 54, g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(216,203,184,0.16)"); g.addColorStop(1, "rgba(216,203,184,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(139,90,53,0.22)";
      for (let i = 0; i < 4; i++) {
        const a = Math.random() * Math.PI * 2, d = Math.random() * r * 0.8;
        ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, 1, 1);
      }
    };
    const tick = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      if (queue.length) {
        idle = 0;
        queue.forEach((p) => {
          if (last) {
            const dx = p.x - last.x, dy = p.y - last.y, steps = Math.min(12, Math.ceil(Math.hypot(dx, dy) / 10));
            for (let s = 1; s <= steps; s++) blob(last.x + (dx * s) / steps, last.y + (dy * s) / steps);
          } else blob(p.x, p.y);
          last = p;
        });
        queue = [];
      } else if (++idle > 150) { ctx.clearRect(0, 0, w, h); raf = 0; last = null; return; }
      raf = requestAnimationFrame(tick);
    };
    section.addEventListener("pointermove", (e) => {
      if (SZ.motion.reduced) return;
      const r = canvas.getBoundingClientRect();
      queue.push({ x: e.clientX - r.left, y: e.clientY - r.top });
      if (!raf) raf = requestAnimationFrame(tick);
    });
    section.addEventListener("pointerleave", () => { last = null; });
  }

  /* ═════════ 4. CATALOG ═════════ */
  const state = { cat: "", color: "", size: "", fabric: "", sort: "featured", q: new URLSearchParams(location.search).get("q") || "" };
  const cardColor = {};
  const railWrap = $("#rail-wrap"), rail = $("#rail"), scroller = $("#rail-scroller");
  const empty = $("#catalog-empty"), count = $("#grid-count"), clearBtn = $("#filters-clear");

  /* Filter dropdowns (Bootstrap) */
  const colorList = [...new Map(S.products.flatMap((p) => p.colors).map((c) => [c.name, c])).values()];
  const options = {
    cat: [["", t("all")], ...Object.entries(S.categories).map(([k, v]) => [k, L(v)])],
    color: [["", t("all")], ...colorList.map((c) => [c.name, SZ.colorKo(c)])],
    size: [["", t("all")], ...["S", "M", "L", "F"].map((s) => [s, SZ.sizeKo(s)])],
    fabric: [["", t("all")], ...Object.entries(S.fabrics).map(([k, v]) => [k, L(v)])],
    sort: [["featured", t("sortFeatured")], ["low", t("sortLow")], ["high", t("sortHigh")]],
  };
  function syncFilters() {
    $$(".filter[data-filter]").forEach((dd) => {
      const key = dd.dataset.filter, opts = options[key];
      const cur = opts.find(([v]) => v === state[key]) || opts[0];
      $(".filter__val", dd).textContent = cur[1];
      $(".filter__btn", dd).classList.toggle("is-set", key !== "sort" && !!state[key]);
      $(".dropdown-menu", dd).innerHTML = opts.map(([v, label]) =>
        `<li><button type="button" class="dropdown-item${v === state[key] ? " active" : ""}" data-value="${v}"${v === state[key] ? ' aria-current="true"' : ""}>${label}</button></li>`).join("");
    });
  }
  $$(".filter[data-filter]").forEach((dd) => {
    $(".dropdown-menu", dd).addEventListener("click", (e) => {
      const item = e.target.closest(".dropdown-item"); if (!item) return;
      state[dd.dataset.filter] = item.dataset.value;
      syncFilters(); render();
      $(".filter__btn", dd).focus();
    });
  });

  function results() {
    const q = state.q.toLowerCase();
    const list = S.products.filter((p) =>
      (!state.cat || p.cat === state.cat) &&
      (!state.fabric || p.fabric === state.fabric) &&
      (!state.size || p.sizes.includes(state.size)) &&
      (!state.color || p.colors.some((c) => c.name === state.color)) &&
      (!q || [p.name.en, p.name.ko, p.sku, L(S.categories[p.cat]), L(S.fabrics[p.fabric])].join(" ").toLowerCase().includes(q)));
    if (state.sort === "low") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }
  const isFiltered = () => !!(state.cat || state.color || state.size || state.fabric || state.q);
  const colorIdxFor = (p) => cardColor[p.id] ?? Math.max(0, p.colors.findIndex((c) => c.name === state.color));

  function render() {
    const list = results();
    count.textContent = t("items", list.length);
    clearBtn.hidden = !isFiltered();
    empty.hidden = !!list.length;
    railWrap.hidden = !list.length;
    if (!list.length) return;
    rail.innerHTML = list.map((p, i) => SZ.pcardHTML(p, i + 1, colorIdxFor(p))).join("");
    scroller.scrollLeft = 0;
    updateRailNav();
  }

  function applyFilter(f) {
    Object.assign(state, { cat: "", color: "", size: "", fabric: "", q: "" }, f);
    syncFilters(); render();
  }
  const scrollToShop = () => { finishHero(); $("#shop").scrollIntoView({ behavior: SZ.motion.reduced ? "auto" : "smooth" }); };
  clearBtn.addEventListener("click", () => applyFilter({}));
  empty.querySelector("button").addEventListener("click", () => applyFilter({}));

  /* Rail: card hover / touch (shared), colour dots, Quick view */
  SZ.wirePcards(rail, { onColor: (id, i) => { cardColor[id] = i; } });
  rail.addEventListener("click", (e) => {
    const qv = e.target.closest("[data-qv]"); if (qv) openQuickView(qv.dataset.qv, qv);
  });

  /* Rail: drag to scroll with a mouse (touch/trackpad scroll natively) */
  let drag = null;
  scroller.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || e.target.closest("button") || railWrap.classList.contains("is-grid")) return;
    drag = { x: e.clientX, left: scroller.scrollLeft, moved: false };
  });
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; scroller.classList.add("is-dragging"); }
    if (drag.moved) scroller.scrollLeft = drag.left - dx;
  });
  addEventListener("pointerup", () => {
    if (!drag) return;
    if (drag.moved) {
      scroller.addEventListener("click", (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
      setTimeout(() => scroller.classList.remove("is-dragging"), 0);
    }
    drag = null;
  });
  const railBtns = $$("[data-rail]");
  function updateRailNav() {
    const max = scroller.scrollWidth - scroller.clientWidth - 2;
    railBtns.forEach((b) => { b.disabled = b.dataset.rail === "prev" ? scroller.scrollLeft <= 2 : scroller.scrollLeft >= max; });
  }
  scroller.addEventListener("scroll", () => requestAnimationFrame(updateRailNav), { passive: true });
  railBtns.forEach((b) => b.addEventListener("click", () => {
    const step = scroller.clientWidth * 0.7 * (b.dataset.rail === "next" ? 1 : -1);
    scroller.scrollBy({ left: step, behavior: SZ.motion.reduced ? "auto" : "smooth" });
  }));

  /* ── Quick view (native dialog drawer) ── */
  const qv = $("#qv");
  function openQuickView(id, opener) {
    const p = SZ.productById(id); if (!p) return;
    const ci = colorIdxFor(p);
    const body = $(".drawer__body", qv);
    const gallery = (i) => p.colors[i].images;
    body.innerHTML = `
      <div class="qv__gallery">
        <img class="qv__main" src="${gallery(ci)[0]}" alt="${L(p.name)}" width="1000" height="1000">
        <div class="qv__thumbs">${gallery(ci).map((src, i) => `
          <button type="button" class="qv__thumb" aria-pressed="${i === 0}" aria-label="${i + 1} / ${gallery(ci).length}"><img src="${src}" alt="" width="1000" height="1000"></button>`).join("")}
        </div>
      </div>
      <p class="label muted">${p.sku}${p.ships ? " · " + t("preorder", p.ships) : ""}</p>
      <h2 class="qv__name" id="qv-title">${L(p.name)}</h2>
      <p class="qv__price">${SZ.priceHTML(p)}</p>
      ${SZ.buyForm(p, ci, "qv")}
      <div class="note">
        <p class="label">${t("sillageNote")}</p>
        <p class="note__text">${L(p.sillage)}</p>
      </div>
      <a class="link label" href="product.html?id=${p.id}">${t("viewDetails")} →</a>`;
    const main = $(".qv__main", body), thumbs = $(".qv__thumbs", body);
    const setGallery = (i) => {
      main.src = gallery(i)[0];
      $$(".qv__thumb", thumbs).forEach((b, j) => { $("img", b).src = gallery(i)[j]; b.setAttribute("aria-pressed", String(j === 0)); });
    };
    thumbs.addEventListener("click", (e) => {
      const b = e.target.closest(".qv__thumb"); if (!b) return;
      main.src = $("img", b).src;
      $$(".qv__thumb", thumbs).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    });
    SZ.wireBuy($(".buy", body), p, setGallery);
    SZ.openDialog(qv, opener);
    body.scrollTop = 0;
  }

  /* ═════════ 5. JOURNAL strip ═════════ */
  const strip = $("#strip");
  const time = (s) => `0:${String(s).padStart(2, "0")}`;
  strip.innerHTML = S.journal.map((m, i) => `<li class="moment moment--${m.shape}" data-reveal>
      <button type="button" class="moment__btn" data-moment="${i}" aria-label="${t("watch")}: ${L(m.title)}">
        <span class="film">
          <img class="film__poster" src="${S.IMG}${m.poster}" alt="" loading="lazy" decoding="async">
          <span class="film__frame"></span>
        </span>
        <span class="moment__play label" aria-hidden="true">${t("watch")} ↗</span>
      </button>
      <p class="caption"><span class="caption__n">(${String(i + 1).padStart(2, "0")})</span><span>${L(m.title)} <span class="muted">${time(m.seg.start)}–${time(m.seg.end)}</span></span></p>
    </li>`).join("");
  SZ.reveal(strip);
  $$(".moment .film", strip).forEach((el, i) => SZ.observeFilm(new SZ.Film(el, S.journal[i].seg)));
  strip.addEventListener("click", (e) => {
    const b = e.target.closest("[data-moment]"); if (b) SZ.openFilm({ ...S.journal[+b.dataset.moment].seg, start: 0 });
  });
  $$("[data-strip]").forEach((b) => b.addEventListener("click", () => {
    strip.scrollBy({ left: strip.clientWidth * 0.6 * (b.dataset.strip === "next" ? 1 : -1), behavior: SZ.motion.reduced ? "auto" : "smooth" });
  }));

  window.SIYAZU_HOME = { search(q) { applyFilter({ q }); scrollToShop(); } };

  /* Photo view (product / model shots) and layout (rail / 3-column grid); both remembered */
  const pref = (k, v) => { try { return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch { return null; } };
  function setView(v) {
    railWrap.classList.toggle("is-model", v === "model");
    $$("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === v)));
    pref("siyazu-view", v);
  }
  function setLayout(v) {
    railWrap.classList.toggle("is-grid", v === "grid");
    $$("[data-layout]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.layout === v)));
    scroller.setAttribute("aria-label", v === "grid" ? "컬렉션" : "컬렉션 레일, 옆으로 스크롤");
    scroller.scrollLeft = 0;
    pref("siyazu-layout", v);
  }
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
  $$("[data-layout]").forEach((b) => b.addEventListener("click", () => setLayout(b.dataset.layout)));
  setView(pref("siyazu-view") || "product");
  setLayout(pref("siyazu-layout") || "rail");

  /* Sale popup: once per visit, when the collection comes into view; "오늘 하루 보지 않기" hides it until tomorrow */
  function initPromo() {
    const dlg = $("#promo"); if (!dlg) return;
    const today = new Date().toDateString();
    const seen = () => { try { return sessionStorage.getItem("siyazu-promo") || localStorage.getItem("siyazu-promo-skip") === today; } catch { return false; } };
    if (seen()) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || seen() || $$("dialog[open]").length) return;
      io.disconnect();
      try { sessionStorage.setItem("siyazu-promo", "1"); } catch { /* private mode */ }
      SZ.openDialog(dlg, document.activeElement);
    }, { threshold: 0.25 });
    io.observe($("#shop"));
    $("[data-promo-skip]", dlg).addEventListener("click", () => {
      try { localStorage.setItem("siyazu-promo-skip", today); } catch { /* private mode */ }
      dlg.close();
    });
  }
  initPromo();

  syncFilters(); render(); initTrail();
  if (state.q) requestAnimationFrame(scrollToShop);
})();
