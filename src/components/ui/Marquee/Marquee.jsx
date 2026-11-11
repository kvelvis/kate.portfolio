import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "../../../lib/gsap";
import "./Marquee.css";

/**
 * Бесконечная бегущая строка. Ускоряется от скорости скролла
 * и разворачивается, когда скроллишь вверх.
 */
export default function Marquee({
  items = [],
  speed = 60, // px/сек
  reverse = false,
  variant = "blue", // "blue" | "acid" | "ink" | "outline"
  tilt = 0,
  separator = "✦",
  className = "",
}) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current.querySelector(".marquee__track");
      const group = track.firstElementChild;

      let width = group.offsetWidth;
      let wrap = gsap.utils.wrap(-width, 0);
      let x = 0;
      const state = { boost: 1 };
      let scrollDir = 1;
      const baseDir = reverse ? 1 : -1;

      const tick = (_t, dt) => {
        x = wrap(x + baseDir * scrollDir * speed * state.boost * (dt / 1000));
        gsap.set(track, { x });
      };
      gsap.ticker.add(tick);

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          scrollDir = self.direction;
          const v = Math.abs(self.getVelocity()) / 250;
          gsap.to(state, {
            boost: 1 + Math.min(v, 8),
            duration: 0.15,
            overwrite: true,
            onComplete: () => gsap.to(state, { boost: 1, duration: 1.2, ease: "power2.out" }),
          });
        },
      });

      const ro = new ResizeObserver(() => {
        width = group.offsetWidth;
        wrap = gsap.utils.wrap(-width, 0);
      });
      ro.observe(group);

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        ro.disconnect();
      };
    },
    { scope: root, dependencies: [items.join("|"), speed, reverse] }
  );

  const group = (hidden) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span className="marquee__item" key={i}>
          {item}
          <span className="marquee__sep">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={root}
      className={`marquee marquee--${variant} ${className}`}
      style={{ "--tilt": `${tilt}deg` }}
    >
      <div className="marquee__track">
        {group(false)}
        {group(true)}
        {group(true)}
      </div>
    </div>
  );
}
