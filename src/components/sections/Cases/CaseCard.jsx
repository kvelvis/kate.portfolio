import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../../lib/gsap";

/** Looping preview video: loads and plays only while on screen; reduced motion shows the poster only */
function CaseCover({ cover }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { rootMargin: "200px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video ref={ref} poster={cover.poster} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}>
      <source src={cover.webm} type="video/webm" />
      <source src={cover.mp4} type="video/mp4" />
    </video>
  );
}

/** Case card in a "browser window" frame */
export default function CaseCard({ item, index }) {
  const slug = item.href.split("/")[2];

  return (
    <li className="case-card">
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="case-card__link" data-cursor="visit ↗">
        <div className="case-card__window">
          <div className="case-card__bar" aria-hidden="true">
            <span className="case-card__dots">
              <i />
              <i />
              <i />
            </span>
            <span className="case-card__url t-mono">~/cases/{slug.replace(" ", "-")}</span>
          </div>
          <div className="case-card__media">
            <CaseCover cover={item.cover} />
          </div>
        </div>
        <div className="case-card__info">
          <span className="t-mono t-muted">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="case-card__title t-display">{item.title}</h3>
          <span className="case-card__type t-mono">{item.type}</span>
          <span className="case-card__arrow" aria-hidden="true">↗</span>
        </div>
      </a>
    </li>
  );
}
