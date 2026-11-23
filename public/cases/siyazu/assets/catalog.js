/* SIYAZU: catalog (shared). shop.html runs the full shop — filters panel, sort, view, URL state;
   the home page runs a short preview (SZ.catalog({ limit: 6 })) that links to shop.html.
   Quick view and the rail / grid layout come along with it. */

(() => {
  const { $, $$, S, t, L } = SZ;

  SZ.catalog = ({ limit = 0 } = {}) => {
    /* ═════════ 4. CATALOG ═════════ */
    const qs = new URLSearchParams(location.search);
    const state = { cat: qs.get("cat") || "", color: qs.get("color") || "", size: qs.get("size") || "", fabric: qs.get("fabric") || "", sort: qs.get("sort") || "featured", q: qs.get("q") || "" };
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

    /* Filter sheet (tablets / phones): chips for every filter, applied live, count on the button */
    const sheet = $("#filter-sheet"), sheetBody = $("#fsheet-body");
    const GROUPS = [["cat", "카테고리"], ["color", "컬러"], ["size", "사이즈"], ["fabric", "소재"]];
    function renderSheet() {
      if (!sheet) return;
      sheetBody.innerHTML = GROUPS.map(([key, title]) => `
        <fieldset class="fsheet__group"><legend class="label">${title}</legend>
          <div class="fsheet__chips">${options[key].map(([v, label]) => {
            const col = key === "color" && v ? colorList.find((c) => c.name === v) : null;
            return `<button type="button" class="chip" data-key="${key}" data-value="${v}" aria-pressed="${state[key] === v}">${col ? `<i style="--dot:${col.hex}"></i>` : ""}${label}</button>`;
          }).join("")}</div>
        </fieldset>`).join("") + `
        <fieldset class="fsheet__group fsheet__view"><legend class="label">사진</legend>
          <div class="fsheet__chips">
            <button type="button" class="chip" data-viewchip="product" aria-pressed="${$('[data-view="product"]').getAttribute("aria-pressed")}">상품</button>
            <button type="button" class="chip" data-viewchip="model" aria-pressed="${$('[data-view="model"]').getAttribute("aria-pressed")}">모델</button>
          </div>
        </fieldset>`;
      const n = results().length;
      $("[data-fsheet-done]", sheet).textContent = `${n}개 상품 보기`;
    }
    function syncSheetBtn() {
      const n = ["cat", "color", "size", "fabric"].filter((k) => state[k]).length;
      const el = $("[data-filter-n]"); if (!el) return;
      el.hidden = !n; el.textContent = n;
      $("[data-open-filters]").setAttribute("aria-label", n ? `필터, ${n}개 적용됨` : "필터");
    }
    if (sheet) {
      const wide = matchMedia("(min-width: 1024px)");
      const shopEl = $("#shop"), openBtn = $("[data-open-filters]");
      const relayout = () => { updateRailNav(); dispatchEvent(new Event("resize")); };
      openBtn.addEventListener("click", (e) => {
        renderSheet();
        if (!wide.matches) { SZ.openDialog(sheet, e.currentTarget); return; }
        // wide screens: a panel beside the catalog (not modal) — products stay clickable while filtering
        if (sheet.open) { sheet.close(); return; }
        sheet._opener = openBtn;
        sheet.show();
        shopEl.classList.add("is-filtering");
        openBtn.setAttribute("aria-expanded", "true");
        relayout();
        sheetBody.querySelector('.chip[aria-pressed="true"]')?.focus({ preventScroll: true });
      });
      sheet.addEventListener("close", () => {
        shopEl.classList.remove("is-filtering");
        openBtn.setAttribute("aria-expanded", "false");
        relayout();
      });
      addEventListener("keydown", (e) => { if (e.key === "Escape" && sheet.open && wide.matches) sheet.close(); });
      wide.addEventListener("change", () => { if (sheet.open) sheet.close(); });
      // scrolled past the catalog: the fixed panel closes so it never sits over other sections
      new IntersectionObserver(([e]) => { if (!e.isIntersecting && sheet.open && wide.matches) sheet.close(); }).observe(shopEl);
      sheetBody.addEventListener("click", (e) => {
        const chip = e.target.closest("[data-key]");
        if (chip) {
          state[chip.dataset.key] = chip.dataset.value;
          syncFilters(); render(); renderSheet();
          sheetBody.querySelector(`[data-key="${chip.dataset.key}"][data-value="${chip.dataset.value}"]`)?.focus();
          return;
        }
        const v = e.target.closest("[data-viewchip]");
        if (v) { $(`[data-view="${v.dataset.viewchip}"]`).click(); renderSheet(); sheetBody.querySelector(`[data-viewchip="${v.dataset.viewchip}"]`)?.focus(); }
      });
      $("[data-fsheet-reset]", sheet).addEventListener("click", () => { Object.assign(state, { cat: "", color: "", size: "", fabric: "" }); syncFilters(); render(); renderSheet(); });
    }

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
      const all = results();
      const list = limit ? all.slice(0, limit) : all;   // home: a short preview, shop.html: everything
      if (count) count.textContent = t("items", all.length);
      syncSheetBtn();
      if (clearBtn) clearBtn.hidden = !isFiltered();
      if (empty) empty.hidden = !!list.length;
      $$("[data-shop-total]").forEach((el) => { el.textContent = S.products.length; });
      if (!limit) {
        // shop.html: the URL follows the filters, so a selection can be shared or bookmarked
        const keep = new URLSearchParams();
        ["cat", "color", "size", "fabric", "q"].forEach((k) => state[k] && keep.set(k, state[k]));
        if (state.sort !== "featured") keep.set("sort", state.sort);
        history.replaceState(null, "", keep.size ? `?${keep}` : location.pathname);
      }
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
    clearBtn?.addEventListener("click", () => applyFilter({}));
    empty?.querySelector("button")?.addEventListener("click", () => applyFilter({}));

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

    /* Photo view (product / model shots) and layout (rail / 3-column grid); both remembered */
    const pref = (k, v) => { try { return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch { return null; } };
    function setView(v) {
      railWrap.classList.toggle("is-model", v === "model");
      $$("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === v)));
      pref("siyazu-view", v);
    }
    // grid only (the rail / slide layout was removed)
    railWrap.classList.add("is-grid");
    scroller.setAttribute("aria-label", "컬렉션");
    $$("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
    setView(pref("siyazu-view") || "product");

    // the search sheet filters right here on the shop page
    if (!limit) SZ.catalogSearch = (q) => applyFilter({ q });
    syncFilters(); render();
    return { applyFilter };
  };
})();
