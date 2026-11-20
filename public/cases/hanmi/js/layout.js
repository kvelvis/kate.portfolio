/* Shared chrome for every HANMI page: header, sub visual + LNB, footer.
   Each page sets <body data-section="brand" data-page="greeting">.
   Pages without a design yet (Figma frames 16–30) are listed with href:null
   and rendered as disabled tabs. */
(function () {
  const IMG = 'img/';

  const SECTIONS = {
    brand: {
      label: '브랜드소개', eyebrow: 'BRAND', href: 'greeting.html',
      pages: [
        ['greeting', '인사말', 'greeting.html'],
        ['policy', '고객정책', 'policy.html'],
        ['history', '연혁', 'history.html'],
        ['founder', '창립자', 'founder.html'],
        ['global', '글로벌 네트워크', 'global.html'],
        ['tour', '한미둘러보기', null],
        ['as', 'AI A/S 센터', 'as-center.html'],
        ['location', '오시는 길', 'location.html'],
      ],
    },
    products: {
      label: '제품라인업', eyebrow: 'PRODUCT LINEUP', href: 'products.html',
      pages: [],
      alt: {
        hbm: [
          ['griffin45', 'TC BONDER 4.5 GRIFFIN', null],
          ['tiger40', 'TC BONDER 4.0 TIGER', 'product-tiger.html'],
          ['griffin10', 'TC BONDER 1.0 GRIFFIN', null],
          ['tiger10', 'TC BONDER 1.0 TIGER', null],
          ['inspection', 'HBM 6-SIDE INSPECTION 1.0', null],
        ],
      },
    },
    ir: {
      label: '투자정보', eyebrow: 'INVESTOR RELATIONS', href: 'ir-disclosure.html',
      pages: [
        ['disclosure', '공시정보 관리규정', 'ir-disclosure.html'],
        ['meeting', '주주총회 공고', null],
        ['ci', 'CI', 'ci.html'],
        ['awards', '대외수상내역', 'awards.html'],
      ],
    },
    media: { label: '미디어센터', eyebrow: 'MEDIA', href: null, pages: [] },
    esg: {
      label: 'ESG', eyebrow: 'ESG', href: 'esg.html',
      pages: [
        ['overview', '개요', 'esg.html'],
        ['env', '환경', null],
        ['social', '사회', null],
        ['gov', '지배구조', null],
        ['ethics', '윤리', null],
        ['quality', '품질', null],
      ],
    },
    csr: { label: '사회공헌', eyebrow: 'CSR', href: null, pages: [] },
    careers: {
      label: '인재채용', eyebrow: 'CAREERS', href: 'recruit.html',
      pages: [
        ['talent', '인재채용', 'recruit.html'],
        ['benefits', '복리후생', null],
        ['jobs', '채용공고', null],
      ],
    },
    notice: { label: '공지사항', eyebrow: 'NOTICE', href: null, pages: [] },
  };
  // allow pages to override the LNB list (e.g. product pages)
  window.HANMI_SECTIONS = SECTIONS;

  const body = document.body;
  const secKey = body.dataset.section;
  const pageKey = body.dataset.page;
  const sec = SECTIONS[secKey];

  const link = (href, label, attrs = '') =>
    href ? `<a href="${href}" ${attrs}>${label}</a>`
         : `<a aria-disabled="true" title="준비 중인 페이지" ${attrs}>${label}</a>`;

  /* ---- header ---- */
  // only sections / sub-pages that actually exist are shown
  const gnb = Object.entries(SECTIONS).filter(([, s]) => s.href).map(([k, s]) =>
    link(s.href, s.label, k === secKey ? 'aria-current="page"' : '')).join('');
  const header = `
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="hdr" id="hdr">
  <div class="hdr__in">
    <a class="logo" href="index.html" aria-label="한미반도체 홈">
      <span class="logo__mark">HANMI</span><span class="logo__ko">한미반도체</span>
    </a>
    <nav class="gnb" id="gnb" aria-label="주요 메뉴">${gnb}</nav>
    <div class="util">
      <p class="lang"><a href="#" aria-current="true" lang="ko">KOR</a>  ·  <a href="#" lang="en">ENG</a></p>
      <a class="icon-btn" href="index.html#search" aria-label="검색"><img src="${IMG}icon-search-white.svg" width="22" height="22" alt=""></a>
      <button class="menu-btn" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="gnb"><span></span></button>
    </div>
  </div>
</header>`;
  body.insertAdjacentHTML('afterbegin', header);

  /* ---- sub visual + LNB (inner pages only) ---- */
  const main = document.getElementById('main');
  if (sec && main && body.dataset.subvisual !== 'off') {
    const allPages = (body.dataset.lnb && sec.alt && sec.alt[body.dataset.lnb]) || (body.dataset.lnb === 'none' ? [] : sec.pages);
    const cur = allPages.find(p => p[0] === pageKey);
    const live = allPages.filter(p => p[2]);
    const pages = live.length > 1 ? live : []; // a one-tab LNB is no menu at all
    const title = body.dataset.title || sec.label;
    const trail = body.dataset.crumbs
      ? ['HOME', ...body.dataset.crumbs.split('|')]
      : ['HOME', sec.label, cur && cur[1] !== sec.label ? cur[1] : null];
    const crumbs = trail.filter(Boolean).map(c => `<li>${c}</li>`).join('');
    const lnb = pages.length ? `
<nav class="lnb" aria-label="${sec.label} 하위 메뉴"><div class="lnb__in">
  ${pages.map(([k, l, h]) => link(h, l, k === pageKey ? 'aria-current="page"' : '')).join('')}
</div></nav>` : '';
    main.insertAdjacentHTML('beforebegin', `
<section class="subvis" aria-labelledby="subvis-title">
  <img class="subvis__bg" src="${IMG}${body.dataset.subvisualImg || 'news-ir.png'}" alt="" width="1920" height="640">
  <div class="subvis__in">
    <p class="eyebrow">${body.dataset.eyebrow || sec.eyebrow}</p>
    <h1 class="t-display" id="subvis-title">${title}</h1>
    <ol class="crumb" aria-label="현재 위치">${crumbs}</ol>
  </div>
</section>${lnb}`);
  }

  /* ---- footer ---- */
  body.insertAdjacentHTML('beforeend', `
<footer class="ftr">
  <div class="ftr__top">
    <a class="logo" href="index.html" aria-label="한미반도체 홈">
      <span class="logo__mark">HANMI</span><span class="logo__ko">한미반도체</span>
    </a>
    <nav class="ftr__links" aria-label="하단 메뉴">
      <a href="policy.html">고객정책</a>
    </nav>
  </div>
  <hr>
  <div class="ftr__info">
    <address>
      <span>본사  인천광역시 서해구 가좌로 30번길 14</span>
      <span>서울사무소  서울특별시 용산구 한남대로 152</span>
      <span>대표번호  <a href="tel:+82325719100">+82-32-571-9100</a>   |   AI A/S 센터  <a href="tel:+82325711119">+82-32-571-1119</a> (365일 24시간)</span>
    </address>
    <div class="sns">
      <a href="https://www.youtube.com/watch?v=Csjy4jXo6yQ" target="_blank" rel="noopener">YouTube</a>
      <a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a>
    </div>
  </div>
  <p class="ftr__copy ftr__concept">본 사이트는 포트폴리오용 리디자인 컨셉이며, 실제 한미반도체와 관련이 없습니다. · Redesign concept for portfolio</p>
</footer>`);

  /* ---- mobile menu ---- */
  const hdr = document.getElementById('hdr');
  const btn = hdr.querySelector('.menu-btn');
  btn.addEventListener('click', () => {
    const open = hdr.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && hdr.classList.contains('is-open')) btn.click(); });

  /* ---- brand film: play inline instead of leaving the site ---- */
  document.querySelectorAll('.video[data-yt]').forEach(v => v.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let modified clicks open YouTube
    e.preventDefault();
    const box = document.createElement('div');
    box.className = v.className + ' is-playing';
    box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.dataset.yt}?autoplay=1&rel=0" title="한미반도체 브랜드 필름" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    v.replaceWith(box);
    box.querySelector('iframe').focus();
  }));

  /* ---- scroll reveal ---- */
  const els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('is-in'));

  /* ---- generic tabs: [role=tablist] > button[aria-controls] ---- */
  document.querySelectorAll('[role="tablist"]:not([data-carousel]):not([data-filter])').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(o => {
        const on = o === t;
        o.setAttribute('aria-selected', on);
        o.tabIndex = on ? 0 : -1;
        const p = document.getElementById(o.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    }));
  });
})();
