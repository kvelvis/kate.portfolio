import { useCallback, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "../../../lib/gsap";
import { works, workTools } from "../../../data/works";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";
import FilterChips from "./FilterChips";
import WorkCard from "./WorkCard";
import Lightbox from "./Lightbox";
import "./Works.css";

export default function Works() {
  const root = useRef(null);
  const [tool, setTool] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const list = useMemo(() => (tool === "All" ? works : works.filter((w) => w.tool === tool)), [tool]);
  const counts = useMemo(
    () => Object.fromEntries(workTools.map((t) => [t, t === "All" ? works.length : works.filter((w) => w.tool === t).length])),
    []
  );

  // картинки грузятся позже — пересчитываем длину горизонтального скролла
  const refreshTimer = useRef(0);
  const onImgLoad = useCallback(() => {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => ScrollTrigger.refresh(), 150);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const track = root.current.querySelector(".works__track");
      const counter = root.current.querySelector(".works__count-now");
      const cards = gsap.utils.toArray(".work-card", root.current);

      // DESKTOP: закрепляем секцию и двигаем ленту по горизонтали
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".works__pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
              if (counter) counter.textContent = String(i).padStart(2, "0");
              gsap.set(".works__bar-fill", { scaleX: self.progress });
            },
          },
        });

        // лёгкий параллакс картинок внутри карточек
        cards.forEach((card) => {
          gsap.fromTo(
            card.querySelector("img"),
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            }
          );
        });
      });

      // TABLET/PHONE: обычная свайп-лента, карточки просто «въезжают»
      mm.add(`(max-width: 1023px) and ${MQ.motion}`, () => {
        gsap.from(cards.slice(0, 4), {
          x: 80,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: track, start: "top 85%", once: true },
        });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root, dependencies: [tool], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="works" className="works section">
      <div className="container">
        <SectionHeading
          index="02"
          kicker="portfolio"
          title="Graphic works"
          aside="Photoshop · Illustrator · AI — баннеры, постеры, иллюстрации и 3D."
        />
        <FilterChips options={workTools} counts={counts} value={tool} onChange={setTool} />
      </div>

      <div className="works__pin">
        <div className="works__viewport" data-lenis-prevent-touch>
          <ul className="works__track">
            {list.map((w, i) => (
              <WorkCard key={w.title} work={w} index={i} onOpen={() => setOpenIndex(i)} onLoad={onImgLoad} />
            ))}
            <li className="works__end t-display" aria-hidden="true">
              <span>more on</span>
              <span>request ✦</span>
            </li>
          </ul>
        </div>

        <div className="works__hud container t-mono">
          <span>
            <span className="works__count-now">01</span> / {String(list.length).padStart(2, "0")}
          </span>
          <span className="works__bar"><span className="works__bar-fill" /></span>
          <span className="works__hint"><span className="works__hint-desk">scroll</span><span className="works__hint-touch">swipe</span> →</span>
        </div>
      </div>

      <Lightbox items={list} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </section>
  );
}
