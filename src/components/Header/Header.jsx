import { useEffect, useState } from "react";
import { useLang } from "../../app/I18n";
import "./Header.css";

const NAV = [
  { id: "profile", label: { ko: "프로필", en: "Profile" } },
  { id: "work", label: { ko: "작업", en: "Work" } },
  { id: "about", label: { ko: "소개", en: "About" } },
  { id: "contact", label: { ko: "연락", en: "Contact" } },
];

/** Fixed top bar: wordmark, section links (current one is highlighted), language switch. */
export default function Header() {
  const { t, lang, setLang } = useLang();
  const [current, setCurrent] = useState("");
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header className={`hdr${scrolled ? " is-scrolled" : ""}`}>
      <a href="#top" className="hdr__mark" aria-label="Kate — top">
        kate<span>.</span>
      </a>
      <nav className="hdr__nav" aria-label={t({ ko: "주요 메뉴", en: "Main" })}>
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
          {t({ ko: "구직 중", en: "Open to work" })}
        </span>
        <div className="hdr__lang" role="group" aria-label="Language">
          {["ko", "en"].map((l) => (
            <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
