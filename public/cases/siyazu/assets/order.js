/* SIYAZU: order page.
   order.html?no=…&new=1 → "주문이 완료되었습니다"; order.html?no=… → order detail; order.html → lookup.
   Demo: orders live in localStorage (this browser only). Status moves on with time so the tracker can be seen working:
   결제 완료 → 상품 준비 중 (1 min) → 배송 중 (5 min) → 배송 완료 (30 min). */

(() => {
  const { $, $$, S, t, L, price, productById, colorKo, sizeKo, store } = SZ;
  SZ.boot();

  const root = $("#main");
  const q = new URLSearchParams(location.search);
  const MIN = 60 * 1000;
  const STEPS = [
    { key: "paid", label: "결제 완료", at: 0 },
    { key: "preparing", label: "상품 준비 중", at: 1 * MIN },
    { key: "shipping", label: "배송 중", at: 5 * MIN },
    { key: "delivered", label: "배송 완료", at: 30 * MIN },
  ];
  const orders = () => store.get("siyazu-orders", []);
  const save = (o) => store.set("siyazu-orders", orders().map((x) => (x.no === o.no ? o : x)));
  const find = (no) => orders().find((o) => o.no === no);

  const stepIndex = (o) => {
    const age = Date.now() - o.created;
    return STEPS.reduce((i, s, j) => (age >= s.at ? j : i), 0);
  };
  const fmtDate = (ms, withTime = true) => {
    const d = new Date(ms);
    const day = `${d.getMonth() + 1}월 ${d.getDate()}일 (${"일월화수목금토"[d.getDay()]})`;
    return withTime ? `${day} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : day;
  };
  // delivery estimate: 2 business days after shipping; pre-order items wait for their ship date
  function eta(o) {
    let d = new Date(o.created);
    const pre = o.items.map((it) => productById(it.id)?.ships).filter(Boolean)
      .map((md) => { const [m, dd] = md.split("/").map(Number); const x = new Date(d.getFullYear(), m - 1, dd); if (x < d) x.setFullYear(x.getFullYear() + 1); return x; })
      .sort((a, b) => b - a)[0];
    if (pre && pre > d) d = pre;
    let n = 0;
    while (n < 2) { d = new Date(d.getTime() + 24 * 60 * MIN); if (d.getDay() % 6) n++; }
    return fmtDate(d.getTime(), false);
  }
  const trackNo = (o) => "6" + o.no.replace(/\D/g, "").slice(-11).padStart(11, "0");
  const maskPhone = (p) => p.replace(/^(\d{3})-(\d{3,4})-(\d{4})$/, (_, a, b, c) => `${a}-${"*".repeat(b.length)}-${c}`);

  /* ── Order detail / complete ── */
  function renderOrder(o, isNew) {
    const i = stepIndex(o);
    const cancelled = o.status === "cancelled";
    const canCancel = !cancelled && i <= 1;
    const canReturn = !cancelled && i === 3 && !o.request;
    document.title = `${isNew ? "주문 완료" : "주문 상세"} | SIYAZU`;
    root.innerHTML = `
      ${isNew ? `<ol class="co-steps label" aria-label="주문 단계">
        <li class="is-done"><span>01</span> 장바구니</li><li class="is-done"><span>02</span> 주문서 작성</li>
        <li class="is-on" aria-current="step"><span>03</span> 주문 완료</li></ol>` : ""}
      <section class="od-hero">
        <p class="label muted">주문번호 <span class="od-hero__no">${o.no}</span></p>
        <h1 class="od-hero__title" tabindex="-1">${isNew ? `${o.orderer.name}님, 주문이 완료되었습니다` : cancelled ? "취소된 주문입니다" : STEPS[i].label}</h1>
        <p class="muted">${isNew
          ? `${o.orderer.email}로 주문 확인 메일을 보냈어요 (데모). 주문번호와 휴대폰 번호로 언제든 조회할 수 있어요.`
          : `${fmtDate(o.created)} 주문`}</p>
        ${!cancelled && i < 3 ? `<p>도착 예정 <b>${eta(o)}</b></p>` : ""}
        <div class="od-hero__actions">
          <a class="sz-btn sz-btn--solid" href="shop.html">쇼핑 계속하기</a>
          ${canCancel ? `<button class="sz-btn sz-btn--line" type="button" data-cancel>주문 취소</button>` : ""}
          ${canReturn ? `<button class="sz-btn sz-btn--line" type="button" data-return>교환·반품 신청</button>` : ""}
        </div>
      </section>

      ${cancelled
        ? `<p class="od-cancelled">${fmtDate(o.cancelledAt)}에 취소되었어요. 결제하신 ${price(o.totals.total)}는 ${o.pay.method === "card" ? "카드사에 따라 3–5영업일 안에" : "1–3영업일 안에"} 환불됩니다.</p>`
        : `<ol class="track" aria-label="배송 단계">
            ${STEPS.map((s, j) => `<li class="${j < i ? "is-done" : ""}${j === i ? " is-done is-now" : ""}" ${j === i ? 'aria-current="step"' : ""}>
              <span>${s.label}</span>${j <= i ? `<time>${fmtDate(o.created + s.at)}</time>` : ""}</li>`).join("")}
          </ol>
          <p class="track-note">${i >= 2 ? `CJ대한통운 송장번호 ${trackNo(o)} · ` : ""}데모: 시간이 지나면 다음 단계로 바뀌어요 (1분 · 5분 · 30분).</p>`}

      ${o.request ? `<div class="od-req" role="status"><p><b>${o.request.type === "exchange" ? "교환" : "반품"} 접수됨</b> · ${fmtDate(o.request.at)}</p>
        <p class="muted">${o.request.summary} 회수 기사님이 1–2영업일 안에 방문해요.</p></div>` : ""}
      <div id="req-slot"></div>

      <section class="od-sec" aria-labelledby="od-items">
        <h2 id="od-items">주문 상품 <span class="muted">${o.items.reduce((n, x) => n + x.qty, 0)}개</span></h2>
        <ul class="od-items">${o.items.map((it) => {
          const p = productById(it.id); if (!p) return "";
          const col = p.colors.find((c) => c.name === it.color) || p.colors[0];
          return `<li class="od-item">
            <img src="${col.images[0]}" alt="" width="72" height="96" loading="lazy">
            <div><a href="product.html?id=${p.id}">${L(p.name)}</a><p class="muted">${colorKo(col)} · ${sizeKo(it.size)} · ${it.qty}개${p.ships ? ` · ${t("preorder", p.ships)}` : ""}</p></div>
            <p>${price(it.price * it.qty)}</p></li>`;
        }).join("")}</ul>
      </section>

      <div class="od-two">
        <section class="od-sec" aria-labelledby="od-ship">
          <h2 id="od-ship">배송지</h2>
          <dl class="od-dl">
            <div><dt>받는 분</dt><dd>${o.ship.name}</dd></div>
            <div><dt>연락처</dt><dd>${maskPhone(o.ship.phone)}</dd></div>
            <div><dt>주소</dt><dd>(${o.ship.zip}) ${o.ship.addr1} ${o.ship.addr2}</dd></div>
            <div><dt>요청사항</dt><dd>${o.ship.memo || "없음"}</dd></div>
          </dl>
        </section>
        <section class="od-sec" aria-labelledby="od-pay">
          <h2 id="od-pay">결제 정보</h2>
          <dl class="od-dl">
            <div><dt>결제 수단</dt><dd>${o.pay.label}${o.pay.detail ? ` · ${o.pay.detail}` : ""}</dd></div>
            <div><dt>상품 금액</dt><dd>${price(o.totals.list)}</dd></div>
            ${o.totals.sale ? `<div><dt>시즌 할인</dt><dd>−${price(o.totals.sale)}</dd></div>` : ""}
            ${o.totals.off ? `<div><dt>쿠폰 ${o.coupon}</dt><dd>−${price(o.totals.off)}</dd></div>` : ""}
            <div><dt>배송비</dt><dd>${o.totals.ship ? price(o.totals.ship) : "무료"}</dd></div>
            <div><dt>결제 금액</dt><dd><b>${price(o.totals.total)}</b></dd></div>
          </dl>
        </section>
      </div>
      <p class="muted od-foot-note">${o.pay.method === "bank" ? "무통장 입금 주문은 24시간 안에 입금이 확인되지 않으면 자동 취소돼요. " : ""}문의: 고객센터 1588-0000 (평일 10–17시, 데모)</p>`;

    if (isNew) $(".od-hero__title", root).focus({ preventScroll: true });
    // the new=1 flag is only for the first view; a reload shows the regular detail
    if (isNew) history.replaceState(null, "", `order.html?no=${encodeURIComponent(o.no)}`);

    $("[data-cancel]", root)?.addEventListener("click", () => cancelFlow(o));
    $("[data-return]", root)?.addEventListener("click", () => returnFlow(o));
  }

  function cancelFlow(o) {
    const slot = $("#req-slot");
    slot.innerHTML = `<div class="od-req" role="group" aria-labelledby="cx-t">
      <p id="cx-t"><b>주문을 취소할까요?</b></p>
      <p class="muted">상품 준비가 시작되기 전이라 바로 취소돼요. 결제 금액 ${price(o.totals.total)}는 결제 수단으로 환불됩니다.</p>
      <div class="od-hero__actions"><button class="sz-btn sz-btn--solid" type="button" data-yes>주문 취소하기</button>
      <button class="sz-btn sz-btn--line" type="button" data-no>돌아가기</button></div></div>`;
    $("[data-yes]", slot).focus();
    $("[data-no]", slot).addEventListener("click", () => { slot.innerHTML = ""; $("[data-cancel]", root)?.focus(); });
    $("[data-yes]", slot).addEventListener("click", () => {
      o.status = "cancelled"; o.cancelledAt = Date.now(); save(o); renderOrder(o, false);
      $(".od-hero__title", root).focus();
    });
  }

  function returnFlow(o) {
    const slot = $("#req-slot");
    const lines = o.items.map((it, k) => ({ it, k, p: productById(it.id) })).filter((x) => x.p);
    slot.innerHTML = `<form class="od-req" novalidate aria-labelledby="rq-t">
      <p id="rq-t"><b>교환·반품 신청</b> <span class="muted">수령 후 7일 이내</span></p>
      <fieldset class="buy__group"><legend class="label">상품</legend>
        ${lines.map(({ it, k, p }) => `<label class="check"><input type="radio" name="line" value="${k}" ${k === 0 ? "checked" : ""}><span>${L(p.name)} · ${sizeKo(it.size)}</span></label>`).join("")}
      </fieldset>
      <fieldset class="buy__group"><legend class="label">신청 유형</legend>
        <div class="sizes">
          <label class="size"><input type="radio" name="type" value="exchange" checked><span>사이즈 교환</span></label>
          <label class="size"><input type="radio" name="type" value="return"><span>반품</span></label>
        </div>
      </fieldset>
      <fieldset class="buy__group" data-newsize><legend class="label">받고 싶은 사이즈</legend><div class="sizes"></div></fieldset>
      <div class="field"><label for="rq-why">사유</label>
        <select id="rq-why" name="why"><option>사이즈가 맞지 않아요</option><option>생각한 색상과 달라요</option><option>상품에 문제가 있어요</option><option>단순 변심</option></select></div>
      <p class="muted" data-fee></p>
      <div class="od-hero__actions"><button class="sz-btn sz-btn--solid" type="submit">신청하기</button>
      <button class="sz-btn sz-btn--line" type="button" data-no>취소</button></div>
    </form>`;
    const f = $("form", slot);
    const sync = () => {
      const { it, p } = lines.find((x) => x.k === +f.line.value);
      const ex = f.type.value === "exchange";
      const box = $("[data-newsize]", f);
      const others = p.sizes.filter((s) => s !== it.size);
      const firstFree = others.find((s) => !SZ.isSoldOut(p, it.color, s));
      box.hidden = !ex || !others.length;
      $(".sizes", box).innerHTML = others.map((s) => `<label class="size${SZ.isSoldOut(p, it.color, s) ? " is-out" : ""}"><input type="radio" name="newSize" value="${s}" ${s === firstFree ? "checked" : ""} ${SZ.isSoldOut(p, it.color, s) ? "disabled" : ""}><span>${sizeKo(s)}<small class="size__out">${t("soldOut")}</small></span></label>`).join("");
      // nothing to exchange into: only a return is possible
      const exBtn = f.querySelector('[name=type][value="exchange"]');
      exBtn.disabled = !firstFree;
      if (!firstFree && ex) { f.querySelector('[name=type][value="return"]').checked = true; return sync(); }
      const free = f.why.value === "상품에 문제가 있어요";
      $("[data-fee]", f).textContent = free ? "상품 문제는 배송비 없이 처리해 드려요." : `${ex ? "교환" : "반품"} 배송비 ${price(ex ? 6000 : 3000)}가 ${ex ? "추가 결제돼요" : "환불 금액에서 차감돼요"}.`;
    };
    f.addEventListener("change", sync); sync();
    $("input", f).focus();
    $("[data-no]", f).addEventListener("click", () => { slot.innerHTML = ""; $("[data-return]", root)?.focus(); });
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const { it, p } = lines.find((x) => x.k === +f.line.value);
      const ex = f.type.value === "exchange";
      o.request = {
        type: ex ? "exchange" : "return", at: Date.now(), why: f.why.value,
        summary: ex ? `${L(p.name)} ${sizeKo(it.size)} → ${sizeKo(f.newSize?.value || it.size)} 교환.` : `${L(p.name)} 반품.`,
      };
      save(o); renderOrder(o, false);
    });
  }

  /* ── Lookup (no order number in the URL) ── */
  function renderLookup(errMsg = "") {
    document.title = "주문 조회 | SIYAZU";
    const mine = orders();
    root.innerHTML = `
      <section class="od-hero"><h1 class="od-hero__title">주문 조회</h1>
        <p class="muted">회원가입 없이 주문하셨다면 주문번호와 휴대폰 번호로 조회할 수 있어요.</p></section>
      <form class="lookup" novalidate>
        <div class="field"><label for="lk-no">주문번호</label><input id="lk-no" name="no" autocomplete="off" placeholder="SZ20261123-0000" required></div>
        <div class="field"><label for="lk-phone">휴대폰 번호</label><input id="lk-phone" name="phone" type="tel" inputmode="numeric" placeholder="010-0000-0000" required></div>
        <p class="lookup__err" role="alert">${errMsg}</p>
        <button class="sz-btn sz-btn--solid" type="submit">조회하기</button>
        ${mine.length ? `<div class="lookup__recent"><p class="label muted">이 기기에서 한 주문</p>
          ${mine.map((o) => `<a href="order.html?no=${encodeURIComponent(o.no)}"><span>${o.no}</span><span class="muted">${o.status === "cancelled" ? "취소됨" : STEPS[stepIndex(o)].label} · ${price(o.totals.total)}</span></a>`).join("")}</div>`
        : `<p class="muted">데모 안내: 이 사이트에서 직접 주문해 보면 여기에서 조회할 수 있어요.</p>`}
      </form>`;
    const f = $("form", root);
    f.phone.addEventListener("input", () => {
      const d = f.phone.value.replace(/\D/g, "").slice(0, 11);
      f.phone.value = d.length < 4 ? d : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}` : `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
    });
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const o = find(f.no.value.trim().toUpperCase());
      if (o && o.orderer.phone.replace(/\D/g, "") === f.phone.value.replace(/\D/g, "")) {
        history.pushState(null, "", `order.html?no=${encodeURIComponent(o.no)}`);
        renderOrder(o, false);
        return;
      }
      $(".lookup__err", root).textContent = "일치하는 주문이 없어요. 주문번호와 휴대폰 번호를 다시 확인해 주세요.";
      f.no.focus();
    });
  }

  function route() {
    const no = new URLSearchParams(location.search).get("no");
    const o = no && find(no);
    if (o) renderOrder(o, q.get("new") === "1" && no === q.get("no"));
    else renderLookup(no ? "주문을 찾을 수 없어요. 이 기기에서 한 주문만 조회할 수 있어요 (데모)." : "");
  }
  addEventListener("popstate", route);
  route();
})();
