/* SIYAZU: purchase form (colour, size, add to bag), shared by Quick view and the product page. */

(() => {
  const { t, L, colorKo, sizeKo } = SZ;

  SZ.priceHTML = (p) =>
    `<span class="price">${SZ.price(p.price)}</span>` +
    (p.was ? ` <s class="price price--was"><span class="sr-only">정가 </span>${SZ.price(p.was)}</s>` : "");

  SZ.buyForm = (p, colorIdx, uid) => `
    <form class="buy" novalidate>
      <fieldset class="buy__group">
        <legend class="label">${t("color")} <span class="muted" data-color-name>${colorKo(p.colors[colorIdx])}</span></legend>
        <div class="swatches">
          ${p.colors.map((c, i) => `
            <label class="swatch" title="${colorKo(c)}">
              <input type="radio" name="${uid}-color" value="${i}" ${i === colorIdx ? "checked" : ""}>
              <span class="swatch__dot" style="--dot:${c.hex}"></span>
              <span class="sr-only">${colorKo(c)}</span>
            </label>`).join("")}
        </div>
      </fieldset>
      <fieldset class="buy__group" aria-describedby="${uid}-size-err">
        <div class="buy__legend-row">
          <legend class="label">${t("size")}</legend>
          ${uid === "pdp" && p.sizes.length > 1 ? `<button type="button" class="link-btn label size-find" data-size-find>${t("findSize")}</button>` : ""}
        </div>
        <div class="sizes">
          ${p.sizes.map((s) => `
            <label class="size">
              <input type="radio" name="${uid}-size" value="${s}" ${p.sizes.length === 1 ? "checked" : ""}>
              <span>${sizeKo(s)}<small class="size__out">${t("soldOut")}</small></span>
            </label>`).join("")}
        </div>
        <p class="field-error" id="${uid}-size-err" hidden><span aria-hidden="true">!</span> ${t("chooseSize")}</p>
        <p class="size-rec label" data-size-rec hidden></p>
      </fieldset>
      <div class="buy__row">
        <button class="sz-btn sz-btn--add" type="submit">${t("addToBag")}</button>
        ${SZ.wishBtn(p, "wish-btn--box")}
      </div>
      <div class="notify" data-notify hidden>
        <p class="notify__hint"></p>
        <div class="notify__row">
          <label class="sr-only" for="${uid}-notify">이메일 또는 휴대폰 번호</label>
          <input id="${uid}-notify" type="text" inputmode="email" autocomplete="email" placeholder="이메일 또는 010-0000-0000">
          <button type="button" class="label link-btn" data-notify-send>${t("notifyBtn")}</button>
        </div>
        <p class="field-error" data-notify-err hidden><span aria-hidden="true">!</span> 이메일 또는 휴대폰 번호를 확인해 주세요.</p>
        <p class="notify__ok" data-notify-ok role="status" hidden>${t("notifyDone")}</p>
      </div>
      <p class="buy__status sr-only" role="status" aria-live="polite"></p>
    </form>`;

  SZ.wireBuy = (form, p, onColor) => {
    const err = form.querySelector(".field-error");
    const status = form.querySelector(".buy__status");
    const btn = form.querySelector(".sz-btn--add");
    const notify = form.querySelector("[data-notify]");
    let timer = 0;
    const colorIdx = () => +form.querySelector('input[name$="-color"]:checked').value;
    const chosen = () => form.querySelector('input[name$="-size"]:checked');
    // sold-out sizes follow the colour; a sold-out size turns the button into "재입고 알림 신청"
    const refresh = () => {
      const col = p.colors[colorIdx()].name;
      form.querySelectorAll('input[name$="-size"]').forEach((r) => r.closest(".size").classList.toggle("is-out", SZ.isSoldOut(p, col, r.value)));
      const c = chosen(), out = c && SZ.isSoldOut(p, col, c.value);
      form.classList.toggle("is-soldout", !!out);
      if (!btn.classList.contains("is-done")) btn.textContent = out ? t("notifyBtn") : t("addToBag");
      if (!out) notify.hidden = true;
    };
    SZ.selectSize = (size) => {
      const r = form.querySelector(`input[name$="-size"][value="${size}"]`);
      if (r) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }
    };
    form.addEventListener("change", (e) => {
      if (e.target.name.endsWith("-color")) {
        const i = +e.target.value;
        form.querySelector("[data-color-name]").textContent = colorKo(p.colors[i]);
        onColor?.(i);
      } else if (e.target.name.endsWith("-size")) { err.hidden = true; form.classList.remove("is-invalid"); }
      refresh();
    });
    // restock request: email or Korean mobile number
    form.querySelector("[data-notify-send]").addEventListener("click", () => {
      const input = notify.querySelector("input"), v = input.value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^01[016789]-?\d{3,4}-?\d{4}$/.test(v);
      notify.querySelector("[data-notify-err]").hidden = ok;
      input.setAttribute("aria-invalid", String(!ok));
      if (!ok) { input.focus(); return; }
      notify.querySelector("[data-notify-ok]").hidden = false;
      notify.querySelector(".notify__row").hidden = true;
      const size = chosen()?.value, color = p.colors[colorIdx()].name;
      const list = SZ.store.get("siyazu-restock", []).filter((r) => !(r.id === p.id && r.color === color && r.size === size));
      SZ.store.set("siyazu-restock", [{ id: p.id, color, size, contact: v, at: Date.now() }, ...list]);
    });
    refresh();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const size = chosen();
      if (!size) {
        err.hidden = false; form.classList.add("is-invalid");
        form.querySelector('input[name$="-size"]').focus();
        return;
      }
      if (SZ.isSoldOut(p, p.colors[colorIdx()].name, size.value)) {
        notify.hidden = false;
        notify.querySelector(".notify__hint").textContent = t("notifyHint", `${colorKo(p.colors[colorIdx()])} ${sizeKo(size.value)}`);
        notify.querySelector(".notify__row").hidden = false;
        notify.querySelector("[data-notify-ok]").hidden = true;
        notify.querySelector("input").focus();
        return;
      }
      const ci = colorIdx();
      SZ.bag.add(p.id, p.colors[ci].name, size.value);
      status.textContent = `${t("added")}: ${L(p.name)}, ${sizeKo(size.value)}`;
      btn.classList.add("is-done"); btn.textContent = t("addedBtn");
      clearTimeout(timer);
      timer = setTimeout(() => { btn.classList.remove("is-done"); refresh(); }, 2000);
      SZ.afterAdd();
    });
  };
})();

/* ── Product card (rail, related) ──
   One 3:4 frame; product photo, model photo and optional clip are stacked absolute
   layers. Hover crossfades opacity only. Touch: first tap reveals the model layer,
   second tap opens the product. */
(() => {
  const { t, L, colorKo } = SZ;

  SZ.pcardHTML = (p, n, ci = 0, { qv = true, clip = true } = {}) => {
    const col = p.colors[ci], name = L(p.name), [a, b] = col.images;
    return `<li class="pcard" data-id="${p.id}">
      <div class="pcard__media">
        <a class="pcard__link" href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true" draggable="false">
          <img class="pcard__layer pcard__layer--a" src="${a}" alt="" width="750" height="1000" loading="lazy" decoding="async" draggable="false">
          ${b ? `<img class="pcard__layer pcard__layer--b" src="${b}" alt="" width="750" height="1000" loading="lazy" decoding="async" draggable="false">` : ""}
          ${clip && p.clip ? `<video class="pcard__layer pcard__layer--v" muted playsinline loop preload="none" src="${p.clip}"></video>` : ""}
        </a>
        ${qv ? `<button class="pcard__qv label" type="button" data-qv="${p.id}" aria-label="${t("quickView")}: ${name}">${t("quickView")}</button>` : ""}
        ${p.ships ? `<p class="pcard__tag label">${t("preorder", p.ships)}</p>` : ""}
        ${SZ.viewers(p) ? `<p class="pcard__live"><i aria-hidden="true"></i>${t("viewers", SZ.viewers(p))}</p>` : ""}
        ${SZ.wishBtn(p, "pcard__wish")}
      </div>
      <div class="caption">
        <span class="caption__n">(${String(n).padStart(2, "0")})</span>
        <a class="caption__name" href="product.html?id=${p.id}">${name}</a>
      </div>
      <div class="pcard__row">
        ${p.colors.length > 1 || qv ? `<ul class="dots" aria-label="${t("color")}">
          ${p.colors.map((c, i) => `<li><button type="button" class="dot${i === ci ? " is-on" : ""}" style="--dot:${c.hex}" data-color="${i}" aria-pressed="${i === ci}" aria-label="${colorKo(c)}"></button></li>`).join("")}
        </ul>` : "<span></span>"}
        <p class="pcard__price">${SZ.priceHTML(p)}</p>
      </div>
    </li>`;
  };

  const canHover = matchMedia("(hover: hover)");
  const stopClip = (card) => {
    const v = card.querySelector(".pcard__layer--v");
    if (v) { v.pause(); v.currentTime = 0; }
    card.classList.remove("is-alt", "is-clip");
  };

  SZ.wirePcards = (root, { onColor } = {}) => {
    root.addEventListener("mouseover", (e) => {
      if (!canHover.matches) return; // touch fires emulated mouseover before click
      const media = e.target.closest(".pcard__media"); if (!media || media.contains(e.relatedTarget)) return;
      const card = media.closest(".pcard"); card.classList.add("is-alt");
      const v = card.querySelector(".pcard__layer--v");
      if (v && !SZ.motion.reduced) v.play().then(() => card.classList.add("is-clip")).catch(() => {});
    });
    root.addEventListener("mouseout", (e) => {
      if (!canHover.matches) return;
      const media = e.target.closest(".pcard__media"); if (!media || media.contains(e.relatedTarget)) return;
      stopClip(media.closest(".pcard"));
    });
    root.addEventListener("click", (e) => {
      const link = e.target.closest(".pcard__link");
      if (link && !canHover.matches) {
        const card = link.closest(".pcard");
        if (!card.classList.contains("is-alt")) {          // first tap: reveal model layer
          e.preventDefault();
          root.querySelectorAll(".pcard.is-alt").forEach(stopClip);
          card.classList.add("is-alt");
          const v = card.querySelector(".pcard__layer--v");
          if (v && !SZ.motion.reduced) v.play().then(() => card.classList.add("is-clip")).catch(() => {});
        }
        return;                                             // second tap: follow the link
      }
      const dot = e.target.closest("[data-color]");
      if (dot) {
        const card = dot.closest(".pcard"), p = SZ.productById(card.dataset.id), i = +dot.dataset.color;
        const [a, b] = p.colors[i].images;
        card.querySelector(".pcard__layer--a").src = a;
        const lb = card.querySelector(".pcard__layer--b"); if (lb && b) lb.src = b;
        card.querySelectorAll(".dot").forEach((d, j) => { d.classList.toggle("is-on", i === j); d.setAttribute("aria-pressed", String(i === j)); });
        onColor?.(p.id, i);
      }
    });
  };
})();
