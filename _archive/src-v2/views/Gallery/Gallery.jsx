import { useEffect, useRef, useState } from "react";
import { SphereGallery } from "../../webgl/sphere";
import { work } from "../../data/work";
import { profile } from "../../data/profile";
import { useLang } from "../../app/I18n";
import "./Gallery.css";

const meta = (item, t) => [t(item.category), item.year].filter(Boolean).join(", ");

/** Home: a sphere of Kate's projects. Intro → drag to spin → click to zoom → click again for the overview. */
export default function Gallery({ active, onBurst }) {
  const { t, lang } = useLang();
  const host = useRef(null);
  const sphere = useRef(null);
  const tRef = useRef(t);
  tRef.current = t;
  const r = {
    wordmark: useRef(null),
    sideL: useRef(null),
    sideR: useRef(null),
    counterInner: useRef(null),
    counterNum: useRef(null),
    captionInner: useRef(null),
    captionTitle: useRef(null),
    captionCat: useRef(null),
    hint: useRef(null),
    cursor: useRef(null),
    overview: useRef(null),
  };
  const [zoomed, setZoomed] = useState(null);
  const [overviewOpen, setOverviewOpen] = useState(false);

  const labels = {
    overview: t({ ko: "자세히", en: "Overview" }),
    close: t({ ko: "닫기", en: "Close" }),
  };

  useEffect(() => {
    const s = new SphereGallery({
      host: host.current,
      items: work.slice(0, 20),
      ui: {
        wordmark: r.wordmark.current,
        sides: [r.sideL.current, r.sideR.current],
        counterInner: r.counterInner.current,
        counterNum: r.counterNum.current,
        captionInner: r.captionInner.current,
        hint: r.hint.current,
        cursor: r.cursor.current,
        overview: r.overview.current,
        setCaption: (item) => {
          r.captionTitle.current.textContent = item.title;
          r.captionCat.current.textContent = meta(item, tRef.current);
        },
      },
      onZoom: setZoomed,
      onOverview: setOverviewOpen,
      onBurst,
    });
    sphere.current = s;
    return () => s.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const s = sphere.current;
    if (!s) return;
    if (active) s.start();
    else s.stop();
  }, [active]);

  useEffect(() => {
    sphere.current?.setLang(labels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section className="view gallery" id="view-gallery" aria-label={t({ ko: "작업 구", en: "Work sphere" })}>
      <div ref={host} className="view__gl" />

      <h1 ref={r.wordmark} className="gallery__mark">
        kate<span>.</span>
        <span className="visually-hidden">
          {" "}
          — {profile.firstName} {profile.lastName}, Web Designer &amp; Publisher
        </span>
      </h1>

      <p className="gallery__side gallery__side--l" aria-hidden="true">
        <span ref={r.sideL}>
          {profile.firstName} {profile.lastName}
        </span>
      </p>
      <p className="gallery__side gallery__side--r" aria-hidden="true">
        <span ref={r.sideR}>{t({ ko: "웹디자이너 & 퍼블리셔, 서울", en: "Web Designer & Publisher, Seoul" })}</span>
      </p>

      <div className="gallery__counter" aria-hidden="true">
        <span ref={r.counterInner}>
          <span ref={r.counterNum}>001</span>
        </span>
      </div>

      <div className="gallery__caption" aria-live="polite">
        <span ref={r.captionInner} className="gallery__caption-inner">
          <b ref={r.captionTitle} />
          <i ref={r.captionCat} />
        </span>
      </div>

      <p ref={r.hint} className="gallery__hint kicker">
        {t({ ko: "드래그해서 둘러보기", en: "Drag to explore" })}
      </p>

      <div ref={r.cursor} className="cursor-label" aria-hidden="true" />

      <div ref={r.overview} className="overview" role="dialog" aria-label={zoomed?.title} hidden={!zoomed}>
        {zoomed && (
          <>
            <div className="overview__head">
              <p>
                <b>{zoomed.title}</b> <i>{meta(zoomed, t)}</i>
              </p>
              <button className="pill-btn" onClick={() => sphere.current.collapse()}>
                {labels.close}
              </button>
            </div>
            <p className="overview__desc">{t(zoomed.desc)}</p>
            <div className="overview__foot">
              <ul className="overview__tags">
                <li>{zoomed.video ? t({ ko: "프리뷰 영상", en: "Preview video" }) : t({ ko: "스크린샷", en: "Screenshot" })}</li>
                <li>{t(zoomed.category)}</li>
                <li>{zoomed.href ? t({ ko: "라이브 페이지", en: "Live page" }) : "Figma"}</li>
              </ul>
              {zoomed.href && (
                <a className="pill-btn pill-btn--light" href={zoomed.href} target="_blank" rel="noopener noreferrer">
                  {t({ ko: "사이트 열기", en: "Open site" })} ↗
                </a>
              )}
            </div>
          </>
        )}
      </div>
      {/* when the overview is closed, clicking the plane again opens it */}
      <span className="visually-hidden" aria-live="polite">
        {zoomed && !overviewOpen ? t({ ko: "한 번 더 누르면 설명이 열려요", en: "Click again for the overview" }) : ""}
      </span>

      {/* the sphere is WebGL — keyboard and screen-reader users get a plain list */}
      <nav className="visually-hidden" aria-label={t({ ko: "프로젝트 목록", en: "Projects" })}>
        <ul>
          {work.map((w) => (
            <li key={w.id}>
              {w.href ? (
                <a href={w.href} target="_blank" rel="noopener noreferrer">
                  {w.title} — {t(w.category)}
                </a>
              ) : (
                <span>
                  {w.title} — {t(w.category)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
