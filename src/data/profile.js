// All portfolio text content lives here — components read from this file.
// Text that differs by language is { ko, en }; components pick one with t() from useLang().
// EN versions are translations of Kate's Korean text. ПРОВЕРЬ ЗДЕСЬ: read the EN versions once.

const YEAR = 2026;
const IN_KOREA_SINCE = 2012;
export const yearsInKorea = YEAR - IN_KOREA_SINCE;

// Empty values are hidden on the site until filled in. Also used for SEO structured data (vite.config.js).
export const links = {
  // Contacts are optional: visitors come from the resume, which has them. Empty values stay hidden.
  email: "kvelvis74@gmail.com",
  github: "", // optional, full URL
  linkedin: "", // optional, full URL
  telegram: "", // removed: email only
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
    en: `Hi, I'm Kate. I'm from Russia and have lived in Korea for ${yearsInKorea} years. I graduated in Business Administration from Pusan National University, and I'm a web designer and web publisher.`,
  },
  contacts: [
    links.email && { label: "Email", value: links.email, href: `mailto:${links.email}`, external: false },
    links.github && { label: "GitHub", value: links.github.replace(/^https?:\/\/(www\.)?/, ""), href: links.github },
    links.linkedin && { label: "LinkedIn", value: links.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: links.linkedin },
    links.telegram && { label: "Telegram", value: `@${links.telegram}`, href: `https://t.me/${links.telegram}` },
  ].filter(Boolean),
  // Put the PDFs in public/resume/ and write the paths here, e.g. "/resume/kate-resume-ko.pdf"
  resume: [
    { lang: "KO", label: "이력서 (KO)", href: "" }, // optional — Korean resume PDF
    { lang: "EN", label: "Resume (EN)", href: "" }, // optional — English resume PDF
  ].filter((r) => r.href),
};


// level: 3 = daily use, 2 = working knowledge, 1 = familiar
// ПРОВЕРЬ ЗДЕСЬ — confirm the levels you didn't set yourself (you set Figma 3, React 2, Blender 2)
export const skillLevels = { 3: "daily", 2: "working", 1: "familiar" };

export const skillGroups = [
  {
    group: "Web",
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

// Work experience, most recent first (as Kate listed it).
// current: true → "프리랜서 · 진행 중" tag; otherwise "퇴사".
// dates: "2024.03–2024.07" — empty → the site shows "ПРОВЕРЬ ЗДЕСЬ". Also check the English company names.
export const experience = [
  {
    company: { ko: "스포워즈 코리아", en: "스포워즈 코리아" },
    role: { ko: "웹디자이너 웹퍼블리셔", en: "Web Designer Web Publisher" },
    period: { ko: "5개월", en: "5 months" },
    dates: "2024.02–2024.06",
    current: false,
    duty: {
      ko: "자사 홈페이지 웹디자인 (Figma → 퍼블리싱) 및 사내 타 사이트 디자인 지원. 회사 경영 악화로 프로젝트가 중단되었고, 이후 회사가 폐업했습니다.",
      en: "Web design of the company website (Figma → publishing) and design support for the company's other sites. The projects were stopped as the company’s finances worsened, and it later closed.",
    },
    closed: true,
    tools: ["Figma", "HTML", "CSS"],
  },
  {
    company: { ko: "얀소프트", en: "얀소프트" },
    role: { ko: "웹디자이너 웹퍼블리셔", en: "Web Designer Web Publisher" },
    period: { ko: "8개월", en: "8 months" },
    dates: "2024.07–2025.02",
    current: false,
    duty: {
      ko: "Svelte 대시보드 디자인 및 퍼블리싱, 사내 연동 서비스 사이트 3건 웹디자인 진행. 회사 경영 악화로 프로젝트가 중단되었고, 이후 회사가 폐업했습니다.",
      en: "Designed and published a Svelte dashboard, and web design for 3 connected in-house service sites. The projects were stopped as the company’s finances worsened, and it later closed.",
    },
    closed: true,
    tools: ["Svelte", "Figma", "HTML", "CSS"],
  },
  {
    company: { ko: "1S-Rarus", en: "1S-Rarus" },
    role: { ko: "콘텐츠 디자이너", en: "Content designer" },
    period: { ko: "1년 9개월~", en: "1 year 9 months+" },
    // after 얀소프트, ongoing. ПРОВЕРЬ ЗДЕСЬ: your resume says 해외근무 1년 11개월 — make the two match
    dates: { ko: "2025.03–현재", en: "2025.03–present" },
    current: true,
    freelance: true,
    duty: {
      ko: "러시아 회사에서 콘텐츠 디자이너로 사내 교육 · 홍보 콘텐츠와 SNS 배너를 브랜드 가이드라인에 맞춰 제작하고 있습니다.",
      en: "As a content designer I make internal training and promo content and social media banners to the brand guidelines.",
    },
    tools: ["Figma", "Photoshop", "Illustrator"],
  },
  {
    // freelance translation, found through the Soomgo and Kmong platforms
    company: { ko: "숨고 · 크몽", en: "Soomgo · Kmong" },
    role: { ko: "프리랜서 번역", en: "Freelance translator" },
    period: { ko: "1년 9개월~", en: "1 year 9 months+" },
    dates: { ko: "2025.03–현재", en: "2025.03–present" },
    noStatus: true,
    duty: {
      ko: "숨고와 크몽을 통해 의뢰를 받아, 한국어를 러시아어로 번역하는 프리랜서 업무를 하고 있습니다.",
      en: "Freelance translation from Korean into Russian, with clients found through Soomgo and Kmong.",
    },
    tools: [],
  }
];

export const education = [
  { year: "2012–2014", desc: { ko: "러시아 외교관 고등학교", en: "Diplomatic high school, Russia" } },
  { year: "2014–2016", desc: { ko: "부산대학교 언어교육원", en: "Pusan National University, Language Education Institute" } },
  { year: "2016–2020", desc: { ko: "부산대학교 경영학 졸업", en: "Pusan National University, B.A. Business Administration" } },
  { year: "2023.05–11", desc: { ko: "이젠컴퓨터아카데미 (국비 6개월)", en: "EZEN Computer Academy (6-month government-funded course)" } },
];

export const languages = [
  { name: "한국어", note: { ko: "TOPIK 6급", en: "TOPIK Level 6" } },
  { name: "English", note: "TOEIC 875" },
  { name: "러시아어", note: "Native" },
  { name: "KO ↔ RU", note: "Localization" },
];

// Empty dates are hidden on the site until filled in (format "YYYY.MM").
// skill: true → also shown next to the skills (Profile section), as a certificate card.
export const licenses = [
  {
    date: "2022.04",
    name: { ko: "컴퓨터그래픽스운용기능사", en: "Craftsman Computer Graphics Operation" },
    skill: true,
    issuer: { ko: "국가기술자격 · 한국산업인력공단", en: "National technical qualification · HRD Korea" },
    covers: { ko: "Photoshop · Illustrator 그래픽 제작", en: "Graphics in Photoshop and Illustrator" },
  },
  {
    date: "2022.04",
    name: { ko: "웹디자인기능사", en: "Craftsman Web Design" },
    skill: true,
    issuer: { ko: "국가기술자격 · 한국산업인력공단", en: "National technical qualification · HRD Korea" },
    covers: { ko: "웹 디자인 · HTML/CSS 퍼블리싱", en: "Web design and HTML/CSS publishing" },
  },
];

// Horizontal timeline under the skills (Profile section), oldest first.
// when: "" → the site shows "ПРОВЕРЬ ЗДЕСЬ". The job dates come from `experience` above.
const jobDates = (name) => experience.find((x) => x.company.ko.startsWith(name))?.dates || "";
export const timeline = [
  {
    when: "2016–2020",
    kind: "edu",
    title: { ko: "부산대학교 경영학과 졸업", en: "Pusan National University, B.A. Business Administration" },
  },
  {
    when: "2023.05–11",
    kind: "edu",
    title: { ko: "이젠컴퓨터아카데미 (국비 6개월)", en: "EZEN Computer Academy (6-month government-funded course)" },
  },
  {
    when: jobDates("스포워즈"),
    kind: "work",
    title: { ko: "스포워즈 코리아 · 웹디자인 / 퍼블리싱", en: "스포워즈 코리아 · Web design / publishing" },
    note: { ko: "회사 경영 악화로 프로젝트 중단, 이후 폐업", en: "Projects stopped as the company struggled; it later closed" },
  },
  {
    when: jobDates("얀소프트"),
    kind: "work",
    title: { ko: "얀소프트 · UI 디자인 / 퍼블리싱", en: "얀소프트 · UI design / publishing" },
    note: { ko: "회사 경영 악화로 프로젝트 중단, 이후 폐업", en: "Projects stopped as the company struggled; it later closed" },
  },
  {
    when: jobDates("1S-Rarus"),
    kind: "free",
    title: { ko: "프리랜서 · 1S-Rarus (러시아) 콘텐츠 디자인 · 숨고·크몽 번역 (한→러)", en: "Freelance · content design for 1S-Rarus (Russia) · KO→RU translation via Soomgo and Kmong" },
    note: { ko: "진행 중", en: "Ongoing" },
  },
  {
    when: { ko: "지금", en: "Now" },
    kind: "next",
    title: { ko: "함께 성장할 회사를 찾고 있어요", en: "Looking for a team to grow with" },
    note: {
      ko: "안정적인 환경에서 팀과 함께 일하며 새로운 것을 배우고, 더 흥미로운 프로젝트를 통해 성장하고 싶어서 회사를 찾고 있습니다.",
      en: "I want a stable place to work with a team, learn new things and grow through more interesting projects.",
    },
  },
];
