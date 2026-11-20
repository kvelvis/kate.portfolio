import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";

/** Roles rotate in a loop: Web Designer → Web Publisher → Front-end */
export default function RoleTicker({ roles }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray(".role-ticker__item");
      if (prefersReducedMotion()) {
        gsap.set(items.slice(1), { autoAlpha: 0 }); // static: show the first role only
        return;
      }
      gsap.set(items, { yPercent: 110 });
      gsap.set(items[0], { yPercent: 0 });
      const tl = gsap.timeline({ repeat: -1 });
      items.forEach((el, i) => {
        const next = items[(i + 1) % items.length];
        tl.to(el, { yPercent: -110, duration: 0.6, ease: "expo.inOut" }, "+=1.6")
          .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.inOut", immediateRender: false }, "<");
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className="role-ticker">
      <span className="visually-hidden">{roles.join(", ")}</span>
      <span className="role-ticker__dot" />
      <span className="role-ticker__window" aria-hidden="true">
        {roles.map((r) => (
          <span key={r} className="role-ticker__item">{r}</span>
        ))}
      </span>
    </span>
  );
}
