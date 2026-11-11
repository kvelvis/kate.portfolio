import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";
import star from "../../../assets/img/star.png";

/** Acid card with a big counter */
export default function FactCard({ value, suffix = "", label, className = "" }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const num = ref.current.querySelector(".fact__num");
      const c = { v: 0 };
      num.textContent = "0"; // start from 0 (the real value stays in the HTML for no-JS / reduced motion)
      gsap.to(c, {
        v: value,
        duration: 2,
        ease: "power3.out",
        onUpdate: () => (num.textContent = Math.round(c.v)),
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      gsap.to(".fact__star", { rotate: 360, repeat: -1, duration: 8, ease: "none" });
    },
    { scope: ref }
  );

  return (
    <article ref={ref} className={`bento__card bento__card--acid fact ${className}`}>
      <img src={star} alt="" className="fact__star" width="250" height="170" loading="lazy" />
      <p className="fact__value t-display">
        <span className="fact__num">{value}</span>
        <span className="fact__suffix">{suffix}</span>
      </p>
      <p className="fact__label t-mono">{label}</p>
    </article>
  );
}
