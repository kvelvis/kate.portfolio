/** Карточка работы в горизонтальной ленте */
export default function WorkCard({ work, index, onOpen, onLoad }) {
  return (
    <li className="work-card">
      <button className="work-card__btn" onClick={onOpen} data-cursor="view" aria-label={`Open ${work.title}`}>
        <span className="work-card__media">
          <img src={work.src} alt={work.title} loading="lazy" decoding="async" onLoad={onLoad} />
        </span>
        <span className="work-card__cap t-mono">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="work-card__title">{work.title}</span>
          <span className={`work-card__tool work-card__tool--${work.tool.toLowerCase()}`}>{work.tool}</span>
        </span>
      </button>
    </li>
  );
}
