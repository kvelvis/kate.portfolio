/* ==========================================================================
   FEEV — product catalogue shared by index.html, products.html, product.html and the cart.
   Prices are PLACEHOLDERS for the portfolio concept (no official price list).
   Swatch colours are sampled from the product photos.
   ========================================================================== */
window.FEEV_PRODUCTS = [
  {
    id: 'gloss',
    en: 'Bubble Gloss',
    ko: '버블 글로스',
    tag: 'NEW',
    finish: 'Glossy',
    texture: 'gloss',   // swatch look: gloss | matte | soft
    price: 18000,
    desc: '맑고 투명한 버블 광택, 바를수록 차오르는 볼륨. 스킨 컨디셔닝 성분으로 하루 종일 촉촉하게.',
    img: (n) => `./img/web/gloss-${n}`,
    shades: [
      { no: '01', name: 'Nut Veil',     ko: '넛 베일',     hex: '#C98474' },
      { no: '02', name: 'Peach Loaf',   ko: '피치 로아프', hex: '#E58E7E' },
      { no: '03', name: 'Rosy Babe',    ko: '로지 베이브', hex: '#CF6C7E' },
      { no: '04', name: 'More Apple',   ko: '모어 애플',   hex: '#E3121F' },
      { no: '05', name: 'Ballet Skirt', ko: '발레 스커트', hex: '#F6A3BD' },
      { no: '06', name: 'Sugar Plum',   ko: '슈가 플럼',   hex: '#8A2445' },
    ],
  },
  {
    id: 'tint',
    en: 'Hyper-Fit Color Wear',
    ko: '하이퍼 핏 컬러 웨어',
    best: true,         // "BEST" mark: popular product
    finish: 'Velvet',
    texture: 'matte',
    price: 17000,
    desc: '입술에 얇게 밀착되는 컬러 웨어. 가볍게 물들고 오래 머무는 벨벳 피니시.',
    img: (n) => `./img/web/tint-${n}`,
    shades: [
      { no: '01', hex: '#D67162' },
      { no: '02', hex: '#CD6E64' },
      { no: '03', hex: '#DD534F' },
      { no: '04', hex: '#C95B5F' },
      { no: '05', hex: '#C2484F' },
      { no: '06', hex: '#AF625C' },
      { no: '07', hex: '#B1445A' },
    ],
  },
  {
    id: 'blush',
    en: 'Fluffy Cheek Blush',
    ko: '플러피 치크 블러쉬',
    finish: 'See-through',
    texture: 'soft',
    price: 16000,
    desc: '두 뺨에 은은하게 스미는 말간 시스루 발색. 부드럽게 블러링되어 촉촉하게 마무리돼요. 10 g.',
    img: (n) => `./img/web/blush-${n}`,
    shades: [
      { no: '01', name: 'Strawberry Choux', hex: '#F4A9AC' },
      { no: '02', name: 'Lilac Mousse',     hex: '#E2A2BC' },
      { no: '03', name: 'Peach Whip',       hex: '#FAA491' },
      { no: '04', name: 'Cotton Candy',     hex: '#FEAEBC' },
      { no: '05', name: 'Popo Grape',       hex: '#D9A0C4' },
      { no: '06', name: 'Milk Tangerine',   hex: '#F3AE87' },
    ],
  },
];

window.FEEV_FMT = (n) => n.toLocaleString('ko-KR') + '원';
window.FEEV_SHADE_LABEL = (s) => s.name ? `No. ${s.no} ${s.name}` : `No. ${s.no}`;

/* ---------- Product page details (product.html) ----------
   Ingredients, volumes and dates are EXAMPLES for the portfolio concept. */
window.FEEV_DETAILS = {
  gloss: {
    volume: '3.8 g',
    detail: { src: './img/bubblegloss_sw.jpg', w: 940, h: 3716, alt: '버블 글로스 6가지 컬러 발색과 제품 포인트' },
    how: [
      '입술 중앙에서 바깥쪽으로 가볍게 펴 발라 주세요.',
      '볼륨감을 원하면 한 번 더 덧발라 버블 광택을 쌓아 주세요.',
      '립 컬러 위에 덧바르면 맑은 광택 코팅이 돼요.',
    ],
    ingredients: '폴리부텐, 하이드로제네이티드폴리아이소부텐, 다이아이소스테아릴말레이트, 옥틸도데칸올, 실리카다이메틸실릴레이트, 펜타에리스리틸테트라아이소스테아레이트, 소듐하이알루로네이트, 세라마이드엔피, 멘톨, 토코페롤, 향료, 적색202호, 황색4호, 산화철',
  },
  tint: {
    volume: '4 g',
    detail: { src: './img/tint_sw.jpg', w: 940, h: 7270, alt: '하이퍼 핏 컬러 웨어 컬러별 입술 발색과 스와치' },
    how: [
      '입술 안쪽부터 얇게 한 번 바르고, 바깥쪽으로 그라데이션해 주세요.',
      '30초 정도 지나 밀착되면 한 번 더 덧발라 선명하게 표현해요.',
      '손가락으로 톡톡 두드리면 블러 립으로 연출할 수 있어요.',
    ],
    ingredients: '정제수, 부틸렌글라이콜, 다이메티콘, 사이클로펜타실록세인, 실리카, 글리세린, 트라이메틸실록시실리케이트, 폴리메틸실세스퀴옥세인, 1,2-헥산다이올, 판테놀, 토코페롤, 향료, 적색202호, 적색104호의(1), 산화철',
  },
  blush: {
    volume: '10 g',
    detail: { src: './img/blush_sw.jpg', w: 940, h: 7270, alt: '플러피 치크 블러쉬 컬러별 발색 상세 이미지' }, // placeholder: same picture as the tint for now
    how: [
      '손가락이나 퍼프에 소량 덜어 광대 위에 톡톡 두드려 주세요.',
      '경계를 부드럽게 펴 바르면 말간 시스루 발색이 돼요.',
      '눈두덩이나 입술에 가볍게 올려 톤을 맞춰도 좋아요.',
    ],
    ingredients: '정제수, 사이클로펜타실록세인, 부틸렌글라이콜, 다이메티콘, 글리세린, 나이아신아마이드, 폴리글리세릴-4아이소스테아레이트, 판테놀, 마데카소사이드, 토코페롤, 향료, 적색202호, 황색5호, 산화철',
  },
};

/* Shared for every product */
window.FEEV_INFO = {
  shelfLife: '제조일로부터 30개월 · 개봉 후 12개월',
  origin: '대한민국',
  caution: [
    '사용 시 또는 사용 후 직사광선에 의해 사용 부위가 붉은 반점, 부어오름, 가려움 등의 이상 증상이나 부작용이 있으면 전문의와 상담하세요.',
    '상처가 있는 부위 등에는 사용을 자제하세요.',
    '어린이의 손이 닿지 않는 곳, 직사광선을 피해 서늘한 곳에 보관하세요.',
  ],
  shipping: [
    '3만 원 이상 구매 시 무료배송 (미만 3,000원)',
    '평일 오후 2시 이전 주문 시 당일 출고, 1–2일 안에 도착해요.',
    '제주·도서산간 지역은 3,000원이 추가돼요.',
  ],
  returns: [
    '상품 수령 후 7일 이내 교환·반품할 수 있어요.',
    '개봉하거나 사용한 제품은 위생상 교환·반품이 어려워요 (제품 하자는 예외).',
    '단순 변심에 의한 반품은 왕복 배송비 6,000원이 들어요.',
  ],
};

/* NEW / BEST marks */
window.FEEV_BADGES = (p, cls) => {
  const marks = [p.tag && `<span class="badge badge--mini">${p.tag}</span>`, p.best && `<span class="badge badge--mini badge--best">BEST</span>`].filter(Boolean);
  return marks.length ? `<span class="${cls}">${marks.join('')}</span>` : '';
};
window.FEEV_HEART = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

window.FEEV_URL = (id, no) => `./product.html?id=${id}${no ? `&shade=${no}` : ''}`;

/* Product card (shop + "other products" on the product page): one card per product,
   colour dots preview each shade; the whole card links to the product page. */
window.FEEV_CARD = (p) => {
  const s0 = p.shades[0];
  const dots = p.shades.map((s, j) => `
      <button class="pcard__dot dot--${p.texture}" type="button" data-no="${s.no}" style="--c:${s.hex}"
              aria-pressed="${j === 0}" aria-label="${window.FEEV_SHADE_LABEL(s)} 미리 보기"></button>`).join('');
  return `
  <li class="pcard" data-id="${p.id}" style="--c:${s0.hex}">
    <div class="pcard__frame">
      <img src="${p.img(s0.no)}-600.webp" srcset="${p.img(s0.no)}-600.webp 600w, ${p.img(s0.no)}-1000.webp 1000w"
           sizes="(min-width: 900px) 30vw, (min-width: 600px) 46vw, 92vw" width="600" height="600" loading="lazy" decoding="async"
           alt="${p.ko} ${window.FEEV_SHADE_LABEL(s0)}">
      ${window.FEEV_BADGES(p, 'pcard__tags')}
      <button class="wish js-wish" type="button" data-wish="${p.id}" aria-pressed="false" aria-label="${p.ko} 찜하기">${window.FEEV_HEART}</button>
      <span class="pcard__count">${p.shades.length} colors</span>
    </div>
    <div class="pcard__body">
      <h2 class="pcard__name"><a class="pcard__link" href="${window.FEEV_URL(p.id)}"><span lang="en">${p.en}</span></a></h2>
      <p class="pcard__ko">${p.ko}</p>
      <div class="pcard__dots" role="group" aria-label="${p.ko} ${p.shades.length}가지 컬러">${dots}</div>
      <p class="pcard__price">${window.FEEV_FMT(p.price)}</p>
    </div>
  </li>`;
};

/* Wires the colour dots of every .pcard inside root: preview the shade, keep the link in sync. */
window.FEEV_CARDS_INIT = (root) => {
  root.addEventListener('click', (e) => {
    const dot = e.target.closest('.pcard__dot');
    if (dot) preview(dot);
  });
  root.addEventListener('pointerover', (e) => {
    const dot = e.target.closest('.pcard__dot');
    if (dot && e.pointerType === 'mouse') preview(dot);
  });
  function preview(dot) {
    const card = dot.closest('.pcard');
    const p = window.FEEV_PRODUCTS.find((x) => x.id === card.dataset.id);
    const s = p.shades.find((x) => x.no === dot.dataset.no);
    card.querySelectorAll('.pcard__dot').forEach((d) => d.setAttribute('aria-pressed', String(d === dot)));
    const img = card.querySelector('img');
    img.srcset = `${p.img(s.no)}-600.webp 600w, ${p.img(s.no)}-1000.webp 1000w`;
    img.src = `${p.img(s.no)}-600.webp`;
    img.alt = `${p.ko} ${window.FEEV_SHADE_LABEL(s)}`;
    card.style.setProperty('--c', s.hex);
    card.querySelector('.pcard__link').href = window.FEEV_URL(p.id, s.no);
  }
};
