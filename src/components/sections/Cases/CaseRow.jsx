/** Строка в списке «ещё кейсы»: на hover заливается снизу */
export default function CaseRow({ item, index }) {
  return (
    <li className="case-row">
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="case-row__link">
        <span className="case-row__no t-mono">{String(index + 1).padStart(2, "0")}</span>
        <span className="case-row__title t-display">{item.title}</span>
        <span className="case-row__type t-mono">{item.type}</span>
        <span className="case-row__arrow" aria-hidden="true">→</span>
      </a>
    </li>
  );
}
