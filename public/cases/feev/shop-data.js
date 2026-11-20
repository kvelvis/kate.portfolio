/* ==========================================================================
   FEEV — product catalogue shared by index.html, products.html and the cart.
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
