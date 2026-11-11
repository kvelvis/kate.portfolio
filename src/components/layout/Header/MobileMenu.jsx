import { useRef } from "react";
import { gsap, useGSAP } from "../../../lib/gsap";
import { navLinks, profile } from "../../../data/profile";

/** Полноэкранное меню для tablet/phone */
export default function MobileMenu({ open, onNavigate, active }) {
  const root = useRef(null);
  const tl = useRef(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo(
          root.current,
          { clipPath: "circle(0% at calc(100% - 40px) 36px)" },
          { clipPath: "circle(150% at calc(100% - 40px) 36px)", duration: 0.8, ease: "power4.inOut" }
        )
        .from(".mm__link span", { yPercent: 120, rotate: 6, stagger: 0.06, duration: 0.7, ease: "expo.out" }, "-=0.35")
        .from(".mm__foot > *", { opacity: 0, y: 20, stagger: 0.05, duration: 0.5 }, "-=0.5");
    },
    { scope: root }
  );

  useGSAP(
    () => {
      if (!tl.current) return;
      if (open) tl.current.timeScale(1).play();
      else tl.current.timeScale(1.8).reverse();
    },
    { dependencies: [open] }
  );

  return (
    <div ref={root} id="mobile-menu" className="mm" aria-hidden={!open} inert={!open ? true : undefined}>
      <nav className="mm__nav" aria-label="Mobile">
        {navLinks.map((l, i) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className={`mm__link ${active === l.id ? "is-active" : ""}`}
            onClick={onNavigate(l.id)}
          >
            <sup className="t-mono">0{i + 1}</sup>
            <span className="t-display">{l.label}</span>
          </a>
        ))}
      </nav>
      <div className="mm__foot">
        <span className="t-mono">{profile.route.join(" → ")}</span>
        <span className="t-blob">{profile.nickname}</span>
      </div>
    </div>
  );
}
