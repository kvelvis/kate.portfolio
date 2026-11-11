import { useLang } from "../../../app/I18n";

/** Row in the "more cases" list: fills from the bottom on hover */
export default function CaseRow({ item, index }) {
  const { t } = useLang();
  return (
    <li className="case-row">
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="case-row__link">
        <span className="case-row__no t-mono">{String(index + 1).padStart(2, "0")}</span>
        <span className="case-row__title t-display">{t(item.title)}</span>
        <span className="case-row__type t-mono">{item.type}</span>
        <span className="case-row__arrow" aria-hidden="true">→</span>
      </a>
    </li>
  );
}
