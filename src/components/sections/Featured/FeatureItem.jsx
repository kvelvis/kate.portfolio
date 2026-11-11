import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";

export default function FeatureItem({ no, title, en, text }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(ref.current, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <li ref={ref} className="feature">
      <span className="feature__no t-mono">{no}</span>
      <div>
        <h3 className="feature__title">
          {title} <span className="t-mono">/ {en}</span>
        </h3>
        {text && <p className="feature__text">{text}</p>}
      </div>
    </li>
  );
}
