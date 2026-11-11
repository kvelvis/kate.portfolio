import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../../../lib/gsap";
import { featuredCases, moreCases } from "../../../data/cases";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";
import Marquee from "../../ui/Marquee/Marquee";
import CaseCard from "./CaseCard";
import CaseRow from "./CaseRow";
import "./Cases.css";

export default function Cases() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // правая колонка едет быстрее — «разъезжающаяся» сетка
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        gsap.utils.toArray(".case-card:nth-child(even)").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 120 },
            { y: -120, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
          );
        });
      });
      mm.add(MQ.motion, () => {
        gsap.utils.toArray(".case-card").forEach((el) => {
          gsap.from(el.querySelector(".case-card__window"), {
            scale: 0.88,
            rotate: gsap.utils.random(-4, 4),
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="cases" className="cases section">
      <div className="container">
        <SectionHeading
          index="03"
          kicker="cases"
          title="Web cases"
          aside="퍼블리싱 & 리디자인 프로젝트. 카드를 누르면 실제 페이지가 열려요."
        />

        <ul className="cases__grid">
          {featuredCases.map((c, i) => (
            <CaseCard key={c.href} item={c} index={i} />
          ))}
        </ul>
      </div>

      <Marquee items={["more cases", "퍼블리싱", "redesign", "landing"]} variant="acid" tilt={-2} reverse speed={50} className="cases__marquee" />

      <div className="container">
        <ul className="cases__list">
          {moreCases.map((c, i) => (
            <CaseRow key={c.href} item={c} index={featuredCases.length + i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
