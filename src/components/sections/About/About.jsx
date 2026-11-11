import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../../../lib/gsap";
import { profile, skillGroups, education, languages, licenses, yearsInKorea } from "../../../data/profile";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";
import RevealText from "../../ui/RevealText/RevealText";
import BentoCard from "./BentoCard";
import SkillBars from "./SkillBars";
import Timeline from "./Timeline";
import FactCard from "./FactCard";
import ProfileCard from "./ProfileCard";
import { useLang } from "../../../app/I18n";
import "./About.css";

export default function About() {
  const root = useRef(null);
  const { lang, t } = useLang();

  // bento cards drop into the grid
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".bento__card", {
          y: 80,
          rotate: (i) => (i % 2 ? 3 : -3),
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          clearProps: "transform,opacity", // so the CSS hover works afterwards
          scrollTrigger: { trigger: ".bento", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="about section">
      <div className="container">
        <SectionHeading index="01" kicker="{background}" title="About me" aside={t(profile.aboutAside)} />

        <div className="about__top">
          {/* key: re-split the text when the language changes */}
          <RevealText key={lang} as="p" by="words" mode="scrub" className="about__intro">
            {t(profile.intro)}
          </RevealText>
          <ProfileCard />
        </div>

        <div className="bento">
          <BentoCard title="Skills" tag="tools I use" className="bento__skills">
            <SkillBars groups={skillGroups} />
          </BentoCard>

          <BentoCard title="Education" tag="since 2012" className="bento__edu">
            <Timeline items={education} />
          </BentoCard>

          <FactCard className="bento__fact" value={yearsInKorea} suffix="y" label={t(profile.factLabel)} />

          <BentoCard title="Language" tag="3 langs + l10n" className="bento__lang" tone="blue">
            <ul className="lang-list">
              {languages.map((l) => (
                <li key={l.name}>
                  <span className="lang-list__name">{l.name}</span>
                  <span className="lang-list__note">{t(l.note)}</span>
                </li>
              ))}
            </ul>
          </BentoCard>

          <BentoCard title="License" tag="certified" className="bento__license">
            <ul className="license-list">
              {licenses.map((l) => (
                <li key={t(l.name)}>
                  {l.date && <span className="t-mono t-muted">{l.date}</span>}
                  <span>{t(l.name)}</span>
                </li>
              ))}
            </ul>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
