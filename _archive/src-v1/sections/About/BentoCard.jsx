/** Карточка bento-сетки. tone: "surface" | "blue" | "acid" */
export default function BentoCard({ title, tag, tone = "surface", className = "", children }) {
  return (
    <article className={`bento__card bento__card--${tone} ${className}`}>
      <header className="bento__head">
        <h3 className="bento__title t-display">{title}</h3>
        {tag && <span className="bento__tag t-mono">{tag}</span>}
      </header>
      {children}
    </article>
  );
}
