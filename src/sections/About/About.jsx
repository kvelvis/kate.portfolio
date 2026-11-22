import { useRef } from "react";
import { profile, experience, education, languages, licenses } from "../../data/profile";
import { useLang } from "../../app/I18n";
import { useReveal } from "../../hooks/useInView";
import "./About.css";

/** About: experience, education, languages, licenses. */
export default function About() {
  const { t, lang } = useLang();
  const root = useRef(null);
  useReveal(root, [lang]);

  return (
    <section ref={root} id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <div className="section-head">
          <p className="kicker rv">{t({ ko: "소개", en: "About", ru: "Обо мне" })}</p>
          <h2 id="about-title" className="rv" style={{ "--i": 1 }}>
            {t({ ko: "경력과 학력", en: "Experience & education", ru: "Опыт и образование" })}
          </h2>
          <p className="rv" style={{ "--i": 2 }}>
            {profile.route.join(" → ")}
          </p>
        </div>

        <div className="about__exp">
          <h3 className="kicker rv">{t({ ko: "경력", en: "Experience", ru: "Опыт" })}</h3>
          <ol>
            {experience.map((x, i) => (
              <li key={i} className="about__job rv" style={{ "--i": i }}>
                <p className="about__co">
                  {t(x.company)}
                  {x.role && <span className="about__role">{t(x.role)}</span>}
                </p>
                <p className="about__period">
                  <span className="about__dates">{t(x.dates)}</span>
                  {t(x.period)}
                  {!x.noStatus && (
                    <span className={`about__status${x.current ? " is-current" : ""}`}>
                      {x.current
                        ? t(x.freelance ? { ko: "프리랜서 · 진행 중", en: "Freelance · ongoing", ru: "Фриланс · сейчас" } : { ko: "재직 중", en: "Current", ru: "Сейчас работаю" })
                        : x.closed
                          ? t({ ko: "회사 폐업", en: "Company closed", ru: "Компания закрылась" })
                          : t({ ko: "퇴사", en: "Left", ru: "Уволилась" })}
                    </span>
                  )}
                </p>
                <p className="about__duty">{t(x.duty)}</p>
                {x.tools.length > 0 && (
                  <ul className="about__tools">
                    {x.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="about__grid">
          <div className="about__col rv">
            <h3 className="kicker">{t({ ko: "학력", en: "Education", ru: "Образование" })}</h3>
            <ol className="about__timeline">
              {education.map((e) => (
                <li key={e.year}>
                  <span>{e.year}</span>
                  {t(e.desc)}
                </li>
              ))}
            </ol>
          </div>

          <div className="about__col rv" style={{ "--i": 1 }}>
            <h3 className="kicker">{t({ ko: "언어", en: "Languages", ru: "Языки" })}</h3>
            <ul className="about__plain">
              {languages.map((l) => (
                <li key={typeof l.name === "string" ? l.name : l.name.ko}>
                  {t(l.name)}
                  <span>{t(l.note)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="about__col rv" style={{ "--i": 2 }}>
            <h3 className="kicker">{t({ ko: "자격증", en: "Licenses", ru: "Квалификации" })}</h3>
            <ul className="about__plain">
              {licenses.map((l) => (
                <li key={t(l.name)}>
                  {t(l.name)}
                  <span>{l.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
