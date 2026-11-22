import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Content can be a plain string (same in every language) or { ko, en, ru }.
// Use t(value) to pick the current language; a missing ru falls back to en, then ko.

const LANGS = ["ko", "en", "ru"];
const CHOICE_KEY = "lang-choice"; // set only when the visitor picks a language
const RU_LIKE = ["ru", "be", "kk", "ky"]; // Russian-speaking browsers
const TITLES = {
  ko: "케이트 Kate (Ekaterina Vlasova) — 웹퍼블리셔 · 웹디자이너 포트폴리오",
  en: "Kate (Ekaterina Vlasova) — Web Publisher · Web Designer Portfolio",
  ru: "Катя (Екатерина Власова) — портфолио веб-дизайнера и верстальщика",
};

function initialLang() {
  try {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(fromUrl)) return fromUrl;
    const saved = localStorage.getItem(CHOICE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    /* ignore */
  }
  return browserLang();
}

// First visit: follow the browser's language. Korean → ko, Russian → ru, anything else → en.
function browserLang() {
  const list = navigator.languages?.length ? navigator.languages : [navigator.language || ""];
  for (const tag of list) {
    const base = String(tag).toLowerCase().split("-")[0];
    if (base === "ko") return "ko";
    if (RU_LIKE.includes(base)) return "ru";
    if (base === "en") return "en";
  }
  return "en";
}

const translate = (lang) => (value) =>
  value && typeof value === "object" && !Array.isArray(value) && "ko" in value
    ? value[lang] ?? (lang === "ru" ? value.en : undefined) ?? value.ko
    : value;

const LangContext = createContext({ lang: "ko", setLang: () => {}, t: translate("ko") });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = TITLES[lang];
    try {
      localStorage.setItem("lang", lang); // read by preview.html
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l) => {
    if (!LANGS.includes(l)) return;
    setLangState(l);
    try {
      localStorage.setItem(CHOICE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  return <LangContext.Provider value={{ lang, setLang, t: translate(lang) }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
