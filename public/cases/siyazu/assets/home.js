/* SIYAZU: home page.
   Hero (film inside the SIYAZU letters), NEW FORM clips, sillage trail,
   catalog preview (6 pieces → shop.html), journal strip. Catalog code: catalog.js. */

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

  /* ═════════ 4. CATALOG preview: a few pieces; the whole shop is shop.html ═════════ */
  SZ.catalog({ limit: 6 });

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

  initTrail();
})();
