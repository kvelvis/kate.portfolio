/*
 * Bright yellow "ПРОВЕРЬ ЗДЕСЬ" marker: shows on the page wherever Kate still has to
 * write or confirm something. Search the code for "Check" / "ПРОВЕРЬ ЗДЕСЬ" to find them all.
 * Once a value is filled in, the marker disappears by itself (see orCheck.jsx).
 */
export function Check({ hint }) {
  return (
    <mark className="check-here" title={hint}>
      ПРОВЕРЬ ЗДЕСЬ
      {hint && <span className="check-here__hint">: {hint}</span>}
    </mark>
  );
}
