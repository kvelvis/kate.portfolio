import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../../../lib/gsap";
import { profile, skills, education, languages, licenses, yearsInKorea } from "../../../data/profile";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";
import RevealText from "../../ui/RevealText/RevealText";
import BentoCard from "./BentoCard";
import SkillBars from "./SkillBars";
import Timeline from "./Timeline";
import FactCard from "./FactCard";
import ProfileCard from "./ProfileCard";
import "./About.css";

export default function About() {
  const root = useRef(null);

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
        <SectionHeading index="01" kicker="{background}" title="About me" aside="Chelyabinsk → Busan → Seoul. 경영학 전공 → 디자인 → 코드." />

        <div className="about__top">
          <RevealText as="p" by="words" mode="scrub" className="about__intro">
            {profile.intro}
          </RevealText>
          <ProfileCard />
        </div>

        <div className="bento">
          <BentoCard title="Skills" tag="tools I use" className="bento__skills">
            <SkillBars items={skills} />
          </BentoCard>

          <BentoCard title="Education" tag="since 2012" className="bento__edu">
            <Timeline items={education} />
          </BentoCard>

          <FactCard className="bento__fact" value={yearsInKorea} suffix="y" label="living in Korea 🇰🇷" />

          <BentoCard title="Language" tag="3 langs" className="bento__lang" tone="blue">
            <ul className="lang-list">
              {languages.map((l) => (
                <li key={l.name}>
                  <span className="lang-list__name">{l.name}</span>
                  <span className="lang-list__note">{l.note}</span>
                </li>
              ))}
            </ul>
          </BentoCard>

          <BentoCard title="License" tag="certified" className="bento__license">
            <ul className="license-list">
              {licenses.map((l) => (
                <li key={l.name}>
                  {l.date && <span className="t-mono t-muted">{l.date}</span>}
                  <span>{l.name}</span>
                </li>
              ))}
            </ul>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
