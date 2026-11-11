import mockup from "../assets/img/figma2.png";

export const featured = {
  name: "Dano",
  nameKo: "단어",
  label: "Figma project",
  tagline: "단어가 찾아오는 한국어 단어 앱",
  meta: ["개인 프로젝트", "2026.11", "Mobile app", "UI/UX", "Figma"], // TODO: Kate — confirm period "2026.11"
  mockup,
  mockupAlt: "Dano 단어 앱 화면",
  mascot: null, // TODO: Kate — 3D cat mascot image (import it here), shown next to the phone mockup
  figmaUrl: "", // TODO: Kate — public Figma link (optional)
  summary:
    "앱을 열지 않아도 단어를 외울 수 있도록, 원하는 단어를 뜻과 예문과 함께 잠금 화면 알림으로 보내주는 앱입니다. 시험일에 맞춰 단어를 자동으로 나눠 보내 줍니다.",
  role: "기획 · UI/UX · 캐릭터 디자인",
  features: [
    { no: "01", title: "알림 중심 UX", en: "Notifications", text: "앱을 열지 않아도 단어가 뜻 · 예문과 함께 잠금 화면 알림으로 도착해요." },
    { no: "02", title: "한 화면 설정", en: "One-screen setup", text: "" }, // TODO: Kate — one-line description
    { no: "03", title: "Figma Variables 디자인 시스템", en: "Design system", text: "" }, // TODO: Kate — one-line description
    { no: "04", title: "AI로 만든 3D 고양이 캐릭터", en: "3D mascot", text: "" }, // TODO: Kate — one-line description
  ],
  next: ["탭하면 뜻이 보이는 알림", "간격 반복 학습"],
};
