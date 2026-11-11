import { useRef } from "react";
import { Draggable, gsap, useGSAP, MQ } from "../../../lib/gsap";
import "./Sticker.css";

/**
 * Стикер, который можно таскать мышкой (на десктопе).
 * shape: "pill" | "circle" | "star" | "image"
 */
export default function Sticker({
  children,
  shape = "pill",
  color = "acid", // acid | blue | pink | ink | cream
  rotate = -6,
  draggable = true,
  className = "",
  style,
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.set(ref.current, { rotate });
      if (!draggable) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.fine, () => {
        const [d] = Draggable.create(ref.current, {
          inertia: true,
          bounds: document.body,
          zIndexBoost: true,
          onPress() {
            gsap.to(this.target, { scale: 1.08, rotate: rotate + 6, duration: 0.25 });
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, rotate, duration: 0.6, ease: "elastic.out(1, 0.4)" });
          },
        });
        return () => d.kill();
      });
      return () => mm.revert();
    },
    { dependencies: [draggable, rotate] }
  );

  return (
    <div
      ref={ref}
      className={`sticker sticker--${shape} sticker--${color} ${draggable ? "is-draggable" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
