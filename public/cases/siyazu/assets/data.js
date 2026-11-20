/* SIYAZU: content and configuration (Korean-only site).
   Everything editable lives here: film segments, products, UI strings. */

window.SIYAZU = (() => {
  const IMG = "img/web/";

  /* ── Film ─────────────────────────────────────────────
     One Vimeo film is used for every moment on the site; each moment is a
     start/end segment of it. To use a different film, change `id` per segment.
     Source: vimeo.com/1236128328 (SIYAZU 26 WINTER, Echoes of Time, 41 s).
     Optional `src`: a local MP4 (e.g. "video/hero.mp4"). When set, a native
     <video> is used instead of the Vimeo player, still looped start→end. */
  const FILM_ID = "1236128328";
  const seg = (start, end, extra = {}) => ({ id: FILM_ID, start, end, src: null, ...extra });

  const film = {
    id: FILM_ID,
    title: "SIYAZU 26 Winter: Echoes of Time",
    hero: seg(5, 14, { poster: "film-6.jpg" }),   // inside the SIYAZU letters
  };

  /* NEW FORM tiles: short loops (4–6 s). Captions describe what each segment shows. */
  const newForm = [
    { seg: seg(10, 15), poster: "film-14.jpg", name: "울 코트" },
    { seg: seg(3, 8),   poster: "film-4.jpg",  name: "시어링 & 니트" },
    { seg: seg(20, 25), poster: "film-22.jpg", name: "덕다운 패딩" },
  ];

  /* Journal strip: short moments from the film (4–6 s each). */
  const journal = [
    { seg: seg(0, 5),   poster: "ed-stairs.jpg",     shape: "tall", title: { ko: "첫 빛" } },
    { seg: seg(6, 11),  poster: "film-6.jpg",        shape: "wide", title: { ko: "고요한 방" } },
    { seg: seg(12, 17), poster: "ed-sofa.jpg",       shape: "tall", title: { ko: "질감" } },
    { seg: seg(18, 23), poster: "wide-leather.jpg",  shape: "wide", title: { ko: "두 개의 코트" } },
    { seg: seg(24, 30), poster: "ed-pair-grey.jpg",  shape: "tall", title: { ko: "오후" } },
    { seg: seg(31, 36), poster: "ed-fur-red.jpg",    shape: "tall", title: { ko: "남겨진 것" } },
  ];

  /* ── Filters ── */
  const categories = {
    outer: { en: "Outerwear", ko: "아우터" },
    knit:  { en: "Knitwear",  ko: "니트" },
    top:   { en: "Tops",      ko: "탑" },
    pants: { en: "Trousers",  ko: "팬츠" },
  };
  const fabrics = {
    wool:   { en: "Wool blend",     ko: "울 블렌드" },
    fur:    { en: "Faux fur",       ko: "페이크 퍼" },
    suede:  { en: "Faux shearling", ko: "페이크 무스탕" },
    down:   { en: "Duck down",      ko: "덕다운" },
    jersey: { en: "Brushed jersey", ko: "기모 저지" },
    cotton: { en: "Cotton blend",   ko: "코튼 블렌드" },
  };

  /* ── Products ── (prices from price.txt: `was` = list price, `price` = current) */
  const c = (name, ko, hex, images) => ({ name, ko, hex, images: images.map((f) => IMG + f) });

  const products = [
    { id: "bomber", sku: "SIOT4173", cat: "outer", fabric: "suede", price: 191100, was: 273000,
      name: { en: "Faux Mustang Bomber Jacket", ko: "페이크 무스탕 봄버 자켓" },
      colors: [c("Brown", "브라운", "#6E4A33", ["bomber-brown.jpg", "bomber-brown-model.jpg"]),
               c("Black", "블랙", "#1A1A1A", ["bomber-black.jpg", "bomber-black-model.jpg"])],
      sizes: ["S", "M"], sillage: { en: "Leather, smoked birch", ko: "레더, 스모크 버치" },
      desc: { en: "A cropped bomber in faux mustang with a plush collar. Boxy through the body, gathered at the hem.",
              ko: "플러시 칼라를 더한 페이크 무스탕 크롭 봄버. 여유 있는 바디와 밑단 셔링." } },
    { id: "hood-down", sku: "SIOT4176", cat: "outer", fabric: "down", price: 147950, was: 269000,
      name: { en: "Oversized Hooded Down Jacket", ko: "덕다운 오버 핏 후드 패딩" },
      colors: [c("Ivory", "아이보리", "#EFEADF", ["hood-down-ivory.jpg", "hood-down-ivory-model.jpg"])],
      sizes: ["S", "M"], sillage: { en: "White tea, cotton flower", ko: "화이트 티, 코튼 플라워" },
      desc: { en: "Duck-down fill in a relaxed, oversized shape with a deep hood.",
              ko: "깊은 후드와 오버사이즈 실루엣의 덕다운 패딩." } },
    { id: "crop-down", sku: "SIOT4010", cat: "outer", fabric: "down", price: 137900, was: 197000,
      name: { en: "Cropped Duck Down Jacket", ko: "덕다운 크롭 패딩" },
      colors: [c("Black", "블랙", "#1A1A1A", ["crop-down-black.jpg", "crop-down-black-model.jpg"])],
      sizes: ["S", "M"], sillage: { en: "Cold air, vetiver", ko: "차가운 공기, 베티버" },
      desc: { en: "A short, rounded down jacket with a high stand collar.",
              ko: "하이넥 스탠드 칼라의 짧고 둥근 실루엣 다운 재킷." } },
    { id: "half-coat", sku: "SIOT4225", cat: "outer", fabric: "wool", price: 267750, was: 357000,
      name: { en: "Classic Double Half Coat", ko: "클래식 더블 하프 코트" },
      colors: [c("Melange black", "멜란지 블랙", "#3A3838", ["half-coat.jpg", "half-coat-model.jpg"])],
      sizes: ["S", "M"], sillage: { en: "Cedar, black pepper", ko: "시더, 블랙 페퍼" },
      desc: { en: "Double-breasted and hip-length, with clean shoulders and a straight fall.",
              ko: "깨끗한 어깨선과 곧게 떨어지는 힙 기장의 더블 브레스트 코트." } },
    { id: "luster-fur", sku: "SIOT4222", cat: "outer", fabric: "fur", price: 185250, was: 247000, ships: "11/24",
      name: { en: "Luster Vintage Fur Jacket", ko: "러스터 빈티지 퍼 자켓" },
      colors: [c("Brown", "브라운", "#6E4A33", ["luster-fur.jpg", "luster-fur-model.jpg"])],
      sizes: ["S", "M"], sillage: { en: "Amber, tonka bean", ko: "앰버, 통카 빈" },
      desc: { en: "A glossy, vintage-toned faux fur with a soft collar and easy shape.",
              ko: "은은한 광택의 빈티지 톤 페이크 퍼. 부드러운 칼라와 여유로운 실루엣." } },
    { id: "jacquard-knit", sku: "SIKN2216", cat: "knit", fabric: "wool", price: 110250, was: 147000,
      name: { en: "Jacquard Zip-up Knit", ko: "인디언 자카드 집업 니트" },
      colors: [c("Cream", "크림", "#EDE4D3", ["jacquard-knit.jpg", "jacquard-knit-model.jpg"])],
      sizes: ["F"], sillage: { en: "Warm milk, sandalwood", ko: "웜 밀크, 샌달우드" },
      desc: { en: "A full-zip cardigan in a tonal jacquard pattern.",
              ko: "톤온톤 자카드 패턴의 풀 집업 니트." } },
    { id: "turtleneck", sku: "SITP5320", cat: "top", fabric: "jersey", price: 36750, was: 49000,
      name: { en: "Brushed Layered Turtleneck", ko: "기모 레이어드 터틀넥 탑" },
      colors: [c("Purple", "퍼플", "#6B5577", ["turtleneck.jpg", "turtleneck-model.jpg"])],
      sizes: ["F"], sillage: { en: "Violet leaf, iris", ko: "바이올렛 리프, 아이리스" },
      desc: { en: "A slim, brushed turtleneck made for layering.",
              ko: "레이어드하기 좋은 슬림한 기모 터틀넥." } },
    { id: "highneck-knit", sku: "SIKN2200", cat: "knit", fabric: "wool", price: 96750, was: 129000, ships: "11/20",
      name: { en: "Wool Blend High-neck Zip Knit", ko: "울 블렌드 하이넥 집업 니트" },
      colors: [c("Oatmeal", "오트밀", "#D8CBB8", ["highneck-knit.jpg", "highneck-knit-model.jpg"])],
      sizes: ["F"], sillage: { en: "Oat, cashmere musk", ko: "오트, 캐시미어 머스크" },
      desc: { en: "A half-zip high-neck knit in a soft wool blend.",
              ko: "부드러운 울 블렌드의 하프 집업 하이넥 니트." } },
    { id: "bermuda", sku: "SIPT7222", cat: "pants", fabric: "wool", price: 66750, was: 89000, ships: "11/18",
      name: { en: "Hairy Bermuda Pants", ko: "헤어리 버뮤다 팬츠" },
      colors: [c("Deep charcoal", "딥 차콜", "#34312F", ["bermuda.jpg", "bermuda-model.jpg"])],
      sizes: ["S", "M", "L"], sillage: { en: "Vetiver, wet stone", ko: "베티버, 젖은 돌" },
      desc: { en: "Knee-length Bermudas in a brushed, hairy texture.",
              ko: "헤어리한 기모 질감의 무릎 기장 버뮤다 팬츠." } },
    { id: "jogger", sku: "SIPT7218", cat: "pants", fabric: "cotton", price: 66750, was: 89000,
      name: { en: "Curved Banding Jogger Pants", ko: "커브드 밴딩 조거 팬츠" },
      colors: [c("Melange gray", "멜란지 그레이", "#9A9894", ["jogger.jpg", "jogger-model.jpg"])],
      sizes: ["S", "M", "L"], sillage: { en: "Clean cotton, bergamot", ko: "클린 코튼, 베르가못" },
      desc: { en: "Curved-leg joggers with an elastic waist.",
              ko: "곡선 라인의 다리와 밴딩 허리의 조거 팬츠." } },
    { id: "shearling", sku: "SIOT4223", cat: "outer", fabric: "fur", price: 179250, was: 239000,
      name: { en: "Soft Shearling Fur Jacket", ko: "소프트 시어링 퍼 자켓" },
      colors: [c("Beige", "베이지", "#D9C6A8", ["shearling.jpg", "shearling-model.jpg"])],
      sizes: ["S", "M"], sillage: { en: "Cedar, white tea", ko: "시더, 화이트 티" },
      desc: { en: "A short shearling-texture jacket with a wide collar.",
              ko: "넓은 칼라의 짧은 시어링 텍스처 재킷." } },
    { id: "wing-coat", sku: "SIOT4227", cat: "outer", fabric: "wool", price: 279750, was: 373000, ships: "12/2",
      name: { en: "Handmade Wing Sleeve Long Coat", ko: "핸드메이드 윙 슬리브 롱 코트" },
      colors: [c("Charcoal", "차콜", "#45423F", ["wing-coat.jpg", "wing-coat-model.jpg"])],
      sizes: ["S", "M"], sillage: { en: "Incense, cedarwood", ko: "인센스, 시더우드" },
      desc: { en: "A long, handmade coat with full wing sleeves.",
              ko: "풍성한 윙 슬리브의 핸드메이드 롱 코트." } },
  ].map((p, i) => ({ ...p, order: i, clip: p.clip || null }));
  /* `clip`: optional hover video per product, e.g. clip: "video/bomber.mp4" (3–5 s, muted).
     Without it, hovering shows the second photo. */

  /* ── UI strings (Korean) ── */
  const t = {
    skip: "본문 바로가기", newIn: "신상품", shop: "쇼핑", about: "브랜드", journal: "저널",
    search: "검색", account: "계정", bag: "장바구니", menu: "메뉴", close: "닫기",
    heroTitle: "시야주 SIYAZU, 26 윈터 컬렉션", pauseFilm: "영상 일시정지", playFilm: "영상 재생",
    newForm: "새로운 형태", visualBy: "비주얼 디렉션 · 시야주",
    edIntro: "2020년에 시작된 시야주는 깨끗한 선과 편안한 실루엣을 중심으로 모던하고 미니멀한 옷을 만듭니다.",
    sillageLabel: "잔향",
    sillageTitle: "당신이 지나간 자리",
    sillage1: "시야주는 프랑스어 ‘sillage’에서 온 이름입니다. 누군가 지나간 자리에 남는 향기의 잔향. 시야주의 모든 옷에는 저마다의 잔향이 담겨 있습니다. 당신만의 향을 입어보세요.",
    sillage2: "무엇에도 흔들리지 않고 자신을 표현하는 여성은 그 아름다움으로 기억됩니다. 그런 여성들이 시야주를 선택합니다.",
    sillageHint: "화면 위로 천천히 움직여 보세요.",
    collection: "컬렉션", category: "카테고리", color: "컬러", size: "사이즈", fabric: "소재", sort: "정렬",
    all: "전체", sortFeatured: "추천순", sortLow: "낮은 가격순", sortHigh: "높은 가격순",
    items: (n) => `${n}개 상품`,
    empty: "조건에 맞는 상품이 없습니다.", clear: "필터 초기화",
    quickView: "퀵뷰", addToBag: "장바구니 담기", addedBtn: "담았어요 ✓", added: "장바구니에 담았어요",
    chooseSize: "사이즈를 선택해 주세요",
    preorder: (d) => `${d} 예약발송`, sillageNote: "잔향 노트", viewDetails: "상세 보기",
    journalLabel: "저널", journalTitle: "시간이 남긴 잔향", watch: "보기", watchFull: "전체 영상 보기",
    footerAvail: "온라인 및 오프라인 매장에서 만나보세요", newsletter: "뉴스레터",
    newsletterHint: "새 컬렉션과 조용한 소식을 한 시즌에 몇 번만 보내드립니다.",
    email: "이메일 주소", subscribe: "구독하기", subscribed: "감사합니다. 구독이 완료되었습니다.",
    emailErr: "이메일 주소를 확인해 주세요. @와 도메인이 필요합니다.",
    bagTitle: "장바구니", bagEmpty: "장바구니가 비어 있습니다.", remove: "삭제", subtotal: "합계",
    checkout: "주문하기", keepShopping: "계속 쇼핑하기",
    sizeGuide: "사이즈 가이드", fabricCare: "소재 및 관리",
    care: "드라이클리닝 전용. 직사광선을 피해 접어서 보관하세요. 착용 후에는 향이 자리 잡도록 통풍해 주세요.",
    sillageBlock: (notes) => `${notes}. 안감에 스며든 향은 체온과 함께 천천히 피어올라, 당신이 떠난 뒤에도 공간에 머뭅니다.`,
    inMotion: "26 윈터 필름 中", backToShop: "쇼핑으로 돌아가기", related: "함께 보면 좋은 상품",
    searchLabel: "컬렉션 검색", searchPh: "코트, 니트, 퍼…",
    notFound: "상품을 찾을 수 없습니다.", sizes: { F: "Free" },
    sizeCols: ["사이즈", "어깨", "가슴", "총장"],
    ed4: "캐시미어 블렌드 핸드메이드 코트",
    filters: "필터", help: "고객센터", stores: "매장 안내", shipping: "배송", returns: "교환·반품", care2: "케어", contact: "문의",
    outerwear: "아우터", knitwear: "니트", trousers: "팬츠", prev: "이전", next: "다음",
    edTitle: "시야주 소개", shopTitle: "26 윈터", film: "필름",
  };

  /* Size guide (cm), placeholder measurements per category. */
  const sizeGuide = {
    outer: [["S", 44, 58, 68], ["M", 46, 61, 70]],
    knit:  [["F", 52, 60, 64]],
    top:   [["F", 38, 44, 60]],
    pants: [["S", "—", 35, 52], ["M", "—", 37, 53], ["L", "—", 39, 54]],
  };

  return { IMG, film, newForm, journal, categories, fabrics, products, t, sizeGuide };
})();
