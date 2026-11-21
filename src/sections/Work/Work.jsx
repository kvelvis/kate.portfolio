import { useEffect, useRef, useState } from "react";
import { SphereGallery } from "../../webgl/sphere";
import { work } from "../../data/work";
import { caseStudies } from "../../data/caseStudies";
import { useLang } from "../../app/I18n";
import { useInView } from "../../hooks/useInView";
import { notifyProject } from "../../app/notify";
import "./Work.css";

// project sites open in the device viewer (public/preview.html)
const previewUrl = (href, lang) => (href ? `${import.meta.env.BASE_URL}preview.html?url=${encodeURIComponent(href)}&lang=${lang}` : undefined);

/*
 * Holds the page on the sphere while its intro plays, so it can't be scrolled past.
 * Guarded: first time only, only when arriving from above, never with reduced motion,
 * Esc releases it, and it always lets go after MAX_LOCK ms.
 */
const MAX_LOCK = 4000;
const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
function lockScroll() {
  const stop = (e) => e.preventDefault();
  const keys = (e) => {
    if (e.key === "Escape") return release();
    if (SCROLL_KEYS.has(e.key) && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) e.preventDefault();
  };
  addEventListener("wheel", stop, { passive: false });
  addEventListener("touchmove", stop, { passive: false });
  addEventListener("keydown", keys);
  const timer = setTimeout(() => release(), MAX_LOCK);
  let done = false;
  function release() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    removeEventListener("wheel", stop);
    removeEventListener("touchmove", stop);
    removeEventListener("keydown", keys);
  }
  return release;
}

// font specimens in a project story need that project's fonts — load each stylesheet once
const loadedCss = new Set();
const loadCss = (href) => {
  if (loadedCss.has(href)) return;
  loadedCss.add(href);
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
};

const metaOf = (item, t) => [t(item.category), item.year].filter(Boolean).join(", ");

// "여덟 개의 프로젝트, 하나의 구" / "Eight projects, one sphere": the number follows data/work.js
const EN_NUM = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];
const KO_NUM = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열", "열한", "열두", "열세", "열네", "열다섯", "열여섯", "열일곱", "열여덟", "열아홉", "스무"];
const countTitle = (n) => ({
  ko: `${KO_NUM[n] || n} 개의 프로젝트,`,
  en: `${EN_NUM[n] || n} project${n === 1 ? "" : "s"},`,
});

/** Project sphere. Plays its intro the first time it scrolls into view. */
export default function Work() {
  const { t, lang } = useLang();
  const root = useRef(null);
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
    cursor: useRef(null),
    overview: useRef(null),
    go: useRef(null),
  };
  const [zoomed, setZoomed] = useState(null);
  const panelTitle = useRef(null);
  const lastTrigger = useRef(null);
  const unlock = useRef(null);
  const soon = useInView(root, "150% 0px"); // build + preload stills a screen and a half early
  const near = useInView(root, "300px 0px");
  const seen = useInView(root, "0px 0px -35% 0px");

  const cs = zoomed?.caseStudy && caseStudies[zoomed.caseStudy];
  useEffect(() => cs?.fontCss?.forEach(loadCss), [cs]);

  // keyboard / screen reader: focus moves into the panel when a project opens, and back when it closes
  useEffect(() => {
    if (zoomed) {
      const id = setTimeout(() => panelTitle.current?.focus({ preventScroll: true }), 450);
      return () => clearTimeout(id);
    }
    lastTrigger.current?.focus({ preventScroll: true });
    lastTrigger.current = null;
  }, [zoomed]);

  useEffect(() => notifyProject(zoomed?.title), [zoomed]);

  const openFromList = (i, e) => {
    lastTrigger.current = e.currentTarget;
    root.current.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    sphere.current?.open(i);
  };
  const labels = { overview: t({ ko: "자세히", en: "Overview" }), close: t({ ko: "닫기", en: "Close" }) };

  // built the first time the section comes close
  useEffect(() => {
    if (!(soon || near) || sphere.current) return;
    sphere.current = new SphereGallery({
      host: host.current,
      items: work.slice(0, 20),
      ui: {
        wordmark: r.wordmark.current,
        sides: [r.sideL.current, r.sideR.current],
        counterInner: r.counterInner.current,
        counterNum: r.counterNum.current,
        captionInner: r.captionInner.current,
        cursor: r.cursor.current,
        overview: r.overview.current,
        go: r.go.current,
        setCaption: (item) => {
          r.captionTitle.current.textContent = item.title;
          r.captionCat.current.textContent = metaOf(item, tRef.current);
        },
      },
      onZoom: setZoomed,
    });
    sphere.current.onIntroDone = () => unlock.current?.();
    sphere.current.setLang(labels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soon, near]);

  useEffect(() => () => {
    unlock.current?.();
    sphere.current?.destroy();
  }, []);

  useEffect(() => {
    const s = sphere.current;
    if (!s) return;
    if (near) s.start();
    else {
      s.collapse();
      s.stop();
    }
  }, [near]);

  useEffect(() => {
    const s = sphere.current;
    if (!seen || !s || s.played) return;
    const el = root.current;
    const fromAbove = el.getBoundingClientRect().top > 0;
    if (fromAbove && !s.reduced) {
      // settle the section on screen, then hold it until the intro is over
      scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: "smooth" });
      unlock.current = lockScroll();
    }
    s.play();
  }, [seen, near]);

  useEffect(() => {
    sphere.current?.setLang(labels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <>
    <div className="container">
      <aside className="work-ai" aria-labelledby="work-ai-title">
        <h2 id="work-ai-title" className="work-ai__title">
          {t({ ko: "AI 활용에 대해", en: "About AI" })}
        </h2>
        <div className="work-ai__text">
          <p>
            {t({
              ko: "채용 공고와 최근 업계 트렌드를 참고해, 이번 포트폴리오에는 AI를 활용했습니다.",
              en: "Following job postings and recent industry trends, I used AI in this portfolio.",
            })}
          </p>
          <p>
            {t({
              ko: "이 포트폴리오의 사이트들은 대부분 제가 예전에 직접 기획하고 디자인하고 코딩한 작업물이며, 이후 AI와 함께 리디자인했습니다.",
              en: "Most of the sites here I planned, designed and coded myself earlier, then redesigned with AI.",
            })}
          </p>
        </div>
      </aside>
    </div>
    <section ref={root} id="work" className={`work${zoomed ? " is-zoomed" : ""}`} aria-labelledby="work-title">
      <div className="work__head container">
        <p className="kicker">{t({ ko: "작업", en: "Selected work" })}</p>
        <h2 id="work-title">
          {t(countTitle(work.length))} <em>{t({ ko: "하나의 구", en: "one sphere" })}</em>
        </h2>
      </div>

      <div ref={host} className="gl work__gl" />

      <p ref={r.wordmark} className="work__mark" aria-hidden="true">
        work<span>.</span>
      </p>
      <p className="work__side work__side--l" aria-hidden="true">
        <span ref={r.sideL}>{t({ ko: "웹 · 브랜드", en: "Web, brand & interactive" })}</span>
      </p>
      <p className="work__side work__side--r" aria-hidden="true">
        <span ref={r.sideR}>{t({ ko: "드래그로 돌리고, 클릭해서 열기", en: "Drag to spin, click to open" })}</span>
      </p>

      <div className="work__counter" aria-hidden="true">
        <span ref={r.counterInner}>
          <span ref={r.counterNum}>001</span>
        </span>
      </div>

      <div className="work__caption" aria-hidden="true">
        <span ref={r.captionInner} className="work__caption-inner">
          <b ref={r.captionTitle} />
          <i ref={r.captionCat} />
        </span>
      </div>

   

      <div ref={r.cursor} className="cursor-label" aria-hidden="true" />

      <a
        ref={r.go}
        className="work__go"
        href={previewUrl(zoomed?.href, lang)}
        hidden={!zoomed?.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t({ ko: "사이트 바로가기", en: "Visit the site" })} <span aria-hidden="true">↗</span>
      </a>

      {/* close button in the top-right corner */}
      <button type="button" className="work__x" hidden={!zoomed} aria-label={labels.close} onClick={() => sphere.current.collapse()}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
        </svg>
      </button>

      <div ref={r.overview} className="overview" role="dialog" aria-label={zoomed?.title} hidden={!zoomed}>
        {zoomed && (
          <div className={`overview__in${cs?.story?.length ? " has-story" : ""}`}>
            <p className="kicker">
              {String(work.indexOf(zoomed) + 1).padStart(2, "0")} / {String(work.length).padStart(2, "0")} · {metaOf(zoomed, t)}
            </p>
            <h3 ref={panelTitle} tabIndex={-1} className="overview__title">
              {zoomed.title}
              {cs?.titleEn && <small>{t(cs.titleEn)}</small>}
            </h3>
            {zoomed.desc && <p className="overview__desc">{t(zoomed.desc)}</p>}
            <div className="overview__body" tabIndex={cs?.story?.length ? 0 : undefined}>
              {cs && (cs.period || cs.role || cs.tools?.length > 0 || cs.credits?.length > 0) && (
                <dl className="overview__facts">
                  {cs.period && (
                    <div>
                      <dt>{t({ ko: "기간", en: "When" })}</dt>
                      <dd>{t(cs.period)}</dd>
                    </div>
                  )}
                  {cs.role && (
                    <div>
                      <dt>{t({ ko: "역할", en: "Role" })}</dt>
                      <dd>{t(cs.role)}</dd>
                    </div>
                  )}
                  {cs.tools?.length > 0 && (
                    <div>
                      <dt>{t({ ko: "도구", en: "Tools" })}</dt>
                      <dd>{cs.tools.join(" · ")}</dd>
                    </div>
                  )}
                  {cs.credits?.map((c) => (
                    <div key={t(c.label)}>
                      <dt>{t(c.label)}</dt>
                      <dd>
                        {c.href ? (
                          <a href={c.href} target="_blank" rel="noopener noreferrer" className="overview__credit">
                            {c.value} ↗
                          </a>
                        ) : (
                          c.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {cs?.story?.map((sec) => (
                <section key={t(sec.title)} className="overview__sec">
                  <h4>{t(sec.title)}</h4>
                  {sec.text && <p>{t(sec.text)}</p>}
                  {sec.colors && (
                    <ul className="overview__swatches">
                      {sec.colors.map((c) => (
                        <li key={c.hex} className={c.main ? "is-main" : ""}>
                          <i style={{ background: c.bg || c.hex }} aria-hidden="true" />
                          <b>{t(c.name)}</b>
                          <code>{c.code || c.hex.toUpperCase()}</code>
                        </li>
                      ))}
                    </ul>
                  )}
                  {sec.fonts && (
                    <ul className="overview__fonts">
                      {sec.fonts.map((f) => (
                        <li key={f.name}>
                          <span className="overview__specimen" style={{ fontFamily: f.family, fontWeight: f.weight, fontStyle: f.italic ? "italic" : undefined }}>
                            {f.sample}
                          </span>
                          <span className="overview__font-meta">
                            <b>{f.name}</b> · {t(f.role)}
                            {f.note && <em>{t(f.note)}</em>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {sec.tags && (
                    <ul className="overview__tags">
                      {sec.tags.map((tag) => (
                        <li key={t(tag)}>{t(tag)}</li>
                      ))}
                    </ul>
                  )}
                  {sec.items && (
                    <ul>
                      {sec.items.map((it) => (
                        <li key={t(it.text)}>
                          {it.term && <b>{t(it.term)}</b>}
                          {t(it.text)}
                          {it.why && (
                            <span className="overview__why">
                              <i>{t({ ko: "왜", en: "Why" })}</i>
                              {t(it.why)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
            <div className="overview__actions">
              {zoomed.href && (
                <a className="pill-btn pill-btn--light overview__go overview__go--inline" href={previewUrl(zoomed.href, lang)} target="_blank" rel="noopener noreferrer">
                  {t({ ko: "사이트 바로가기", en: "Visit the site" })} <span aria-hidden="true">↗</span>
                </a>
              )}
              {cs?.links?.figma && (
                <a className="pill-btn" href={cs.links.figma} target="_blank" rel="noopener noreferrer">
                  Figma ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>

    {/* every project as plain HTML, for keyboard, screen reader and search engines */}
    <section className="work-list container" aria-labelledby="work-list-title">
      <h3 id="work-list-title" className="kicker">
        {t({ ko: "전체 목록", en: "All projects" })}
      </h3>
      <ol>
        {work.map((item, i) => (
          <li key={item.id} className="work-list__row">
            <span className="work-list__no">{String(i + 1).padStart(2, "0")}</span>
            <span className="work-list__title">{item.title}</span>
            <span className="work-list__cat">{t(item.category)}</span>
            <span className="work-list__year">{item.year}</span>
            <span className="work-list__actions">
              <button type="button" className="pill-btn" onClick={(e) => openFromList(i, e)}>
                {t({ ko: "설명", en: "Details" })}
              </button>
              {item.href && (
                <a className="pill-btn" href={previewUrl(item.href, lang)} target="_blank" rel="noopener noreferrer">
                  {t({ ko: "사이트", en: "Site" })} <span aria-hidden="true">↗</span>
                </a>
              )}
              {!item.href && caseStudies[item.caseStudy]?.links?.figma && (
                <a className="pill-btn" href={caseStudies[item.caseStudy].links.figma} target="_blank" rel="noopener noreferrer">
                  Figma <span aria-hidden="true">↗</span>
                </a>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
    </>
  );
}
