import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../../../lib/gsap";
import { featured } from "../../../data/featured";
import RevealText from "../../ui/RevealText/RevealText";
import Sticker from "../../ui/Sticker/Sticker";
import Button from "../../ui/Button/Button";
import CaseStudyButton from "../CaseStudy/CaseStudy";
import FeatureItem from "./FeatureItem";
import { useLang } from "../../../app/I18n";
import "./Featured.css";

export default function Featured() {
  const root = useRef(null);
  const { lang, t } = useLang();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // blue panel expands from a card to full width
        gsap.fromTo(
          ".featured__panel",
          { clipPath: "inset(8% 6% 0% 6% round 48px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 15%", scrub: true },
          }
        );

        // giant DANO word moves against the scroll
        gsap.fromTo(
          ".featured__giant",
          { xPercent: 10 },
          {
            xPercent: -30,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        // phone mockup tilts slightly
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
              <img src={featured.mockup} alt={t(featured.mockupAlt)} width="494" height="615" loading="lazy" decoding="async" />
            </div>
            {featured.mascot && (
              <img src={featured.mascot} alt="Dano 3D 고양이 캐릭터" className="featured__mascot" loading="lazy" decoding="async" />
            )}
            <Sticker color="acid" rotate={-12} className="featured__st-1">단어 +1</Sticker>
            <Sticker shape="circle" color="pink" rotate={10} className="featured__st-2">
              daily
              <br />
              words
            </Sticker>
          </div>

          <div className="featured__content">
            <div className="featured__meta t-mono">
              <span>(02)</span>
              <span className="featured__label">{featured.label}</span>
            </div>
            <RevealText as="h2" by="chars" className="featured__title t-display">
              {featured.name}
            </RevealText>
            <p className="featured__tagline">
              <span lang="ko">{featured.nameKo}</span> — {t(featured.tagline)}
            </p>
            <ul className="featured__tags t-mono">
              {featured.meta.map((m) => (
                <li key={t(m)}>{t(m)}</li>
              ))}
            </ul>
            <RevealText key={lang} as="p" className="featured__summary">
              {t(featured.summary)}
            </RevealText>

            <ol className="featured__features">
              {featured.features.map((f) => (
                <FeatureItem key={f.no} {...f} />
              ))}
            </ol>

            <dl className="featured__facts">
              <div>
                <dt className="t-mono">Role</dt>
                <dd>{t(featured.role)}</dd>
              </div>
              <div>
                <dt className="t-mono">Next</dt>
                <dd>{featured.next.map(t).join(" · ")}</dd>
              </div>
            </dl>

            <CaseStudyButton id="dano" variant="acid" className="featured__cta" />
            {featured.figmaUrl && (
              <Button href={featured.figmaUrl} variant="acid" icon="↗" className="featured__cta">
                View in Figma
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
