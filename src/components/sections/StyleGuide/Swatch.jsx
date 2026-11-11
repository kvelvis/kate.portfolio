import { useState } from "react";

export default function Swatch({ name, hex, fg }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <li className="swatch" style={{ "--sw-bg": hex, "--sw-fg": fg }}>
      <button className="swatch__btn" onClick={copy} data-cursor="copy" aria-label={`Copy ${hex}`}>
        <span className="swatch__name">{name}</span>
        <span className="swatch__hex t-mono">{copied ? "copied ✓" : hex}</span>
      </button>
    </li>
  );
}
