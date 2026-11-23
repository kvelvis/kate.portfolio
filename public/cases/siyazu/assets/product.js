/* SIYAZU: product page. Photo stack, sticky purchase panel, size guide, sillage. */

(() => {
  const { $, $$, S, t, L } = SZ;
  SZ.boot();

  const id = new URLSearchParams(location.search).get("id") || S.products[0].id;
  const p = SZ.productById(id);
  const root = $("#pdp");
  let colorIdx = 0, wired = false;

  if (!p) {
    root.outerHTML = `<section class="pdp-missing"><h1 class="pdp__name">${t("notFound")}</h1>
      <a class="sz-btn sz-btn--line" href="shop.html">${t("backToShop")}</a></section>`;
    return;
  }

  function stackHTML() {
    const imgs = p.colors[colorIdx].images;
    const other = p.colors.filter((_, i) => i !== colorIdx).flatMap((c) => c.images.slice(1));
    const fig = (src, i) => `<figure data-reveal><img src="${src}" alt="${L(p.name)}, ${i + 1}" width="1000" height="1000" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"></figure>`;
    return [
      fig(imgs[0], 0),
      ...imgs.slice(1).map((src, i) => fig(src, i + 1)),
      ...other.map((src, i) => fig(src, imgs.length + i)),
    ].join("");
  }

  function sizeTable() {
    const cols = t("sizeCols");
    const rows = S.sizeGuide[p.cat].filter((r) => p.sizes.includes(r[0]));
    return `<table class="size-table"><thead><tr>${cols.map((c) => `<th scope="col">${c}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r) => `<tr><th scope="row">${r[0] === "F" ? t("sizes").F : r[0]}</th>${r.slice(1).map((v) => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table>
      <p>단위 cm. 측정 방법에 따라 1–2cm 오차가 있을 수 있습니다.</p>`;
  }

  function related() {
    const pool = [...S.products.filter((x) => x.id !== p.id && x.cat === p.cat), ...S.products.filter((x) => x.cat !== p.cat)].slice(0, 4);
    return pool.map((x, i) => SZ.pcardHTML(x, i + 1, 0, { qv: false, clip: false })).join("");
  }

  function render() {
    document.title = `${L(p.name)} | SIYAZU`;
    $('meta[name="description"]').content = `${L(p.name)}. ${L(p.desc)} 잔향: ${L(p.sillage)}.`;
    root.innerHTML = `
      <nav class="crumbs label" aria-label="Breadcrumb">
        <a href="shop.html">${t("shop")}</a><span aria-hidden="true">/</span>
        <a href="shop.html?cat=${p.cat}">${L(S.categories[p.cat])}</a>
      </nav>
      <div class="pdp__stack">${stackHTML()}</div>
      <aside class="pdp__panel" aria-labelledby="pdp-name">
        <p class="label muted">${p.sku}${p.ships ? " · " + t("preorder", p.ships) : ""}</p>
        <h1 id="pdp-name" class="pdp__name">${L(p.name)}</h1>
        <p class="pdp__price">${SZ.priceHTML(p)}</p>
        ${SZ.viewers(p) ? `<p class="pdp__live"><i aria-hidden="true"></i>${t("viewers", SZ.viewers(p))}</p>` : ""}
        <ul class="pdp__perks">
          <li>${t("freeShip", S.info.freeShip.toLocaleString("ko-KR") + "원")}</li>
          <li>${t("reviewPoints", S.info.reviewPoints.toLocaleString("ko-KR"))}</li>
        </ul>
        <p class="pdp__desc">${L(p.desc)}</p>
        ${SZ.buyForm(p, colorIdx, "pdp")}
        <div>
          <details class="acc"><summary class="label">${t("sizeGuide")}</summary><div class="acc__body">${sizeTable()}</div></details>
          <details class="acc"><summary class="label">${t("modelInfo")}</summary><div class="acc__body">
            <ul class="acc__list">${S.info.model.map((m) => `<li>${m}</li>`).join("")}</ul></div></details>
          <details class="acc"><summary class="label">${t("fabricCare")}</summary><div class="acc__body">
            <p>${t("fabric")}: ${L(S.fabrics[p.fabric])}</p>
            <ul class="acc__list">${S.info.care.map((c) => `<li>${c}</li>`).join("")}</ul>
            ${p.fabric === "fur" ? `<div class="acc__note"><p class="acc__note-title">${S.info.furNotice.title}</p>${S.info.furNotice.text.map((x) => `<p>${x}</p>`).join("")}</div>` : ""}
          </div></details>
          <details class="acc"><summary class="label">${t("productInfo")}</summary><div class="acc__body">
            <dl class="acc__dl">${S.info.maker.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl></div></details>
          <details class="acc"><summary class="label">${t("refundTitle")}</summary><div class="acc__body">
            <ul class="acc__list">${S.info.refund.map((r) => `<li>${r}</li>`).join("")}</ul></div></details>
        </div>
      </aside>`;
    $("#related-title").textContent = t("related");
    $("#related-grid").innerHTML = related();

    renderDetail();
    SZ.wireBuy($(".buy", root), p, (i) => {
      colorIdx = i;
      renderDetail();
      const figs = $$(".pdp__stack > figure img", root), imgs = p.colors[i].images;
      figs.forEach((img, j) => { if (imgs[j]) img.src = imgs[j]; });
    });
    SZ.reveal(document);
    injectJsonLd();
    if (!wired) { SZ.wirePcards($("#related-grid")); wired = true; }
  }

  /* 상세 정보: the long photos, one after another with no gaps (the parts join seamlessly) */
  function renderDetail() {
    const list = (S.details[p.id] || []).filter((d) => !d.color || d.color === p.colors[colorIdx].name);
    let sec = $("#pdp-detail");
    if (!list.length) { sec?.remove(); return; }
    if (!sec) {
      sec = document.createElement("section");
      sec.className = "pdp-detail"; sec.id = "pdp-detail";
      sec.setAttribute("aria-labelledby", "pdp-detail-title");
    }
    placeDetail(sec);
    sec.innerHTML = `<h2 class="label pdp-detail__title" id="pdp-detail-title">상세 정보</h2>` + list.map((d) => `
      <figure class="pdp-detail__item">
        <figcaption class="label muted">${d.caption}</figcaption>
        ${d.parts.map(([src, h]) => `<img src="${S.DETAIL}${src}" alt="" width="900" height="${h}" loading="lazy" decoding="async">`).join("")}
      </figure>`).join("");
  }

  // wide screens: under the main photos in the left column, so the buy panel stays beside them while scrolling;
  // phones: after the buy panel, so "담기" isn't pushed far down
  const wideDetail = matchMedia("(min-width: 900px)");
  function placeDetail(sec) {
    const target = wideDetail.matches ? $(".pdp__stack", root) : root;
    if (sec.parentElement !== target) target.append(sec);
  }
  wideDetail.addEventListener("change", () => { const s = $("#pdp-detail"); if (s) placeDetail(s); });

  function injectJsonLd() {
    $("#ld-product")?.remove();
    const s = document.createElement("script");
    s.type = "application/ld+json"; s.id = "ld-product";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: p.name.en, sku: p.sku,
      brand: { "@type": "Brand", name: "SIYAZU" }, description: p.desc.en,
      image: p.colors[0].images.map((src) => new URL(src, location.href).href),
      offers: { "@type": "Offer", priceCurrency: "KRW", price: p.price, availability: p.ships ? "https://schema.org/PreOrder" : "https://schema.org/InStock" },
    });
    document.head.append(s);
  }

  render();
  initFit();

  /* ── "내 사이즈 찾기": usual Korean size + preferred fit → recommended size.
     The answers are remembered, so every product page shows its own recommendation. ── */
  function recommend(usual, fit) {
    const n = p.sizes.length;
    const base = n === 3 ? { 44: 0, 55: 1, 66: 2, 77: 2 }[usual] : { 44: 0, 55: 0, 66: 1, 77: 1 }[usual];
    return p.sizes[Math.min(n - 1, base + (fit === "loose" ? 1 : 0))];
  }
  function showRec(profile) {
    const el = $("[data-size-rec]", root); if (!el || !profile) return;
    el.hidden = false;
    el.textContent = `${t("mySize", recommend(profile.usual, profile.fit))} · 평소 ${profile.usual} 기준`;
  }
  function initFit() {
    if (p.sizes.length < 2) return;
    document.body.insertAdjacentHTML("beforeend", `
      <dialog id="fit" class="drawer fit" aria-labelledby="fit-title">
        <div class="drawer__head">
          <h2 id="fit-title" class="label">${t("findSize")}</h2>
          <button class="label link-btn" type="button" data-close>${t("close")}</button>
        </div>
        <form class="drawer__body fit__form" method="dialog">
          <p class="muted">두 가지만 알려주시면 이 상품에 맞는 사이즈를 추천해 드려요.</p>
          <fieldset class="buy__group">
            <legend class="label">평소 입는 사이즈</legend>
            <div class="sizes">${[44, 55, 66, 77].map((u) => `<label class="size"><input type="radio" name="usual" value="${u}" required><span>${u}</span></label>`).join("")}</div>
          </fieldset>
          <fieldset class="buy__group">
            <legend class="label">선호하는 핏</legend>
            <div class="sizes">
              <label class="size"><input type="radio" name="fit" value="regular" checked><span>딱 맞게</span></label>
              <label class="size"><input type="radio" name="fit" value="loose"><span>여유 있게</span></label>
            </div>
          </fieldset>
          <div class="fit__result" aria-live="polite" hidden>
            <p class="label muted">추천 사이즈</p>
            <p class="fit__size"></p>
            <p class="fit__why muted"></p>
            <button class="sz-btn sz-btn--solid" type="button" data-fit-apply>이 사이즈로 선택</button>
          </div>
          <p class="muted fit__model">모델 ${S.info.model[0]}</p>
        </form>
      </dialog>`);
    const dlg = $("#fit"); SZ.wireDialog(dlg);
    const form = $(".fit__form", dlg), result = $(".fit__result", dlg);
    let rec = null;
    const saved = SZ.store.get("siyazu-fit", null);
    if (saved) {
      form.querySelector(`[name=usual][value="${saved.usual}"]`).checked = true;
      form.querySelector(`[name=fit][value="${saved.fit}"]`).checked = true;
    }
    const update = () => {
      const usual = form.querySelector("[name=usual]:checked")?.value;
      if (!usual) return;
      const fit = form.querySelector("[name=fit]:checked").value;
      rec = recommend(+usual, fit);
      SZ.store.set("siyazu-fit", { usual: +usual, fit });
      const row = S.sizeGuide[p.cat].find((r) => r[0] === rec);
      const col = p.colors[+$('.buy input[name$="-color"]:checked', root).value];
      result.hidden = false;
      $(".fit__size", result).textContent = rec;
      $(".fit__why", result).textContent =
        (fit === "loose" ? "여유 있는 핏을 원하셔서 한 사이즈 크게 추천해요. " : "평소 사이즈 기준, 몸에 맞게 떨어지는 핏이에요. ") +
        (row ? `가슴 ${row[2]}cm · 총장 ${row[3]}cm.` : "") +
        (SZ.isSoldOut(p, col.name, rec) ? ` 현재 ${SZ.colorKo(col)} ${rec}는 품절이라 재입고 알림을 신청할 수 있어요.` : "");
      showRec({ usual: +usual, fit });
    };
    form.addEventListener("change", update);
    if (saved) { update(); }
    $("[data-fit-apply]", dlg).addEventListener("click", () => { dlg.close(); SZ.selectSize(rec); });
    root.addEventListener("click", (e) => { if (e.target.closest("[data-size-find]")) SZ.openDialog(dlg, e.target.closest("[data-size-find]")); });
  }
})();
