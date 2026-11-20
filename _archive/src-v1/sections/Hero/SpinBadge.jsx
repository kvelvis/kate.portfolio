import { useId } from "react";

/** Round badge with text on a circle and a star in the middle */
export default function SpinBadge({ text }) {
  const id = useId().replace(/:/g, "");

  return (
    <div className="spin-badge">
      <span className="visually-hidden">{text}</span>
      <svg viewBox="0 0 200 200" className="spin-badge__ring" aria-hidden="true">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="490">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="spin-badge__core" aria-hidden="true">✦</span>
    </div>
  );
}
