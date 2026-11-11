import { useState } from "react";
import Modal from "../../ui/Modal/Modal";
import Button from "../../ui/Button/Button";
import { caseStudies, hasCaseStudy } from "../../../data/caseStudies";
import "./CaseStudy.css";

/** Case study content: problem → process → result. Empty parts are not shown. */
function CaseStudyBody({ cs }) {
  return (
    <article className="cs">
      {cs.type && <p className="cs__kicker t-mono t-muted">{cs.type}</p>}
      <h3 className="cs__title t-display">
        {cs.title} {cs.titleKo && <span className="cs__ko t-blob">{cs.titleKo}</span>}
      </h3>
      {cs.lead && <p className="cs__lead">{cs.lead}</p>}

      <dl className="cs__meta">
        {cs.role && (
          <div>
            <dt className="t-mono">Role</dt>
            <dd>{cs.role}</dd>
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
            <dd>{cs.tools.join(" · ")}</dd>
          </div>
        )}
      </dl>

      {cs.problem && (
        <section className="cs__block">
          <h4 className="cs__label t-mono">01 — Problem</h4>
          <p>{cs.problem}</p>
        </section>
      )}
      {cs.process?.length > 0 && (
        <section className="cs__block">
          <h4 className="cs__label t-mono">02 — Process</h4>
          <ol className="cs__steps">
            {cs.process.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                {step.text && <p>{step.text}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}
      {cs.images?.length > 0 && (
        <div className="cs__images">
          {cs.images.map((img) => (
            <img key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" />
          ))}
        </div>
      )}
      {cs.result && (
        <section className="cs__block">
          <h4 className="cs__label t-mono">03 — Result</h4>
          <p>{cs.result}</p>
        </section>
      )}
      {cs.next?.length > 0 && (
        <section className="cs__block">
          <h4 className="cs__label t-mono">Next</h4>
          <p>{cs.next.join(" · ")}</p>
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
