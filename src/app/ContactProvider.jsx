import { createContext, useCallback, useContext, useState } from "react";
import Modal from "../components/ui/Modal/Modal";
import { profile } from "../data/profile";
import sticker from "../assets/img/contact-sticker.webp";
import "./ContactModal.css";

const ContactContext = createContext(() => {});

/** Даёт любому компоненту функцию openContact() — одна модалка на весь сайт. */
export function ContactProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const [copied, setCopied] = useState(null);

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      /* clipboard недоступен — просто ссылка */
    }
  };

  return (
    <ContactContext.Provider value={openContact}>
      {children}
      <Modal open={open} onClose={close} label="Contact">
        <div className="contact-modal">
          <img src={sticker} alt="" className="contact-modal__sticker" />
          <p className="t-mono t-muted">say hi 👋 / 연락주세요</p>
          <h3 className="contact-modal__title t-display">Let&apos;s talk</h3>
          <ul className="contact-modal__list">
            {profile.contacts.map((c) => (
              <li key={c.label}>
                <span className="t-mono t-muted">{c.label}</span>
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  {c.value}
                </a>
                <button className="contact-modal__copy t-mono" onClick={() => copy(c.value)}>
                  {copied === c.value ? "copied!" : "copy"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </ContactContext.Provider>
  );
}

export const useContact = () => useContext(ContactContext);
