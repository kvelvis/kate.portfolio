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
      <a class="sz-btn sz-btn--line" href="index.html#shop">${t("backToShop")}</a></section>`;
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
        <a href="index.html#shop">${t("shop")}</a><span aria-hidden="true">/</span>
        <a href="index.html#shop">${L(S.categories[p.cat])}</a>
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
        <section class="sillage-card" aria-labelledby="sillage-h">
          <h2 id="sillage-h" class="label">${t("sillageLabel")}</h2>
          <p class="sillage-card__notes">${L(p.sillage)}</p>
          <p class="muted">${t("sillageBlock", L(p.sillage))}</p>
        </section>
      </aside>`;
    $("#related-title").textContent = t("related");
    $("#related-grid").innerHTML = related();

    SZ.wireBuy($(".buy", root), p, (i) => {
      colorIdx = i;
      const figs = $$(".pdp__stack > figure img", root), imgs = p.colors[i].images;
      figs.forEach((img, j) => { if (imgs[j]) img.src = imgs[j]; });
    });
    SZ.reveal(document);
    injectJsonLd();
    if (!wired) { SZ.wirePcards($("#related-grid")); wired = true; }
  }

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
})();
