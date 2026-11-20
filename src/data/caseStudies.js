// Project panel content, keyed by work.js → caseStudy. Text: a string or { ko, en }.

export const caseStudies = {
  dano: {
    title: "Dano 단어",
    titleEn: { ko: "알림으로 배우는 한국어 단어 앱", en: "Learn Korean words from your notifications" },
    period: "2026.11",
    role: { ko: "기획 · UX/UI 디자인 · 캐릭터", en: "Planning · UX/UI design · Character" },
    tools: ["Figma", "Weavy"],
    fontCss: ["https://fonts.googleapis.com/css2?family=Gothic+A1:wght@400;700;800&display=swap"],
    story: [
      {
        title: { ko: "컨셉", en: "Concept" },
        text: {
          ko: "단어 공부를 위해 따로 시간을 내지 않아도, 잠금화면 알림으로 단어와 뜻이 자연스럽게 눈에 들어오도록 만든 앱입니다. 방해되지 않는 알림으로 일상 속에서 반복 학습을 돕습니다.",
          en: "You don’t have to set time aside to study: words and their meanings simply show up in your lock-screen notifications. Gentle, non-intrusive notifications build repetition into everyday life.",
        },
      },
      {
        title: { ko: "만든 이유", en: "Why I made it" },
        text: {
          ko: "저도 계속 한국어를 공부하고 있고, 시험 전에는 특정 단어들을 반복해서 외우고 싶을 때가 많았습니다. 따로 시간을 내지 않아도 그 단어들이 자연스럽게 눈에 들어오는 앱이 있었으면 해서 직접 기획했습니다.",
          en: "I’m still studying Korean myself, and before exams I often wanted to drill a specific set of words. I wanted an app that puts those words in front of me without setting time aside, so I designed one.",
        },
      },
      {
        title: { ko: "주요 기능", en: "Key features" },
        items: [
          {
            term: { ko: "알림 학습", en: "Learning by notification" },
            text: {
              ko: "단어 + 번역이 잠금화면 알림으로 도착해 앱을 열지 않아도 학습 가능",
              en: "A word and its translation arrive on the lock screen, so you learn without opening the app",
            },
          },
          {
            term: { ko: "맞춤 설정", en: "Your own schedule" },
            text: { ko: "주제, 알림 빈도, 요일·시간대를 직접 설정", en: "Choose topics, how often, and which days and hours" },
          },
          {
            term: { ko: "단어 팩", en: "Word packs" },
            text: { ko: "시험 전 교재 단어 등 미리 구성된 단어 팩 제공", en: "Ready-made packs, such as textbook words before an exam" },
          },
          {
            term: { ko: "시험 모드", en: "Exam mode" },
            text: { ko: "TOPIK 등 시험 날짜까지 D-day와 학습 진행률 표시", en: "A D-day countdown to TOPIK or another exam, with study progress" },
          },
        ],
      },
      {
        title: { ko: "디자인 포인트", en: "Design points" },
        items: [
          {
            term: { ko: "단어 카드", en: "Word card" },
            text: {
              ko: "한글 단어, 로마자 발음, 영어 뜻, 예문을 한 카드에 담고 발음 듣기 버튼 제공",
              en: "The Korean word, romanisation, English meaning and an example on one card, with a listen button",
            },
          },
          {
            term: { ko: "마스코트", en: "Mascot" },
            text: {
              ko: "빨간 털실을 가진 검은 고양이를 AI로 3D 바이닐 토이 스타일로 제작. 주제별 장면(예: 약국 주제에서는 알약을 든 고양이)으로 학습에 재미를 더함",
              en: "A black cat with a red ball of yarn, made with AI in a 3D vinyl-toy style. Topic scenes (e.g. holding a pill for “pharmacy”) make studying more fun",
            },
            why: {
              ko: "러시아 동화에 나오는 ‘학자 고양이’에서 가져온 캐릭터. 부엉이는 다른 학습 앱과 비슷해 보여서 피했고, 빨간 털실은 실타래를 풀듯 언어의 단어를 하나씩 풀어 간다는 의미",
              en: "Based on the “learned cat” from Russian fairy tales. I avoided an owl because it would look like other learning apps; the red yarn stands for unwinding a language word by word",
            },
          },
          {
            term: { ko: "컬러", en: "Colour" },
            text: {
              ko: "라벤더-피치 그라데이션 배경에 흰 카드, 포인트 컬러는 털실의 레드 오렌지",
              en: "White cards on a lavender-to-peach gradient; the accent is the yarn’s red-orange",
            },
            why: { ko: "잘 어울리면서 눈에 부담이 없는 색이라, 매일 보는 학습 앱에 맞음", en: "The colours sit well together and are easy on the eyes, right for an app you look at every day" },
          },
          {
            term: { ko: "영문 UI", en: "English UI" },
            text: { ko: "한국어를 배우는 외국인 학습자를 위한 영어 인터페이스", en: "An English interface for foreigners learning Korean" },
          },
        ],
      },
      {
        title: { ko: "컬러", en: "Colour" },
        // values from the Figma file (collection "Dano v3")
        colors: [
          { hex: "#F1582D", name: { ko: "털실 레드 · 메인 액션, 진행률, 번역", en: "Yarn · main action, progress, translation" }, main: true },
          { hex: "#1E1B1C", name: { ko: "고양이 블랙 · 텍스트, 선택 칩", en: "Cat · text, selected chips" } },
          { hex: "#8C7CFF", name: { ko: "라일락 · 차트, 일러스트", en: "Lilac · charts, illustrations" } },
          {
            hex: "#B7AEFF",
            bg: "linear-gradient(135deg, #B7AEFF 0%, #FFC7D9 55%, #FFB27D 100%)",
            name: { ko: "배경 그라데이션", en: "Background gradient" },
            code: "#B7AEFF → #FFC7D9 → #FFB27D",
          },
          { hex: "#FFFFFF", bg: "rgba(255,255,255,0.3)", name: { ko: "글래스 패널 (흰색 30%)", en: "Glass panels (white 30%)" }, code: "#FFFFFF 30%" },
          { hex: "#FFFFFF", bg: "rgba(255,255,255,0.62)", name: { ko: "글래스 스트롱 · 필, 안쪽 블록 (흰색 62%)", en: "Glass strong · pills, inner blocks (white 62%)" }, code: "#FFFFFF 62%" },
        ],
      },
      {
        title: { ko: "타이포그래피", en: "Typography" },
        fonts: [
          {
            family: "'Gothic A1', sans-serif",
            name: "Gothic A1",
            role: { ko: "한국어 단어 · 본문", en: "Korean words · body" },
            sample: "약국",
            weight: 800,
            note: { ko: "굵고 또렷한 한글로 단어가 한눈에", en: "Bold, clear hangul so a word reads at a glance" },
          },
          {
            family: "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif",
            name: "SF Pro Rounded",
            role: { ko: "영문 UI · 숫자", en: "English UI · numbers" },
            sample: "Words come to you",
            weight: 700,
            note: { ko: "털실처럼 부드러운 둥근 형태", en: "Soft and round, like the ball of yarn" },
          },
        ],
      },
      {
        title: { ko: "디자인 시스템", en: "Design system" },
        items: [
          {
            text: {
              ko: "단어 카드, 팩 카드, 칩, 버튼, 탭 바 등 재사용 가능한 컴포넌트로 구성",
              en: "Built from reusable components: word cards, pack cards, chips, buttons, a tab bar",
            },
          },
          {
            text: {
              ko: "오토레이아웃으로 다양한 휴대폰 화면 크기에 대응, 별도 스타일 가이드 제작",
              en: "Auto Layout adapts to different phone sizes; a separate style guide",
            },
          },
        ],
      },
      {
        title: { ko: "주요 화면", en: "Key screens" },
        tags: [
          { ko: "로딩", en: "Loading" },
          { ko: "웰컴", en: "Welcome" },
          { ko: "오늘의 단어", en: "Word of the day" },
          { ko: "단어 팩", en: "Word packs" },
          { ko: "단어 상세", en: "Word detail" },
          { ko: "알림 스케줄", en: "Notification schedule" },
          { ko: "학습 진행률", en: "Progress" },
          { ko: "잠금화면", en: "Lock screen" },
        ],
      },
      {
        title: { ko: "디자인 과정", en: "Design process" },
        text: {
          ko: "초기 미니멀 버전은 템플릿처럼 단조롭게 느껴져, 그라데이션과 3D 마스코트 장면을 더한 방향으로 전면 리디자인했습니다.",
          en: "The first minimal version felt flat, like a template, so I redesigned it completely, adding gradients and 3D mascot scenes.",
        },
      },
    ],
    links: { figma: "https://www.figma.com/design/ziA3DZKe7lxjrnYEWaA6Yj/Dano_App_project?node-id=0-1" },
  },
  gatto: {
    title: "묘한 커피",
    titleEn: "Myohan Coffee",
    period: "2026.11",
    role: { ko: "컨셉 기획 · 브랜딩 · 마스코트 · 웹디자인", en: "Concept · Branding · Mascot · Web design" },
    tools: ["Figma", "Illustrator", "Weavy", "Kling", "HTML · CSS · JS", "GSAP", "Lenis"],
    story: [
      {
        title: { ko: "컨셉", en: "Concept" },
        text: {
          ko: "커피를 마시고, 굿즈를 사고, 고양이를 입양할 수 있는 카페입니다. 브랜드의 중심에는 ‘길고양이에게 가족을 찾아주는 일’이 있습니다. 타깃은 고양이를 좋아하는 30대 직장인입니다.",
          en: "A café where you can have a coffee, buy merch and adopt a cat. At the heart of the brand is one job: finding families for street cats. The audience: office workers in their thirties who love cats.",
        },
      },
      {
        title: { ko: "아이디어의 출발", en: "Where the idea came from" },
        text: {
          ko: "해외에서 본 ‘고양이가 주인공인 카페’에서 영감을 받았습니다. 여기에 카페에서 고양이를 직접 입양할 수 있다는 아이디어를 더해 오리지널 브랜드로 만들었습니다.",
          en: "It was inspired by cafés I saw abroad where a cat is the star. I added my own idea, adopting a cat right at the café, and built it into an original brand.",
        },
      },
      {
        title: { ko: "네이밍", en: "Naming" },
        text: {
          ko: "묘(猫) = 고양이, 묘하다 = 신비롭다. 한 단어에 카페의 주제와 분위기를 함께 담았습니다.",
          en: "In Korean, 묘 (猫) means “cat” and 묘하다 means “mysterious”. One word carries both the café’s subject and its mood.",
        },
      },
      {
        title: { ko: "마스코트 ‘콩이’", en: "Mascot “Kongi”" },
        items: [
          {
            term: { ko: "별 모양 눈동자", en: "Star-shaped pupils" },
            text: { ko: "브랜드의 ‘묘한’ 분위기를 보여주는 시그니처", en: "The signature that shows the brand’s “mysterious” side" },
          },
          {
            term: { ko: "물린 귀", en: "Bitten ear" },
            text: {
              ko: "길 위에서 살아온 흔적. 입양을 기다리는 고양이들처럼 사연이 있는 캐릭터",
              en: "A mark of life on the street. A character with a story, like the cats waiting for a home",
            },
          },
          {
            term: { ko: "후드티 + 팝아트 스티커 스타일", en: "Hoodie + pop-art sticker style" },
            text: {
              ko: "스트릿 감성으로 MZ세대를 공략하고, 굿즈에도 활용하기 좋은 형태",
              en: "Street style that speaks to Gen Z, and a shape that works well on merch",
            },
          },
        ],
      },
      {
        title: { ko: "디자인 결정", en: "Design decisions" },
        items: [
          {
            term: { ko: "메인 컬러는 레드", en: "Red as the main colour" },
            text: { ko: "로고와 타이틀, 포인트는 레드, 그린과 옐로우를 함께 사용", en: "Red for the logo, titles and accents, with green and yellow alongside" },
            why: {
              ko: "눈에 띄고 기억에 남도록. 레드만 쓰면 너무 강해서 그린과 옐로우로 밝기의 균형을 맞춤",
              en: "To stand out and be remembered. Red alone is too strong, so green and yellow balance its brightness",
            },
          },
          {
            term: { ko: "둥근 서체 Bagel Fat One", en: "Round typeface: Bagel Fat One" },
            text: { ko: "로고와 큰 타이틀에 사용", en: "Used for the logo and big titles" },
            why: { ko: "둥글고 통통한 글자가 고양이처럼 귀엽고 친근해서", en: "Round, chubby letters feel cute and friendly, like a cat" },
          },
          {
            term: { ko: "이모지 · 스티커 장식", en: "Emoji and sticker details" },
            text: { ko: "🐾, ✦ 같은 장식을 문구와 띠 배너에 사용", en: "Marks like 🐾 and ✦ in copy and the running banner" },
            why: { ko: "밝고 장난스러운 분위기를 만들고, 스티커 굿즈와도 이어지도록", en: "To keep the mood bright and playful, and to tie in with the sticker merch" },
          },
          {
            term: { ko: "입양과 굿즈를 강조", en: "Adoption and merch up front" },
            text: { ko: "입양을 핵심 섹션으로 두고, 굿즈도 크게 보여줌", en: "Adoption is the core section, and the merch is shown big too" },
            why: { ko: "굿즈 판매도 고양이를 돕는 일이라서, 두 가지를 함께 브랜드의 이야기로 연결", en: "Selling merch helps the cats too, so both are part of the brand’s story" },
          },
        ],
      },
      {
        title: { ko: "가장 어려웠던 점", en: "The hardest part" },
        text: {
          ko: "중요한 것에 집중시키는 것. 입양과 굿즈를 강조하면서도, 결국 이곳은 수익을 내야 하는 카페라서 메뉴와 방문 정보도 놓치지 않게 균형을 맞췄습니다.",
          en: "Keeping the focus on what matters. Adoption and merch come first, but this is still a café that has to make money, so the menu and visit info couldn’t get lost.",
        },
      },
      {
        title: { ko: "적용", en: "Applications" },
        items: [
          {
            text: {
              ko: "콩이 자수 앞치마, 영문 로고 종이컵, 국문 로고 크라프트 쇼핑백",
              en: "Apron with an embroidered Kongi, paper cup with the English logo, kraft shopping bag with the Korean logo",
            },
          },
        ],
      },
      {
        title: { ko: "웹사이트", en: "Website" },
        items: [
          { text: { ko: "메인 비주얼에서 콩이를 주인공으로 소개", en: "The main visual introduces Kongi as the hero" } },
          { text: { ko: "고양이 입양을 핵심 섹션으로 배치", en: "Cat adoption is placed as the core section" } },
          {
            text: {
              ko: "콩이 모양 샌드위치 등 스페셜 메뉴로 캐릭터를 실제 경험과 연결",
              en: "Special menu items like a Kongi-shaped sandwich connect the character to the real visit",
            },
          },
          {
            text: { ko: "한국어 전용, 반응형 (PC · 태블릿 · 모바일)", en: "Korean only, responsive (PC · tablet · mobile)" },
          },
        ],
      },
    ],
  },
  feev: {
    title: "FEEV",
    titleEn: "",
    period: "2026.11",
    role: { ko: "컨셉 기획 · 웹디자인 · 아트 디렉션", en: "Concept · Web design · Art direction" },
    tools: ["Figma", "Three.js", "Weavy", "Claude (AI)"],
    story: [
      {
        title: { ko: "컨셉", en: "Concept" },
        text: {
          ko: "실제 K-뷰티 브랜드 FEEV의 웹사이트를 버블 글로스 출시 캠페인으로 리디자인했습니다. 투명하고 촉촉한 립글로스의 광택을 ‘비눗방울’로 표현해, 첫 화면부터 가볍고 톡 터지는 즐거움을 느낄 수 있도록 했습니다. 타깃은 SNS에서 뷰티 제품을 찾는 20대 여성입니다.",
          en: "A redesign of the real K-beauty brand FEEV’s website as a launch campaign for its bubble gloss. The clear, glossy shine of the gloss becomes a soap bubble, so the light, popping fun is there from the first screen. The audience: women in their twenties who discover beauty products on social media.",
        },
      },
      {
        title: { ko: "출발점: 사이트와 광고의 온도 차이", en: "Starting point: the site and the ads felt different" },
        text: {
          ko: "기존 사이트는 미니멀한데, 브랜드 광고는 항상 밝고 화려했습니다. 광고를 보고 들어온 사람이 같은 브랜드라고 느낄 수 있도록 광고의 에너지를 사이트로 가져오되, 과하지 않게 균형을 맞추는 것을 목표로 했습니다.",
          en: "The original site was minimal, while the brand’s ads were always bright and loud. The goal was to bring the ads’ energy into the site, so people arriving from an ad feel it’s the same brand, without overdoing it.",
        },
      },
      {
        title: { ko: "디자인 결정", en: "Design decisions" },
        items: [
          {
            term: { ko: "메인 비주얼: 입술에서 부풀어 터지는 3D 버블", en: "Main visual: a 3D bubble blown from the lips that pops" },
            text: {
              ko: "스크롤하면 버블이 커지다가 터지고, 클릭해서 먼저 터뜨릴 수도 있음",
              en: "It grows as you scroll and pops; you can also click to pop it early",
            },
            why: {
              ko: "제품 이름(버블 글로스)과 사용감(톡 터지는 플럼핑)을 한 번에 보여주기 위해. 사진 한 장보다 직접 터뜨려 보는 경험이 더 기억에 남음",
              en: "To show the product name (bubble gloss) and how it feels (the popping, plumping effect) in one go. Popping it yourself sticks better than a photo",
            },
          },
          {
            term: { ko: "화려함은 타이틀에만", en: "The loud part stays in the titles" },
            text: {
              ko: "‘POP that Bubble!’ 같은 큰 타이틀은 광고처럼 통통한 3D 젤리 레터링 이미지로, 본문과 UI는 차분한 세리프와 고딕으로",
              en: "Big titles like “POP that Bubble!” are puffy 3D jelly lettering like the ads; body text and UI stay in a calm serif and sans",
            },
            why: {
              ko: "광고의 밝은 톤은 가져오되, 모든 요소가 화려하면 과해지고 제품이 안 보이기 때문",
              en: "To keep the ads’ bright tone without everything shouting, which would bury the product",
            },
          },
          {
            term: { ko: "라벤더 배경 + 버블검 핑크", en: "Lavender background + bubblegum pink" },
            text: { ko: "배경은 연한 라벤더, 포인트와 버튼은 핑크", en: "A soft lavender background, pink for accents and buttons" },
            why: {
              ko: "라벤더는 핑크와 잘 어울리면서 튀지 않아서, 글로스 컬러가 주인공이 됨",
              en: "Lavender goes well with pink without drawing attention, so the gloss colours stay the hero",
            },
          },
          {
            term: { ko: "버블 모양 컬러 스와치", en: "Bubble-shaped shade swatches" },
            text: { ko: "색을 고르면 제품 사진이 바로 바뀜", en: "Picking a shade swaps the product photo" },
            why: { ko: "여러 색을 바로 비교할 수 있게, 그리고 스와치까지 버블 콘셉트를 이어가기 위해", en: "To compare shades at a glance, and to carry the bubble idea into the swatches" },
          },
          {
            term: { ko: "캠페인 → 제품 → 장바구니", en: "Campaign → product → cart" },
            text: { ko: "캠페인 페이지 안에서 바로 색을 고르고 담을 수 있음", en: "You can pick a shade and add it to the cart right on the campaign page" },
            why: { ko: "캠페인 사이트라도 관심이 바로 구매로 이어지도록", en: "So interest turns into a purchase without leaving the campaign" },
          },
        ],
      },
      {
        title: { ko: "가장 어려웠던 점", en: "The hardest part" },
        text: {
          ko: "과하지 않게 만드는 것. 버블, 레터링, 반짝임을 하나씩 더할 때마다 광고처럼 즐겁지만 쇼핑하기 불편해지지 않는지 계속 확인했습니다.",
          en: "Not overdoing it. Each time I added a bubble, lettering or shine, I checked that it stayed fun like the ads but still easy to shop.",
        },
      },
      {
        title: { ko: "AI 활용", en: "Using AI" },
        items: [
          {
            term: "Claude",
            text: {
              ko: "Three.js 3D 버블 애니메이션 코드 작성. 원하는 분위기가 나올 때까지 디자인 방향과 수정 사항을 직접 디렉팅",
              en: "Wrote the Three.js bubble animation code; I directed the design and every revision until the mood was right",
            },
          },
          {
            term: "Weavy",
            text: {
              ko: "캠페인 사진에서 버블과 텍스트를 제거해 깨끗한 배경 이미지 제작",
              en: "Removed the bubbles and text from the campaign photo to make a clean background",
            },
          },
          {
            term: { ko: "3D 레터링", en: "3D lettering" },
            text: {
              ko: "타이틀 글자를 Weavy로 생성: 핑크 풍선이나 젤리처럼 통통하고 반짝이는 질감",
              en: "Title lettering generated with Weavy: puffy, glossy, like pink balloons or jelly",
            },
          },
        ],
      },
    ],
  },
  celine27: {
    title: "CELINE",
    titleEn: "Printemps 2027",
    period: "2026.11",
    role: { ko: "컨셉 기획 · 웹디자인 · 퍼블리싱", en: "Concept · Web design · Publishing" },
    tools: ["Figma", "HTML", "CSS", "Bootstrap 5", "JavaScript"],
    story: [
      {
        title: { ko: "컨셉", en: "Concept" },
        text: {
          ko: "CELINE의 새 컬렉션을 소개하는 캠페인 랜딩 페이지입니다. 쇼핑몰이 아닌, 한 시즌 컬렉션의 분위기와 이야기를 전하는 사이트로, 패션 매거진을 넘겨보는 듯한 에디토리얼 경험을 목표로 했습니다.",
          en: "A campaign landing page for CELINE’s new collection. Not a shop but a site that carries the mood and story of one season, aiming for the editorial feel of leafing through a fashion magazine.",
        },
      },
      {
        title: { ko: "디자인 포인트", en: "Design points" },
        items: [
          {
            term: { ko: "에디토리얼 레이아웃", en: "Editorial layout" },
            text: {
              ko: "비대칭 그리드와 넓은 여백으로 룩북처럼 사진 한 장 한 장에 집중",
              en: "An asymmetric grid and generous white space keep the focus on each photo, like a lookbook",
            },
          },
          {
            term: { ko: "타이포그래피", en: "Typography" },
            text: {
              ko: "세리프 헤드라인 + 이탤릭 포인트(“The Art of Being Elsewhere”)로 감성을 살리고, 모노스페이스 서체로 캡션과 내비게이션을 정리",
              en: "Serif headlines with an italic accent (“The Art of Being Elsewhere”) set the mood; a monospace face keeps captions and navigation tidy",
            },
            why: { ko: "가느다란 세리프가 고급스러워 보여서, 럭셔리 브랜드의 톤과 맞음", en: "A fine serif looks expensive and matches a luxury brand’s tone" },
          },
          {
            term: { ko: "컬러", en: "Colour" },
            text: { ko: "순수 흰색 대신 아이보리 배경으로 따뜻하고 차분한 톤", en: "Ivory instead of pure white for a warm, calm tone" },
            why: {
              ko: "베이지 톤 배경이 흑백 사진은 따뜻하게, 컬러 사진은 더 선명하게 돋보이게 해서",
              en: "A beige-toned background warms the black-and-white photos and makes the colour shots stand out",
            },
          },
          {
            term: { ko: "미니멀 헤더", en: "Minimal header" },
            text: { ko: "시즌명 · 로고 · 메뉴만 남겨 콘텐츠에 시선 집중", en: "Only the season, the logo and the menu, so eyes stay on the content" },
          },
          {
            term: { ko: "룩 캡션", en: "Look captions" },
            text: {
              ko: "“LOOK 07 — LAKESIDE”처럼 번호와 장소를 붙여 컬렉션 스토리를 이어감",
              en: "Numbers and places, like “LOOK 07 — LAKESIDE”, carry the collection’s story from look to look",
            },
          },
          {
            term: { ko: "사진", en: "Photography" },
            text: {
              ko: "필름 그레인 흑백 사진에 컬러 컷을 섞어 리듬감 부여",
              en: "Film-grain black-and-white photos mixed with colour shots for rhythm",
            },
            why: {
              ko: "이번 컬렉션 캠페인 사진이 흑백 위주이면서 컬러 컷도 많아서, 그 대비를 그대로 살림",
              en: "The collection’s campaign photos are mostly black and white with many colour shots, so I kept that contrast",
            },
          },
        ],
      },
      {
        title: { ko: "집중한 점", en: "What I focused on" },
        text: {
          ko: "콘텐츠(사진 · 영상 · 문구)는 이미 준비되어 있었기 때문에, 그것을 아름답게 편집하는 데 집중했습니다. 사진의 순서와 크기, 여백으로 잡지 같은 리듬을 만드는 것이 핵심이었습니다.",
          en: "The content (photos, films, copy) already existed, so the work was editing it beautifully. The key was building a magazine-like rhythm through the order and size of photos and the white space.",
        },
      },
      {
        title: { ko: "웹사이트", en: "Website" },
        items: [
          { text: { ko: "히어로 · 룩북 10룩 · 캠페인 필름 · 크레딧 구성", en: "Hero, a 10-look lookbook, campaign films and credits" } },
          { text: { ko: "반응형 (PC · 태블릿 · 모바일)", en: "Responsive (PC · tablet · mobile)" } },
        ],
      },
    ],
  },
  siyazu: {
    title: "SIYAZU",
    titleEn: { ko: "웹사이트 리디자인", en: "Website redesign" },
    period: "2026.11",
    role: { ko: "UX/UI 디자인 · 퍼블리싱", en: "UX/UI design · Publishing" },
    tools: ["Figma", "HTML", "CSS", "JavaScript", "Bootstrap 5"],
    credits: [{ label: { ko: "원본 사이트", en: "Original site" }, value: "siyazu.co.kr", href: "https://m.siyazu.co.kr/" }],
    story: [
      {
        title: { ko: "컨셉", en: "Concept" },
        text: {
          ko: "SIYAZU라는 이름은 프랑스어 ‘sillage(잔향)’에서 왔고, ‘옷이 지나간 뒤에도 남는 분위기’는 브랜드가 원래 가진 콘셉트입니다. 저는 이 콘셉트가 사이트에서도 느껴지도록, 영상과 여백 중심의 에디토리얼 쇼핑몰로 재구성했습니다.",
          en: "The name SIYAZU comes from the French “sillage”, the trail a scent leaves behind, and “the mood that lingers after the clothes pass by” is the brand’s own concept. I rebuilt the store so the site carries that concept too: an editorial shop led by film and white space.",
        },
      },
      {
        title: { ko: "이 프로젝트를 고른 이유", en: "Why this project" },
        text: {
          ko: "인기 있는 패션 브랜드의 쇼핑몰 리디자인을 보여주고 싶었습니다. SIYAZU는 주로 플랫폼에서 판매되는 꽤 인기 있는 브랜드인데, 자사몰은 충분히 다듬어지지 않았고 PC보다 모바일 위주로 만들어져 있었습니다.",
          en: "I wanted to show a redesign of a popular fashion store. SIYAZU sells mostly through big platforms and is fairly popular, but its own store felt unfinished and was built mainly for phones rather than desktop.",
        },
      },
      {
        title: { ko: "기존 사이트의 과제", en: "Problems with the old site" },
        items: [
          {
            text: {
              ko: "아이콘 위주 헤더와 영문·국문 혼용으로 메뉴 구조가 한눈에 들어오지 않음",
              en: "An icon-heavy header and mixed English/Korean labels made the menu hard to read at a glance",
            },
          },
          {
            text: {
              ko: "‘○○명이 주문 중’ 같은 팝업이 미니멀한 브랜드 무드와 충돌",
              en: "Pop-ups like “○○ people are ordering” clashed with the minimal brand mood",
            },
          },
          {
            text: {
              ko: "상품명에 품번·배송 공지가 섞여 정보가 복잡하고, 레이아웃의 여백이 비효율적으로 쓰임",
              en: "Product names mixed in item codes and shipping notices, and the layout used white space poorly",
            },
          },
          {
            text: {
              ko: "모바일 위주로 만들어져 PC에서는 쇼핑하기 불편함",
              en: "Built mainly for phones, so shopping on desktop was awkward",
            },
          },
        ],
      },
      {
        title: { ko: "리디자인 포인트", en: "Redesign points" },
        items: [
          {
            term: { ko: "메인 비주얼", en: "Main visual" },
            text: {
              ko: "로고 ‘SIYAZU’ 글자 안에 캠페인 영상이 흐르는 텍스트 마스크로 첫 화면부터 브랜드를 각인",
              en: "A text mask with the campaign film running inside the “SIYAZU” letters stamps the brand from the first screen",
            },
            why: {
              ko: "글자 사이로 들여다보다가 스크롤하면 그 안으로 들어가, 브랜드의 세계에 들어서는 느낌을 주고 싶어서",
              en: "You first peek through the letters, then scroll into them, like stepping into the brand’s world",
            },
          },
          {
            term: { ko: "한국어 전용 내비게이션", en: "Korean-only navigation" },
            text: { ko: "신상품 · 쇼핑 · 브랜드 · 저널로 단순화", en: "Simplified to New · Shop · Brand · Journal" },
            why: { ko: "영문 · 국문이 섞여 있던 메뉴를 한국어로 통일해 한눈에 들어오도록", en: "The mixed English/Korean menu, unified in Korean so it reads at a glance" },
          },
          {
            term: { ko: "컬렉션 페이지", en: "Collection page" },
            text: {
              ko: "‘26 윈터’ 같은 큰 타이틀, 카테고리·컬러·사이즈·소재 필터, 번호(01)와 컬러칩이 있는 정돈된 상품 카드",
              en: "Big titles like “26 Winter”, category / colour / size / material filters, and tidy product cards with a number (01) and colour chips",
            },
          },
          {
            term: { ko: "에디토리얼 섹션", en: "Editorial section" },
            text: {
              ko: "비대칭 배치의 화보와 대형 세리프 타이포(‘ZU’)로 매거진 같은 리듬",
              en: "Asymmetric photo layouts and oversized serif type (“ZU”) give it a magazine rhythm",
            },
          },
          {
            term: { ko: "컬러 & 타이포", en: "Colour & type" },
            text: {
              ko: "아이보리 배경, 세리프 로고 + 깔끔한 산세리프 본문으로 차분하고 고급스러운 톤",
              en: "An ivory background, a serif logo and clean sans-serif body text for a calm, refined tone",
            },
            why: { ko: "팝업처럼 시선을 빼앗는 요소를 없애고, 브랜드의 미니멀한 무드를 살리기 위해", en: "To drop attention-grabbing elements like the pop-ups and keep the brand’s minimal mood" },
          },
        ],
      },
      {
        title: { ko: "집중한 점", en: "What I focused on" },
        text: {
          ko: "브랜드다운 미니멀함과 아름다움을 지키면서도, 가장 중요한 건 편하게 쇼핑할 수 있는 사이트로 만드는 것이었습니다. 기존 사이트는 구매 과정이 불편해 보여서, 필터 · 퀵뷰 · 장바구니까지 흐름을 단순하게 정리했습니다.",
          en: "Keeping the brand’s minimal beauty, but above all making it comfortable to shop. Buying on the old site looked awkward, so I simplified the flow from filters to quick view to the bag.",
        },
      },
    ],
  },
  hanmi: {
    title: "한미반도체",
    titleEn: { ko: "웹사이트 리디자인", en: "Website redesign" },
    period: "2026.11",
    role: { ko: "UX/UI 디자인 · 캐릭터 기획 · 퍼블리싱", en: "UX/UI design · Character concept · Publishing" },
    tools: ["Figma", "Figma AI (이미지 생성)", "HTML", "CSS", "JavaScript"],
    story: [
      {
        title: { ko: "컨셉", en: "Concept" },
        text: {
          ko: "HBM 본딩 장비 세계 1위 기술력을 가진 기업답게, 첨단 기술 기업의 신뢰감과 마케팅 임팩트를 함께 전달하는 B2B 사이트를 목표로 했습니다.",
          en: "For the world’s No. 1 maker of HBM bonding equipment, the goal was a B2B site that delivers both the trust of a high-tech company and real marketing impact.",
        },
      },
      {
        title: { ko: "이 프로젝트를 고른 이유", en: "Why this project" },
        text: {
          ko: "화려한 브랜드 사이트뿐 아니라 정보가 많은 B2B 기업 사이트도 설계할 수 있다는 걸 보여주고 싶었습니다. 기술력은 세계 1위인데 사이트는 오래되고 현대적이지 않아 보여서, 리디자인할 이유가 분명했습니다.",
          en: "I wanted to show I can design an information-heavy B2B corporate site, not only flashy brand sites. The company leads the world in its field, but its site looked old and dated, so the reason to redesign was clear.",
        },
      },
      {
        title: { ko: "기존 사이트의 과제", en: "Problems with the old site" },
        items: [
          { text: { ko: "메뉴 8개와 아이콘이 나열되어 정보 구조가 복잡함", en: "Eight menus plus a row of icons made the structure confusing" } },
          {
            text: {
              ko: "메인 영상이 화면 중앙에 작게 배치되어 첫인상의 임팩트가 약함",
              en: "The main video sat small in the middle of the screen, so the first impression was weak",
            },
          },
          {
            text: {
              ko: "제품 페이지는 긴 사이드 메뉴에서 모델을 하나씩 찾아야 해 비교와 탐색이 불편함",
              en: "On product pages you had to dig through a long side menu model by model, which made comparing hard",
            },
          },
        ],
      },
      {
        title: { ko: "리디자인 포인트", en: "Redesign points" },
        items: [
          {
            term: { ko: "딥 네이비 & 블루 톤", en: "Deep navy & blue" },
            text: { ko: "반도체·첨단 기술 이미지를 강조하고 브랜드 컬러와 연결", en: "Stresses the semiconductor, high-tech image and ties into the brand colour" },
          },
          {
            term: { ko: "메뉴 단순화", en: "Simpler menu" },
            text: {
              ko: "브랜드소개 · 제품라인업 · 투자정보 · ESG · 인재채용 5개로 정리, KOR/ENG 전환",
              en: "Cut to five (About · Products · IR · ESG · Careers), with a KOR/ENG switch",
            },
            why: {
              ko: "8개 메뉴는 한눈에 들어오지 않았고, 고객 · 투자자 · 지원자가 가장 많이 찾는 정보에 집중하기 위해. 범위도 이 5개 섹션, 15페이지로 정함",
              en: "Eight menus were hard to scan; I focused on what customers, investors and applicants look for most, and set the scope to these five sections, 15 pages",
            },
          },
          {
            term: { ko: "풀스크린 메인 슬라이더", en: "Full-screen hero slider" },
            text: {
              ko: "진행 바가 있는 탭(HBM TC BONDER, micro SAW 등)으로 핵심 사업을 한눈에 보여주고, 일시정지 기능 제공",
              en: "Tabs with progress bars (HBM TC BONDER, micro SAW…) show the core business at a glance, with a pause button",
            },
          },
          {
            term: { ko: "솔루션 섹션", en: "Solutions section" },
            text: {
              ko: "HBM 본딩 · 어드밴스드 패키징 · 후공정 자동화 3가지 사업 영역을 카드로 구성해 고객이 필요한 솔루션을 바로 찾도록 설계",
              en: "Three business areas (HBM bonding, advanced packaging, back-end automation) as cards, so customers find their solution right away",
            },
          },
          {
            term: { ko: "제품라인업 페이지", en: "Product line-up page" },
            text: {
              ko: "카테고리 탭 + 카드 그리드, 모델 수 표시로 전체 라인업을 빠르게 비교·탐색",
              en: "Category tabs, a card grid and model counts make the whole line-up quick to compare and browse",
            },
          },
          {
            term: { ko: "이미지", en: "Imagery" },
            text: { ko: "Figma AI로 제작한 하이테크 비주얼로 통일감 있는 무드 연출", en: "High-tech visuals made with Figma AI keep the mood consistent" },
            why: {
              ko: "기존 사이트에는 제품 사진 외에 쓸 수 있는 이미지가 거의 없어서, 필요한 장면만 최소한으로 생성해 톤을 맞춤",
              en: "The old site had almost no images besides product shots, so I generated only the scenes I needed, keeping one tone",
            },
          },
        ],
      },
      {
        title: { ko: "AI A/S 센터 캐릭터", en: "AI A/S centre character" },
        text: {
          ko: "한미반도체는 24시간 365일 상담과 기술 지원을 강조합니다. 딱딱하게 느껴질 수 있는 이 서비스를 친근하게 전달하기 위해, 기존의 로봇 캐릭터 대신 더 현대적인 A/S 엔지니어 캐릭터를 새로 기획했습니다.",
          en: "Hanmi stresses 24/7 consulting and technical support. To make that service feel friendlier, I replaced their old robot character with a more modern A/S engineer.",
        },
      },
      {
        title: { ko: "가장 어려웠던 점", en: "The hardest part" },
        text: {
          ko: "콘텐츠가 거의 없는 상태에서 콘텐츠를 만드는 것. 제품 사진 외에는 자료가 없어서 페이지 구성과 문구를 직접 기획하고, 의미 없는 AI 생성은 최소한으로 줄였습니다.",
          en: "Making content out of almost nothing. Apart from product photos there was no material, so I planned the pages and copy myself and kept meaningless AI generation to a minimum.",
        },
      },
    ],
  },
  fairy: {
    title: "별빛 동화",
    titleEn: "Fairy Tale",
    period: "2026.11",
    role: { ko: "기획 · 웹디자인 · 퍼블리싱 · 인터랙션 개발", en: "Planning · Web design · Publishing · Interaction development" },
    tools: ["HTML", "CSS", "JavaScript", "GSAP", "ScrollTrigger", "Lenis"],
    credits: [{ label: { ko: "일러스트", en: "Illustrations" }, value: "kittykeks", href: "https://www.behance.net/kittykeks" }],
    story: [
      {
        title: { ko: "컨셉", en: "Concept" },
        text: {
          ko: "한 편의 동화책을 넘기듯, 스크롤을 내리며 이야기 속으로 들어가는 경험을 목표로 했습니다. 작가의 일러스트에 움직임을 더해 정적인 그림이 살아 있는 장면처럼 느껴지도록 구성했습니다.",
          en: "Like turning the pages of a picture book, scrolling takes you into the story. Motion added to the illustrator’s artwork makes still pictures feel like living scenes.",
        },
      },
      {
        title: { ko: "프로젝트의 시작", en: "How it started" },
        text: {
          ko: "처음에는 GSAP ScrollTrigger를 연습하기 위한 프로젝트였습니다. 스크롤 애니메이션을 일러스트와 스토리텔링으로 보여주면 더 아름다울 것 같아서 동화 형식으로 만들었고, 제가 GSAP을 처음 쓴 프로젝트입니다.",
          en: "It started as practice for GSAP ScrollTrigger. I thought scroll animation would look most beautiful told as a story with illustrations, so I made it a fairy tale. It was my first GSAP project.",
        },
      },
      {
        title: { ko: "스토리텔링 & 인터랙션", en: "Storytelling & interaction" },
        items: [
          {
            term: { ko: "스크롤 기반 연출", en: "Scroll-driven scenes" },
            text: {
              ko: "GSAP으로 스크롤 흐름에 맞춰 장면이 차례로 등장하며 이야기가 전개, 네 개의 챕터로 구성",
              en: "With GSAP, scenes appear in turn as you scroll and the story unfolds across four chapters",
            },
          },
          {
            term: { ko: "챕터마다 바뀌는 색", en: "Colour changes per chapter" },
            text: {
              ko: "배경 · 글자 · 포인트 색과 별빛의 밝기가 챕터에 맞춰 천천히 바뀌며 분위기를 이어감",
              en: "Background, text and accent colours, and even how bright the stars are, shift slowly with each chapter",
            },
            why: {
              ko: "일러스트마다 분위기가 달라서 그 그림에 맞췄고, 이야기가 진행될수록 어두운 밤에서 밝은 색으로 바뀌도록",
              en: "Each illustration has its own mood, so the colours follow the picture, moving from dark night to light as the story goes on",
            },
          },
          {
            term: { ko: "텍스트 모션", en: "Text motion" },
            text: {
              ko: "챕터 제목은 잉크가 번지듯 읽는 순서대로 한 글자씩, 본문은 단어 단위로 나타나며 읽는 리듬을 조절",
              en: "Chapter titles appear letter by letter in reading order, like ink settling; body text appears word by word to pace the reading",
            },
          },
          {
            term: { ko: "장면 전환", en: "Scene transitions" },
            text: {
              ko: "원형으로 열리는 그림, 작은 원이 화면 전체로 열리는 ‘포털’, 가로 스크롤 챕터로 챕터 사이를 연결",
              en: "Pictures that open in a circle, a “portal” where a tiny circle opens to the full screen, and a horizontally scrolling chapter",
            },
            why: {
              ko: "2장은 그림이 옆으로 이어지는 장면이라 가로 스크롤로 넘기는 게 자연스러워서",
              en: "Chapter II’s pictures run sideways as one scene, so turning them horizontally felt natural",
            },
          },
          {
            term: { ko: "패럴랙스", en: "Parallax" },
            text: {
              ko: "아치형 그림 프레임이 마우스를 따라 움직이고, 콜라주 이미지는 스크롤에 따라 깊이감 있게 이동",
              en: "Arched picture frames follow the mouse; collage images move at different depths as you scroll",
            },
          },
        ],
      },
      {
        title: { ko: "비주얼", en: "Visuals" },
        items: [
          {
            text: {
              ko: "동화적인 감성을 살린 한글 서체(송명 · 고운바탕 · 고운돋움)로 전체 사이트를 한국어로 구성",
              en: "The whole site is in Korean, set in storybook-like Hangul faces (Song Myung, Gowun Batang, Gowun Dodum)",
            },
            why: { ko: "사이트 전체가 제가 들려주는 이야기라서, 책을 읽는 느낌의 서체를 골랐음", en: "The whole site is a story I’m telling, so I chose faces that feel like reading a book" },
          },
          {
            text: {
              ko: "일러스트의 색감과 분위기를 해치지 않도록 UI 요소를 최소화",
              en: "UI kept to a minimum so it never fights the illustrations’ colour and mood",
            },
          },
        ],
      },
      {
        title: { ko: "처음 버전과 리뉴얼", en: "First version and the refresh" },
        items: [
          {
            term: { ko: "처음 버전: 직접 작업", en: "First version: all mine" },
            text: {
              ko: "기획, 레이아웃, 코딩 전부 직접. GSAP ScrollTrigger로 가로 스크롤(pin · scrub)과 containerAnimation을 사용한 이미지 효과, Lenis 부드러운 스크롤",
              en: "Planning, layout and code all by me: a horizontal scroll with GSAP ScrollTrigger (pin, scrub), image effects with containerAnimation, Lenis smooth scrolling",
            },
          },
          {
            term: { ko: "리뉴얼: AI와 함께", en: "Refresh: with AI" },
            text: {
              ko: "서체, 별이 빛나는 마법 같은 배경, 별가루 커서, 둥근 프레임 같은 그림 연출 등 꾸밈 요소는 AI와 함께 더함",
              en: "Fonts, the magical starry background, the star-dust cursor, rounded picture frames and other finishing touches were added with AI",
            },
          },
        ],
      },
    ],
  },
  cube: {
    title: "Cube Clinic",
    titleEn: { ko: "큐브성형외과 · 가상 브랜드 웹사이트", en: "Cube Plastic Surgery · fictional clinic website" },
    period: { ko: "3일", en: "3 days" },
    role: { ko: "웹디자인 · 퍼블리싱", en: "Web design · Publishing" },
    tools: ["HTML", "CSS", "JavaScript", "Weavy"],
    credits: [{ label: { ko: "참고한 병원 사이트", en: "Reference clinic site" }, value: "https://www.cubeps.com/", href: "https://www.cubeps.com/" }],
    story: [
      {
        title: { ko: "컨셉", en: "Concept" },
        text: {
          ko: "가상의 성형외과 웹사이트입니다. 구직 중에 성형외과 웹디자인 채용이 특히 많아서, 이 분야에서 실제로 필요한 사이트를 만들어 보고 싶었습니다. 실제 병원 사이트의 구조를 참고했고, 사진은 모두 AI로 새로 만들었습니다.",
          en: "A website for a fictional plastic surgery clinic. While job hunting I saw many web design openings at clinics, so I wanted to build the kind of site that field actually needs. The structure follows a real clinic site; every photo was remade with AI.",
        },
      },
      {
        title: { ko: "집중한 점", en: "What I focused on" },
        text: {
          ko: "편하고 예쁜 사이트, 그리고 무엇보다 방문자가 바로 무엇을 할 수 있는지 보이게 하는 것. 상담 예약과 전화 상담을 어디서든 바로 할 수 있게 배치했습니다.",
          en: "A comfortable, good-looking site where visitors see right away what they can do. Booking a consultation or calling is always one step away.",
        },
      },
    ],
  },
};
