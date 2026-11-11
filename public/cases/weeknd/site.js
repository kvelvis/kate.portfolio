/* THE WEEKND — After Hours Til Dawn · site script (no dependencies) */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- data ---------------- */
  const SHOWS = [
    { id: 'lon1', date: '2023-07-07', city: 'London',    country: 'United Kingdom', venue: 'London Stadium',  region: 'europe',  status: 'few',  cur: '£',   rate: 1,    sold: ['suite'] },
    { id: 'lon2', date: '2023-07-08', city: 'London',    country: 'United Kingdom', venue: 'London Stadium',  region: 'europe',  status: 'new',  cur: '£',   rate: 1,    sold: [] },
    { id: 'bne',  date: '2023-11-20', city: 'Brisbane',  country: 'Australia',      venue: 'Suncorp Stadium', region: 'oceania', status: 'on',   cur: 'A$',  rate: 1.9,  sold: [] },
    { id: 'syd',  date: '2023-11-24', city: 'Sydney',    country: 'Australia',      venue: 'Accor Stadium',   region: 'oceania', status: 'sold', cur: 'A$',  rate: 1.9,  sold: ['suite', 'floor', 'lower', 'upper'] },
    { id: 'mel',  date: '2023-12-01', city: 'Melbourne', country: 'Australia',      venue: 'Marvel Stadium',  region: 'oceania', status: 'few',  cur: 'A$',  rate: 1.9,  sold: ['floor'] },
    { id: 'akl',  date: '2023-12-07', city: 'Auckland',  country: 'New Zealand',    venue: 'Eden Park',       region: 'oceania', status: 'on',   cur: 'NZ$', rate: 2.05, sold: [] },
  ];
  const TIERS = [
    { id: 'suite', name: 'Chrome Suite', desc: 'Front of stage · lounge · early entry', base: 450 },
    { id: 'floor', name: 'Floor GA',     desc: 'Standing · closest to the runway',      base: 145 },
    { id: 'lower', name: 'Lower Bowl',   desc: 'Reserved seat · side view',             base: 110 },
    { id: 'upper', name: 'Upper Bowl',   desc: 'Reserved seat · full light show',       base: 75 },
  ];
  const STATUS = {
    on:   ['badge--on',   'On sale'],
    few:  ['badge--few',  'Few left'],
    new:  ['badge--new',  'New show'],
    sold: ['badge--sold', 'Sold out'],
  };
  const FEE = 0.12;
  const MAX_QTY = 8;

  const day = (iso) => new Date(iso + 'T12:00:00');
  const fmtDate = (iso, opts) => day(iso).toLocaleDateString('en-GB', opts);
  const price = (show, tier) => Math.round(tier.base * show.rate);
  const money = (show, n, dec = 0) =>
    show.cur + n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  /* ---------------- state ---------------- */
  const state = { show: SHOWS.find(s => s.status !== 'sold'), tier: null, qty: 2 };

  /* ---------------- header ---------------- */
  const hd = $('[data-hd]');
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');

  const onScroll = () => hd.classList.toggle('is-solid', scrollY > 20);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
    hd.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // highlight the nav link of the section on screen
  const links = $$('.hd__nav a:not(.hd__nav-cta)');
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['tour', 'tickets', 'afterhours', 'info'].forEach(id => navIO.observe(document.getElementById(id)));

  /* ---------------- hero: skyline + pointer glow ---------------- */
  (function skyline() {
    const svg = $('[data-skyline]');
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let out = '';
    let x = 0;
    while (x < 1600) {
      const w = 28 + rnd() * 70;
      const center = Math.abs(x + w / 2 - 800) / 800;        // lower towers in the middle, so the sun shows
      const h = (40 + rnd() * 190) * (0.45 + center * 0.75);
      const top = 260 - h;
      out += `<rect class="b" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${(w + 0.5).toFixed(1)}" height="${h.toFixed(1)}"/>`;
      if (h > 150 && rnd() > 0.4) {
        const ax = x + w / 2;
        out += `<line class="ant" x1="${ax}" y1="${top}" x2="${ax}" y2="${top - 26}"/><circle class="tip" cx="${ax}" cy="${top - 26}" r="2.2"/>`;
      }
      for (let wy = top + 10; wy < 252; wy += 11) {
        for (let wx = x + 6; wx < x + w - 6; wx += 9) {
          const r = rnd();
          if (r > 0.82) {
            const tone = r > 0.985 ? ' r' : r > 0.97 ? ' bl' : '';
            const blink = rnd() > 0.96 ? ' blink' : '';
            out += `<rect class="w${tone}${blink}" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="3.5" height="5"/>`;
          }
        }
      }
      x += w + 2 + rnd() * 6;
    }
    svg.innerHTML = out;
  })();

  const hero = $('[data-hero]');
  const glow = $('[data-glow]');
  if (matchMedia('(pointer: fine)').matches && !reduceMotion) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      glow.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      glow.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  }

  /* ---------------- tour dates ---------------- */
  const datesEl = $('[data-dates]');
  datesEl.innerHTML = SHOWS.map(s => {
    const [cls, label] = STATUS[s.status];
    const sold = s.status === 'sold';
    return `
      <li class="date${sold ? ' date--sold' : ''}" data-region="${s.region}">
        <div class="date__day"><b>${fmtDate(s.date, { day: '2-digit' })}</b><span>${fmtDate(s.date, { month: 'short' })}<br>${fmtDate(s.date, { weekday: 'short' })} · ${fmtDate(s.date, { year: 'numeric' })}</span></div>
        <p class="date__city">${s.city}<small>${s.country}</small></p>
        <p class="date__venue">${s.venue}</p>
        <span class="badge ${cls}">${label}</span>
        ${sold
          ? `<button class="btn btn--ghost" type="button" disabled>Sold out</button>`
          : `<a class="btn btn--ghost" href="#tickets" data-pick="${s.id}" aria-label="Tickets for ${s.city}, ${fmtDate(s.date, { day: 'numeric', month: 'long' })}">Tickets</a>`}
      </li>`;
  }).join('');

  $('[data-filter]').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    $$('[data-filter] button').forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('.date', datesEl).forEach(li => { li.hidden = b.dataset.region !== 'all' && li.dataset.region !== b.dataset.region; });
  });

  datesEl.addEventListener('click', e => {
    const a = e.target.closest('[data-pick]');
    if (!a) return;
    selectShow(a.dataset.pick);
  });

  /* ---------------- booking ---------------- */
  const form = $('[data-book]');
  const showSel = $('[data-show]');
  const showMeta = $('[data-show-meta]');
  const tiersEl = $('[data-tiers]');
  const map = $('.map');
  const sectionsG = $('[data-sections]');
  const qtyOut = $('[data-qty-out]');

  showSel.innerHTML = SHOWS.map(s =>
    `<option value="${s.id}"${s.status === 'sold' ? ' disabled' : ''}>${fmtDate(s.date, { day: '2-digit', month: 'short', year: 'numeric' })} — ${s.city}, ${s.venue}${s.status === 'sold' ? ' (sold out)' : ''}</option>`
  ).join('');
  showSel.addEventListener('change', () => selectShow(showSel.value));

  // stadium map: pit + floor rectangles, two rings of seating sections
  (function buildMap() {
    const NS = 'http://www.w3.org/2000/svg';
    const cx = 200, cy = 150, sx = 0.95;
    const pt = (r, a) => {
      const rad = a * Math.PI / 180;
      return [(cx + r * Math.cos(rad) * sx).toFixed(1), (cy + r * Math.sin(rad)).toFixed(1)];
    };
    const sector = (r1, r2, a0, a1) => {
      const big = a1 - a0 > 180 ? 1 : 0;
      const [x0, y0] = pt(r2, a0), [x1, y1] = pt(r2, a1), [x2, y2] = pt(r1, a1), [x3, y3] = pt(r1, a0);
      return `M${x0} ${y0}A${r2 * sx} ${r2} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${r1 * sx} ${r1} 0 ${big} 0 ${x3} ${y3}Z`;
    };
    const add = (tag, attrs, tier, label) => {
      const el = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      el.classList.add('sect');
      el.dataset.tier = tier;
      const t = document.createElementNS(NS, 'title');
      t.textContent = label;
      el.append(t);
      sectionsG.append(el);
    };
    add('rect', { x: 125, y: 58, width: 150, height: 60, rx: 6 }, 'suite', 'Chrome Suite');
    add('rect', { x: 125, y: 124, width: 150, height: 102, rx: 6 }, 'floor', 'Floor GA');
    const ring = (r1, r2, from, to, n, tier, prefix) => {
      const step = (to - from) / n;
      for (let i = 0; i < n; i++) {
        add('path', { d: sector(r1, r2, from + i * step + 1.2, from + (i + 1) * step - 1.2) }, tier, `${prefix} ${101 + i}`);
      }
    };
    ring(128, 160, -30, 210, 6, 'lower', 'Lower Bowl ·');
    ring(168, 200, -40, 220, 8, 'upper', 'Upper Bowl ·');
    // keep the stage and runway above the sections
    const svg = $('[data-map]');
    svg.append($('.map__runway', svg), $('.map__stage', svg), $('.map__label', svg));
  })();

  sectionsG.addEventListener('click', e => {
    const s = e.target.closest('.sect');
    if (s) selectTier(s.dataset.tier, true);
  });

  function renderTiers() {
    const s = state.show;
    tiersEl.innerHTML = TIERS.map(t => {
      const sold = s.sold.includes(t.id);
      const on = state.tier === t.id;
      return `
        <button type="button" class="tier" role="radio" data-tier="${t.id}" aria-checked="${on}" tabindex="-1"${sold ? ' disabled' : ''}>
          <span class="tier__sw" aria-hidden="true"></span>
          <span><b>${t.name}</b><small>${sold ? 'Sold out for this show' : t.desc}</small></span>
          <span class="tier__price">${sold ? '—' : money(s, price(s, t))}</span>
        </button>`;
    }).join('');
    const focusable = $('.tier[aria-checked="true"]', tiersEl) || $('.tier:not([disabled])', tiersEl);
    if (focusable) focusable.tabIndex = 0;
  }

  tiersEl.addEventListener('click', e => {
    const b = e.target.closest('.tier');
    if (b && !b.disabled) selectTier(b.dataset.tier);
  });
  // radio-group keyboard: arrows move the selection
  tiersEl.addEventListener('keydown', e => {
    const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const list = $$('.tier:not([disabled])', tiersEl);
    let i = list.indexOf(document.activeElement);
    i = (i + dir + list.length) % list.length;
    selectTier(list[i].dataset.tier);
    $(`.tier[data-tier="${list[i].dataset.tier}"]`, tiersEl).focus();
  });

  function selectTier(id, fromMap = false) {
    if (state.show.sold.includes(id)) return;
    state.tier = id;
    renderTiers();
    paintMap();
    update();
    if (fromMap) $(`.tier[data-tier="${id}"]`, tiersEl)?.focus({ preventScroll: true });
  }

  function paintMap() {
    if (state.tier) map.dataset.tier = state.tier; else delete map.dataset.tier;
    $$('.sect', sectionsG).forEach(s => {
      s.classList.toggle('is-on', s.dataset.tier === state.tier);
      s.style.display = state.show.sold.includes(s.dataset.tier) ? 'none' : '';
    });
  }

  function selectShow(id) {
    const s = SHOWS.find(x => x.id === id);
    if (!s || s.status === 'sold') return;
    state.show = s;
    showSel.value = id;
    if (state.tier && s.sold.includes(state.tier)) state.tier = null;
    showMeta.textContent = `${fmtDate(s.date, { weekday: 'long', day: 'numeric', month: 'long' })} · Doors 17:30 · ${STATUS[s.status][1]}`;
    renderTiers();
    paintMap();
    update();
  }

  $$('[data-qty]').forEach(b => b.addEventListener('click', () => {
    state.qty = Math.min(MAX_QTY, Math.max(1, state.qty + Number(b.dataset.qty)));
    update();
  }));

  const sum = {
    show: $('[data-sum-show]'), tier: $('[data-sum-tier]'), qty: $('[data-sum-qty]'),
    sub: $('[data-sum-sub]'), fee: $('[data-sum-fee]'), total: $('[data-sum-total]'),
  };

  function totals() {
    const s = state.show;
    const t = TIERS.find(x => x.id === state.tier);
    if (!t) return null;
    const sub = price(s, t) * state.qty;
    const fee = Math.round(sub * FEE * 100) / 100;
    return { t, sub, fee, total: sub + fee };
  }

  function update() {
    const s = state.show;
    qtyOut.textContent = state.qty;
    $('[data-qty="-1"]').disabled = state.qty <= 1;
    $('[data-qty="1"]').disabled = state.qty >= MAX_QTY;

    sum.show.textContent = `${s.city} · ${fmtDate(s.date, { day: '2-digit', month: 'short' })}`;
    sum.qty.textContent = `× ${state.qty}`;
    const r = totals();
    sum.tier.textContent = r ? r.t.name : 'Choose a tier';
    sum.sub.textContent = r ? money(s, r.sub, 2) : '—';
    sum.fee.textContent = r ? money(s, r.fee, 2) : '—';
    sum.total.textContent = r ? money(s, r.total, 2) : money(s, 0, 2);
  }

  /* ---- validation + submit ---- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const check = (input) => {
    const ok = input.type === 'email' ? EMAIL.test(input.value.trim()) : input.value.trim().length > 1;
    input.closest('.field').classList.toggle('is-error', !ok);
    input.setAttribute('aria-invalid', !ok);
    return ok;
  };
  $$('.field input', form).forEach(i => i.addEventListener('input', () => {
    if (i.closest('.field').classList.contains('is-error')) check(i);
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!state.tier) {
      const first = $('.tier:not([disabled])', tiersEl);
      first?.closest('.step').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      tiersEl.animate?.([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 320 });
      first?.focus({ preventScroll: true });
      return;
    }
    const inputs = $$('.field input', form);
    const bad = inputs.filter(i => !check(i));
    if (bad.length) { bad[0].focus(); return; }
    openTicket();
  });

  /* ---------------- ticket dialog ---------------- */
  const dlg = $('[data-ticket]');
  function openTicket() {
    const s = state.show;
    const r = totals();
    const set = (k, v) => { $(`[data-t-${k}]`).textContent = v; };
    set('name', form.elements.name.value.trim());
    set('email', form.elements.email.value.trim());
    set('date', fmtDate(s.date, { day: '2-digit', month: 'short', year: 'numeric' }));
    set('venue', `${s.venue}, ${s.city}`);
    set('tier', r.t.name);
    set('qty', `× ${state.qty}`);
    set('total', money(s, r.total, 2));
    set('order', 'XO-' + Math.random().toString(36).slice(2, 8).toUpperCase());

    const bars = Array.from({ length: 34 }, () => `<i style="flex:${1 + Math.floor(Math.random() * 4)}"></i>`).join('');
    $('[data-barcode]').innerHTML = bars;

    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    document.body.classList.add('is-locked');
  }
  const closeTicket = () => { dlg.close ? dlg.close() : dlg.removeAttribute('open'); };
  $('[data-ticket-close]').addEventListener('click', closeTicket);
  dlg.addEventListener('click', e => { if (e.target === dlg) closeTicket(); });
  dlg.addEventListener('close', () => document.body.classList.remove('is-locked'));

  /* ---------------- VHS video ---------------- */
  const vhs = $('.vhs');
  const video = $('[data-video]');
  const clock = $('[data-clock]');
  let userPaused = false;
  const pad = n => String(Math.floor(n)).padStart(2, '0');
  video.addEventListener('timeupdate', () => {
    const t = video.currentTime;
    clock.textContent = `${pad(t / 3600)}:${pad(t / 60 % 60)}:${pad(t % 60)}`;
  });
  const syncVhs = () => {
    vhs.classList.toggle('is-paused', video.paused);
    $('[data-video-toggle]').setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
  };
  video.addEventListener('play', syncVhs);
  video.addEventListener('pause', syncVhs);
  $('[data-video-toggle]').addEventListener('click', () => {
    if (video.paused) { userPaused = false; video.play().catch(() => {}); }
    else { userPaused = true; video.pause(); }
  });
  if (reduceMotion) { video.removeAttribute('autoplay'); video.pause(); userPaused = true; }
  // only play while on screen
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting && !userPaused) video.play().catch(() => {});
    else if (!en.isIntersecting) video.pause();
  }, { threshold: 0.2 }).observe(vhs);

  /* ---------------- newsletter ---------------- */
  const news = $('[data-news]');
  const newsMsg = $('[data-news-msg]');
  news.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('input', news);
    const ok = EMAIL.test(input.value.trim());
    newsMsg.classList.toggle('is-error', !ok);
    newsMsg.textContent = ok ? 'You’re on the list. See you after hours.' : 'Please enter a valid email.';
    if (ok) input.value = '';
  });

  /* ---------------- reveal on scroll ---------------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    revealIO.observe(el);
  });

  /* ---------------- init ---------------- */
  selectShow(state.show.id);
})();
