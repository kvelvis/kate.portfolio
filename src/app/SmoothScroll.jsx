import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

const LenisContext = createContext(null);

/** Lenis smooth scroll, synced with the GSAP ticker and ScrollTrigger. */
export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion(),
    });

    instance.on("scroll", ScrollTrigger.update);
    rafRef.current = (time) => instance.raf(time * 1000);
    gsap.ticker.add(rafRef.current);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);

/** Scrolls to a section by id (minus the fixed header) and moves keyboard focus there. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target, opts = {}) => {
    const el = typeof target === "string" ? document.getElementById(target) : target;
    if (!el) return;
    const reduce = prefersReducedMotion();
    if (lenis) lenis.scrollTo(el, { offset: -72, immediate: reduce, ...opts });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };
}
