/** Кейс в рамке «окна браузера» */
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
            <img src={item.cover} alt={`${item.title} preview`} loading="lazy" decoding="async" />
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
