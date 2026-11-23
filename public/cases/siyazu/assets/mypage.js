/* SIYAZU: 마이페이지 (demo account, everything in localStorage).
   Signed out → sign-in (any email + password, or "데모 계정으로 둘러보기") and the guest order lookup.
   Signed in → member card (grade, points, coupons) + tabs: 주문·배송 / 위시리스트 / 재입고 알림 / 내 사이즈 / 배송지.
   mypage.html#wish opens the wishlist tab (the header heart links here). */

(() => {
  const { $, $$, S, t, L, price, productById, colorKo, sizeKo, store, user, wish, bag } = SZ;
  SZ.boot();

  const root = $("#main");
  const MIN = 60 * 1000;
  const TABS = [
    { id: "orders", label: "주문·배송" },
    { id: "wish", label: "위시리스트" },
    { id: "restock", label: "재입고 알림" },
    { id: "size", label: "내 사이즈" },
    { id: "address", label: "배송지" },
    { id: "cards", label: "결제 수단" },
  ];
  const STEP = (o) => {
    if (o.status === "cancelled") return "취소됨";
    const age = Date.now() - o.created;
    return age >= 30 * MIN ? "배송 완료" : age >= 5 * MIN ? "배송 중" : age >= MIN ? "상품 준비 중" : "결제 완료";
  };
  const orders = () => store.get("siyazu-orders", []);
  const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtPhone = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d.length < 4 ? d : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}` : `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
  };

  /* ── Points & grade (demo rules) ── */
  function member() {
    const live = orders().filter((o) => o.status !== "cancelled");
    const delivered = live.filter((o) => STEP(o) === "배송 완료");
    const spent = live.reduce((s, o) => s + o.totals.total, 0);
    const points = 3000 + delivered.reduce((s, o) => s + o.totals.points, 0); // 3,000P welcome
    const pending = live.filter((o) => STEP(o) !== "배송 완료").reduce((s, o) => s + o.totals.points, 0);
    const grades = [["MEMBER", 0], ["SILVER", 300000], ["GOLD", 1000000]];
    const gi = grades.reduce((i, g, j) => (spent >= g[1] ? j : i), 0);
    const next = grades[gi + 1];
    return { spent, points, pending, grade: grades[gi][0], next: next && { name: next[0], left: next[1] - spent } };
  }

  /* ── Signed out ── */
  function renderLogin(msg = "") {
    document.title = "로그인 | SIYAZU";
    root.innerHTML = `
      <section class="mp-login">
        <h1 class="mp-title">로그인</h1>
        <p class="muted">로그인하면 주문 내역, 위시리스트, 적립금을 한곳에서 볼 수 있어요.</p>
        <p class="co-demo" role="note"><b>데모</b> 실제 회원가입은 되지 않아요. 아무 이메일과 4자 이상 비밀번호로 로그인하거나 데모 계정을 써 보세요.</p>
        <form class="mp-login__form" novalidate>
          <div class="field"><label for="lg-email">이메일</label>
            <input id="lg-email" name="email" type="email" inputmode="email" autocomplete="username" placeholder="name@example.com" required></div>
          <div class="field"><label for="lg-pw">비밀번호</label>
            <input id="lg-pw" name="pw" type="password" autocomplete="current-password" minlength="4" required></div>
          <p class="lookup__err" role="alert">${msg}</p>
          <button class="sz-btn sz-btn--solid" type="submit">로그인</button>
          <button class="sz-btn sz-btn--line" type="button" data-demo>데모 계정으로 둘러보기</button>
        </form>
        <div class="mp-login__guest">
          <p class="label muted">비회원으로 주문하셨나요?</p>
          <a class="link label" href="order.html">비회원 주문조회 →</a>
        </div>
      </section>`;
    const f = $("form", root);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = f.email.value.trim(), pw = f.pw.value;
      const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      f.email.setAttribute("aria-invalid", String(!okEmail));
      f.pw.setAttribute("aria-invalid", String(pw.length < 4));
      if (!okEmail) { $(".lookup__err", root).textContent = "이메일 주소를 확인해 주세요."; f.email.focus(); return; }
      if (pw.length < 4) { $(".lookup__err", root).textContent = "비밀번호를 4자 이상 입력해 주세요."; f.pw.focus(); return; }
      signIn({ name: email.split("@")[0], email });
    });
    $("[data-demo]", root).addEventListener("click", () => signIn({
      name: "김시야", email: "siya@example.com", phone: "010-1234-5678",
      address: { zip: "06035", addr1: "서울 강남구 가로수길 5 (신사동)", addr2: "3층" },
      cards: [{ co: "현대카드", last4: "4821", nick: "", main: true }],
    }));
  }
  function signIn(u) {
    // the last order on this device fills in what the account doesn't know yet
    const last = orders()[0];
    user.set({
      joined: Date.now(), ...u,
      phone: u.phone || last?.orderer.phone || "",
      address: u.address || (last ? { zip: last.ship.zip, addr1: last.ship.addr1, addr2: last.ship.addr2 } : null),
    });
    syncAccountLinks();
    route();
    $(".mp-hello", root)?.focus();
  }
  const syncAccountLinks = () => $$('a[href="mypage.html"]:not(.wish-head)').forEach((a) => { if (!a.closest(".mp")) a.textContent = user.get() ? t("mypage") : t("login"); });

  /* ── Signed in ── */
  function renderPage(tab) {
    const u = user.get(), m = member();
    document.title = "마이페이지 | SIYAZU";
    const n = (v) => v.toLocaleString("ko-KR");
    const nav = (group, ids) => `<li><p class="mp-nav__group label">${group}</p><ul>
      ${ids.map((id) => { const x = TABS.find((y) => y.id === id); return `<li><a href="#${id}" ${id === tab ? 'aria-current="page"' : ""}><span>${x.label}</span>${count(id)}</a></li>`; }).join("")}
    </ul></li>`;
    root.innerHTML = `
      <header class="mp-head">
        <div class="mp-head__who">
          <h1 class="mp-hello" id="mp-hello" tabindex="-1">${esc(u.name)}님 <span class="mp-grade mp-grade--${m.grade.toLowerCase()}">${m.grade}</span></h1>
          <p class="muted">${esc(u.email)}${m.next ? ` · ${price(m.next.left)} 더 구매하면 ${m.next.name}` : ""}</p>
        </div>
        <button class="mp-logout" type="button" data-logout>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2.5H3.5v11H6M10.5 5l3 3-3 3M13.5 8H6.5"/></svg>로그아웃
        </button>
      </header>
      <ul class="mp-sum">
        <li><div><span class="mp-sum__k">적립금</span><b>${n(m.points)}P</b>${m.pending ? `<span class="mp-sum__s">적립 예정 ${n(m.pending)}P</span>` : ""}</div></li>
        <li><div><span class="mp-sum__k">쿠폰</span><b>${Object.keys(S.info.coupons).length}장</b></div></li>
        <li><a href="#wish"><span class="mp-sum__k">위시리스트</span><b>${wish.ids.length}</b></a></li>
        <li><a href="#orders"><span class="mp-sum__k">주문</span><b>${orders().length}</b></a></li>
      </ul>
      <div class="mp-body">
        <nav class="mp-nav" aria-label="마이페이지 메뉴">
          <ul>
            ${nav("쇼핑", ["orders"])}
            ${nav("관심 상품", ["wish", "restock"])}
            ${nav("회원 정보", ["size", "address", "cards"])}
          </ul>
        </nav>
        <section class="mp-panel" id="mp-panel" tabindex="-1" aria-labelledby="mp-panel-title">
          <h2 class="mp-panel__title" id="mp-panel-title">${TABS.find((x) => x.id === tab).label}</h2>
          <div id="mp-panel-body"></div>
        </section>
      </div>`;
    $("[data-logout]", root).addEventListener("click", () => { user.logout(); syncAccountLinks(); history.replaceState(null, "", "mypage.html"); route(); });
    PANELS[tab]($("#mp-panel-body"));
  }
  function count(id) {
    const n = id === "orders" ? orders().length : id === "wish" ? wish.ids.length : id === "restock" ? store.get("siyazu-restock", []).length : id === "cards" ? (user.get().cards || []).length : 0;
    return n ? `<span class="mp-nav__n">${n}</span>` : "";
  }

  const empty = (text, link = "shop.html", cta = "쇼핑하러 가기") =>
    `<div class="mp-empty"><p>${text}</p><a class="sz-btn sz-btn--line" href="${link}">${cta}</a></div>`;

  const PANELS = {
    orders(el) {
      const list = orders();
      // classic Korean mypage strip: how many orders sit at each step
      const steps = ["결제 완료", "상품 준비 중", "배송 중", "배송 완료"];
      const pipe = `<ol class="mp-pipe" aria-label="주문 처리 현황">${steps.map((s) => {
        const c = list.filter((o) => STEP(o) === s).length;
        return `<li class="${c ? "is-on" : ""}"><b>${c}</b><span>${s}</span></li>`;
      }).join("")}</ol>`;
      if (!list.length) { el.innerHTML = pipe + empty("아직 주문 내역이 없어요."); return; }
      el.innerHTML = pipe + `<ul class="mp-orders">${list.map((o) => {
        const first = productById(o.items[0].id), col = first?.colors.find((c) => c.name === o.items[0].color) || first?.colors[0];
        const more = o.items.length - 1;
        return `<li><a class="mp-order" href="order.html?no=${encodeURIComponent(o.no)}">
          ${col ? `<img src="${col.images[0]}" alt="" width="64" height="85" loading="lazy">` : ""}
          <span class="mp-order__info">
            <span class="mp-order__meta">${new Date(o.created).toLocaleDateString("ko-KR")} · ${o.no}</span>
            <span class="mp-order__name">${first ? L(first.name) : ""}${more > 0 ? ` 외 ${more}건` : ""}</span>
            <span>${price(o.totals.total)}</span>
          </span>
          <span class="mp-order__status${STEP(o) === "취소됨" ? " is-off" : ""}">${STEP(o)}</span>
        </a></li>`;
      }).join("")}</ul>`;
    },

    wish(el) {
      const ids = wish.ids;
      if (!ids.length) { el.innerHTML = empty("상품의 하트를 누르면 여기에 모여요."); return; }
      el.innerHTML = `<ul class="mp-wish">${ids.map((id) => {
        const p = productById(id), col = p.colors[0];
        const free = p.sizes.filter((s) => !SZ.isSoldOut(p, col.name, s));
        return `<li class="mp-wish__item" data-id="${p.id}">
          <div class="mp-wish__media">
            <a href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true"><img src="${col.images[0]}" alt="" width="300" height="400" loading="lazy"></a>
            <button class="wish-btn mp-wish__heart" type="button" data-unwish="${p.id}" aria-pressed="true" aria-label="${t("wishRemove")}: ${L(p.name)}"><svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.6-4.6-9.2-9.4C1.7 7.6 3.9 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.3 0 5.5 3.1 4.4 6.4-1.6 4.8-9.2 9.4-9.2 9.4z"/></svg></button>
          </div>
          <div class="mp-wish__cap">
            <a class="mp-wish__name" href="product.html?id=${p.id}">${L(p.name)}</a>
            <p class="mp-wish__price">${SZ.priceHTML(p)}</p>
          </div>
          <div class="mp-wish__sizes" role="radiogroup" aria-label="${L(p.name)} ${t("size")}">
            ${p.sizes.map((s) => {
              const out = SZ.isSoldOut(p, col.name, s);
              return `<label class="size size--sm${out ? " is-out" : ""}"><input type="radio" name="ws-${p.id}" value="${s}" ${s === free[0] ? "checked" : ""} ${out ? "disabled" : ""}><span>${sizeKo(s)}</span></label>`;
            }).join("")}
          </div>
          <button class="sz-btn sz-btn--line mp-wish__add" type="button" data-add ${free.length ? "" : "disabled"}>${free.length ? t("addToBag") : t("soldOut")}</button>
        </li>`;
      }).join("")}</ul>`;
      el.onclick = (e) => {
        const x = e.target.closest("[data-unwish]");
        if (x) { wish.toggle(x.dataset.unwish); return; }
        const add = e.target.closest("[data-add]");
        if (add) {
          const li = add.closest(".mp-wish__item"), p = productById(li.dataset.id);
          const size = $("input:checked", li)?.value || p.sizes[0];
          bag.add(p.id, p.colors[0].name, size);
          add.textContent = t("addedBtn");
          setTimeout(() => { add.textContent = t("addToBag"); }, 1800);
          SZ.afterAdd();
        }
      };
    },

    restock(el) {
      const list = store.get("siyazu-restock", []);
      if (!list.length) { el.innerHTML = empty("품절 사이즈에서 ‘재입고 알림 신청’을 누르면 여기에 모여요."); return; }
      el.innerHTML = `<ul class="mp-orders">${list.map((r, i) => {
        const p = productById(r.id); if (!p) return "";
        const col = p.colors.find((c) => c.name === r.color) || p.colors[0];
        const back = !SZ.isSoldOut(p, r.color, r.size);
        return `<li><div class="mp-order">
          <img src="${col.images[0]}" alt="" width="64" height="85" loading="lazy">
          <span class="mp-order__info">
            <a href="product.html?id=${p.id}">${L(p.name)}</a>
            <span class="muted">${colorKo(col)} · ${sizeKo(r.size)} · 알림 받을 곳 ${esc(r.contact)}</span>
          </span>
          <span class="mp-order__side">
            <span class="mp-order__status${back ? "" : " is-wait"}">${back ? "재입고됨" : "대기 중"}</span>
            <button class="label link-btn" type="button" data-unrestock="${i}">알림 취소</button>
          </span>
        </div></li>`;
      }).join("")}</ul>`;
      el.onclick = (e) => {
        const b = e.target.closest("[data-unrestock]"); if (!b) return;
        const l = store.get("siyazu-restock", []); l.splice(+b.dataset.unrestock, 1); store.set("siyazu-restock", l);
        renderPage("restock");
      };
    },

    size(el) {
      const fit = store.get("siyazu-fit", null);
      el.innerHTML = `<form class="mp-form" novalidate>
        <p class="muted">저장해 두면 상품마다 맞는 사이즈를 바로 추천해 드려요.</p>
        <fieldset class="buy__group"><legend class="label">평소 입는 사이즈</legend>
          <div class="sizes">${[44, 55, 66, 77].map((u) => `<label class="size"><input type="radio" name="usual" value="${u}" ${fit?.usual === u ? "checked" : ""}><span>${u}</span></label>`).join("")}</div></fieldset>
        <fieldset class="buy__group"><legend class="label">선호하는 핏</legend>
          <div class="sizes">
            <label class="size"><input type="radio" name="fit" value="regular" ${fit?.fit !== "loose" ? "checked" : ""}><span>딱 맞게</span></label>
            <label class="size"><input type="radio" name="fit" value="loose" ${fit?.fit === "loose" ? "checked" : ""}><span>여유 있게</span></label>
          </div></fieldset>
        <p class="notify__ok" role="status"></p>
      </form>`;
      const f = $("form", el);
      f.addEventListener("change", () => {
        const usual = f.querySelector("[name=usual]:checked")?.value; if (!usual) return;
        store.set("siyazu-fit", { usual: +usual, fit: f.querySelector("[name=fit]:checked").value });
        $(".notify__ok", f).textContent = "저장했어요. 상품 페이지에서 추천 사이즈가 보여요.";
      });
    },

    address(el) {
      const a = user.get().address || {};
      el.innerHTML = `<form class="mp-form" novalidate>
        <p class="muted">기본 배송지는 주문서에 자동으로 채워져요.</p>
        <div class="fields">
          <div class="field"><label for="ad-name">받는 분</label><input id="ad-name" name="name" autocomplete="name" value="${esc(user.get().name)}"></div>
          <div class="field"><label for="ad-phone">연락처</label><input id="ad-phone" name="phone" type="tel" inputmode="numeric" placeholder="010-0000-0000" value="${esc(user.get().phone)}"></div>
          <div class="field"><label for="ad-zip">우편번호</label><input id="ad-zip" name="zip" inputmode="numeric" placeholder="00000" value="${esc(a.zip)}"></div>
          <div class="field field--wide"><label for="ad-1">주소</label><input id="ad-1" name="addr1" value="${esc(a.addr1)}"></div>
          <div class="field field--wide"><label for="ad-2">상세 주소</label><input id="ad-2" name="addr2" value="${esc(a.addr2)}"></div>
        </div>
        <p class="lookup__err" role="alert"></p>
        <button class="sz-btn sz-btn--solid" type="submit">기본 배송지로 저장</button>
        <p class="notify__ok" role="status"></p>
      </form>`;
      const f = $("form", el);
      f.phone.addEventListener("input", () => { f.phone.value = fmtPhone(f.phone.value); });
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const bad = !/^01[016789]-\d{3,4}-\d{4}$/.test(f.phone.value) ? "연락처를 010-0000-0000 형식으로 입력해 주세요."
          : !/^\d{5}$/.test(f.zip.value.trim()) ? "우편번호 5자리를 입력해 주세요."
          : !f.addr1.value.trim() ? "주소를 입력해 주세요." : "";
        $(".lookup__err", f).textContent = bad;
        if (bad) return;
        user.update({ name: f.name.value.trim() || user.get().name, phone: f.phone.value, address: { zip: f.zip.value.trim(), addr1: f.addr1.value.trim(), addr2: f.addr2.value.trim() } });
        $(".notify__ok", f).textContent = "저장했어요.";
      });
    },
  };

  /* ── Saved cards (demo: only the card company, a nickname and the last 4 digits are kept) ── */
  const CARD_CO = ["신한카드", "KB국민카드", "현대카드", "삼성카드", "롯데카드", "하나카드", "우리카드", "BC카드", "NH농협카드"];
  PANELS.cards = (el) => {
    const cards = user.get().cards || [];
    el.innerHTML = `
      <p class="muted mp-note">등록한 카드는 주문서에서 바로 선택돼요. 데모라 카드 번호 전체는 받지 않고 끝 4자리만 저장해요.</p>
      ${cards.length ? `<ul class="mp-cards">${cards.map((c, i) => `
        <li class="mp-cardrow${c.main ? " is-main" : ""}">
          <span class="mp-cardrow__chip" aria-hidden="true"></span>
          <span class="mp-cardrow__info">
            <b>${esc(c.co)}${c.main ? ' <span class="mp-tag">기본</span>' : ""}</b>
            <span class="muted">•••• ${esc(c.last4)}${c.nick ? ` · ${esc(c.nick)}` : ""}</span>
          </span>
          <span class="mp-cardrow__act">
            ${c.main ? "" : `<button class="mp-mini" type="button" data-main="${i}">기본으로</button>`}
            <button class="mp-mini mp-mini--del" type="button" data-del="${i}" aria-label="${esc(c.co)} ${esc(c.last4)} 삭제">삭제</button>
          </span>
        </li>`).join("")}</ul>` : `<p class="mp-empty">등록된 카드가 없어요.</p>`}
      <details class="mp-add" ${cards.length ? "" : "open"}>
        <summary class="sz-btn sz-btn--line">+ 카드 추가</summary>
        <form class="mp-form" novalidate>
          <div class="fields">
            <div class="field"><label for="cd-co">카드사</label>
              <select id="cd-co" name="co"><option value="">선택해 주세요</option>${CARD_CO.map((c) => `<option>${c}</option>`).join("")}</select></div>
            <div class="field"><label for="cd-4">카드 번호 끝 4자리</label>
              <input id="cd-4" name="last4" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="0000"></div>
            <div class="field field--wide"><label for="cd-nick">별칭 <span class="muted">선택</span></label>
              <input id="cd-nick" name="nick" maxlength="12" placeholder="예: 생활비 카드"></div>
          </div>
          <label class="check"><input type="checkbox" name="main" ${cards.length ? "" : "checked"}><span>기본 결제 카드로 설정</span></label>
          <p class="lookup__err" role="alert"></p>
          <button class="sz-btn sz-btn--solid" type="submit">카드 등록</button>
        </form>
      </details>`;
    const save = (list) => { user.update({ cards: list }); renderPage("cards"); };
    el.onclick = (e) => {
      const m = e.target.closest("[data-main]"), d = e.target.closest("[data-del]");
      if (m) save(cards.map((c, i) => ({ ...c, main: i === +m.dataset.main })));
      if (d) {
        const list = cards.filter((_, i) => i !== +d.dataset.del);
        if (list.length && !list.some((c) => c.main)) list[0].main = true; // keep one default
        save(list);
      }
    };
    const f = $("form", el);
    f.last4.addEventListener("input", () => { f.last4.value = f.last4.value.replace(/\D/g, "").slice(0, 4); });
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const bad = !f.co.value ? ["카드사를 선택해 주세요.", f.co] : !/^\d{4}$/.test(f.last4.value) ? ["카드 번호 끝 4자리를 입력해 주세요.", f.last4] : null;
      $(".lookup__err", f).textContent = bad ? bad[0] : "";
      if (bad) { bad[1].focus(); return; }
      const main = f.main.checked || !cards.length;
      save([...cards.map((c) => ({ ...c, main: main ? false : c.main })), { co: f.co.value, last4: f.last4.value, nick: f.nick.value.trim(), main }]);
    });
  };

  function route() {
    if (!user.get()) { renderLogin(); return; }
    const tab = TABS.some((x) => x.id === location.hash.slice(1)) ? location.hash.slice(1) : "orders";
    renderPage(tab);
  }
  addEventListener("hashchange", () => { route(); $("#mp-panel")?.focus?.(); });
  // the counts and lists follow wishlist / bag changes made on this page
  document.addEventListener("wish:change", () => { if (user.get()) renderPage(TABS.some((x) => x.id === location.hash.slice(1)) ? location.hash.slice(1) : "orders"); });
  route();
})();
