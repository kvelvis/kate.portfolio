// Весь текстовый контент портфолио в одном месте.
// Правь здесь — компоненты подтянут изменения сами.

export const profile = {
  name: "Vlasova Ekaterina",
  firstName: "Ekaterina",
  lastName: "Vlasova",
  nickname: "케이트",
  year: 2026,
  roles: ["Web Designer", "Web Publisher", "Front-end"],
  route: ["Chelyabinsk", "Busan", "Seoul"],
  intro:
    "안녕하세요. 저는 러시아에서 왔고 한국에서 14년째 살고 있어요. 부산대학교 경영학과를 졸업하고 국비지원 프론트엔드 개발자 과정 6개월을 수료한 웹디자이너 케이트입니다.",
  // TODO: заменить на реальные контакты
  contacts: [
    { label: "Email", value: "kate@example.com", href: "mailto:kate@example.com" },
    { label: "Telegram", value: "@katerina_vlasova", href: "https://t.me/katerina_vlasova" },
  ],
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "works", label: "Graphic" },
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
  { date: "2022.04", name: "한국어", note: "TOPIK 6급" },
  { date: "2022.12", name: "English", note: "TOEIC 875" },
  { date: "1996.09", name: "Русский", note: "Native" },
];

// TODO: проверить даты — в старой версии у всех стояло 2020.07
export const licenses = [
  { date: "2020.07", name: "컴퓨터그래픽스운용기능사" },
  { date: "2020.07", name: "웹디자인기능사" },
  { date: "2020.07", name: "2종보통 운전면허" },
  { date: "2020.07", name: "Meta Front-End Developer" },
  { date: "2020.07", name: "Google UX Design" },
];

export const marqueeWords = [
  "HTML", "CSS/SCSS", "JavaScript", "React", "GSAP", "Figma",
  "Photoshop", "Illustrator", "Blender", "UI/UX",
];
