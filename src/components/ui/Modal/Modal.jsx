import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap, useGSAP, prefersReducedMotion } from "../../../lib/gsap";
import { trapTab } from "../../../lib/a11y";
import { useLenis } from "../../../app/SmoothScroll";
import "./Modal.css";

/** Modal: Esc / backdrop click close it, page scroll is locked, focus stays inside and returns on close. */
export default function Modal({ open, onClose, label, variant = "card", children }) {
  const overlay = useRef(null);
  const box = useRef(null);
  const openerRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    const root = document.getElementById("root");
    lenis?.stop();
    if (root) root.inert = true; // the modal is portaled to <body>, outside #root
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      trapTab(e, box.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      if (root) root.inert = false;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, lenis]);

  useGSAP(
    () => {
      if (!open) return;
      openerRef.current = document.activeElement; // remember who opened the modal, before moving focus
      overlay.current.querySelector(".modal__close")?.focus();
      if (prefersReducedMotion()) return;
      gsap.from(overlay.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
      gsap.from(".modal__box", { y: 60, rotate: -3, scale: 0.92, opacity: 0, duration: 0.6, ease: "back.out(1.6)" });
    },
    { scope: overlay, dependencies: [open] }
  );

  if (!open) return null;

  return createPortal(
    <div ref={overlay} className={`modal modal--${variant}`} onClick={onClose} role="presentation">
      <div
        ref={box}
        className="modal__box"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="modal__scroll" data-lenis-prevent>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
