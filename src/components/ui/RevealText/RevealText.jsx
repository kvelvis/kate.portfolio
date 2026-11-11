import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "../../../lib/gsap";

/**
 * Текст появляется по строкам/словам/буквам при скролле.
 * by: "lines" | "words" | "chars"
 * mode: "slide" (выезжает из маски) | "scrub" (подсветка по мере скролла)
 */
export default function RevealText({
  as = "p",
  by = "lines",
  mode = "slide",
  delay = 0,
  stagger,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const Tag = as;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const split = SplitText.create(ref.current, {
        type: by === "chars" ? "words,chars" : by === "words" ? "words" : "lines",
        mask: mode === "slide" ? (by === "chars" ? "words" : by) : undefined,
        autoSplit: by === "lines",
        linesClass: "rt-line",
        onSplit(self) {
          const targets = self[by];
          if (mode === "scrub") {
            return gsap.fromTo(
              targets,
              { opacity: 0.15 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top 80%",
                  end: "bottom 45%",
                  scrub: true,
                },
              }
            );
          }
          return gsap.from(targets, {
            yPercent: 110,
            rotate: by === "chars" ? 8 : 0,
            duration: 1.1,
            delay,
            ease: "expo.out",
            stagger: stagger ?? (by === "chars" ? 0.025 : 0.08),
            scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
