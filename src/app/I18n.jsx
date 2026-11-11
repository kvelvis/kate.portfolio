import { createContext, useCallback, useContext, useEffect, useState } from "react";

// KO is the default. Content can be a plain string (same in both languages)
// or { ko: "...", en: "..." }. Use t(value) to pick the current language.

const LANGS = ["ko", "en"];
const TITLES = {
  ko: "케이트 Kate (Ekaterina Vlasova) — 웹퍼블리셔 · 웹디자이너 포트폴리오",
  en: "Kate (Ekaterina Vlasova) — Web Publisher · Web Designer Portfolio",
};

function initialLang() {
  try {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(fromUrl)) return fromUrl;
    const saved = localStorage.getItem("lang");
    if (LANGS.includes(saved)) return saved;
  } catch {
    /* ignore */
  }
  return "ko";
}

const translate = (lang) => (value) =>
  value && typeof value === "object" && !Array.isArray(value) && "ko" in value ? value[lang] ?? value.ko : value;

const LangContext = createContext({ lang: "ko", setLang: () => {}, t: translate("ko") });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = TITLES[lang];
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l) => LANGS.includes(l) && setLangState(l), []);

  return <LangContext.Provider value={{ lang, setLang, t: translate(lang) }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
