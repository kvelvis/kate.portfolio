import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Badge } from "../../webgl/badge";
import { reducedMotion } from "../../webgl/media";
import { profile, links } from "../../data/profile";
import { useLang } from "../../app/I18n";
import { useInView } from "../../hooks/useInView";
import badgeImg from "../../assets/img/badge_card.png";
import "./Hero.css";

const mail = links.email && `mailto:${links.email}`;
const STATUS = { ko: "구직 중 · 프리랜서 가능", en: "Open to work · available for freelance", ru: "Ищу работу · открыта для фриланса" };

/** split "Greeting. Rest of the text" → [greeting, rest] */
const splitIntro = (s) => {
  const i = s.indexOf(". ");
  return i < 0 ? ["", s] : [s.slice(0, i + 1), s.slice(i + 2)];
};

/** First screen: intro text and the draggable badge. */
export default function Hero() {
  const { t, lang } = useLang();
  const root = useRef(null);
  const gl = useRef(null);
  const hit = useRef(null);
  const sys = useRef(null);
  const inView = useInView(root);
  const [hello, rest] = splitIntro(t(profile.intro));

  useEffect(() => {
    const badge = new Badge({ host: gl.current, image: badgeImg });
    const s = { badge, running: false, raf: 0 };
    sys.current = s;

    // the invisible hit box follows the card, so only the card blocks page scrolling on touch
    const hb = hit.current;
    const down = (e) => {
      if (!badge.h.down(e)) return;
      hb.setPointerCapture?.(e.pointerId);
      root.current.classList.add("is-grabbing");
    };
    const move = (e) => {
      badge.h.move(e);
      hb.classList.toggle("is-over", badge.hovering);
    };
    const up = (e) => {
      badge.h.up(e);
      root.current?.classList.remove("is-grabbing");
    };
    const noSelect = (e) => e.preventDefault(); // dragging the card must not select text
    hb.addEventListener("pointerdown", down);
    hb.addEventListener("mousedown", noSelect);
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);

    s.loop = () => {
      let last = performance.now();
      const tick = (now) => {
        if (!s.running) return;
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        badge.frame(dt);
        const b = badge.bounds();
        // hit box: card body plus the clip, axis-aligned
        const top = b.hh + badge.cardH * 0.157;
        hb.style.transform = `translate3d(${badge.W / 2 + b.x - b.hw}px, ${badge.H / 2 + b.y - top}px, 0)`;
        hb.style.width = `${b.hw * 2}px`;
        hb.style.height = `${top + b.hh}px`;
        s.raf = requestAnimationFrame(tick);
      };
      s.raf = requestAnimationFrame(tick);
    };

    return () => {
      s.running = false;
      cancelAnimationFrame(s.raf);
      hb.removeEventListener("pointerdown", down);
      hb.removeEventListener("mousedown", noSelect);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
      badge.destroy();
    };
  }, []);

  // render only while the hero is on screen
  useEffect(() => {
    const s = sys.current;
    if (!s) return;
    if (inView && !s.running) {
      s.running = true;
      s.loop();
    } else if (!inView) {
      s.running = false;
      cancelAnimationFrame(s.raf);
    }
  }, [inView]);

  // text: words rise in on load and on language change
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero__copy .w > span", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.018, delay: 0.15 });
      gsap.fromTo(".hero__name", { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.9, ease: "power2.inOut", delay: 1.1 });
      gsap.fromTo(".hero__meta, .hero__cta, .hero__foot > *", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.7 });
    }, root);
    return () => ctx.revert();
  }, [lang]);

  // the name ("케이트" / "Kate") gets a highlighter stroke; the particle after it stays plain
  const NAME = /(케이트|Kate)/;
  const mark = (w) =>
    w.split(NAME).map((part, j) =>
      NAME.test(part) ? (
        <mark key={j} className="hero__name">
          {part}
        </mark>
      ) : (
        part
      )
    );
  const words = (s) =>
    s.split(" ").map((w, i) => (
      <Fragment key={i}>
        <span className="w">
          <span>{mark(w)}</span>
        </span>{" "}
      </Fragment>
    ));

  return (
    <section ref={root} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__copy container" key={lang}>
        <p className="hero__meta kicker">
          {profile.firstName} {profile.lastName} · {t({ ko: "웹디자이너 · 웹퍼블리셔", en: "Web Designer & Web Publisher", ru: "Веб-дизайнер и верстальщик" })}
        </p>
        <h1 id="hero-title" className="hero__hello">
          {words(hello)}
        </h1>
        <p className="hero__lead">{words(rest)}</p>
        <a className="hero__cta" href="#work">
          {t({ ko: "작업 보기", en: "See my work", ru: "Смотреть работы" })} <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div ref={gl} className="gl hero__gl" aria-hidden="true" />
      <div ref={hit} className="hero__hit" aria-hidden="true" title={t({ ko: "드래그해서 흔들어 보세요", en: "Drag to swing", ru: "Потяните, чтобы раскачать" })} />

      <div className="hero__foot">
        <p>
          {mail ? (
            <a href={mail}>
              <i className="hero__dot" aria-hidden="true" />
              {t(STATUS)}
            </a>
          ) : (
            t(STATUS)
          )}
          <span>{profile.route.join(" → ")}</span>
        </p>
        <p className="hero__how">{t({ ko: "배지를 당겨 보세요", en: "Pull the badge", ru: "Потяните бейдж" })}</p>
      </div>
    </section>
  );
}
