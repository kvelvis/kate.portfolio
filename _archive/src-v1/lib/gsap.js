// Единая точка регистрации плагинов GSAP.
// Импортируй gsap и плагины только отсюда.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, useGSAP);

gsap.defaults({ ease: "power3.out", duration: 1 });

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Брейкпоинты для gsap.matchMedia — совпадают с styles/tokens.css
export const MQ = {
  desktop: "(min-width: 1024px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  mobile: "(max-width: 639px)",
  motion: "(prefers-reduced-motion: no-preference)",
  fine: "(hover: hover) and (pointer: fine)",
};

export { gsap, ScrollTrigger, SplitText, Draggable, useGSAP };
