import { useRef } from "react";
import { gsap, useGSAP } from "../../../lib/gsap";

/** Полоски навыков заполняются и считают проценты, когда попадают в экран */
export default function SkillBars({ items }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray(".skill");
      rows.forEach((row, i) => {
        const fill = row.querySelector(".skill__fill");
        const num = row.querySelector(".skill__num");
        const level = Number(row.dataset.level);
        const counter = { v: 0 };
        gsap
          .timeline({
            scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
            delay: i * 0.06,
          })
          .fromTo(fill, { scaleX: 0 }, { scaleX: level / 100, duration: 1.4, ease: "expo.out" })
          .to(counter, {
            v: level,
            duration: 1.4,
            ease: "expo.out",
            onUpdate: () => (num.textContent = Math.round(counter.v)),
          }, 0);
      });
    },
    { scope: ref }
  );

  return (
    <ul ref={ref} className="skills">
      {items.map((s) => (
        <li className="skill" key={s.name} data-level={s.level}>
          <span className="skill__name">{s.name}</span>
          <span className="skill__track">
            <span className="skill__fill" />
          </span>
          <span className="skill__val t-mono">
            <span className="skill__num">{s.level}</span>%
          </span>
        </li>
      ))}
    </ul>
  );
}
