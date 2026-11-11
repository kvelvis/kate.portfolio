import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap, useGSAP } from "../../../lib/gsap";
import { useLenis } from "../../../app/SmoothScroll";
import "./Modal.css";

/** Модальное окно: Esc/клик по фону закрывают, скролл страницы блокируется. */
export default function Modal({ open, onClose, label, variant = "card", children }) {
  const overlay = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lenis]);

  useGSAP(
    () => {
      if (!open) return;
      gsap.from(overlay.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
      gsap.from(".modal__box", { y: 60, rotate: -3, scale: 0.92, opacity: 0, duration: 0.6, ease: "back.out(1.6)" });
      overlay.current.querySelector(".modal__close")?.focus();
    },
    { scope: overlay, dependencies: [open] }
  );

  if (!open) return null;

  return createPortal(
    <div ref={overlay} className={`modal modal--${variant}`} onClick={onClose} role="presentation">
      <div
        className="modal__box"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
