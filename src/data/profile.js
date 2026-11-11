// All portfolio text content lives here — components read from this file.

const YEAR = 2026;
const IN_KOREA_SINCE = 2012;
export const yearsInKorea = YEAR - IN_KOREA_SINCE;

// Empty values are hidden on the site until filled in.
const links = {
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
  intro: `안녕하세요. 저는 러시아에서 왔고 한국에서 ${yearsInKorea}년째 살고 있어요. 부산대학교 경영학과를 졸업하고 국비지원 프론트엔드 개발자 과정 6개월을 수료한 웹디자이너 케이트입니다.`,
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

export const skills = [
  { name: "HTML", level: 95 },
  { name: "CSS/SCSS", level: 95 },
  { name: "JavaScript", level: 85 },
  { name: "jQuery", level: 80 },
  { name: "Git", level: 90 },
  { name: "Illustrator", level: 90 },
  { name: "Blender", level: 90 },
  { name: "Photoshop", level: 75 },
  { name: "Figma", level: 75 },
];

export const education = [
  { year: "2012–2014", desc: "러시아 외교관 고등학교" },
  { year: "2014–2016", desc: "부산대학교 언어교육원" },
  { year: "2016–2020", desc: "부산대학교 경영학 졸업" },
  { year: "2023.05–11", desc: "이젠컴퓨터아카데미" },
];

export const languages = [
  { name: "한국어", note: "TOPIK 6급" },
  { name: "English", note: "TOEIC 875" },
  { name: "Русский", note: "Native" },
];

// Empty dates are hidden on the site until filled in (format "YYYY.MM").
export const licenses = [
  { date: "", name: "컴퓨터그래픽스운용기능사" }, // TODO: Kate — real date
  { date: "", name: "웹디자인기능사" }, // TODO: Kate — real date
  { date: "", name: "2종보통 운전면허" }, // TODO: Kate — real date
  { date: "", name: "Meta Front-End Developer" }, // TODO: Kate — real date
  { date: "", name: "Google UX Design" }, // TODO: Kate — real date
];

export const marqueeWords = [
  "HTML", "CSS/SCSS", "JavaScript", "React", "GSAP", "Figma",
  "Photoshop", "Illustrator", "Blender", "UI/UX",
];
