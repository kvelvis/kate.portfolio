/* 묘한 커피 — cat profiles + "meet a cat" booking.
   Card "프로필 보기" opens the cat's profile (personality, health, who it suits);
   "만나러 가기 예약" walks through 4 steps: cat → date & time → your details → check → booked.
   Demo only: bookings live in localStorage ("myohan-visits"), nothing is sent anywhere. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  };
  const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- the crew (photos are real; personality & health are example details) ---------- */
  const CATS = [
    { id: 'garam', name: '가람이', en: 'Garam', age: '4개월(추정)', sex: '여아', color: 'var(--yellow)', img: 'kitten-garam-800.jpg',
      tags: ['#입양가능', '#간식요정'], traits: ['사람을 좋아해요', '간식 소리에 달려와요', '무릎냥 꿈나무'],
      health: { vaccine: '2차 접종 완료', neuter: '중성화 예정', check: '건강 검진 이상 없음' },
      fits: { kids: true, cats: true, alone: false },
      story: '구조 당시 체중이 600g이었지만 지금은 누구보다 씩씩해요. 손을 내밀면 먼저 코를 대고 인사해요.',
      link: 'https://dmanimal.co.kr/adoption/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=12310025&t=board&category=7HAW5F61qw' },
    { id: 'tori', name: '토리', en: 'Tori', age: '3개월', sex: '여아', color: 'var(--lilac)', img: 'kitten-tori-800.jpg',
      tags: ['#깜짝놀람전문', '#턱시도'], traits: ['조심성이 많아요', '천천히 다가가면 금방 친해져요', '창가 자리 좋아함'],
      health: { vaccine: '1차 접종 완료', neuter: '중성화 예정', check: '건강 검진 이상 없음' },
      fits: { kids: false, cats: true, alone: true },
      story: '큰 소리에는 깜짝 놀라지만, 조용한 오후에는 옆에 와서 꾹꾹이를 해요.',
      link: 'https://dmanimal.co.kr/adoption/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=15413967&t=board' },
    { id: 'yeoreum', name: '여름', en: 'Yeoreum', age: '3개월', sex: '남아', color: 'var(--cream-d)', img: 'kitten-yeoreum-800.jpg',
      tags: ['#입양가능', '#수다쟁이'], traits: ['말이 많아요', '장난감 낚싯대 최고', '호기심 대장'],
      health: { vaccine: '2차 접종 완료', neuter: '중성화 예정', check: '건강 검진 이상 없음' },
      fits: { kids: true, cats: true, alone: false },
      story: '이름을 부르면 대답하는 수다쟁이예요. 함께 놀아 줄 가족이면 더 행복해할 거예요.',
      link: 'https://dmanimal.co.kr/adoption/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=15398220&t=board' },
    { id: 'seori', name: '서리', en: 'Seori', age: '5개월', sex: '여아', color: 'var(--pink)', img: 'kitten-seori-800.jpg',
      tags: ['#봉투러버', '#집순이'], traits: ['차분한 집순이', '종이봉투만 있으면 행복', '혼자서도 잘 놀아요'],
      health: { vaccine: '접종 완료', neuter: '중성화 완료', check: '건강 검진 이상 없음' },
      fits: { kids: true, cats: false, alone: true },
      story: '혼자만의 시간도 소중히 여기는 고양이예요. 퇴근 후 조용히 반겨 주는 친구를 찾는 분께 잘 맞아요.',
      link: 'https://dmanimal.co.kr/adoption/?bmode=view&idx=4235318&back_url=&t=board&page=1' },
    { id: 'latte', name: '라떼', en: 'Latte', age: '2개월', sex: '남아', color: 'var(--green-l)', img: 'kitten-kkoya-800.jpg',
      tags: ['#입양가능', '#사냥꾼'], traits: ['에너지 넘쳐요', '깃털 장난감 사냥꾼', '밥을 잘 먹어요'],
      health: { vaccine: '1차 접종 완료', neuter: '중성화 예정', check: '건강 검진 이상 없음' },
      fits: { kids: true, cats: true, alone: false },
      story: '하루 종일 뛰어놀다 갑자기 잠드는 아기 고양이예요. 놀이 시간을 함께해 줄 가족을 기다려요.',
      link: 'https://dmanimal.co.kr/adoption/?q=YToyOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjtzOjQ6InBhZ2UiO2k6Mzt9&bmode=view&idx=11337886&t=board&category=a72c762Z24' },
    { id: 'meonji', name: '먼지', en: 'Meonji', age: '2개월', sex: '여아', color: 'var(--yellow)', img: 'kitten-meonji-800.jpg',
      tags: ['#낮잠전문', '#먹방'], traits: ['순둥순둥', '안기는 걸 좋아해요', '낮잠 전문가'],
      health: { vaccine: '1차 접종 완료', neuter: '중성화 예정', check: '건강 검진 이상 없음' },
      fits: { kids: true, cats: true, alone: true },
      story: '어디서든 잘 자고 잘 먹는 순둥이예요. 처음 고양이를 키우는 분께도 추천해요.',
      link: 'https://dmanimal.co.kr/adoption/?q=YToyOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjtzOjQ6InBhZ2UiO2k6Mjt9&bmode=view&idx=15381799&t=board' },
  ];
  const catById = (id) => CATS.find((c) => c.id === id);
  // 은/는 after a name, by whether the last syllable has a final consonant
  const topic = (w) => { const c = w.charCodeAt(w.length - 1) - 0xac00; return w + (c >= 0 && c <= 11171 && c % 28 ? '은' : '는'); };

  /* ---------- time ---------- */
  const SLOTS = ['11:00', '13:00', '15:00', '17:00', '19:00'];
  const DAY = '일월화수목금토';
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const nice = (s) => { const d = new Date(s + 'T00:00'); return `${d.getMonth() + 1}/${d.getDate()}(${DAY[d.getDay()]})`; };
  function days() {
    const out = [], d = new Date(); d.setHours(0, 0, 0, 0);
    while (out.length < 12) { if (d.getDay() !== 1) out.push(iso(d)); d.setDate(d.getDate() + 1); } // Monday: closed
    return out;
  }
  const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  function slotState(date, time, catIds) {
    const [h, m] = time.split(':').map(Number);
    const t = new Date(date + 'T00:00'); t.setHours(h, m);
    if (t.getTime() < Date.now() + 60 * 60 * 1000) return 'past';
    // demo: some slots are already taken by other visitors
    if (catIds.some((id) => hash(id + date + time) % 4 === 0)) return 'full';
    return 'open';
  }

  /* ---------- dialog shell (native modal, Lenis paused, focus returned) ---------- */
  const dlg = document.createElement('dialog');
  dlg.className = 'meet'; dlg.id = 'meet'; dlg.setAttribute('aria-labelledby', 'meet-title');
  document.body.append(dlg);
  let opener = null;
  function open(from) {
    if (!dlg.open) {
      // remember what opened the dialog (profile → booking keeps the card button)
      opener = from || document.activeElement;
      document.documentElement.classList.add('is-modal');
      window.__lenis && window.__lenis.stop();
      dlg.showModal();
    }
    dlg.scrollTop = 0;
    ($('[data-first]', dlg) || $('#meet-title', dlg))?.focus();
  }
  function done() {
    document.documentElement.classList.remove('is-modal');
    window.__lenis && window.__lenis.start();
    if (opener && document.contains(opener)) opener.focus();
  }
  dlg.addEventListener('close', done);
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();               // backdrop
    if (e.target.closest('[data-meet-close]')) dlg.close();
  });

  /* ---------- profile ---------- */
  const fitRow = (ok, yes, no) => `<li class="${ok ? 'is-ok' : 'is-no'}"><span aria-hidden="true">${ok ? '✓' : '–'}</span>${ok ? yes : no}</li>`;
  function profile(id, from) {
    const c = catById(id); if (!c) return;
    const booked = bookings().find((b) => b.catIds.includes(id));
    dlg.style.setProperty('--c', c.color);
    dlg.innerHTML = `
      <button class="meet__x" type="button" data-meet-close aria-label="닫기">✕</button>
      <div class="meet__profile">
        <figure class="meet__photo"><img src="./img/${c.img}" alt="${c.name}" width="800" height="800"></figure>
        <div class="meet__info">
          <p class="meet__kicker">${c.en} · ${c.age} · ${c.sex}</p>
          <h2 class="meet__title" id="meet-title" tabindex="-1">${c.name}</h2>
          <ul class="chips">${c.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
          <p class="meet__story">${c.story}</p>
          <h3 class="meet__h3">성격</h3>
          <ul class="meet__traits">${c.traits.map((t) => `<li>${t}</li>`).join('')}</ul>
          <h3 class="meet__h3">건강</h3>
          <dl class="meet__health">
            <div><dt>접종</dt><dd>${c.health.vaccine}</dd></div>
            <div><dt>중성화</dt><dd>${c.health.neuter}</dd></div>
            <div><dt>검진</dt><dd>${c.health.check}</dd></div>
          </dl>
          <h3 class="meet__h3">이런 가족과 잘 맞아요</h3>
          <ul class="meet__fits">
            ${fitRow(c.fits.kids, '아이가 있는 집', '아이가 없는 조용한 집이 좋아요')}
            ${fitRow(c.fits.cats, '다른 고양이와 함께', '외동냥이로 지내고 싶어요')}
            ${fitRow(c.fits.alone, '1인 가구도 괜찮아요', '함께 있는 시간이 많은 집')}
          </ul>
          ${booked ? `<p class="meet__booked">♥ ${nice(booked.date)} ${booked.time}에 만남이 예약되어 있어요</p>` : ''}
          <div class="meet__actions">
            <button class="btn btn--red" type="button" data-first data-book="${c.id}">${booked ? '예약 다시 하기' : `${c.name} 만나러 가기 예약`} <i aria-hidden="true">→</i></button>
            <a class="btn btn--line btn--sm" href="${esc(c.link)}" target="_blank" rel="noopener">보호센터 프로필 <i aria-hidden="true">↗</i><span class="sr-only"> (새 창)</span></a>
          </div>
          <p class="meet__note">사진은 실제 보호 중인 고양이예요. 성격·건강 정보는 포트폴리오용 예시예요.</p>
        </div>
      </div>`;
    $('[data-book]', dlg).addEventListener('click', () => book([c.id]));
    open(from);
  }

  /* ---------- booking (4 steps) ---------- */
  const STEPS = ['냥이', '날짜·시간', '정보', '확인'];
  let B = null; // draft
  function book(catIds = [], from) {
    B = { step: catIds.length ? 1 : 0, catIds: [...catIds], date: null, time: null, name: '', phone: '', people: '1', exp: 'first', family: [], memo: '', agree: false };
    renderBook();
    open(from);
  }
  const stepper = () => `<ol class="meet__steps" aria-label="예약 단계">${STEPS.map((s, i) =>
    `<li class="${i < B.step ? 'is-done' : ''}${i === B.step ? ' is-on' : ''}" ${i === B.step ? 'aria-current="step"' : ''}><span>${i + 1}</span>${s}</li>`).join('')}</ol>`;
  const catChip = (c) => `<span class="meet__mini" style="--c:${c.color}"><img src="./img/${c.img.replace('-800', '-480')}" alt="" width="40" height="40">${c.name}</span>`;

  function renderBook() {
    const chosen = B.catIds.map(catById);
    dlg.style.setProperty('--c', chosen[0]?.color || 'var(--yellow)');
    let body = '';
    if (B.step === 0) {
      body = `
        <p class="meet__lead">만나고 싶은 냥이를 골라 주세요. 한 번에 두 마리까지 만날 수 있어요.</p>
        <div class="meet__pick" role="group" aria-label="냥이 선택">
          ${CATS.map((c) => `<button type="button" class="meet__pick-item" style="--c:${c.color}" data-pick="${c.id}" aria-pressed="${B.catIds.includes(c.id)}">
            <img src="./img/${c.img.replace('-800', '-480')}" alt="" width="480" height="480"><span>${c.name}</span><small>${c.age}</small></button>`).join('')}
        </div>
        <p class="meet__err" data-err hidden>냥이를 한 마리 이상 골라 주세요.</p>`;
    } else if (B.step === 1) {
      const ds = days();
      if (!B.date) B.date = ds.find((d) => SLOTS.some((t) => slotState(d, t, B.catIds) === 'open'));
      body = `
        <div class="meet__with">${chosen.map(catChip).join('')}<button type="button" class="meet__link" data-go="0">변경</button></div>
        <h3 class="meet__h3" id="pick-date">날짜</h3>
        <div class="meet__dates" role="radiogroup" aria-labelledby="pick-date">
          ${ds.map((d) => { const dt = new Date(d + 'T00:00'); const any = SLOTS.some((t) => slotState(d, t, B.catIds) === 'open');
            return `<button type="button" role="radio" class="meet__date" data-date="${d}" aria-checked="${d === B.date}" ${any ? '' : 'disabled'}>
              <small>${DAY[dt.getDay()]}</small><b>${dt.getDate()}</b>${any ? '' : '<em>마감</em>'}</button>`; }).join('')}
        </div>
        <p class="meet__hint">월요일은 냥이들도 쉬어요 😴</p>
        <h3 class="meet__h3" id="pick-time">시간 <span>30분 만남</span></h3>
        <div class="meet__times" role="radiogroup" aria-labelledby="pick-time">
          ${SLOTS.map((t) => { const s = slotState(B.date, t, B.catIds);
            return `<button type="button" role="radio" class="meet__time" data-time="${t}" aria-checked="${t === B.time}" ${s === 'open' ? '' : 'disabled'}>${t}${s === 'full' ? '<em>예약 마감</em>' : s === 'past' ? '<em>지남</em>' : ''}</button>`; }).join('')}
        </div>
        <p class="meet__err" data-err hidden>시간을 골라 주세요.</p>`;
    } else if (B.step === 2) {
      body = `
        <div class="meet__with">${chosen.map(catChip).join('')}<span class="meet__when">${nice(B.date)} ${B.time}</span><button type="button" class="meet__link" data-go="1">변경</button></div>
        <form class="meet__form" novalidate>
          <div class="meet__field"><label for="m-name">이름</label><input id="m-name" name="name" autocomplete="name" value="${esc(B.name)}" required></div>
          <div class="meet__field"><label for="m-phone">휴대폰 번호</label><input id="m-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="010-0000-0000" value="${esc(B.phone)}" required></div>
          <fieldset class="meet__field"><legend>함께 오는 인원</legend>
            <div class="meet__seg">${['1', '2', '3', '4'].map((n) => `<label><input type="radio" name="people" value="${n}" ${B.people === n ? 'checked' : ''}><span>${n}명</span></label>`).join('')}</div></fieldset>
          <fieldset class="meet__field"><legend>고양이를 키워 본 적이 있나요?</legend>
            <div class="meet__seg">
              <label><input type="radio" name="exp" value="first" ${B.exp === 'first' ? 'checked' : ''}><span>처음이에요</span></label>
              <label><input type="radio" name="exp" value="has" ${B.exp === 'has' ? 'checked' : ''}><span>키워 봤어요</span></label>
              <label><input type="radio" name="exp" value="now" ${B.exp === 'now' ? 'checked' : ''}><span>지금 키워요</span></label>
            </div></fieldset>
          <fieldset class="meet__field"><legend>함께 사는 가족 <span>해당되면 골라 주세요</span></legend>
            <div class="meet__seg">${[['kids', '아이'], ['cat', '다른 고양이'], ['dog', '강아지']].map(([v, l]) => `<label><input type="checkbox" name="family" value="${v}" ${B.family.includes(v) ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></fieldset>
          <div class="meet__field"><label for="m-memo">궁금한 점 <span>선택</span></label><textarea id="m-memo" name="memo" rows="2" maxlength="200" placeholder="예: 원룸에서 키워도 괜찮을까요?">${esc(B.memo)}</textarea></div>
          <label class="meet__agree"><input type="checkbox" name="agree" ${B.agree ? 'checked' : ''}><span>[필수] 예약 확인 연락을 위한 개인정보 수집·이용에 동의해요</span></label>
        </form>
        ${fitWarn(chosen)}`;
    } else if (B.step === 3) {
      body = `
        <div class="meet__summary">
          <div class="meet__with">${chosen.map(catChip).join('')}</div>
          <dl>
            <div><dt>언제</dt><dd>${nice(B.date)} ${B.time} · 30분</dd></div>
            <div><dt>어디서</dt><dd>묘한 커피 연남점 · 서울 마포구 연남로 00, 1층</dd></div>
            <div><dt>예약자</dt><dd>${esc(B.name)} · ${esc(B.phone)} · ${B.people}명</dd></div>
          </dl>
          <ul class="meet__rules">
            <li>만남은 무료예요. 음료 한 잔만 주문해 주세요 ☕</li>
            <li>손 씻기 → 간식 주기 → 놀아 주기 순서로 담당 매니저가 안내해요</li>
            <li>냥이가 쉬고 싶어 하면 잠시 기다려 주세요</li>
            <li>만남 후 바로 입양을 결정하지 않아도 돼요</li>
          </ul>
        </div>`;
    }
    dlg.innerHTML = `
      <button class="meet__x" type="button" data-meet-close aria-label="닫기">✕</button>
      <div class="meet__book">
        <h2 class="meet__title" id="meet-title" tabindex="-1">냥이 만나러 가기</h2>
        ${stepper()}
        <div class="meet__body">${body}</div>
        <div class="meet__nav">
          ${B.step > 0 ? '<button type="button" class="btn btn--line btn--sm" data-prev>이전</button>' : '<span></span>'}
          <button type="button" class="btn ${B.step === 3 ? 'btn--red' : 'btn--charcoal'}" data-next data-first>${B.step === 3 ? '예약 확정하기' : '다음'} <i aria-hidden="true">→</i></button>
        </div>
      </div>`;
    wireBook();
  }

  // gentle note when the chosen cat doesn't suit the household
  function fitWarn(chosen) {
    const notes = [];
    chosen.forEach((c) => {
      if (B.family.includes('kids') && !c.fits.kids) notes.push(`${topic(c.name)} 조용한 집을 좋아해요. 만남에서 아이와 잘 지내는지 함께 살펴봐요.`);
      if (B.family.includes('cat') && !c.fits.cats) notes.push(`${topic(c.name)} 외동냥이를 원해요. 합사 방법을 상담해 드릴게요.`);
    });
    return notes.length ? `<div class="meet__tip" role="note">${notes.map((n) => `<p>💡 ${n}</p>`).join('')}</div>` : '';
  }

  const fmtPhone = (v) => { const d = v.replace(/\D/g, '').slice(0, 11); return d.length < 4 ? d : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}` : `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`; };

  function readForm() {
    const f = $('.meet__form', dlg); if (!f) return;
    B.name = f.name.value.trim(); B.phone = f.phone.value; B.people = f.people.value; B.exp = f.exp.value;
    B.family = $$('input[name=family]:checked', f).map((i) => i.value); B.memo = f.memo.value.trim(); B.agree = f.agree.checked;
  }
  function wireBook() {
    $$('[data-pick]', dlg).forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.pick;
      if (B.catIds.includes(id)) B.catIds = B.catIds.filter((x) => x !== id);
      else if (B.catIds.length < 2) B.catIds.push(id);
      else B.catIds = [B.catIds[1], id];
      B.date = null; B.time = null;
      renderBook(); $(`[data-pick="${id}"]`, dlg)?.focus();
    }));
    $$('[data-date]', dlg).forEach((b) => b.addEventListener('click', () => { B.date = b.dataset.date; B.time = null; renderBook(); $(`[data-date="${B.date}"]`, dlg)?.focus(); }));
    $$('[data-time]', dlg).forEach((b) => b.addEventListener('click', () => { B.time = b.dataset.time; renderBook(); $(`[data-time="${B.time}"]`, dlg)?.focus(); }));
    $$('[data-go]', dlg).forEach((b) => b.addEventListener('click', () => { readForm(); B.step = +b.dataset.go; renderBook(); }));
    const f = $('.meet__form', dlg);
    if (f) {
      f.phone.addEventListener('input', () => { f.phone.value = fmtPhone(f.phone.value); });
      f.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
      f.agree.addEventListener('change', () => { if (f.agree.checked) { $('.meet__agree', f).classList.remove('is-bad'); f.agree.setAttribute('aria-invalid', 'false'); } });
      $$('input[name=family]', f).forEach((i) => i.addEventListener('change', () => { readForm(); const old = $('.meet__tip', dlg); const html = fitWarn(B.catIds.map(catById)); if (old) old.outerHTML = html || ''; else if (html) f.insertAdjacentHTML('afterend', html); }));
      f.addEventListener('submit', (e) => { e.preventDefault(); next(); });
    }
    $('[data-prev]', dlg)?.addEventListener('click', () => { readForm(); B.step--; renderBook(); });
    $('[data-next]', dlg).addEventListener('click', next);
  }
  function next() {
    const err = $('[data-err]', dlg);
    if (B.step === 0 && !B.catIds.length) { err.hidden = false; return; }
    if (B.step === 1 && (!B.time || slotState(B.date, B.time, B.catIds) !== 'open')) { err.hidden = false; return; }
    if (B.step === 2) {
      readForm();
      const f = $('.meet__form', dlg);
      const bad = [];
      if (!B.name) bad.push(f.name);
      if (!/^01[016789]-\d{3,4}-\d{4}$/.test(B.phone)) bad.push(f.phone);
      if (!B.agree) bad.push(f.agree);
      $$('[aria-invalid]', f).forEach((el) => el.setAttribute('aria-invalid', 'false'));
      $('.meet__agree', f).classList.toggle('is-bad', !B.agree);
      bad.forEach((el) => el.setAttribute('aria-invalid', 'true'));
      if (bad.length) { bad[0].focus(); return; }
    }
    if (B.step === 3) { confirm(); return; }
    B.step++; renderBook(); $('#meet-title', dlg).focus();
  }

  /* ---------- confirmed ---------- */
  const bookings = () => store.get('myohan-visits', []);
  function confirm() {
    const no = 'MY' + B.date.replace(/-/g, '').slice(2) + '-' + String(1000 + (hash(B.name + B.time) % 9000));
    const rec = { no, catIds: B.catIds, date: B.date, time: B.time, name: B.name, phone: B.phone, people: B.people, created: Date.now() };
    store.set('myohan-visits', [rec, ...bookings().filter((b) => b.no !== no)].slice(0, 10));
    const chosen = B.catIds.map(catById);
    const names = chosen.map((c) => c.name).join(' · ');
    // calendar file: a 30-minute visit
    const [h, m] = B.time.split(':').map(Number);
    const pad = (n) => String(n).padStart(2, '0');
    const d = B.date.replace(/-/g, '');
    const end = new Date(2000, 0, 1, h, m + 30);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Myohan Coffee//KO', 'BEGIN:VEVENT', `UID:${no}@myohan.example`,
      `DTSTART:${d}T${pad(h)}${pad(m)}00`, `DTEND:${d}T${pad(end.getHours())}${pad(end.getMinutes())}00`,
      `SUMMARY:묘한 커피 · ${names} 만나기`, 'LOCATION:서울 마포구 연남로 00\\, 1층', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    dlg.innerHTML = `
      <button class="meet__x" type="button" data-meet-close aria-label="닫기">✕</button>
      <div class="meet__ok">
        <img class="meet__ok-face" src="./img/3d_cat.png" alt="" width="1024" height="1024">
        <p class="meet__kicker">예약번호 ${no}</p>
        <h2 class="meet__title" id="meet-title" tabindex="-1">예약 완료! 🐾</h2>
        <div class="meet__with meet__with--center">${chosen.map(catChip).join('')}</div>
        <p class="meet__lead">${nice(B.date)} ${B.time}, 묘한 커피 연남점에서 만나요.<br>${esc(B.phone)}로 예약 확인 문자를 보냈어요 (데모).</p>
        <div class="meet__actions meet__actions--center">
          <a class="btn btn--yellow btn--sm" download="myohan-${no}.ics" href="data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}">캘린더에 추가 <i aria-hidden="true">↓</i></a>
          <button class="btn btn--line btn--sm" type="button" data-cancel="${no}">예약 취소</button>
          <button class="btn btn--charcoal btn--sm" type="button" data-meet-close data-first>확인</button>
        </div>
      </div>`;
    $('[data-cancel]', dlg).addEventListener('click', () => {
      store.set('myohan-visits', bookings().filter((b) => b.no !== no));
      $('.meet__lead', dlg).innerHTML = '예약이 취소되었어요. 언제든 다시 예약할 수 있어요.';
      $('[data-cancel]', dlg).remove();
      markCards();
    });
    markCards();
    $('[data-first]', dlg).focus();
  }

  /* ---------- cards: badge for booked cats ---------- */
  function markCards() {
    const list = bookings();
    $$('.cat-card[data-cat]').forEach((card) => {
      const b = list.find((x) => x.catIds.includes(card.dataset.cat));
      let tag = $('.cat-card__booked', card);
      if (b && !tag) { $('.cat-card__body', card).insertAdjacentHTML('afterbegin', '<p class="cat-card__booked"></p>'); tag = $('.cat-card__booked', card); }
      if (tag) { tag.hidden = !b; if (b) tag.textContent = `♥ ${nice(b.date)} ${b.time} 만남 예약`; }
    });
  }

  /* ---------- wiring ---------- */
  document.addEventListener('click', (e) => {
    const p = e.target.closest('[data-profile]');
    if (p) { profile(p.dataset.profile, p); return; }
    const m = e.target.closest('[data-meet]');
    if (m) book(m.dataset.meet ? [m.dataset.meet] : [], m);
  });
  markCards();
})();
