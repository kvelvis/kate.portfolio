/** Фильтр по инструменту: All / Photoshop / Illustrator / AI */
export default function FilterChips({ options, counts, value, onChange }) {
  return (
    <div className="chips" role="tablist" aria-label="Filter by tool">
      {options.map((opt) => (
        <button
          key={opt}
          role="tab"
          aria-selected={value === opt}
          className={`chip ${value === opt ? "is-active" : ""}`}
          onClick={() => onChange(opt)}
        >
          {opt}
          <sup className="t-mono">{counts[opt]}</sup>
        </button>
      ))}
    </div>
  );
}
