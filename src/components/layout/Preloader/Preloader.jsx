import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";
import { useLenis } from "../../../app/SmoothScroll";
import { profile } from "../../../data/profile";
import "./Preloader.css";

/** Синий экран со счётчиком 0→100, затем уезжает вверх и вызывает onDone. */
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  // пока идёт загрузка — скролл заблокирован
  useEffect(() => {
    if (!gone) lenis?.stop();
  }, [lenis, gone]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setGone(true);
        onDone?.();
        return;
      }
      window.scrollTo(0, 0);
      const counter = { v: 0 };
      const num = root.current.querySelector(".pl__num");

      gsap
        .timeline({
          onComplete: () => {
            lenisRef.current?.start();
            setGone(true);
          },
        })
        .from(".pl__word", { yPercent: 120, stagger: 0.08, duration: 0.8, ease: "expo.out" })
        .to(counter, {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, "0")),
        }, 0)
        .to(".pl__bar", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .to(".pl__blob", { scale: 1, rotate: 0, duration: 0.9, ease: "back.out(2)" }, 0.5)
        .add(() => onDone?.(), "+=0.05")
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<");
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div ref={root} className="pl" aria-hidden="true">
      <div className="pl__top t-mono">
        <span className="line-mask"><span className="pl__word">Portfolio</span></span>
        <span className="line-mask"><span className="pl__word">{profile.year}</span></span>
      </div>
      <span className="pl__blob t-blob">{profile.nickname}</span>
      <div className="pl__bottom">
        <span className="pl__num t-display">000</span>
        <span className="pl__bar" />
      </div>
    </div>
  );
}
