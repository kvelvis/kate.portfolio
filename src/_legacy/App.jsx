import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import Header from "./components/Header.jsx";
import Button from "./components/Button.jsx";
import Main from "./components/Main.jsx";
import TypoColors from "./components/TypoColors.jsx";
import About from "./components/About.jsx";
import GraphicWorks from "./components/GraphicWorks.jsx";
import Slider from "./Slider.jsx";
import FigmaProject from "./components/FigmaProject.jsx";
import Projects from "./components/Projects.jsx";
import Ending from "./components/Ending.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
    } else {
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // ссылки на секции
  const aboutRef = useRef(null);
  const graphicRef = useRef(null);
  const figmaRef = useRef(null);
  const casesRef = useRef(null);

  const scrollToSection = (ref, offset = 120) => {
    if (ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className={darkMode ? "theme-dark" : "theme-light"}>
      <Header
        onAboutClick={() => scrollToSection(aboutRef)}
        onGraphicClick={() => scrollToSection(graphicRef)}
        onFigmaClick={() => scrollToSection(figmaRef)}
        onCasesClick={() => scrollToSection(casesRef)}
      >
        <Button
          className="theme-button me-2"
          onClick={toggleTheme}
          label="Theme"
        />
      </Header>

      <Main />

      <section ref={aboutRef}>
        <About />
      </section>

      <section ref={graphicRef}>
        <GraphicWorks />
      </section>

      {/* Если используешь Slider отдельно — оставь / перемести куда нужно */}
      <Slider />

      <section ref={figmaRef}>
        <FigmaProject />
      </section>

      <section ref={casesRef}>
        <Projects />
      </section>

      <TypoColors />
      <Ending />

      {/* дублирующая кнопка — по желанию можно убрать */}
      
    </div>
  );
}

export default App;
