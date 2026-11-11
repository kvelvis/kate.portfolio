import { useLang } from "../../../app/I18n";

/** KO / EN switch — same pill style as the theme toggle */
export default function LangToggle() {
  const { lang, setLang } = useLang();
  const next = lang === "ko" ? "en" : "ko";

  return (
    <button
      type="button"
      className="lang-toggle t-mono"
      onClick={() => setLang(next)}
      aria-label={next === "en" ? "Switch to English" : "한국어로 보기"}
      lang={next}
    >
      <span className={lang === "ko" ? "is-active" : ""} aria-hidden="true">KO</span>
      <span className={lang === "en" ? "is-active" : ""} aria-hidden="true">EN</span>
    </button>
  );
}
