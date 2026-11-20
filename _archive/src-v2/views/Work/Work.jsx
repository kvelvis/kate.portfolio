import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WorkGrid } from "../../webgl/grid";
import { work } from "../../data/work";
import { caseStudies } from "../../data/caseStudies";
import { useLang } from "../../app/I18n";
import { makeVideo } from "../../webgl/media";
import "./Work.css";

const metaOf = (item, t) => [t(item.category), item.year].filter(Boolean).join(", ");

function gridText(t) {
  return {
    headA: t({ ko: "직접 디자인하고 퍼블리싱한 ", en: "A Selected Index of " }),
    headB: t({ ko: "웹 · 브랜드 · 인터랙티브 작업", en: "Web, Brand and Interactive Work" }),
    headLines: [
      { a: t({ ko: "직접 디자인하고 ", en: "A Selected Index of " }), b: t({ ko: "", en: "Web, Brand" }) },
      t({ ko: "퍼블리싱한 웹 · 브랜드 작업", en: "and Interactive Work" }),
    ],
    footL: "Ekaterina Vlasova",
    footR: t({ ko: "인덱스 · 서울", en: "Index · Seoul" }),
    cat: (item) => t(item.category),
    meta: (item) => metaOf(item, t),
  };
}

function Lightbox({ item, onClose }) {
  const { t } = useLang();
  const root = useRef(null);
  const frame = useRef(null);
  const closeBtn = useRef(null);
  const cs = item.caseStudy && caseStudies[item.caseStudy];

  useEffect(() => {
    const prev = document.activeElement;
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
    gsap.fromTo(frame.current, { scale: 0.94, y: 20 }, { scale: 1, y: 0, duration: 0.9, ease: "expo.out" });
    closeBtn.current?.focus({ preventScroll: true });

    let v;
    if (item.video) {
      v = makeVideo(item.video, "auto");
      v.className = "lightbox__media";
      v.setAttribute("aria-hidden", "true");
      frame.current.prepend(v);
      v.play().catch(() => {});
    }
    const key = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", key);
    return () => {
      removeEventListener("keydown", key);
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

/** Project index: WebGL grid with glass-lens edges, hover-to-play and a lightbox. */
export default function Work({ active }) {
  const { t, lang } = useLang();
  const host = useRef(null);
  const bubble = useRef(null);
  const grid = useRef(null);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const g = new WorkGrid({ host: host.current, items: work, text: gridText(t), onOpen: setOpen, bubble: bubble.current });
    grid.current = g;
    return () => g.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (active && !open) grid.current?.start();
    else grid.current?.stop();
  }, [active, open]);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) return void (first.current = false);
    grid.current?.ready.then(() => grid.current?.setText(gridText(t)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section className="view work" id="view-projects" aria-label={t({ ko: "프로젝트 인덱스", en: "Project index" })}>
      <div ref={host} className="view__gl" />
      <div ref={bubble} className="work__bubble" aria-hidden="true">
        {t({ ko: "보기", en: "View" })}
      </div>

      {/* accessible mirror of the WebGL grid */}
      <ul className="visually-hidden">
        {work.map((w) => (
          <li key={w.id}>
            <button onClick={() => setOpen(w)}>
              {w.title} — {metaOf(w, t)}
            </button>
          </li>
        ))}
      </ul>

      {open && <Lightbox item={open} onClose={close} />}
    </section>
  );
}
