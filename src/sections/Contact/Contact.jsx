import { useRef } from "react";
import { profile } from "../../data/profile";
import { useLang } from "../../app/I18n";
import { useReveal } from "../../hooks/useInView";
import "./Contact.css";

/** Contact + footer. Every contact comes from data/profile.js — empty ones stay hidden. */
export default function Contact() {
  const { t, lang } = useLang();
  const root = useRef(null);
  useReveal(root, [lang]);
  const main = profile.contacts[0];

  return (
    <section ref={root} id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <p className="kicker rv">{t({ ko: "연락", en: "Contact" })}</p>
        <h2 id="contact-title" className="contact__title rv" style={{ "--i": 1 }}>
          {main ? (
            <a href={main.href} target={main.external === false ? undefined : "_blank"} rel="noopener noreferrer">
              <em>{t({ ko: "편하게 연락 주세요", en: "Let’s talk" })}</em>
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <em>{t({ ko: "편하게 연락 주세요", en: "Let’s talk" })}</em>
          )}
        </h2>

        <div className="contact__row">
          <ul className="contact__list rv" style={{ "--i": 2 }}>
            {profile.contacts.map((c) => (
              <li key={c.label}>
                <span>{c.label}</span>
                <a href={c.href} target={c.external === false ? undefined : "_blank"} rel="noopener noreferrer">
                  {c.value}
                </a>
              </li>
            ))}
            {profile.resume.map((r) => (
              <li key={r.href}>
                <span>PDF</span>
                <a href={r.href} target="_blank" rel="noopener noreferrer">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="contact__note rv" style={{ "--i": 3 }}>
            {t({
              ko: "웹디자인, 퍼블리싱 포지션을 찾고 있습니다.",
              en: "I’m looking for web design and publishing roles.",
            })}
          </p>
        </div>
      </div>

      <footer className="foot container">
        <span>
          © {profile.year} {profile.firstName} {profile.lastName}
        </span>
        <span className="foot__mid"></span>
        <a href="#top">{t({ ko: "맨 위로 ↑", en: "Back to top ↑" })}</a>
        <small className="foot__privacy">
          {t({
            ko: "사이트 개선을 위해 익명 방문 통계를 수집합니다. 쿠키나 IP는 저장하지 않습니다.",
            en: "Anonymous visit stats are collected to improve the site. No cookies or IP addresses are stored.",
          })}
        </small>
      </footer>
    </section>
  );
}
