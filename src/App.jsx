import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { marqueeWords } from "./data/profile";

import Preloader from "./components/layout/Preloader/Preloader";
import Header from "./components/layout/Header/Header";
import Cursor from "./components/layout/Cursor/Cursor";
import Footer from "./components/layout/Footer/Footer";

import Hero from "./components/sections/Hero/Hero";
import About from "./components/sections/About/About";
import Works from "./components/sections/Works/Works";
import Featured from "./components/sections/Featured/Featured";
import Cases from "./components/sections/Cases/Cases";
import StyleGuide from "./components/sections/StyleGuide/StyleGuide";
import Contact from "./components/sections/Contact/Contact";

import Marquee from "./components/ui/Marquee/Marquee";

export default function App() {
  const [ready, setReady] = useState(false);
  const onLoaded = useCallback(() => setReady(true), []);

  // после загрузки шрифтов/картинок пересчитываем все ScrollTrigger
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <Header />
      <Preloader onDone={onLoaded} />
      <Cursor />

      <main>
        <Hero ready={ready} />
        <Marquee items={marqueeWords} tilt={-3} className="app__marquee" />
        <About />
        <Works />
        <Featured />
        <Cases />
        <StyleGuide />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
