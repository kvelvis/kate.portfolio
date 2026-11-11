import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../../../lib/gsap";
import { fonts, colors, stack } from "../../../data/styleguide";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";
import Swatch from "./Swatch";
import "./StyleGuide.css";

export default function StyleGuide() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".font-card", {
          y: 60,
          opacity: 0,
          stagger: 0.07,
          duration: 0.9,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".sg__fonts", start: "top 85%", once: true },
        });
        // свотчи «раскладываются» веером
        gsap.from(".swatch", {
          y: 120,
          rotate: (i) => (i - 2) * 8,
          opacity: 0,
          stagger: 0.08,
          duration: 1.1,
          ease: "back.out(1.4)",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".sg__colors", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="styleguide" className="sg section">
      <div className="container">
        <SectionHeading index="05" kicker="portfolio info" title="Style guide" aside="Шрифты, цвета и стек, на которых собран этот сайт." />

        <h3 className="sg__sub t-mono">Typography</h3>
        <ul className="sg__fonts">
          {fonts.map((f) => (
            <li key={f.name} className="font-card">
              <span className="font-card__sample" style={{ fontFamily: f.family, transform: f.stretch ? "scaleY(1.3)" : undefined }}>
                {f.sample}
              </span>
              <span className="font-card__name">{f.name}</span>
              <span className="font-card__role t-mono t-muted">{f.role}</span>
            </li>
          ))}
        </ul>

        <h3 className="sg__sub t-mono">Colors — click to copy</h3>
        <ul className="sg__colors">
          {colors.map((c) => (
            <Swatch key={c.hex} {...c} />
          ))}
        </ul>

        <h3 className="sg__sub t-mono">Built with</h3>
        <ul className="sg__stack">
          {stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
