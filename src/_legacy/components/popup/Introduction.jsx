import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../../App.css";

function ContactPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => setIsOpen((v) => !v);

  // (опционально) блокируем скролл
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  return (
    <div>
      

      {isOpen &&
        createPortal(
          <div className="popupOverlay" onClick={togglePopup}>
            <div className="popupBox" onClick={(e) => e.stopPropagation()}>
              <h2>💬 Привет, это портфолио было сделано с помощью бустера и реакт</h2>
              

              <button onClick={togglePopup} className="btn btn-secondary mt-3">
                Закрыть
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default ContactPopup;
