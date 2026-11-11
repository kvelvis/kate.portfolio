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
      <button  onClick={() => {
    console.log("clicked");
    togglePopup();
  }} className="btn btn-primary">
        Contact Me
      </button>

      {isOpen &&
        createPortal(
          <div className="popupOverlay" onClick={togglePopup}>
            <div className="popupBox" onClick={(e) => e.stopPropagation()}>
              <h2>💬 Свяжитесь со мной</h2>
              <p>Имя: Kate Vlasova</p>
              <p>Email: kate@example.com</p>
              <p>Telegram: @katerina_vlasova</p>

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
