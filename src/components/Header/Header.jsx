import { useEffect, useRef, useState } from "react";
import { useLang } from "../../app/I18n";
import "./Header.css";

const NAV = [
  { id: "work", label: { ko: "작업", en: "Work", ru: "Работы" } },
  { id: "profile", label: { ko: "프로필", en: "Profile", ru: "Профиль" } },
  { id: "about", label: { ko: "소개", en: "About", ru: "О себе" } },
  { id: "contact", label: { ko: "연락", en: "Contact", ru: "Контакты" } },
];
const LANG_LIST = ["ko", "en", "ru"];
const LANG_NAME = { ko: "한국어", en: "English", ru: "Русский" };

/** Fixed top bar: wordmark, section links (current one is highlighted), language switch. */
export default function Header() {
  const { t, lang, setLang } = useLang();
  const [current, setCurrent] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false); // compact language menu (phones)
  const menuRef = useRef(null);

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const top = document.getElementById("top");
    const io2 = new IntersectionObserver(([e]) => {
      setScrolled(!e.isIntersecting);
      if (e.isIntersecting) setCurrent("");
    }, { rootMargin: "-60% 0px 0px 0px" });
    if (top) io2.observe(top);
    return () => {
      io.disconnect();
      io2.disconnect();
    };
  }, []);

  // close the compact menu on an outside tap or Escape
  useEffect(() => {
    if (!menu) return;
    const away = (e) => !menuRef.current?.contains(e.target) && setMenu(false);
    const esc = (e) => e.key === "Escape" && setMenu(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const pick = (l) => {
    setLang(l);
    setMenu(false);
  };

  return (
    <header className={`hdr${scrolled ? " is-scrolled" : ""}`}>
      <a href="#top" className="hdr__mark" aria-label="Kate — top">
        kate<span>.</span>
      </a>
      <nav className="hdr__nav" aria-label={t({ ko: "주요 메뉴", en: "Main", ru: "Главное меню" })}>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} className={current === n.id ? "is-current" : ""} aria-current={current === n.id ? "true" : undefined}>
            <sup>0{i + 1}</sup>
            {t(n.label)}
          </a>
        ))}
      </nav>
      <div className="hdr__right">
        <span className="hdr__status">
          <i aria-hidden="true" />
          {t({ ko: "구직 중", en: "Open to work", ru: "Открыта к предложениям" })}
        </span>
        <div className="hdr__lang" role="group" aria-label="Language">
          {LANG_LIST.map((l) => (
            <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)} lang={l} title={LANG_NAME[l]}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="hdr__lang-mini" ref={menuRef}>
          <button type="button" aria-haspopup="true" aria-expanded={menu} aria-label={`Language: ${LANG_NAME[lang]}`} onClick={() => setMenu((v) => !v)}>
            {lang.toUpperCase()}
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2.5 4l2.5 2.5L7.5 4" />
            </svg>
          </button>
          {menu && (
            <ul role="menu">
              {LANG_LIST.map((l) => (
                <li key={l} role="none">
                  <button type="button" role="menuitemradio" aria-checked={lang === l} lang={l} onClick={() => pick(l)}>
                    {LANG_NAME[l]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
