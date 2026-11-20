import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";
import { skillLevels } from "../../../data/profile";
import { useLang } from "../../../app/I18n";

/** Grouped skills with a 3-level bar; bars fill in when they scroll into view */
export default function SkillBars({ groups }) {
  const ref = useRef(null);
  const { t } = useLang();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return; // bars are already drawn at their level via inline style
      gsap.from(".skill__fill", {
        scaleX: 0,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.04,
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="skills">
      {groups.map((g) => (
        <div key={g.group} className="skills__group">
          <h4 className="skills__label t-mono t-muted">{g.group}</h4>
          <ul className="skills__list">
            {g.items.map((s) => (
              <li className="skill" key={t(s.name)}>
                <span className="skill__name">{t(s.name)}</span>
                <span className="skill__track" aria-hidden="true">
                  <span className="skill__fill" style={{ transform: `scaleX(${s.level / 3})` }} />
                </span>
                <span className="skill__val t-mono">{skillLevels[s.level]}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
