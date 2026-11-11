import { useEffect, useState } from "react";
import { profile } from "../../../data/profile";
import { stack } from "../../../data/styleguide";
import Marquee from "../../ui/Marquee/Marquee";
import { useLang } from "../../../app/I18n";
import "./Footer.css";

function useSeoulTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Seoul" }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Footer() {
  const time = useSeoulTime();
  const { t } = useLang();

  return (
    <footer className="footer">
      <Marquee items={[profile.name, profile.nickname, `portfolio ${profile.year}`]} variant="ink" speed={40} />

      <div className="footer__inner container">
        <div className="footer__col">
          <span className="t-mono footer__label">Local time</span>
          <span className="footer__big t-display">Seoul {time}</span>
        </div>

        <div className="footer__col">
          <span className="t-mono footer__label">Contacts</span>
          {profile.contacts.map((c) => (
            <a key={c.label} href={c.href} {...(c.external === false ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="footer__link">
              {c.value}
            </a>
          ))}
        </div>

        <div className="footer__col">
          <span className="t-mono footer__label">This portfolio was made with</span>
          <p>{stack.slice(0, 5).join(" · ")}</p>
        </div>
      </div>

      <div className="footer__legal container t-mono">
        <span>
          {t({
            ko: "해당 웹사이트는 개인 포트폴리오 사이트이며 모든 작업에는 상업적 이용 목적이 없습니다.",
            en: "This is a personal portfolio site. None of the works are used for commercial purposes.",
          })}
        </span>
        <span>Copyright © {profile.year} {profile.name.toUpperCase()}</span>
      </div>
    </footer>
  );
}
