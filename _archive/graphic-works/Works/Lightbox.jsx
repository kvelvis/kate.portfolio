import { useEffect } from "react";
import Modal from "../../ui/Modal/Modal";

/** Просмотр работы на весь экран, стрелки ← → листают */
export default function Lightbox({ items, index, onChange, onClose }) {
  const open = index !== null && items[index];

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onChange]);

  if (!open) return null;
  const item = items[index];

  return (
    <Modal open onClose={onClose} variant="media" label={item.title}>
      <figure className="lightbox">
        <img key={item.src} src={item.src} alt={item.title} className="lightbox__img" />
        <figcaption className="lightbox__cap t-mono">
          <button onClick={() => onChange((index - 1 + items.length) % items.length)} aria-label="Previous">←</button>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} — {item.title} · {item.tool}
          </span>
          <button onClick={() => onChange((index + 1) % items.length)} aria-label="Next">→</button>
        </figcaption>
      </figure>
    </Modal>
  );
}
