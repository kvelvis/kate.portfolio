import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../../lib/gsap";
import "./LikeHeart.css";

const STORAGE_KEY = "portfolio-liked";

function readLiked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Like heart with a particle burst. Remembered in the browser. */
export default function LikeHeart() {
  const [liked, setLiked] = useState(readLiked);
  const ref = useRef(null);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (!next || prefersReducedMotion()) return;

    gsap.fromTo(ref.current.querySelector("svg"), { scale: 0.6 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.2, 0.35)" });
    const dots = ref.current.querySelectorAll(".heart__dot");
    gsap.fromTo(
      dots,
      { x: 0, y: 0, scale: 1, opacity: 1 },
      {
        x: (i) => Math.cos((i / dots.length) * Math.PI * 2) * 46,
        y: (i) => Math.sin((i / dots.length) * Math.PI * 2) * 46,
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`heart ${liked ? "is-liked" : ""}`}
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike portfolio" : "Like portfolio"}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="heart__dot" />
      ))}
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z" />
      </svg>
    </button>
  );
}
