// Profile text. Text that differs by language is { ko, en }; components pick one with t().

const YEAR = 2026;
const IN_KOREA_SINCE = 2012;
export const yearsInKorea = YEAR - IN_KOREA_SINCE;

// Empty values are hidden. Also used for the SEO structured data in vite.config.js.
export const links = {
  email: "kvelvis74@gmail.com",
  github: "", // full URL
  linkedin: "", // full URL
  telegram: "", // username without @
};

export const profile = {
  name: "Vlasova Ekaterina",
  firstName: "Ekaterina",
  lastName: "Vlasova",
  nickname: "케이트",
  year: YEAR,
  roles: ["Web Designer", "Web Publisher"],
  route: ["Chelyabinsk", "Busan", "Seoul"],
  intro: {
    ko: `안녕하세요. 저는 러시아에서 왔고 한국에서 ${yearsInKorea}년째 살고 있어요. 부산대학교 경영학과를 졸업한 웹디자이너이자 웹퍼블리셔 케이트입니다.`,
    en: `Hi, I’m Kate. I’m from Russia and have lived in Korea for ${yearsInKorea} years. I graduated in Business Administration from Pusan National University, and I’m a web designer and web publisher.`,
    ru: `Привет, я Катя. Я из России и живу в Корее уже ${yearsInKorea} лет. Окончила Пусанский национальный университет по специальности «менеджмент», я веб-дизайнер и верстальщик.`,
  },
  contacts: [
    links.email && { label: "Email", value: links.email, href: `mailto:${links.email}`, external: false },
    links.github && { label: "GitHub", value: links.github.replace(/^https?:\/\/(www\.)?/, ""), href: links.github },
    links.linkedin && { label: "LinkedIn", value: links.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: links.linkedin },
    links.telegram && { label: "Telegram", value: `@${links.telegram}`, href: `https://t.me/${links.telegram}` },
  ].filter(Boolean),
  // PDFs go in public/resume/, e.g. "/resume/kate-resume-ko.pdf"
  resume: [
    { lang: "KO", label: "이력서 (KO)", href: "" },
    { lang: "EN", label: "Resume (EN)", href: "" },
  ].filter((r) => r.href),
};

// level: 3 = daily use, 2 = working knowledge, 1 = familiar

export const skillGroups = [
  {
    group: "Web",
    items: [
      { name: { ko: "HTML5 · 웹표준", en: "HTML5 · Web standards", ru: "HTML5 · веб-стандарты" }, level: 3 },
      { name: "CSS / SCSS", level: 3 },
      { name: "JavaScript (ES6+)", level: 2 },
      { name: "React", level: 2 },
      { name: "GSAP · Lenis", level: 2 },
      { name: "jQuery", level: 2 },
      { name: "Git / GitHub", level: 2 },
    ],
  },
  {
    group: "Publishing",
    items: [
      { name: "Responsive (PC · Tablet · Mobile)", level: 3 },
      { name: "Web accessibility (KWCAG · WCAG 2.1)", level: 2 },
      { name: "Cross-browser", level: 2 },
    ],
  },
  {
    group: "Design",
    items: [
      { name: "Figma · Design systems", level: 3 },
      { name: "Photoshop", level: 3 },
      { name: "Illustrator", level: 3 },
    ],
  },
  {
    group: "AI workflow",
    items: [
      { name: "AI-assisted coding", level: 2 },
      { name: "AI image generation", level: 2 },
    ],
  },
];

// Most recent first. Status tag: current → "재직 중" / "프리랜서 · 진행 중", closed → "회사 폐업",
// otherwise "퇴사"; noStatus hides it.
export const experience = [
  {
    company: { ko: "스포워즈 코리아", en: "스포워즈 코리아" },
    role: { ko: "웹디자이너 · 웹퍼블리셔", en: "Web Designer · Web Publisher", ru: "Веб-дизайнер · верстальщик" },
    period: { ko: "5개월", en: "5 months", ru: "5 месяцев" },
    dates: "2024.02–2024.06",
    current: false,
    duty: {
      ko: "자사 홈페이지 웹디자인 (Figma → 퍼블리싱) 및 사내 타 사이트 디자인 지원. 회사 경영 악화로 프로젝트가 중단되었고, 이후 회사가 폐업했습니다.",
      en: "Web design of the company website (Figma → publishing) and design support for the company’s other sites. The projects were stopped as the company’s finances worsened, and it later closed.",
      ru: "Веб-дизайн сайта компании (Figma → вёрстка) и помощь с дизайном других сайтов компании. Проекты остановили из-за финансовых трудностей, позже компания закрылась.",
    },
    closed: true,
    tools: ["Figma", "HTML", "CSS"],
  },
  {
    company: { ko: "얀소프트", en: "얀소프트" },
    role: { ko: "웹디자이너 · 웹퍼블리셔", en: "Web Designer · Web Publisher", ru: "Веб-дизайнер · верстальщик" },
    period: { ko: "8개월", en: "8 months", ru: "8 месяцев" },
    dates: "2024.07–2025.02",
    current: false,
    duty: {
      ko: "Svelte 대시보드 디자인 및 퍼블리싱, 사내 연동 서비스 사이트 3건 웹디자인 진행. 회사 경영 악화로 프로젝트가 중단되었고, 이후 회사가 폐업했습니다.",
      en: "Designed and published a Svelte dashboard, and designed 3 connected in-house service sites. The projects were stopped as the company’s finances worsened, and it later closed.",
      ru: "Дизайн и вёрстка дашборда на Svelte и веб-дизайн трёх связанных внутренних сервисов. Проекты остановили из-за финансовых трудностей, позже компания закрылась.",
    },
    closed: true,
    tools: ["Svelte", "Figma", "HTML", "CSS"],
  },
  {
    company: { ko: "1S-Rarus", en: "1S-Rarus" },
    role: { ko: "콘텐츠 디자이너", en: "Content designer", ru: "Контент-дизайнер" },
    period: { ko: "1년 9개월~", en: "1 year 9 months+", ru: "1 год 9 месяцев+" },
    dates: { ko: "2025.03–현재", en: "2025.03–present", ru: "2025.03–сейчас" },
    current: true,
    freelance: true,
    duty: {
      ko: "러시아 회사에서 콘텐츠 디자이너로 사내 교육 · 홍보 콘텐츠와 SNS 배너를 브랜드 가이드라인에 맞춰 제작하고 있습니다.",
      en: "As a content designer I make internal training and promo content and social media banners to the brand guidelines.",
      ru: "Как контент-дизайнер делаю обучающие и промо-материалы для сотрудников и баннеры для соцсетей по брендбуку.",
    },
    tools: ["Figma", "Photoshop", "Illustrator"],
  },
  {
    company: { ko: "숨고 · 크몽", en: "Soomgo · Kmong", ru: "Soomgo · Kmong" },
    role: { ko: "프리랜서 번역", en: "Freelance translator", ru: "Переводчик-фрилансер" },
    period: { ko: "1년 9개월~", en: "1 year 9 months+", ru: "1 год 9 месяцев+" },
    dates: { ko: "2025.03–현재", en: "2025.03–present", ru: "2025.03–сейчас" },
    noStatus: true,
    duty: {
      ko: "숨고와 크몽을 통해 의뢰를 받아, 한국어를 러시아어로 번역하는 프리랜서 업무를 하고 있습니다.",
      en: "Freelance translation from Korean into Russian, with clients found through Soomgo and Kmong.",
      ru: "Фриланс-переводы с корейского на русский, заказы через Soomgo и Kmong.",
    },
    tools: [],
  },
];

export const education = [
  { year: "2012–2014", desc: { ko: "러시아 외교관 고등학교", en: "Diplomatic high school, Russia", ru: "Лицей при дипломатическом ведомстве, Россия" } },
  { year: "2014–2016", desc: { ko: "부산대학교 언어교육원", en: "Pusan National University, Language Education Institute", ru: "Пусанский национальный университет, языковой институт" } },
  { year: "2016–2020", desc: { ko: "부산대학교 경영학 졸업", en: "Pusan National University, B.A. Business Administration", ru: "Пусанский национальный университет, бакалавр менеджмента" } },
  { year: "2023.05–11", desc: { ko: "이젠컴퓨터아카데미 (국비 6개월)", en: "EZEN Computer Academy (6-month government-funded course)", ru: "Компьютерная академия EZEN (6-месячный государственный курс)" } },
];

export const languages = [
  { name: "한국어", note: { ko: "TOPIK 6급", en: "TOPIK Level 6", ru: "TOPIK, 6 уровень" } },
  { name: "English", note: "TOEIC 875" },
  { name: { ko: "러시아어", en: "Russian", ru: "Русский" }, note: { ko: "Native", en: "Native", ru: "Родной" } },
  { name: "KO ↔ RU", note: { ko: "Localization", en: "Localization", ru: "Локализация" } },
];

// skill: true → also shown as a card next to the skills (Profile section).
export const licenses = [
  {
    date: "2022.04",
    name: { ko: "컴퓨터그래픽스운용기능사", en: "Craftsman Computer Graphics Operation", ru: "Специалист по компьютерной графике (Craftsman)" },
    skill: true,
    issuer: { ko: "국가기술자격 · 한국산업인력공단", en: "National technical qualification · HRD Korea", ru: "Государственная квалификация · HRD Korea" },
    covers: { ko: "Photoshop · Illustrator 그래픽 제작", en: "Graphics in Photoshop and Illustrator", ru: "Графика в Photoshop и Illustrator" },
  },
  {
    date: "2022.04",
    name: { ko: "웹디자인기능사", en: "Craftsman Web Design", ru: "Специалист по веб-дизайну (Craftsman)" },
    skill: true,
    issuer: { ko: "국가기술자격 · 한국산업인력공단", en: "National technical qualification · HRD Korea", ru: "Государственная квалификация · HRD Korea" },
    covers: { ko: "웹 디자인 · HTML/CSS 퍼블리싱", en: "Web design and HTML/CSS publishing", ru: "Веб-дизайн и вёрстка HTML/CSS" },
  },
];

// Timeline under the skills (Profile section), oldest first. Job dates come from `experience`.
const jobDates = (name) => experience.find((x) => x.company.ko.startsWith(name))?.dates || "";
export const timeline = [

  {
    when: "2023.05–11",
    kind: "edu",
    title: { ko: "이젠컴퓨터아카데미 (국비 6개월)", en: "EZEN Computer Academy (6-month government-funded course)", ru: "Компьютерная академия EZEN (6-месячный государственный курс)" },
  },
  {
    when: jobDates("스포워즈"),
    kind: "work",
    title: { ko: "스포워즈 코리아 · 웹디자인 / 퍼블리싱", en: "스포워즈 코리아 · Web design / publishing", ru: "스포워즈 코리아 · веб-дизайн / вёрстка" },
    note: { ko: "회사 경영 악화로 프로젝트 중단, 이후 폐업", en: "Projects stopped as the company struggled; it later closed", ru: "Проекты остановили из-за трудностей компании, позже она закрылась" },
  },
  {
    when: jobDates("얀소프트"),
    kind: "work",
    title: { ko: "얀소프트 · UI 디자인 / 퍼블리싱", en: "얀소프트 · UI design / publishing", ru: "얀소프트 · UI-дизайн / вёрстка" },
    note: { ko: "회사 경영 악화로 프로젝트 중단, 이후 폐업", en: "Projects stopped as the company struggled; it later closed", ru: "Проекты остановили из-за трудностей компании, позже она закрылась" },
  },
  {
    when: jobDates("1S-Rarus"),
    kind: "free",
    title: { ko: "프리랜서 · 1S-Rarus (러시아) 콘텐츠 디자인 · 숨고·크몽 번역 (한→러)", en: "Freelance · content design for 1S-Rarus (Russia) · KO→RU translation via Soomgo and Kmong", ru: "Фриланс · контент-дизайн для 1С-Рарус (Россия) · переводы KO→RU через Soomgo и Kmong" },
    note: { ko: "진행 중", en: "Ongoing", ru: "Сейчас" },
  },
  {
    when: { ko: "지금", en: "Now", ru: "Сейчас" },
    kind: "next",
    title: { ko: "함께 성장할 회사를 찾고 있어요", en: "Looking for a team to grow with", ru: "Ищу команду, с которой буду расти" },
    note: {
      ko: "안정적인 환경에서 팀과 함께 일하며 새로운 것을 배우고, 더 흥미로운 프로젝트를 통해 성장하고 싶어서 회사를 찾고 있습니다.",
      en: "I want a stable place to work with a team, learn new things and grow through more interesting projects.",
      ru: "Хочу стабильное место, где можно работать в команде, учиться новому и расти на более интересных проектах.",
    },
  },
];
