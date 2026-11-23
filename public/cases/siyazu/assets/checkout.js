/* SIYAZU: checkout (guest order). Orderer → delivery (Daum postcode) → coupon → payment → agreements.
   Demo only: nothing is charged or sent. The order is saved in localStorage and opened on order.html. */

(() => {
  const { $, $$, S, t, L, price, productById, colorKo, sizeKo, bag, store } = SZ;
  SZ.boot();

  const form = $("#co-form");
  const DRAFT = "siyazu-checkout-draft";
  let coupon = null; // { code, ...S.info.coupons[code] }

  /* ── Totals ── */
  function totals() {
    const list = bag.items.reduce((s, it) => { const p = productById(it.id); return s + (p.was || p.price) * it.qty; }, 0);
    const sub = bag.subtotal();
    let off = 0;
    if (coupon) off = coupon.rate ? Math.min(coupon.max || Infinity, Math.round((sub * coupon.rate) / 10) * 10) : coupon.amount;
    const ship = SZ.shipFee(sub);
    const total = Math.max(0, sub - off) + ship;
    return { list, sale: list - sub, sub, off, ship, total, points: Math.floor(total * 0.01) };
  }

  function renderSummary() {
    const empty = !bag.items.length;
    $("#co-empty").hidden = !empty;
    form.hidden = empty;
    if (empty) return;
    // a coupon may stop qualifying after the bag changes
    if (coupon?.min && bag.subtotal() < coupon.min) { setCouponMsg(`${coupon.code}: 상품 금액이 ${price(coupon.min)} 이상일 때 쓸 수 있어요.`, true); coupon = null; }
    $("#sum-count").textContent = `(${bag.count()})`;
    $("#sum-items").innerHTML = bag.items.map((it) => {
      const p = productById(it.id), col = p.colors.find((c) => c.name === it.color) || p.colors[0];
      return `<li class="co-item">
        <img src="${col.images[0]}" alt="" width="64" height="85" loading="lazy">
        <div><p>${L(p.name)}</p><p class="muted">${colorKo(col)} · ${sizeKo(it.size)} · ${it.qty}개${p.ships ? ` · ${t("preorder", p.ships)}` : ""}</p></div>
        <p class="co-item__price">${price(p.price * it.qty)}</p>
      </li>`;
    }).join("");
    const x = totals();
    $("#sum-totals").innerHTML = `
      <div><dt>상품 금액</dt><dd>${price(x.list)}</dd></div>
      ${x.sale ? `<div><dt>시즌 할인</dt><dd class="is-off">−${price(x.sale)}</dd></div>` : ""}
      ${x.off ? `<div><dt>쿠폰 할인 <span class="muted">${coupon.code}</span></dt><dd class="is-off">−${price(x.off)}</dd></div>` : ""}
      <div><dt>배송비</dt><dd>${x.ship ? price(x.ship) : "무료"}</dd></div>
      <div class="co-totals__sum"><dt>최종 결제 금액</dt><dd>${price(x.total)}</dd></div>`;
    $("#sum-points").textContent = `구매 확정 시 ${x.points.toLocaleString("ko-KR")}P 적립${x.ship ? ` · ${price(S.info.freeShip - x.sub)} 더 담으면 무료배송` : ""}`;
    $("#pay-btn").textContent = `${price(x.total)} 결제하기`;
  }

  /* ── Field helpers ── */
  const fmtPhone = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d.length < 4 ? d : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}` : `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
  };
  const CHECK = {
    phone: (v) => /^01[016789]-\d{3,4}-\d{4}$/.test(v),
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    zip: (v) => /^\d{5}$/.test(v),
  };
  // which conditional groups are active right now
  const active = (el) => {
    const r = el.dataset.req;
    if (!r) return el.required;
    if (r === "recipient") return !$("#same").checked;
    if (r === "card") return form.pay.value === "card";
    if (r === "bank") return form.pay.value === "bank";
    if (r === "agree") return true;
    return false;
  };
  const fieldsToCheck = () => $$("input, select", form).filter((el) => (el.required || el.dataset.req) && active(el));
  const isValid = (el) => {
    if (el.type === "checkbox") return el.checked;
    const v = el.value.trim();
    if (!v) return false;
    return el.dataset.type ? CHECK[el.dataset.type](v) : true;
  };
  function showError(el, bad) {
    if (el.type === "checkbox") { el.closest(".check").classList.toggle("is-bad", bad); return; }
    const field = el.closest(".field");
    let msg = field.querySelector(".field-error");
    if (bad && !msg) {
      msg = document.createElement("p");
      msg.className = "field-error"; msg.id = el.id + "-err";
      msg.innerHTML = `<span aria-hidden="true">!</span> ${el.dataset.msg}`;
      field.append(msg);
      el.setAttribute("aria-describedby", msg.id);
    }
    if (msg) msg.hidden = !bad;
    el.setAttribute("aria-invalid", String(bad));
  }

  /* ── Wiring ── */
  function wire() {
    // phone formatting while typing
    $$('input[data-type="phone"]', form).forEach((el) => el.addEventListener("input", () => { el.value = fmtPhone(el.value); }));
    // validate a field when leaving it, clear the error as soon as it's fixed
    form.addEventListener("focusout", (e) => {
      const el = e.target;
      if ((el.required || el.dataset.req) && el.type !== "checkbox" && el.value && active(el)) showError(el, !isValid(el));
    });
    form.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid") === "true" && isValid(e.target)) showError(e.target, false); });

    $("#same").addEventListener("change", (e) => { $("#recipient").hidden = e.target.checked; if (!e.target.checked) $("#r-name").focus(); });
    $("#memo").addEventListener("change", (e) => { const c = $("#memo-custom"); c.hidden = e.target.value !== "custom"; if (!c.hidden) c.focus(); });

    // payment method: card details / easy-pay note / bank transfer name
    form.addEventListener("change", (e) => {
      if (e.target.name !== "pay") return;
      const m = e.target.value;
      $("#pay-card").hidden = m !== "card";
      $("#pay-bank").hidden = m !== "bank";
      $("#pay-easy").hidden = !["kakao", "naver", "toss"].includes(m);
    });

    // agreements: "전체 동의" ↔ items
    const all = $("#agree-all"), items = $$('.agree ul input[type="checkbox"]', form);
    all.addEventListener("change", () => { items.forEach((c) => { c.checked = all.checked; showError(c, false); }); });
    items.forEach((c) => c.addEventListener("change", () => { all.checked = items.every((x) => x.checked); if (c.checked) showError(c, false); }));

    // coupon
    const apply = (code) => {
      code = code.trim().toUpperCase();
      const c = S.info.coupons[code];
      if (!code) return setCouponMsg("쿠폰 코드를 입력해 주세요.", true);
      if (!c) return setCouponMsg("사용할 수 없는 쿠폰 코드예요. 대소문자와 철자를 확인해 주세요.", true);
      if (c.min && bag.subtotal() < c.min) return setCouponMsg(`상품 금액이 ${price(c.min)} 이상일 때 쓸 수 있어요.`, true);
      coupon = { code, ...c };
      $("#coupon").value = code;
      setCouponMsg(`${c.label} 적용됐어요.`, false);
      renderSummary();
    };
    $("#coupon-apply").addEventListener("click", () => apply($("#coupon").value));
    $("#coupon").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); apply(e.target.value); } });
    $$("[data-coupon]").forEach((b) => b.addEventListener("click", () => apply(b.dataset.coupon)));

    // address search
    $("#find-addr").addEventListener("click", openPostcode);

    // demo data for reviewers
    $("[data-demo-fill]").addEventListener("click", demoFill);

    // keep what was typed if the visitor goes back to the shop
    form.addEventListener("input", saveDraft);
    form.addEventListener("change", () => { saveDraft(); refreshErrors(); });
    form.addEventListener("focusout", () => refreshErrors());

    form.addEventListener("submit", submit);
    document.addEventListener("bag:change", renderSummary);
  }

  function setCouponMsg(text, bad) {
    const m = $("#coupon-msg"); m.textContent = text; m.classList.toggle("is-bad", bad);
  }

  /* ── Daum postcode (free Korean address search). If it can't load, the fields stay editable. ── */
  let pcLoading = null;
  function loadPostcode() {
    if (window.daum?.Postcode) return Promise.resolve();
    return (pcLoading ||= new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      s.onload = res; s.onerror = () => { pcLoading = null; rej(); };
      document.head.append(s);
    }));
  }
  function openPostcode() {
    const dlg = $("#addr-dlg"), frame = $("#addr-frame");
    loadPostcode().then(() => {
      frame.innerHTML = "";
      new daum.Postcode({
        width: "100%", height: "100%",
        oncomplete(d) {
          const extra = [d.bname, d.buildingName].filter(Boolean).join(", ");
          $("#zip").value = d.zonecode;
          $("#addr1").value = (d.roadAddress || d.jibunAddress) + (extra ? ` (${extra})` : "");
          showError($("#zip"), false); showError($("#addr1"), false);
          dlg.close();
          $("#addr2").focus();
          saveDraft();
        },
      }).embed(frame);
      SZ.openDialog(dlg, $("#find-addr"));
    }).catch(() => {
      $("#zip").focus();
      setTimeout(() => alert("주소 검색을 불러오지 못했어요. 우편번호와 주소를 직접 입력해 주세요."), 0);
    });
  }

  function demoFill({ scroll = true } = {}) {
    const set = (id, v) => { const el = $(id); el.value = v; showError(el, false); };
    set("#o-name", "김시야"); set("#o-phone", "010-1234-5678"); set("#o-email", "siya@example.com");
    set("#zip", "06035"); set("#addr1", "서울 강남구 가로수길 5 (신사동)"); set("#addr2", "3층");
    $("#memo").value = "문 앞에 놓아주세요";
    if (form.pay.value === "card") set("#card", "현대카드");
    if (form.pay.value === "bank") set("#depositor", "김시야");
    saveDraft();
    refreshErrors();
    if (scroll) $("#sec-pay").scrollIntoView({ block: "start" });
  }

  /* ── Draft (sessionStorage): survives "back to shop" and reloads in this tab ── */
  function saveDraft() {
    const d = {};
    $$("input, select", form).forEach((el) => {
      if (!el.name || el.name === "agree" || el.name === "agreeOpt") return;
      if (el.type === "radio") { if (el.checked) d[el.name] = el.value; }
      else d[el.name] = el.value;
    });
    d.same = $("#same").checked;
    d.coupon = coupon?.code || "";
    try { sessionStorage.setItem(DRAFT, JSON.stringify(d)); } catch { /* private mode */ }
  }
  // signed-in members: name, phone, email and the default address are filled in
  function prefillMember() {
    const u = SZ.user.get(); if (!u) return;
    const set = (id, v) => { if (v && !$(id).value) $(id).value = v; };
    set("#o-name", u.name); set("#o-phone", u.phone); set("#o-email", u.email);
    if (u.address) { set("#zip", u.address.zip); set("#addr1", u.address.addr1); set("#addr2", u.address.addr2); }
    const card = (u.cards || []).find((c) => c.main);
    if (card && form.pay.value === "card") {
      if (!$("#card").value) $("#card").value = card.co;
      $("#pay-card").insertAdjacentHTML("afterbegin", `<p class="co-saved field--wide">등록된 카드 <b>${card.co} •••• ${card.last4}</b>${card.nick ? ` · ${card.nick}` : ""} <a class="link" href="mypage.html#cards">변경</a></p>`);
    }
    $(".co-demo").innerHTML = `<b>${u.name}님</b> 회원 정보와 기본 배송지${card ? ", 기본 카드" : ""}를 채워 두었어요. 실제 결제와 배송은 이루어지지 않는 컨셉 데모입니다.`;
  }
  function loadDraft() {
    let d; try { d = JSON.parse(sessionStorage.getItem(DRAFT)); } catch { return; }
    if (!d) return;
    Object.entries(d).forEach(([k, v]) => {
      const el = form.elements[k];
      if (!el || k === "coupon") return;
      if (el instanceof RadioNodeList) { const r = [...el].find((x) => x.value === v); if (r) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); } }
      else el.value = v;
    });
    $("#same").checked = d.same !== false; $("#recipient").hidden = $("#same").checked;
    $("#memo-custom").hidden = $("#memo").value !== "custom";
    if (d.coupon && S.info.coupons[d.coupon]) coupon = { code: d.coupon, ...S.info.coupons[d.coupon] };
    if (coupon) { $("#coupon").value = coupon.code; setCouponMsg(`${coupon.label} 적용됐어요.`, false); }
  }

  /* ── Submit → fake payment → order.html ── */
  function submit(e) {
    e.preventDefault();
    const bad = fieldsToCheck().filter((el) => !isValid(el));
    fieldsToCheck().forEach((el) => showError(el, bad.includes(el)));
    if (markSections(bad)) {
      // go to the first card that needs something and focus the field
      const first = bad[0];
      first.closest(".co-sec").scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      first.focus({ preventScroll: true });
      $("#co-status").textContent = `입력이 필요한 항목이 ${bad.length}개 있어요.`;
      return;
    }
    pay();
  }
  // cards with something missing turn red, with a short note in the card header
  function markSections(bad) {
    $$(".co-sec", form).forEach((sec) => {
      const n = bad.filter((el) => sec.contains(el)).length;
      sec.classList.toggle("is-invalid", n > 0);
      let note = $(".co-sec__need", sec);
      if (n && !note) { $(".co-sec__title", sec).insertAdjacentHTML("beforeend", '<span class="co-sec__need"></span>'); note = $(".co-sec__need", sec); }
      if (note) note.textContent = n ? "입력이 필요해요" : "";
    });
    return bad.length > 0;
  }
  // once marked, the red goes away as soon as a card is complete
  const refreshErrors = () => { if ($(".co-sec.is-invalid", form)) markSections(fieldsToCheck().filter((el) => !isValid(el))); };
  function focusField(el) {
    el.scrollIntoView({ block: "center" });
    el.focus({ preventScroll: true });
  }

  function pay() {
    const dlg = $("#paying");
    // can't be dismissed while "paying"
    dlg.addEventListener("cancel", (ev) => ev.preventDefault());
    dlg.addEventListener("click", (ev) => ev.stopImmediatePropagation(), true);
    dlg.showModal();
    const x = totals();
    const f = form.elements;
    const same = $("#same").checked;
    const method = f.pay.value;
    const METHOD = { card: "신용·체크카드", kakao: "카카오페이", naver: "네이버페이", toss: "토스페이", bank: "무통장 입금" };
    const now = new Date();
    const no = `SZ${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const order = {
      no, created: now.getTime(), status: "paid",
      items: bag.items.map((it) => ({ ...it, price: productById(it.id).price })),
      totals: x, coupon: coupon?.code || null,
      orderer: { name: f.oName.value.trim(), phone: f.oPhone.value, email: f.oEmail.value.trim() },
      ship: {
        name: same ? f.oName.value.trim() : f.rName.value.trim(),
        phone: same ? f.oPhone.value : f.rPhone.value,
        zip: f.zip.value.trim(), addr1: f.addr1.value.trim(), addr2: f.addr2.value.trim(),
        memo: f.memo.value === "custom" ? f.memoCustom.value.trim() : f.memo.value,
      },
      pay: {
        method, label: METHOD[method],
        detail: method === "card" ? `${f.card.value} · ${f.months.selectedOptions[0].text}` : method === "bank" ? `입금자명 ${f.depositor.value.trim()}` : "",
      },
      marketing: !!f.agreeOpt.checked,
    };
    setTimeout(() => {
      const orders = store.get("siyazu-orders", []);
      store.set("siyazu-orders", [order, ...orders].slice(0, 20));
      bag.clear();
      // first order of a member: remember phone + address for next time
      const u = SZ.user.get();
      if (u && !u.address) SZ.user.update({ phone: u.phone || order.orderer.phone, address: { zip: order.ship.zip, addr1: order.ship.addr1, addr2: order.ship.addr2 } });
      try { sessionStorage.removeItem(DRAFT); } catch { /* ignore */ }
      location.replace(`order.html?no=${encodeURIComponent(no)}&new=1`);
    }, 1800);
  }

  wire();
  loadDraft();
  prefillMember();
  // demo: arrive with example details already filled in (agreements stay for the visitor to tick)
  if (!$("#o-name").value) demoFill({ scroll: false });
  renderSummary();
})();
