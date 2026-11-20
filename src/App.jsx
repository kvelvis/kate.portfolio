import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./app/I18n";
import Header from "./components/Header/Header";
import Hero from "./sections/Hero/Hero";
import Profile from "./sections/Profile/Profile";
import Work from "./sections/Work/Work";
import About from "./sections/About/About";
import Contact from "./sections/Contact/Contact";
import { notifyVisit } from "./app/notify";
import Like from "./components/Like/Like";

/** One scrolling page: badge + intro → numbers & skills → sphere of work → about → contact. */
export default function App() {
  const { t } = useLang();

  useEffect(() => notifyVisit(), []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    addEventListener("load", refresh);
    return () => removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <a href="#profile" className="skip-link">
        {t({ ko: "본문 바로가기", en: "Skip to content" })}
      </a>
      <Header />
      <main>
        <Hero />
        <Profile />
        <Work />
        <About />
        <Contact />
      </main>
      <Like />
    </>
  );
}
