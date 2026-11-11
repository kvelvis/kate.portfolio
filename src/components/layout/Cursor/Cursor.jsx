import { useEffect, useRef, useState } from "react";
import { gsap } from "../../../lib/gsap";
import { useFinePointer } from "../../../hooks/useMediaQuery";
import "./Cursor.css";

/**
 * Кастомный курсор (только для мыши).
 * Любому элементу можно дать data-cursor="view" — курсор увеличится и покажет текст.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const dot = useRef(null);
  const ring = useRef(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    let shown = false;
    const move = (e) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e) => {
      const target = e.target.closest("[data-cursor], a, button");
      if (!target) {
        ring.current.dataset.state = "";
        setLabel("");
        return;
      }
      const text = target.getAttribute("data-cursor");
      ring.current.dataset.state = text ? "label" : "hover";
      setLabel(text || "");
    };

    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "back.out(3)" });
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor__ring">
        <span className="cursor__label t-mono">{label}</span>
      </div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}
