import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useLang } from "../../app/I18n";
import { links } from "../../data/profile";
import "./Dock.css";

export const TABS = [
  { id: "gallery", label: "Sphere", no: 1 },
  { id: "projects", label: "Index", no: 2 },
  { id: "about", label: "About", no: 3 },
];

/** Floating dock: wordmark, three tabs (the active one grows an italic label), and a menu that opens upward. */
export default function Dock({ route, visible }) {
  const { t, lang, setLang } = useLang();
  const root = useRef(null);
  const menuBtn = useRef(null);
  const [open, setOpen] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (!visible || shown.current) return;
    shown.current = true;
    gsap.fromTo(root.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", onStart: () => root.current.classList.add("is-on") });
  }, [visible]);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.type === "keydown" ? e.key === "Escape" : !e.target.closest(".dock, .dock-menu")) {
        setOpen(false);
        if (e.type === "keydown") menuBtn.current?.focus();
      }
    };
    addEventListener("pointerdown", close);
    addEventListener("keydown", close);
    return () => {
      removeEventListener("pointerdown", close);
      removeEventListener("keydown", close);
    };
  }, [open]);

  useEffect(() => setOpen(false), [route]);

  return (
    <>
      <nav ref={root} className="dock" aria-label={t({ ko: "주요 메뉴", en: "Main" })}>
        <a href="#gallery" className="dock__mark" aria-label="Kate — home">
          kate<span>.</span>
        </a>
        <i className="dock__div" aria-hidden="true" />
        {TABS.map((tab) => (
          <a key={tab.id} href={`#${tab.id}`} className={`dock__tab${route === tab.id ? " is-active" : ""}`} aria-current={route === tab.id ? "page" : undefined}>
            <span className="dock__label">{tab.label}</span>
            <span className="dock__no">{tab.no}</span>
            <span className="visually-hidden">{route === tab.id ? "" : tab.label}</span>
          </a>
        ))}
        <i className="dock__div" aria-hidden="true" />
        <button
          ref={menuBtn}
          className={`dock__menu${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls="dock-menu"
          aria-label={t({ ko: "메뉴", en: "Menu" })}
          onClick={() => setOpen((o) => !o)}
        >
          <i />
        </button>
      </nav>

      <div id="dock-menu" className={`dock-menu${open ? " is-open" : ""}`} inert={!open}>
        <p className="dock-menu__note">{t({ ko: "서울", en: "Based in Seoul. Open to new projects." })}</p>
        <ul>
          {[...TABS].reverse().map((tab) => (
            <li key={tab.id}>
              <a href={`#${tab.id}`}>
                {tab.label}
                <span>0{tab.no}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="dock-menu__foot">
          <div className="dock-menu__lang" role="group" aria-label="Language">
            {["ko", "en"].map((l) => (
              <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          {links.telegram && (
            <a href={`https://t.me/${links.telegram}`} target="_blank" rel="noopener noreferrer">
              Telegram ↗
            </a>
          )}
        </div>
      </div>
    </>
  );
}
