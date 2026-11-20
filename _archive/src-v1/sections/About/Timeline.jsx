import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";
import { useLang } from "../../../app/I18n";

/** The vertical education line draws itself on scroll */
export default function Timeline({ items }) {
  const ref = useRef(null);
  const { t } = useLang();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".timeline__progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 55%", scrub: true },
        }
      );
      gsap.utils.toArray(".timeline__item").forEach((el) => {
        gsap.from(el, {
          x: -20,
          opacity: 0.2,
          duration: 0.6,
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <ol ref={ref} className="timeline">
      <li className="timeline__progress" aria-hidden="true" />
      {items.map((it) => (
        <li className="timeline__item" key={it.year}>
          <span className="timeline__dot" aria-hidden="true" />
          <span className="t-mono t-muted">{it.year}</span>
          <span className="timeline__text">{t(it.desc)}</span>
        </li>
      ))}
    </ol>
  );
}
