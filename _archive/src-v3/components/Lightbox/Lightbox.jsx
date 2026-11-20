import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { caseStudies } from "../../data/caseStudies";
import { useLang } from "../../app/I18n";
import { makeVideo } from "../../webgl/media";
import "./Lightbox.css";

const metaOf = (item, t) => [t(item.category), item.year].filter(Boolean).join(", ");

/** Project preview: video (or screenshot), description, role/tools when the case study has them, links. */
export default function Lightbox({ item, onClose }) {
  const { t } = useLang();
  const root = useRef(null);
  const frame = useRef(null);
  const closeBtn = useRef(null);
  const cs = item.caseStudy && caseStudies[item.caseStudy];

  useEffect(() => {
    const prev = document.activeElement;
    const html = document.documentElement;
    const sbw = innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    html.style.paddingRight = `${sbw}px`;
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
    gsap.fromTo(frame.current, { scale: 0.94, y: 20 }, { scale: 1, y: 0, duration: 0.9, ease: "expo.out" });
    closeBtn.current?.focus({ preventScroll: true });

    let v;
    if (item.video) {
      v = makeVideo(item.video, "auto");
      v.className = "lightbox__media";
      v.setAttribute("aria-hidden", "true");
      v.poster = item.image;
      frame.current.prepend(v);
      v.play().catch(() => {});
    }
    const key = (e) => {
      if (e.key === "Escape") onClose();
      // keep focus inside the dialog
      if (e.key === "Tab") {
        const f = root.current.querySelectorAll("a[href],button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    addEventListener("keydown", key);
    return () => {
      removeEventListener("keydown", key);
      html.style.overflow = "";
      html.style.paddingRight = "";
      if (v) {
        v.pause();
        v.removeAttribute("src");
        v.load();
        v.remove();
      }
      prev?.focus?.({ preventScroll: true });
    };
  }, [item, onClose]);

  return (
    <div ref={root} className="lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lightbox__inner">
        <div ref={frame} className="lightbox__frame">
          {!item.video && <img className="lightbox__media" src={item.image} alt="" />}
        </div>
        <div className="lightbox__info">
          <p className="lightbox__title">
            <b>{item.title}</b> <i>{metaOf(item, t)}</i>
          </p>
          <p className="lightbox__desc">{t(item.desc)}</p>
          {cs && (t(cs.role) || cs.tools?.length > 0) && (
            <dl className="lightbox__facts">
              {t(cs.role) && (
                <div>
                  <dt>Role</dt>
                  <dd>{t(cs.role)}</dd>
                </div>
              )}
              {cs.tools?.length > 0 && (
                <div>
                  <dt>Tools</dt>
                  <dd>{cs.tools.join(" · ")}</dd>
                </div>
              )}
            </dl>
          )}
          <div className="lightbox__actions">
            {item.href && (
              <a className="pill-btn pill-btn--light" href={item.href} target="_blank" rel="noopener noreferrer">
                {t({ ko: "사이트 열기", en: "Open site" })} ↗
              </a>
            )}
            {cs?.links?.figma && (
              <a className="pill-btn" href={cs.links.figma} target="_blank" rel="noopener noreferrer">
                Figma ↗
              </a>
            )}
            <button ref={closeBtn} className="pill-btn" onClick={onClose}>
              {t({ ko: "닫기", en: "Close" })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
