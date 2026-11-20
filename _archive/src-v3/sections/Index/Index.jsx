import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { work } from "../../data/work";
import { useLang } from "../../app/I18n";
import { useReveal } from "../../hooks/useInView";
import { isTouch, reducedMotion } from "../../webgl/media";
import Lightbox from "../../components/Lightbox/Lightbox";
import "./Index.css";

/** Full project list. Hovering a row floats its preview next to the cursor; a click opens the lightbox. */
export default function Index() {
  const { t, lang } = useLang();
  const root = useRef(null);
  const preview = useRef(null);
  const img = useRef(null);
  const vid = useRef(null);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  useReveal(root, [lang]);

  useEffect(() => {
    if (isTouch()) return;
    const p = preview.current;
    const qx = gsap.quickTo(p, "x", { duration: 0.6, ease: "power3.out" });
    const qy = gsap.quickTo(p, "y", { duration: 0.6, ease: "power3.out" });
    const qr = gsap.quickTo(p, "rotation", { duration: 0.8, ease: "power3.out" });
    let lx = 0;
    const move = (e) => {
      qx(e.clientX + 24);
      qy(e.clientY - 90);
      if (!reducedMotion()) qr(gsap.utils.clamp(-8, 8, (e.clientX - lx) * 0.4));
      lx = e.clientX;
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);

  const show = (w) => {
    if (isTouch()) return;
    img.current.src = w.image;
    const v = vid.current;
    if (w.video && !reducedMotion()) {
      if (v.dataset.id !== w.id) {
        v.dataset.id = w.id;
        v.src = w.video.mp4;
      }
      v.style.opacity = 1;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.style.opacity = 0;
    }
    gsap.to(preview.current, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "power4.out", overwrite: "auto" });
  };
  const hide = () => {
    vid.current?.pause();
    gsap.to(preview.current, { scale: 0.85, autoAlpha: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });
  };

  return (
    <section ref={root} id="index" className="section idx" aria-labelledby="idx-title">
      <div className="container">
        <div className="section-head">
          <p className="kicker rv">02 — {t({ ko: "전체 목록", en: "Index" })}</p>
          <h2 id="idx-title" className="rv" style={{ "--i": 1 }}>
            {t({ ko: "모든 프로젝트,", en: "Every project," })} <em>{t({ ko: "한 줄씩", en: "one line each" })}</em>
          </h2>
          <p className="rv" style={{ "--i": 2 }}>
            {t({
              ko: "행을 누르면 미리보기가 열리고, ↗ 를 누르면 실제 페이지로 이동해요.",
              en: "Click a row for a preview, or ↗ to open the live page.",
            })}
          </p>
        </div>

        <ul className="idx__list" onPointerLeave={hide}>
          <li className="idx__row idx__row--head" aria-hidden="true">
            <span>No.</span>
            <span>{t({ ko: "프로젝트", en: "Project" })}</span>
            <span>{t({ ko: "분야", en: "Field" })}</span>
            <span>{t({ ko: "미디어", en: "Media" })}</span>
            <span />
          </li>
          {work.map((w, i) => (
            <li key={w.id} className="idx__row rv" style={{ "--i": Math.min(i, 6) }} onPointerEnter={() => show(w)}>
              <button className="idx__open" onClick={() => setOpen(w)} onFocus={() => show(w)} onBlur={hide}>
                <span className="idx__no">{String(i + 1).padStart(2, "0")}</span>
                <span className="idx__title">
                  <img className="idx__thumb" src={w.image} alt="" loading="lazy" decoding="async" />
                  {w.title}
                </span>
                <span className="idx__cat">{t(w.category)}</span>
                <span className="idx__media">{w.video ? t({ ko: "영상", en: "Video" }) : t({ ko: "이미지", en: "Still" })}</span>
              </button>
              {w.href ? (
                <a className="idx__live" href={w.href} target="_blank" rel="noopener noreferrer" aria-label={`${w.title} — ${t({ ko: "사이트 열기", en: "open site" })}`}>
                  ↗
                </a>
              ) : (
                <span className="idx__live is-off" aria-hidden="true">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div ref={preview} className="idx__preview" aria-hidden="true">
        <img ref={img} alt="" />
        <video ref={vid} muted loop playsInline preload="none" />
      </div>

      {open && <Lightbox item={open} onClose={close} />}
    </section>
  );
}
