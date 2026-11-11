// All portfolio text content lives here — components read from this file.
// Text that differs by language is { ko, en }; components pick one with t() from useLang().
// EN versions are translations of Kate's Korean text — TODO: Kate — review EN.

const YEAR = 2026;
const IN_KOREA_SINCE = 2012;
export const yearsInKorea = YEAR - IN_KOREA_SINCE;

// Empty values are hidden on the site until filled in. Also used for SEO structured data (vite.config.js).
export const links = {
  email: "", // TODO: Kate — email address, e.g. "name@mail.com"
  github: "", // TODO: Kate — full URL, e.g. "https://github.com/username"
  linkedin: "", // TODO: Kate — full URL
  telegram: "katerina_vlasova", // TODO: Kate — confirm this handle is yours (or set to "")
};

export const profile = {
  name: "Vlasova Ekaterina",
  firstName: "Ekaterina",
  lastName: "Vlasova",
  nickname: "케이트",
  year: YEAR,
  roles: ["Web Designer", "Web Publisher", "Front-end"],
  route: ["Chelyabinsk", "Busan", "Seoul"],
  intro: {
    ko: `안녕하세요. 저는 러시아에서 왔고 한국에서 ${yearsInKorea}년째 살고 있어요. 부산대학교 경영학과를 졸업하고 국비지원 프론트엔드 개발자 과정 6개월을 수료한 웹디자이너 케이트입니다.`,
    en: `Hi, I'm Kate. I'm from Russia and have lived in Korea for ${yearsInKorea} years. I graduated in Business Administration from Pusan National University and completed a 6-month government-funded front-end developer course — now I'm a web designer.`,
  },
  aboutAside: {
    ko: "Chelyabinsk → Busan → Seoul. 경영학 전공 → 디자인 → 코드.",
    en: "Chelyabinsk → Busan → Seoul. Business major → design → code.",
  },
  factLabel: { ko: "한국 거주 🇰🇷", en: "living in Korea 🇰🇷" },
  contacts: [
    links.email && { label: "Email", value: links.email, href: `mailto:${links.email}`, external: false },
    links.github && { label: "GitHub", value: links.github.replace(/^https?:\/\/(www\.)?/, ""), href: links.github },
    links.linkedin && { label: "LinkedIn", value: links.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: links.linkedin },
    links.telegram && { label: "Telegram", value: `@${links.telegram}`, href: `https://t.me/${links.telegram}` },
  ].filter(Boolean),
  // Put the PDFs in public/resume/ and write the paths here, e.g. "/resume/kate-resume-ko.pdf"
  resume: [
    { lang: "KO", label: "이력서 (KO)", href: "" }, // TODO: Kate — Korean resume PDF
    { lang: "EN", label: "Resume (EN)", href: "" }, // TODO: Kate — English resume PDF
  ].filter((r) => r.href),
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "featured", label: "Figma" },
  { id: "cases", label: "Cases" },
  { id: "contact", label: "Contact" },
];

// level: 3 = daily use, 2 = working knowledge, 1 = familiar
// TODO: Kate — confirm the levels you didn't set yourself (you set Figma 3, React 2, Blender 2)
export const skillLevels = { 3: "daily", 2: "working", 1: "familiar" };

export const skillGroups = [
  {
    group: "Front-end",
    items: [
      { name: { ko: "HTML5 · 웹표준", en: "HTML5 · Web standards" }, level: 3 },
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
      { name: "Blender (3D)", level: 2 },
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

export const education = [
  { year: "2012–2014", desc: { ko: "러시아 외교관 고등학교", en: "Diplomatic high school, Russia" } },
  { year: "2014–2016", desc: { ko: "부산대학교 언어교육원", en: "Pusan National University — Language Education Institute" } },
  { year: "2016–2020", desc: { ko: "부산대학교 경영학 졸업", en: "Pusan National University — B.A. Business Administration" } },
  { year: "2023.05–11", desc: { ko: "이젠컴퓨터아카데미", en: "EZEN Computer Academy — front-end course" } },
];

export const languages = [
  { name: "한국어", note: { ko: "TOPIK 6급", en: "TOPIK Level 6" } },
  { name: "English", note: "TOEIC 875" },
  { name: "Русский", note: "Native" },
  { name: "KO ↔ RU", note: "Localization" },
];

// Empty dates are hidden on the site until filled in (format "YYYY.MM").
export const licenses = [
  { date: "", name: { ko: "컴퓨터그래픽스운용기능사", en: "Craftsman Computer Graphics Operation" } }, // TODO: Kate — real date
  { date: "", name: { ko: "웹디자인기능사", en: "Craftsman Web Design" } }, // TODO: Kate — real date
  { date: "", name: { ko: "2종보통 운전면허", en: "Driver's license (Class 2)" } }, // TODO: Kate — real date
  { date: "", name: "Meta Front-End Developer" }, // TODO: Kate — real date
  { date: "", name: "Google UX Design" }, // TODO: Kate — real date
];

export const marqueeWords = [
  "HTML", "CSS/SCSS", "JavaScript", "React", "GSAP", "Figma",
  "Photoshop", "Illustrator", "Blender", "UI/UX",
];
