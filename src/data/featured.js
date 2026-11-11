import mockup from "../assets/img/dano-mockup.webp";

export const featured = {
  name: "Dano",
  nameKo: "단어",
  label: "Figma project",
  // EN versions: TODO: Kate — review EN
  tagline: { ko: "단어가 찾아오는 한국어 단어 앱", en: "A Korean vocabulary app where words come to you" },
  meta: [{ ko: "개인 프로젝트", en: "Personal project" }, "2026.11", "Mobile app", "UI/UX", "Figma"], // TODO: Kate — confirm period "2026.11"
  mockup,
  mockupAlt: { ko: "Dano 단어 앱 화면", en: "Dano app screens" },
  mascot: null, // TODO: Kate — 3D cat mascot image (import it here), shown next to the phone mockup
  figmaUrl: "", // TODO: Kate — public Figma link (optional)
  summary: {
    ko: "앱을 열지 않아도 단어를 외울 수 있도록, 원하는 단어를 뜻과 예문과 함께 잠금 화면 알림으로 보내주는 앱입니다. 시험일에 맞춰 단어를 자동으로 나눠 보내 줍니다.",
    en: "An app that lets you learn words without opening it: it sends the words you choose — with meaning and an example sentence — as lock-screen notifications, and spreads them out automatically to fit your exam date.",
  },
  role: { ko: "기획 · UI/UX · 캐릭터 디자인", en: "Planning · UI/UX · Character design" },
  features: [
    {
      no: "01",
      title: { ko: "알림 중심 UX", en: "Notification-first UX" },
      en: "Notifications",
      text: {
        ko: "앱을 열지 않아도 단어가 뜻 · 예문과 함께 잠금 화면 알림으로 도착해요.",
        en: "Words arrive on the lock screen with meaning and an example — no need to open the app.",
      },
    },
    { no: "02", title: { ko: "한 화면 설정", en: "One-screen setup" }, en: "One-screen setup", text: "" }, // TODO: Kate — one-line description (ko + en)
    { no: "03", title: { ko: "Figma Variables 디자인 시스템", en: "Design system with Figma Variables" }, en: "Design system", text: "" }, // TODO: Kate — one-line description (ko + en)
    { no: "04", title: { ko: "AI로 만든 3D 고양이 캐릭터", en: "AI-made 3D cat mascot" }, en: "3D mascot", text: "" }, // TODO: Kate — one-line description (ko + en)
  ],
  next: [
    { ko: "탭하면 뜻이 보이는 알림", en: "Tap-to-reveal meaning in notifications" },
    { ko: "간격 반복 학습", en: "Spaced repetition" },
  ],
};
