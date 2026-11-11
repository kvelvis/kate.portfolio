import RevealText from "../RevealText/RevealText";
import "./SectionHeading.css";

/** Заголовок секции: (номер) · подпись · огромный тайтл */
export default function SectionHeading({ index, kicker, title, aside, align = "left" }) {
  return (
    <header className={`sh sh--${align}`}>
      <div className="sh__meta t-mono">
        {index && <span className="sh__index">({index})</span>}
        {kicker && <span className="sh__kicker">{kicker}</span>}
      </div>
      <RevealText as="h2" by="chars" className="sh__title t-display">
        {title}
      </RevealText>
      {aside && <p className="sh__aside">{aside}</p>}
    </header>
  );
}
