import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Badge } from "../../webgl/badge";
import { Track } from "../../webgl/track";
import { fontsReady, reducedMotion } from "../../webgl/media";
import { profile, links, skillGroups, education, languages, licenses, yearsInKorea } from "../../data/profile";
import { useLang } from "../../app/I18n";
import badgeImg from "../../assets/img/badge.png";
import "./About.css";

const tg = links.telegram && `https://t.me/${links.telegram}`;

/** Track content — ten stops after the headline. Everything comes from data/profile.js. */
function buildSpec(t) {
  const group = (name) => skillGroups.find((g) => g.group === name)?.items.map((i) => t(i.name)) || [];
  return [
    {
      type: "hero",
      lines: [
        { text: t({ ko: "꼼꼼한 레이아웃을", en: "Designing and publishing" }) },
        { text: t({ ko: "반응형으로, 접근성 있게, 조용히 움직이는", en: "responsive, accessible and quietly kinetic" }) },
        { text: t({ ko: "웹으로 만듭니다", en: "websites from Seoul" }), sup: "KR", after: "." },
      ],
      sub: t({ ko: "지금은 서울에서, |새 프로젝트 가능", en: "Currently in Seoul, |open to work" }),
      subLink: tg ? { href: tg } : null,
    },
    {
      type: "para",
      head: t({ ko: "소개", en: "Hello" }),
      text: t(profile.intro),
    },
    { type: "list", head: "Front-end", items: group("Front-end") },
    {
      type: "chapter",
      head: t({ ko: "Part One  ·  경로", en: "Part One  ·  Route" }),
      numeral: "I",
      text: t({
        ko: "첼랴빈스크 → 부산 → 서울. 경영학에서 디자인으로, 디자인에서 코드로.",
        en: "Chelyabinsk → Busan → Seoul. From business school to design, and from design to code.",
      }),
    },
    {
      type: "quote",
      // TODO: Kate — replace with a line you'd actually say
      text: t({ ko: "“보이는 것만큼 읽히는 것도 디자인이다.”", en: "“If it can’t be read, it isn’t designed yet.”" }),
      cite: t({ ko: "— 작업 노트", en: "— Working note" }),
    },
    {
      type: "stats",
      head: t({ ko: "숫자로", en: "In numbers" }),
      items: [
        [String(yearsInKorea).padStart(2, "0"), t({ ko: "한국 거주 연차", en: "Years in Korea" })],
        ["06", t({ ko: "TOPIK 급수", en: "TOPIK level" })],
        ["875", "TOEIC"],
        ["03", t({ ko: "언어 (한 · 영 · 러)", en: "Languages (KO · EN · RU)" })],
      ],
    },
    {
      type: "para",
      head: t({ ko: "퍼블리싱", en: "Publishing" }),
      text: group("Publishing").join(" · ") + ".",
    },
    {
      type: "chapter",
      head: t({ ko: "Part Two  ·  디자인", en: "Part Two  ·  Design" }),
      numeral: "II",
      text: [...group("Design"), ...group("AI workflow")].join(" · ") + ".",
    },
    {
      type: "list",
      head: t({ ko: "학력", en: "Education" }),
      items: education.map((e) => `${e.year}  ${t(e.desc)}`),
    },
    {
      type: "list",
      head: t({ ko: "자격 · 언어", en: "Licenses & languages" }),
      items: [...licenses.map((l) => t(l.name)), ...languages.slice(0, 3).map((l) => `${l.name} — ${t(l.note)}`)],
    },
    {
      type: "links",
      head: t({ ko: "연락", en: "Contact" }),
      items: [
        ...profile.contacts.map((c) => ({ text: `${c.label} ${c.value} →`, href: c.href, ext: c.external !== false })),
        { text: t({ ko: "전체 작업 보기 →", en: "See the full index →" }), href: "#projects" },
        { text: t({ ko: "2026년 새 프로젝트 가능", en: "Booking from 2026" }) },
      ],
    },
  ];
}

function backLines(t) {
  return {
    top: `ID · ${profile.year}-KR`,
    big: t({ ko: ["web designer,", "publisher,", "& front-end."], en: ["web designer,", "publisher,", "& front-end."] }),
    facts: [
      `${profile.route.join(" → ")}`,
      "TOPIK 6 · TOEIC 875 · RU",
      t({ ko: `한국 ${yearsInKorea}년차`, en: `${yearsInKorea} years in Korea` }),
    ],
    foot: `Kate · ${profile.nickname}`,
    handle: links.telegram ? `@${links.telegram}` : "Seoul",
  };
}

/** About: Kate's badge on a lanyard + a sideways text track that makes room for it. */
export default function About({ active }) {
  const { t, lang } = useLang();
  const root = useRef(null);
  const gl = useRef(null);
  const track = useRef(null);
  const hint = useRef(null);
  const lens = useRef(null);
  const sys = useRef(null);
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    const reduced = reducedMotion();
    const showLens = ({ x, y }) => {
      if (reduced) return;
      gsap.killTweensOf(lens.current);
      gsap.set(lens.current, { x, y, xPercent: -50, yPercent: -50, scale: 0, opacity: 1 });
      gsap.to(lens.current, { scale: 1, duration: 2.4, ease: "expo.out" });
      gsap.to(lens.current, { opacity: 0, duration: 0.9, ease: "sine.inOut", delay: 0.9 });
    };
    const badge = new Badge({ host: gl.current, image: badgeImg, back: backLines(t), onClick: showLens });
    const tr = new Track({
      host: track.current,
      onFirstScroll: () => gsap.to(hint.current, { opacity: 0, duration: 0.5 }),
    });
    const s = { badge, tr, running: false, raf: 0 };
    sys.current = s;

    fontsReady().then(() => {
      tr.build(buildSpec(tRef.current));
      badge.setBack(backLines(tRef.current));
    });
    gsap.fromTo(hint.current, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.9, ease: "expo.out", delay: 1.6 });

    // input
    const el = root.current;
    let swipe = null;
    const down = (e) => {
      if (e.target.closest("a,button")) return;
      if (badge.h.down(e)) {
        el.setPointerCapture?.(e.pointerId);
        el.classList.add("is-grabbing");
        return;
      }
      if (e.pointerType !== "mouse") swipe = { x: e.clientX, y: e.clientY };
    };
    const move = (e) => {
      badge.h.move(e);
      el.classList.toggle("is-over", badge.hovering);
      if (swipe) {
        const dx = e.clientX - swipe.x;
        const dy = e.clientY - swipe.y;
        const d = Math.abs(dx) > Math.abs(dy) ? -dx : -dy;
        tr.nudge(d);
        tr.vel = d;
        swipe = { x: e.clientX, y: e.clientY };
      }
    };
    const up = (e) => {
      badge.h.up(e);
      el.classList.remove("is-grabbing");
      swipe = null;
    };
    const wheel = (e) => {
      e.preventDefault();
      tr.wheel(e);
    };
    const key = (e) => {
      if (!s.running) return;
      const d = { ArrowRight: 240, ArrowDown: 240, ArrowLeft: -240, ArrowUp: -240, PageDown: innerWidth * 0.8, PageUp: -innerWidth * 0.8 }[e.key];
      if (d) tr.nudge(d);
    };
    const resize = () => tr.spec && tr.build(tr.spec);
    const noSelect = (e) => badge.drag && e.preventDefault();
    el.addEventListener("selectstart", noSelect);
    el.addEventListener("pointerdown", down);
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
    el.addEventListener("wheel", wheel, { passive: false });
    addEventListener("keydown", key);
    addEventListener("resize", resize);

    s.loop = () => {
      let last = performance.now();
      const tick = (now) => {
        if (!s.running) return;
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        badge.frame(dt);
        tr.frame(dt, badge.bounds(), reduced);
        s.raf = requestAnimationFrame(tick);
      };
      s.raf = requestAnimationFrame(tick);
    };

    return () => {
      s.running = false;
      cancelAnimationFrame(s.raf);
      el.removeEventListener("selectstart", noSelect);
      el.removeEventListener("pointerdown", down);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      el.removeEventListener("wheel", wheel);
      removeEventListener("keydown", key);
      removeEventListener("resize", resize);
      badge.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const s = sys.current;
    if (!s) return;
    if (active && !s.running) {
      s.running = true;
      s.loop();
    } else if (!active) {
      s.running = false;
      cancelAnimationFrame(s.raf);
    }
  }, [active]);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) return void (first.current = false);
    const s = sys.current;
    s?.tr.build(buildSpec(t));
    s?.badge.setBack(backLines(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section ref={root} className="view about" id="view-about" aria-label={t({ ko: "소개", en: "About" })}>
      <div ref={track} className="about__track" />
      <div ref={lens} className="about__lens" aria-hidden="true" />
      <div ref={gl} className="view__gl about__gl" aria-hidden="true" />
      <p className="visually-hidden">
        {t({
          ko: "가운데에 케이트의 사원증이 걸려 있어요. 드래그하면 흔들리고, 클릭하면 뒤집혀요.",
          en: "Kate’s ID badge hangs in the middle. Drag it to swing it, click it to flip it.",
        })}
      </p>
      <p ref={hint} className="about__hint kicker" aria-hidden="true">
        {t({ ko: "스크롤", en: "Scroll" })} <span>→</span>
      </p>
    </section>
  );
}
