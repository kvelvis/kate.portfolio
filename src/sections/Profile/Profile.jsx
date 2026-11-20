import { useRef } from "react";
import { skillGroups, licenses, timeline } from "../../data/profile";
import { useLang } from "../../app/I18n";
import { useReveal } from "../../hooks/useInView";
import "./Profile.css";

const LEVEL = { ko: { 3: "매일", 2: "실무", 1: "기초" }, en: { 3: "daily", 2: "working", 1: "familiar" } };

/** Skills by group, certificates beside them, timeline below. */
export default function Profile() {
  const { t, lang } = useLang();
  const root = useRef(null);
  useReveal(root, [lang]);

  return (
    <section ref={root} id="profile" className="section prof" aria-labelledby="prof-title">
      <div className="container">
        <div className="section-head">
          <p className="kicker rv">{t({ ko: "프로필", en: "Profile" })}</p>
          <h2 id="prof-title" className="rv" style={{ "--i": 1 }}>
            {t({ ko: "스킬과 자격증으로 보는", en: "Kate’s skills" })} <em>{t({ ko: "케이트", en: "& certificates" })}</em>
          </h2>
        </div>

        <div className="prof__layout">
          <div className="prof__skills">
            {skillGroups.map((g, gi) => (
              <div key={g.group} className="prof__group rv" style={{ "--i": gi }}>
                <h3 className="prof__group-name">{g.group}</h3>
                <ul>
                  {g.items.map((it) => (
                    <li key={t(it.name)}>
                      <span>{t(it.name)}</span>
                      <span className="prof__lvl" title={LEVEL[lang][it.level]}>
                        {[1, 2, 3].map((d) => (
                          <i key={d} className={d <= it.level ? "on" : ""} />
                        ))}
                        <em className="visually-hidden">{LEVEL[lang][it.level]}</em>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <aside className="prof__certs rv" style={{ "--i": 4 }} aria-labelledby="prof-certs">
            <h3 id="prof-certs" className="prof__group-name">{t({ ko: "자격증", en: "Certificates" })}</h3>
            <ul>
              {licenses
                .filter((l) => l.skill)
                .map((l) => (
                  <li key={t(l.name)} className="prof__cert">
                    <span className="prof__cert-mark" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="9" r="5.5" />
                        <path d="M9 13.8 7.5 21l4.5-2.4 4.5 2.4-1.5-7.2" />
                        <path d="m9.8 9 1.6 1.6 2.9-3" />
                      </svg>
                    </span>
                    <b>{t(l.name)}</b>
                    {l.issuer && <span className="prof__cert-issuer">{t(l.issuer)}</span>}
                    {l.covers && <span className="prof__cert-covers">{t(l.covers)}</span>}
                    {l.date && <span className="prof__cert-date">{l.date}</span>}
                  </li>
                ))}
            </ul>
          </aside>
        </div>
        <p className="prof__legend" aria-hidden="true">
          {[3, 2, 1].map((l) => (
            <span key={l}>
              {[1, 2, 3].map((d) => (
                <i key={d} className={d <= l ? "on" : ""} />
              ))}
              {LEVEL[lang][l]}
            </span>
          ))}
        </p>

        <div className="prof__path rv" aria-labelledby="prof-path">
          <h3 id="prof-path" className="prof__group-name">{t({ ko: "걸어온 길", en: "My path" })}</h3>
          <ol className="tl" style={{ gridTemplateColumns: `repeat(${timeline.length + 1}, minmax(0, 1fr))` }}>
            {timeline.map((n, i) => (
              <li
                key={i}
                className={`tl__item tl__item--${n.kind} tl__item--${i % 2 ? "down" : "up"}`}
                style={{ gridColumn: `${i + 1} / span 2` }}
              >
                <span className="tl__dot" aria-hidden="true" />
                <span className="tl__when">{t(n.when)}</span>
                <b className="tl__title">{t(n.title)}</b>
                {n.note && <span className="tl__note">{t(n.note)}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
