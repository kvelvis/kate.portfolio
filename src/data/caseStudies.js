// Project panel content, keyed by work.js → caseStudy. Text: a string or { ko, en }.

export const caseStudies = {
  dano: {
    title: "Dano 단어",
    titleEn: { ko: "알림으로 배우는 한국어 단어 앱", en: "Learn Korean words from your notifications", ru: "Учите корейские слова по уведомлениям" },
    period: "2026.11",
    tools: ["Figma", "Weavy"],
    fontCss: ["https://fonts.googleapis.com/css2?family=Gothic+A1:wght@400;700;800&display=swap"],
    story: [
      {
        title: { ko: "컨셉", en: "Concept", ru: "Концепция" },
        text: {
          ko: "단어 공부를 위해 따로 시간을 내지 않아도, 잠금화면 알림으로 단어와 뜻이 자연스럽게 눈에 들어오도록 만든 앱입니다. 방해되지 않는 알림으로 일상 속에서 반복 학습을 돕습니다.",
          en: "You don’t have to set time aside to study: words and their meanings simply show up in your lock-screen notifications. Gentle, non-intrusive notifications build repetition into everyday life.",
          ru: "Не нужно специально выделять время на учёбу: слова и их значения сами появляются в уведомлениях на экране блокировки. Мягкие, ненавязчивые уведомления встраивают повторение в обычный день.",
        },
      },
      {
        title: { ko: "만든 이유", en: "Why I made it", ru: "Зачем я это сделала" },
        text: {
          ko: "저도 계속 한국어를 공부하고 있고, 시험 전에는 특정 단어들을 반복해서 외우고 싶을 때가 많았습니다. 따로 시간을 내지 않아도 그 단어들이 자연스럽게 눈에 들어오는 앱이 있었으면 해서 직접 기획했습니다.",
          en: "I’m still studying Korean myself, and before exams I often wanted to drill a specific set of words. I wanted an app that puts those words in front of me without setting time aside, so I designed one.",
          ru: "Я сама продолжаю учить корейский, и перед экзаменами мне часто хотелось повторять определённый набор слов. Хотелось приложение, которое само показывает эти слова, без отдельного времени на учёбу, — и я его спроектировала.",
        },
      },
      {
        title: { ko: "주요 기능", en: "Key features", ru: "Основные функции" },
        items: [
          {
            term: { ko: "알림 학습", en: "Learning by notification", ru: "Учёба через уведомления" },
            text: {
              ko: "단어 + 번역이 잠금화면 알림으로 도착해 앱을 열지 않아도 학습 가능",
              en: "A word and its translation arrive on the lock screen, so you learn without opening the app",
              ru: "Слово и перевод приходят на экран блокировки — учиться можно, не открывая приложение",
            },
          },
          {
            term: { ko: "맞춤 설정", en: "Your own schedule", ru: "Своё расписание" },
            text: { ko: "주제, 알림 빈도, 요일·시간대를 직접 설정", en: "Choose topics, how often, and which days and hours", ru: "Сами выбираете темы, частоту, дни и часы" },
          },
          {
            term: { ko: "단어 팩", en: "Word packs", ru: "Наборы слов" },
            text: { ko: "시험 전 교재 단어 등 미리 구성된 단어 팩 제공", en: "Ready-made packs, such as textbook words before an exam", ru: "Готовые наборы, например слова из учебника перед экзаменом" },
          },
          {
            term: { ko: "시험 모드", en: "Exam mode", ru: "Режим экзамена" },
            text: { ko: "TOPIK 등 시험 날짜까지 D-day와 학습 진행률 표시", en: "A D-day countdown to TOPIK or another exam, with study progress", ru: "Обратный отсчёт до TOPIK или другого экзамена и прогресс учёбы" },
          },
        ],
      },
      {
        title: { ko: "디자인 포인트", en: "Design points", ru: "Дизайн-решения" },
        items: [
          {
            term: { ko: "단어 카드", en: "Word card", ru: "Карточка слова" },
            text: {
              ko: "한글 단어, 로마자 발음, 영어 뜻, 예문을 한 카드에 담고 발음 듣기 버튼 제공",
              en: "The Korean word, romanisation, English meaning and an example on one card, with a listen button",
              ru: "Корейское слово, латинская транскрипция, значение по-английски и пример на одной карточке, плюс кнопка прослушивания",
            },
          },
          {
            term: { ko: "마스코트", en: "Mascot", ru: "Маскот" },
            text: {
              ko: "빨간 털실을 가진 검은 고양이를 AI로 3D 바이닐 토이 스타일로 제작. 주제별 장면(예: 약국 주제에서는 알약을 든 고양이)으로 학습에 재미를 더함",
              en: "A black cat with a red ball of yarn, made with AI in a 3D vinyl-toy style. Topic scenes (e.g. holding a pill for “pharmacy”) make studying more fun",
              ru: "Чёрный кот с красным клубком, сделанный с помощью ИИ в стиле 3D-виниловой игрушки. Сцены по темам (например, с таблеткой для темы «аптека») делают учёбу веселее",
            },
            why: {
              ko: "러시아 동화에 나오는 ‘학자 고양이’에서 가져온 캐릭터. 부엉이는 다른 학습 앱과 비슷해 보여서 피했고, 빨간 털실은 실타래를 풀듯 언어의 단어를 하나씩 풀어 간다는 의미",
              en: "Based on the “learned cat” from Russian fairy tales. I avoided an owl because it would look like other learning apps; the red yarn stands for unwinding a language word by word",
              ru: "Образ — «кот учёный» из русских сказок. Сову я не взяла, чтобы не быть похожей на другие приложения для учёбы; красный клубок — это язык, который разматываешь слово за словом",
            },
          },
        
          {
            term: { ko: "영문 UI", en: "English UI", ru: "Интерфейс на английском" },
            text: { ko: "한국어를 배우는 외국인 학습자를 위한 영어 인터페이스", en: "An English interface for foreigners learning Korean", ru: "Английский интерфейс для иностранцев, которые учат корейский" },
          },
        ],
      },
      {
        title: { ko: "디자인 과정", en: "Design process", ru: "Процесс" },
        text: {
          ko: "초기 미니멀 버전은 템플릿처럼 단조롭게 느껴져, 그라데이션과 3D 마스코트 장면을 더한 방향으로 전면 리디자인했습니다.",
          en: "The first minimal version felt flat, like a template, so I redesigned it completely, adding gradients and 3D mascot scenes.",
          ru: "Первая минималистичная версия выглядела плоско, как шаблон, поэтому я полностью её переделала: добавила градиенты и 3D-сцены с маскотом.",
        },
      },
    ],
    links: { figma: "https://www.figma.com/design/ziA3DZKe7lxjrnYEWaA6Yj/Dano_App_project?node-id=0-1" },
  },
  gatto: {
    title: "묘한 커피",
    titleEn: "Myohan Coffee",
    period: "2026.11",
    tools: ["Figma", "Illustrator", "Weavy", "Kling", "HTML · CSS · JS", "GSAP", "Lenis"],
    story: [
      {
        title: { ko: "아이디어의 출발", en: "Where the idea came from", ru: "Откуда идея" },
        text: {
          ko: "해외에서 본 ‘고양이가 주인공인 카페’에서 영감을 받았습니다. 여기에 카페에서 고양이를 직접 입양할 수 있다는 아이디어를 더해 오리지널 브랜드로 만들었습니다.",
          en: "It was inspired by cafés I saw abroad where a cat is the star. I added my own idea, adopting a cat right at the café, and built it into an original brand.",
          ru: "Вдохновили кафе за границей, где главный герой — кот. Я добавила свою идею — взять кота из приюта прямо в кафе — и превратила это в оригинальный бренд.",
        },
      },
      {
        title: { ko: "네이밍", en: "Naming", ru: "Нейминг" },
        text: {
          ko: "묘(猫) = 고양이, 묘하다 = 신비롭다. 한 단어에 카페의 주제와 분위기를 함께 담았습니다.",
          en: "In Korean, 묘 (猫) means “cat” and 묘하다 means “mysterious”. One word carries both the café’s subject and its mood.",
          ru: "По-корейски 묘 (猫) — «кот», а 묘하다 — «загадочный». В одном слове и тема кафе, и его настроение.",
        },
      },
      {
        title: { ko: "마스코트 ‘콩이’", en: "Mascot “Kongi”", ru: "Маскот «Конги»" },
        items: [
          {
            term: { ko: "별 모양 눈동자", en: "Star-shaped pupils", ru: "Зрачки-звёзды" },
            text: { ko: "브랜드의 ‘묘한’ 분위기를 보여주는 시그니처", en: "The signature that shows the brand’s “mysterious” side", ru: "Фирменная деталь, которая показывает «загадочную» сторону бренда" },
          },
          {
            term: { ko: "물린 귀", en: "Bitten ear", ru: "Надкусанное ухо" },
            text: {
              ko: "길 위에서 살아온 흔적. 입양을 기다리는 고양이들처럼 사연이 있는 캐릭터",
              en: "A mark of life on the street. A character with a story, like the cats waiting for a home",
              ru: "След уличной жизни. Персонаж со своей историей — как коты, которые ждут дом",
            },
          },
          {
            term: { ko: "후드티 + 팝아트 스티커 스타일", en: "Hoodie + pop-art sticker style", ru: "Худи и стиль поп-арт стикеров" },
            text: {
              ko: "스트릿 감성으로 MZ세대를 공략하고, 굿즈에도 활용하기 좋은 형태",
              en: "Street style that speaks to Gen Z, and a shape that works well on merch",
              ru: "Уличный стиль, понятный зумерам, и форма, которая хорошо смотрится на мерче",
            },
          },
        ],
      },
      {
        title: { ko: "가장 어려웠던 점", en: "The hardest part", ru: "Самое сложное" },
        text: {
          ko: "중요한 것에 집중시키는 것. 입양과 굿즈를 강조하면서도, 결국 이곳은 수익을 내야 하는 카페라서 메뉴와 방문 정보도 놓치지 않게 균형을 맞췄습니다.",
          en: "Keeping the focus on what matters. Adoption and merch come first, but this is still a café that has to make money, so the menu and visit info couldn’t get lost.",
          ru: "Удержать фокус на главном. На первом месте приют и мерч, но это всё-таки кафе, которое должно зарабатывать, поэтому меню и информация о визите не должны были потеряться.",
        },
      },
    ],
  },
  feev: {
    title: "FEEV",
    titleEn: "",
    period: "2026.11",
    tools: ["Figma", "Three.js", "Weavy", "Claude (AI)"],
    story: [
      {
        title: { ko: "출발점: 사이트와 광고의 온도 차이", en: "Starting point: the site and the ads felt different", ru: "Отправная точка: сайт и реклама ощущались по-разному" },
        text: {
          ko: "기존 사이트는 미니멀한데, 브랜드 광고는 항상 밝고 화려했습니다. 광고를 보고 들어온 사람이 같은 브랜드라고 느낄 수 있도록 광고의 에너지를 사이트로 가져오되, 과하지 않게 균형을 맞추는 것을 목표로 했습니다.",
          en: "The original site was minimal, while the brand’s ads were always bright and loud. The goal was to bring the ads’ energy into the site, so people arriving from an ad feel it’s the same brand, without overdoing it.",
          ru: "Сайт был минималистичным, а реклама бренда — всегда яркой и громкой. Задача — перенести энергию рекламы на сайт, чтобы человек, пришедший из рекламы, узнавал тот же бренд, но без перебора.",
        },
      },
      {
        title: { ko: "디자인 결정", en: "Design decisions", ru: "Дизайн-решения" },
        items: [
          {
            term: { ko: "메인 비주얼: 입술에서 부풀어 터지는 3D 버블", en: "Main visual: a 3D bubble blown from the lips that pops", ru: "Главный визуал: 3D-пузырь, который выдувают губы и который лопается" },
            text: {
              ko: "스크롤하면 버블이 커지다가 터지고, 클릭해서 먼저 터뜨릴 수도 있음",
              en: "It grows as you scroll and pops; you can also click to pop it early",
              ru: "Он растёт при прокрутке и лопается; можно лопнуть его раньше кликом",
            },
            why: {
              ko: "제품 이름(버블 글로스)과 사용감(톡 터지는 플럼핑)을 한 번에 보여주기 위해. 사진 한 장보다 직접 터뜨려 보는 경험이 더 기억에 남음",
              en: "To show the product name (bubble gloss) and how it feels (the popping, plumping effect) in one go. Popping it yourself sticks better than a photo",
              ru: "Чтобы сразу показать и название продукта (bubble gloss), и ощущение от него (эффект «лопающегося» объёма). Лопнуть самой запоминается лучше, чем фото",
            },
          },
          
          {
            term: { ko: "캠페인 → 제품 → 장바구니", en: "Campaign → product → cart", ru: "Кампания → продукт → корзина" },
            text: { ko: "캠페인 페이지 안에서 바로 색을 고르고 담을 수 있음", en: "You can pick a shade and add it to the cart right on the campaign page", ru: "Оттенок можно выбрать и положить в корзину прямо на странице кампании" },
            why: { ko: "캠페인 사이트라도 관심이 바로 구매로 이어지도록", en: "So interest turns into a purchase without leaving the campaign", ru: "Чтобы интерес превращался в покупку, не уходя со страницы кампании" },
          },
        ],
      },
      {
        title: { ko: "가장 어려웠던 점", en: "The hardest part", ru: "Самое сложное" },
        text: {
          ko: "과하지 않게 만드는 것. 버블, 레터링, 반짝임을 하나씩 더할 때마다 광고처럼 즐겁지만 쇼핑하기 불편해지지 않는지 계속 확인했습니다.",
          en: "Not overdoing it. Each time I added a bubble, lettering or shine, I checked that it stayed fun like the ads but still easy to shop.",
          ru: "Не переборщить. Каждый раз, добавляя пузырь, леттеринг или блеск, я проверяла, что сайт остаётся весёлым, как реклама, но по нему всё так же удобно делать покупки.",
        },
      },
      
    ],
  },
  celine27: {
    title: "CELINE",
    titleEn: "Printemps 2027",
    period: "2026.11",
    tools: ["Figma", "HTML", "CSS", "Bootstrap 5", "JavaScript"],
    story: [
      {
        title: { ko: "컨셉", en: "Concept", ru: "Концепция" },
        text: {
          ko: "CELINE의 새 컬렉션을 소개하는 캠페인 랜딩 페이지입니다. 쇼핑몰이 아닌, 한 시즌 컬렉션의 분위기와 이야기를 전하는 사이트로, 패션 매거진을 넘겨보는 듯한 에디토리얼 경험을 목표로 했습니다.",
          en: "A campaign landing page for CELINE’s new collection. Not a shop but a site that carries the mood and story of one season, aiming for the editorial feel of leafing through a fashion magazine.",
          ru: "Лендинг кампании новой коллекции CELINE. Не магазин, а сайт, который передаёт настроение и историю одного сезона — как будто листаешь модный журнал.",
        },
      },
      
      {
        title: { ko: "집중한 점", en: "What I focused on", ru: "На чём я сосредоточилась" },
        text: {
          ko: "콘텐츠(사진 · 영상 · 문구)는 이미 준비되어 있었기 때문에, 그것을 아름답게 편집하는 데 집중했습니다. 사진의 순서와 크기, 여백으로 잡지 같은 리듬을 만드는 것이 핵심이었습니다.",
          en: "The content (photos, films, copy) already existed, so the work was editing it beautifully. The key was building a magazine-like rhythm through the order and size of photos and the white space.",
          ru: "Контент (фото, фильмы, тексты) уже был, поэтому задача — красиво его смонтировать. Главное — журнальный ритм через порядок и размер фотографий и воздух.",
        },
      },
    ],
  },
  siyazu: {
    title: "SIYAZU",
    titleEn: { ko: "웹사이트 리디자인", en: "Website redesign", ru: "Редизайн сайта" },
    period: "2026.11",
    tools: ["Figma", "HTML", "CSS", "JavaScript", "Bootstrap 5"],
    credits: [{ label: { ko: "원본 사이트", en: "Original site", ru: "Оригинальный сайт" }, value: "siyazu.co.kr", href: "https://m.siyazu.co.kr/" }],
    story: [
      {
        title: { ko: "이 프로젝트를 고른 이유", en: "Why this project", ru: "Почему этот проект" },
        text: {
          ko: "인기 있는 패션 브랜드의 쇼핑몰 리디자인을 보여주고 싶었습니다. SIYAZU는 주로 플랫폼에서 판매되는 꽤 인기 있는 브랜드인데, 자사몰은 충분히 다듬어지지 않았고 PC보다 모바일 위주로 만들어져 있었습니다.",
          en: "I wanted to show a redesign of a popular fashion store. SIYAZU sells mostly through big platforms and is fairly popular, but its own store felt unfinished and was built mainly for phones rather than desktop.",
          ru: "Хотелось показать редизайн популярного модного магазина. SIYAZU продаёт в основном через крупные площадки и довольно известен, но собственный магазин выглядел недоделанным и был рассчитан в основном на телефоны, а не на компьютер.",
        },
      },
      {
        title: { ko: "기존 사이트의 과제", en: "Problems with the old site", ru: "Проблемы старого сайта" },
        items: [
          {
            text: {
              ko: "아이콘 위주 헤더와 영문·국문 혼용으로 메뉴 구조가 한눈에 들어오지 않음",
              en: "An icon-heavy header and mixed English/Korean labels made the menu hard to read at a glance",
              ru: "Шапка с кучей иконок и смесь английских и корейских подписей — меню трудно прочитать с первого взгляда",
            },
          },
          {
            text: {
              ko: "‘○○명이 주문 중’ 같은 팝업이 미니멀한 브랜드 무드와 충돌",
              en: "Pop-ups like “○○ people are ordering” clashed with the minimal brand mood",
              ru: "Попапы вроде «○○ человек сейчас заказывают» спорили с минималистичным настроением бренда",
            },
          },
          {
            text: {
              ko: "상품명에 품번·배송 공지가 섞여 정보가 복잡하고, 레이아웃의 여백이 비효율적으로 쓰임",
              en: "Product names mixed in item codes and shipping notices, and the layout used white space poorly",
              ru: "В названиях товаров смешивались артикулы и сообщения о доставке, а воздух в вёрстке использовался плохо",
            },
          },
          {
            text: {
              ko: "모바일 위주로 만들어져 PC에서는 쇼핑하기 불편함",
              en: "Built mainly for phones, so shopping on desktop was awkward",
              ru: "Сайт сделан в основном под телефоны, поэтому покупать с компьютера было неудобно",
            },
          },
        ],
      },
      {
        title: { ko: "리디자인 포인트", en: "Redesign points", ru: "Что изменено" },
        items: [
          {
            term: { ko: "메인 비주얼", en: "Main visual", ru: "Главный визуал" },
            text: {
              ko: "로고 ‘SIYAZU’ 글자 안에 캠페인 영상이 흐르는 텍스트 마스크로 첫 화면부터 브랜드를 각인",
              en: "A text mask with the campaign film running inside the “SIYAZU” letters stamps the brand from the first screen",
              ru: "Текстовая маска: фильм кампании идёт внутри букв «SIYAZU» и с первого экрана запечатлевает бренд",
            },
            why: {
              ko: "글자 사이로 들여다보다가 스크롤하면 그 안으로 들어가, 브랜드의 세계에 들어서는 느낌을 주고 싶었습니다",
              en: "You first peek through the letters, then scroll into them, like stepping into the brand’s world",
              ru: "Сначала подглядываешь сквозь буквы, потом прокручиваешь внутрь — будто входишь в мир бренда",
            },
          },
          {
            term: { ko: "한국어 내비게이션", en: "Korean navigation", ru: "Навигация на корейском" },
            text: { ko: "신상품 · 쇼핑 · 브랜드 · 저널로 단순화", en: "Simplified to New · Shop · Brand · Journal", ru: "Упрощена до «Новинки · Магазин · Бренд · Журнал»" },
            why: { ko: "영문 · 국문이 섞여 있던 메뉴를 한국어로 통일해 한눈에 들어오도록", en: "The mixed English/Korean menu, unified in Korean so it reads at a glance", ru: "Меню из смеси английского и корейского сведено к корейскому, чтобы читалось с первого взгляда" },
          },
        
          
        ],
      },
      {
        title: { ko: "집중한 점", en: "What I focused on", ru: "На чём я сосредоточилась" },
        text: {
          ko: "브랜드다운 미니멀함과 아름다움을 지키면서도, 가장 중요한 건 편하게 쇼핑할 수 있는 사이트로 만드는 것이었습니다. 기존 사이트는 구매 과정이 불편해 보여서, 필터 · 퀵뷰 · 장바구니까지 흐름을 단순하게 정리했습니다.",
          en: "Keeping the brand’s minimal beauty, but above all making it comfortable to shop. Buying on the old site looked awkward, so I simplified the flow from filters to quick view to the bag.",
          ru: "Сохранить минималистичную красоту бренда, но прежде всего сделать покупки удобными. На старом сайте покупать было неловко, поэтому я упростила путь от фильтров к быстрому просмотру и корзине.",
        },
      },
    ],
  },
  hanmi: {
    title: "한미반도체",
    titleEn: { ko: "웹사이트 리디자인", en: "Website redesign", ru: "Редизайн сайта" },
    period: "2026.11",
    tools: ["Figma", { ko: "Figma AI (이미지 생성)", en: "Figma AI", ru: "Figma AI" }, "HTML", "CSS", "JavaScript"],
    story: [
      {
        title: { ko: "컨셉", en: "Concept", ru: "Концепция" },
        text: {
          ko: "HBM 본딩 장비 세계 1위 기술력을 가진 기업답게, 첨단 기술 기업의 신뢰감과 마케팅 임팩트를 함께 전달하는 B2B 사이트를 목표로 했습니다.",
          en: "For the world’s No. 1 maker of HBM bonding equipment, the goal was a B2B site that delivers both the trust of a high-tech company and real marketing impact.",
          ru: "Для мирового лидера в производстве оборудования для HBM-бондинга — B2B-сайт, который передаёт и доверие к высокотехнологичной компании, и реальный маркетинговый эффект.",
        },
      },
      {
        title: { ko: "이 프로젝트를 고른 이유", en: "Why this project", ru: "Почему этот проект" },
        text: {
          ko: "화려한 브랜드 사이트뿐 아니라 정보가 많은 B2B 기업 사이트도 설계할 수 있다는 걸 보여주고 싶었습니다. 기술력은 세계 1위인데 사이트는 오래되고 현대적이지 않아 보여서, 리디자인할 이유가 분명했습니다.",
          en: "I wanted to show I can design an information-heavy B2B corporate site, not only flashy brand sites. The company leads the world in its field, but its site looked old and dated, so the reason to redesign was clear.",
          ru: "Хотелось показать, что я умею проектировать насыщенный информацией корпоративный B2B-сайт, а не только яркие бренд-сайты. Компания — мировой лидер в своей области, но сайт выглядел старым, так что причина для редизайна была очевидна.",
        },
      },
      {
        title: { ko: "기존 사이트의 과제", en: "Problems with the old site", ru: "Проблемы старого сайта" },
        items: [
          { text: { ko: "메뉴 8개와 아이콘이 나열되어 정보 구조가 복잡함", en: "Eight menus plus a row of icons made the structure confusing", ru: "Восемь пунктов меню и ряд иконок запутывали структуру" } },
          {
            text: {
              ko: "메인 영상이 화면 중앙에 작게 배치되어 첫인상의 임팩트가 약함",
              en: "The main video sat small in the middle of the screen, so the first impression was weak",
              ru: "Главное видео было маленьким в центре экрана, поэтому первое впечатление было слабым",
            },
          },
          {
            text: {
              ko: "제품 페이지는 긴 사이드 메뉴에서 모델을 하나씩 찾아야 해 비교와 탐색이 불편함",
              en: "On product pages you had to dig through a long side menu model by model, which made comparing hard",
              ru: "На страницах продуктов приходилось перебирать длинное боковое меню модель за моделью, сравнивать было трудно",
            },
          },
        ],
      },
      {
        title: { ko: "리디자인 포인트", en: "Redesign points", ru: "Что изменено" },
        items: [
          {
            term: { ko: "딥 네이비 & 블루 톤", en: "Deep navy & blue", ru: "Глубокий тёмно-синий и синий" },
            text: { ko: "반도체·첨단 기술 이미지를 강조하고 브랜드 컬러와 연결", en: "Stresses the semiconductor, high-tech image and ties into the brand colour", ru: "Подчёркивает образ полупроводников и хай-тека и связан с фирменным цветом" },
          },
          {
            term: { ko: "풀스크린 메인 슬라이더", en: "Full-screen hero slider", ru: "Полноэкранный слайдер" },
            text: {
              ko: "진행 바가 있는 탭(HBM TC BONDER, micro SAW 등)으로 핵심 사업을 한눈에 보여주고, 일시정지 기능 제공",
              en: "Tabs with progress bars (HBM TC BONDER, micro SAW…) show the core business at a glance, with a pause button",
              ru: "Вкладки с прогресс-барами (HBM TC BONDER, micro SAW…) сразу показывают основной бизнес; есть кнопка паузы",
            },
          },
          {
            term: { ko: "솔루션 섹션", en: "Solutions section", ru: "Раздел решений" },
            text: {
              ko: "HBM 본딩 · 어드밴스드 패키징 · 후공정 자동화 3가지 사업 영역을 카드로 구성해 고객이 필요한 솔루션을 바로 찾도록 설계",
              en: "Three business areas (HBM bonding, advanced packaging, back-end automation) as cards, so customers find their solution right away",
              ru: "Три направления (HBM-бондинг, передовая упаковка, автоматизация back-end) в виде карточек — клиент сразу находит своё решение",
            },
          },
          {
            term: { ko: "제품라인업 페이지", en: "Product line-up page", ru: "Страница продуктовой линейки" },
            text: {
              ko: "카테고리 탭 + 카드 그리드, 모델 수 표시로 전체 라인업을 빠르게 비교·탐색",
              en: "Category tabs, a card grid and model counts make the whole line-up quick to compare and browse",
              ru: "Вкладки категорий, сетка карточек и число моделей помогают быстро просмотреть и сравнить всю линейку",
            },
          },
          {
            term: { ko: "이미지", en: "Imagery", ru: "Изображения" },
            text: { ko: "Figma AI로 제작한 하이테크 비주얼로 통일감 있는 무드 연출", en: "High-tech visuals made with Figma AI keep the mood consistent", ru: "Хай-тек визуалы, сделанные в Figma AI, держат единое настроение" },
            why: {
              ko: "기존 사이트에는 제품 사진 외에 쓸 수 있는 이미지가 거의 없어서, 필요한 장면만 최소한으로 생성해 톤을 맞춤",
              en: "The old site had almost no images besides product shots, so I generated only the scenes I needed, keeping one tone",
              ru: "На старом сайте почти не было изображений, кроме фото продуктов, поэтому я сгенерировала только нужные сцены в едином тоне",
            },
          },
        ],
      },
      {
        title: { ko: "AI A/S 센터 캐릭터", en: "AI A/S centre character", ru: "ИИ-персонаж сервисного центра" },
        text: {
          ko: "한미반도체는 24시간 365일 상담과 기술 지원을 강조합니다. 딱딱하게 느껴질 수 있는 이 서비스를 친근하게 전달하기 위해, 기존의 로봇 캐릭터 대신 더 현대적인 A/S 엔지니어 캐릭터를 새로 기획했습니다.",
          en: "Hanmi stresses 24/7 consulting and technical support. To make that service feel friendlier, I replaced their old robot character with a more modern A/S engineer.",
          ru: "Hanmi делает акцент на круглосуточных консультациях и техподдержке. Чтобы сервис ощущался дружелюбнее, я заменила их старого робота на более современного инженера сервисной службы.",
        },
      },
      {
        title: { ko: "가장 어려웠던 점", en: "The hardest part", ru: "Самое сложное" },
        text: {
          ko: "콘텐츠가 거의 없는 상태에서 콘텐츠를 만드는 것. 제품 사진 외에는 자료가 없어서 페이지 구성과 문구를 직접 기획하고, 의미 없는 AI 생성은 최소한으로 줄였습니다.",
          en: "Making content out of almost nothing. Apart from product photos there was no material, so I planned the pages and copy myself and kept meaningless AI generation to a minimum.",
          ru: "Сделать контент почти из ничего. Кроме фото продуктов материалов не было, поэтому страницы и тексты я продумала сама, а бессмысленную ИИ-генерацию свела к минимуму.",
        },
      },
    ],
  },
  fairy: {
    title: "별빛 동화",
    titleEn: "Fairy Tale",
    period: "2026.11",
    tools: ["HTML", "CSS", "JavaScript", "GSAP", "ScrollTrigger", "Lenis"],
    credits: [{ label: { ko: "일러스트", en: "Illustrations", ru: "Иллюстрации" }, value: "kittykeks", href: "https://www.behance.net/kittykeks" }],
    story: [
      
      {
        title: { ko: "프로젝트의 시작", en: "How it started", ru: "С чего началось" },
        text: {
          ko: "처음에는 GSAP ScrollTrigger를 연습하기 위한 프로젝트였습니다. 스크롤 애니메이션을 일러스트와 스토리텔링으로 보여주면 더 아름다울 것 같아서 동화 형식으로 만들었고, 제가 GSAP을 처음 쓴 프로젝트입니다.",
          en: "It started as practice for GSAP ScrollTrigger. I thought scroll animation would look most beautiful told as a story with illustrations, so I made it a fairy tale. It was my first GSAP project.",
          ru: "Всё началось как практика GSAP ScrollTrigger. Мне показалось, что анимация при прокрутке красивее всего выглядит как история с иллюстрациями, поэтому я сделала сказку. Это мой первый проект на GSAP.",
        },
      },
      
      {
        title: { ko: "비주얼", en: "Visuals", ru: "Визуал" },
        items: [
          {
            text: {
              ko: "동화적인 감성을 살린 한글 서체(송명 · 고운바탕 · 고운돋움)로 전체 사이트를 한국어로 구성",
              en: "The whole site is in Korean, set in storybook-like Hangul faces (Song Myung, Gowun Batang, Gowun Dodum)",
              ru: "Весь сайт на корейском, набран «книжными» шрифтами хангыля (Song Myung, Gowun Batang, Gowun Dodum)",
            },
            why: { ko: "사이트 전체가 제가 들려주는 이야기라서, 책을 읽는 느낌의 서체를 골랐음", en: "The whole site is a story I’m telling, so I chose faces that feel like reading a book", ru: "Весь сайт — это история, которую я рассказываю, поэтому выбрала шрифты, с которыми будто читаешь книгу" },
          },
          {
            text: {
              ko: "일러스트의 색감과 분위기를 해치지 않도록 UI 요소를 최소화",
              en: "UI kept to a minimum so it never fights the illustrations’ colour and mood",
              ru: "Интерфейса минимум, чтобы он не спорил с цветом и настроением иллюстраций",
            },
          },
        ],
      },
      {
        title: { ko: "처음 버전과 리뉴얼", en: "First version and the refresh", ru: "Первая версия и обновление" },
        items: [
          {
            term: { ko: "처음 버전: 직접 작업", en: "First version: all mine", ru: "Первая версия: полностью моя" },
            text: {
              ko: "기획, 레이아웃, 코딩 전부 직접. GSAP ScrollTrigger로 가로 스크롤(pin · scrub)과 containerAnimation을 사용한 이미지 효과, Lenis 부드러운 스크롤",
              en: "Planning, layout and code all by me: a horizontal scroll with GSAP ScrollTrigger (pin, scrub), image effects with containerAnimation, Lenis smooth scrolling",
              ru: "Идея, вёрстка и код — всё моё: горизонтальная прокрутка на GSAP ScrollTrigger (pin, scrub), эффекты изображений через containerAnimation, плавная прокрутка Lenis",
            },
          },
          {
            term: { ko: "리뉴얼: AI와 함께", en: "Refresh: with AI", ru: "Обновление: с ИИ" },
            text: {
              ko: "서체, 별이 빛나는 마법 같은 배경, 별가루 커서, 둥근 프레임 같은 그림 연출 등 꾸밈 요소는 AI와 함께 더함",
              en: "Fonts, the magical starry background, the star-dust cursor, rounded picture frames and other finishing touches were added with AI",
              ru: "Шрифты, волшебный звёздный фон, курсор со звёздной пылью, скруглённые рамки картинок и другие финальные штрихи добавлены с помощью ИИ",
            },
          },
        ],
      },
    ],
  },
  cube: {
    title: "Cube Clinic",
    titleEn: { ko: "큐브성형외과 · 가상 브랜드 웹사이트", en: "Cube Plastic Surgery · fictional clinic website", ru: "Cube Plastic Surgery · сайт вымышленной клиники" },
    period: { ko: "2026.11", en: "2026.11" },
    tools: ["HTML", "CSS", "JavaScript", "Weavy"],
    credits: [{ label: { ko: "참고한 병원 사이트", en: "Reference clinic site", ru: "Сайт клиники-референса" }, value: "https://www.cubeps.com/", href: "https://www.cubeps.com/" }],
    story: [
      {
        title: { ko: "컨셉", en: "Concept", ru: "Концепция" },
        text: {
          ko: "가상의 성형외과 웹사이트입니다. 구직 중에 성형외과 웹디자인 채용이 특히 많아서, 이 분야에서 실제로 필요한 사이트를 만들어 보고 싶었습니다. 실제 병원 사이트의 구조를 참고했고, 사진은 모두 AI로 새로 만들었습니다.",
          en: "A website for a fictional plastic surgery clinic. While job hunting I saw many web design openings at clinics, so I wanted to build the kind of site that field actually needs. The structure follows a real clinic site; every photo was remade with AI.",
          ru: "Сайт вымышленной клиники пластической хирургии. Пока я искала работу, видела много вакансий веб-дизайнера в клиниках и захотела сделать именно такой сайт, какой нужен этой сфере. Структура повторяет сайт настоящей клиники, все фото пересозданы с помощью ИИ.",
        },
      },
      {
        title: { ko: "집중한 점", en: "What I focused on", ru: "На чём я сосредоточилась" },
        text: {
          ko: "편하고 예쁜 사이트, 그리고 무엇보다 방문자가 바로 무엇을 할 수 있는지 보이게 하는 것. 상담 예약과 전화 상담을 어디서든 바로 할 수 있게 배치했습니다.",
          en: "A comfortable, good-looking site where visitors see right away what they can do. Booking a consultation or calling is always one step away.",
          ru: "Удобный и красивый сайт, где посетитель сразу понимает, что можно сделать. Записаться на консультацию или позвонить — всегда в один шаг.",
        },
      },
    ],
  },
};
