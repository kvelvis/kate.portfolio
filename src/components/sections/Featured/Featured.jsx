import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../../../lib/gsap";
import { featured } from "../../../data/featured";
import RevealText from "../../ui/RevealText/RevealText";
import Sticker from "../../ui/Sticker/Sticker";
import FeatureItem from "./FeatureItem";
import "./Featured.css";

export default function Featured() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // синий блок раскрывается из «карточки» на весь экран
        gsap.fromTo(
          ".featured__panel",
          { clipPath: "inset(8% 6% 0% 6% round 48px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 15%", scrub: true },
          }
        );

        // огромное слово TANO едет навстречу скроллу
        gsap.fromTo(
          ".featured__giant",
          { xPercent: 10 },
          {
            xPercent: -30,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        // телефон слегка поворачивается
        gsap.fromTo(
          ".featured__phone",
          { rotate: -8, y: 60 },
          {
            rotate: 4,
            y: -40,
            ease: "none",
            scrollTrigger: { trigger: ".featured__grid", start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="featured" className="featured">
      <div className="featured__panel">
        <p className="featured__giant t-display" aria-hidden="true">
          {featured.name} ✦ {featured.name} ✦ {featured.name}
        </p>

        <div className="featured__grid container">
          <div className="featured__media">
            <div className="featured__phone">
              <img src={featured.mockup} alt={`${featured.name} app screens`} loading="lazy" />
            </div>
            <Sticker color="acid" rotate={-12} className="featured__st-1">단어 +1</Sticker>
            <Sticker shape="circle" color="pink" rotate={10} className="featured__st-2">
              daily
              <br />
              words
            </Sticker>
          </div>

          <div className="featured__content">
            <div className="featured__meta t-mono">
              <span>(03)</span>
              <span className="featured__label">{featured.label}</span>
            </div>
            <RevealText as="h2" by="chars" className="featured__title t-display">
              {featured.name}
            </RevealText>
            <ul className="featured__tags t-mono">
              {featured.meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <RevealText as="p" className="featured__summary">
              {featured.summary}
            </RevealText>

            <ol className="featured__features">
              {featured.features.map((f) => (
                <FeatureItem key={f.no} {...f} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
