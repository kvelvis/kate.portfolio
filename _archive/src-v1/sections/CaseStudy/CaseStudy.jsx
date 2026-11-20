import { useState } from "react";
import Modal from "../../ui/Modal/Modal";
import Button from "../../ui/Button/Button";
import { caseStudies, hasCaseStudy } from "../../../data/caseStudies";
import { useLang } from "../../../app/I18n";
import "./CaseStudy.css";

/** Case study content: problem → process → result. Empty parts are not shown. */
function CaseStudyBody({ cs }) {
  const { t } = useLang();
  return (
    <article className="cs">
      {cs.type && <p className="cs__kicker t-mono t-muted">{t(cs.type)}</p>}
      <h3 className="cs__title t-display">
        {cs.title} {cs.titleKo && <span className="cs__ko t-blob">{cs.titleKo}</span>}
      </h3>
      {t(cs.lead) && <p className="cs__lead">{t(cs.lead)}</p>}

      <dl className="cs__meta">
        {t(cs.role) && (
          <div>
            <dt className="t-mono">Role</dt>
            <dd>{t(cs.role)}</dd>
          </div>
        )}
        {cs.period && (
          <div>
            <dt className="t-mono">Period</dt>
            <dd>{cs.period}</dd>
          </div>
        )}
        {cs.tools?.length > 0 && (
          <div>
            <dt className="t-mono">Tools</dt>
            <dd>{cs.tools.map(t).join(" · ")}</dd>
          </div>
        )}
      </dl>

      {t(cs.problem) && (
        <section className="cs__block">
          <h4 className="cs__label t-mono">01 — Problem</h4>
          <p>{t(cs.problem)}</p>
        </section>
      )}
      {cs.process?.length > 0 && (
        <section className="cs__block">
          <h4 className="cs__label t-mono">02 — Process</h4>
          <ol className="cs__steps">
            {cs.process.map((step) => (
              <li key={t(step.title)}>
                <strong>{t(step.title)}</strong>
                {t(step.text) && <p>{t(step.text)}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}
      {cs.images?.length > 0 && (
        <div className="cs__images">
          {cs.images.map((img) => (
            <img key={img.src} src={img.src} alt={t(img.alt)} width={img.width} height={img.height} loading="lazy" decoding="async" />
          ))}
        </div>
      )}
      {t(cs.result) && (
        <section className="cs__block">
          <h4 className="cs__label t-mono">03 — Result</h4>
          <p>{t(cs.result)}</p>
        </section>
      )}
      {cs.next?.length > 0 && (
        <section className="cs__block">
          <h4 className="cs__label t-mono">Next</h4>
          <p>{cs.next.map(t).join(" · ")}</p>
        </section>
      )}

      <div className="cs__links">
        {cs.links?.live && (
          <Button href={cs.links.live} size="sm" icon="↗">
            Visit site
          </Button>
        )}
        {cs.links?.figma && (
          <Button href={cs.links.figma} size="sm" variant="ghost" icon="↗">
            Figma
          </Button>
        )}
      </div>
    </article>
  );
}

/** "Case study" button + modal. Renders nothing until the case study has a problem or result. */
export default function CaseStudyButton({ id, variant = "ghost", className = "" }) {
  const [open, setOpen] = useState(false);
  if (!hasCaseStudy(id)) return null;
  const cs = caseStudies[id];

  return (
    <>
      <Button size="sm" variant={variant} className={className} onClick={() => setOpen(true)} icon="→">
        Case study
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} label={`${cs.title} case study`} variant="wide">
        <CaseStudyBody cs={cs} />
      </Modal>
    </>
  );
}
