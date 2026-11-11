import { useRef } from "react";
import { gsap, useGSAP, MQ, prefersReducedMotion } from "../../../lib/gsap";
import { profile } from "../../../data/profile";
import Sticker from "../../ui/Sticker/Sticker";
import RoleTicker from "./RoleTicker";
import CityRoute from "./CityRoute";
import SpinBadge from "./SpinBadge";
import nameBlob from "../../../assets/img/hero-name.webp";
import memoji from "../../../assets/img/memoji.webp";
import "./Hero.css";

export default function Hero({ ready }) {
  const root = useRef(null);
  const intro = useRef(null);

  // intro animation (starts after the preloader).
  // fromTo with explicit end values: plain .from() could record the hidden state as the end
  // when the intro starts during page load (preloader skipped), leaving letters stuck.
  // Reduced motion: no intro, content is shown as is.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .fromTo(".hero__letter", { yPercent: 110, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.05 })
        .fromTo(".hero__blob", { scale: 0.4, rotate: -14, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.4, ease: "elastic.out(1, 0.55)" }, 0.35)
        .fromTo(".hero__meta > *", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.8 }, 0.4)
        .fromTo(".hero__bottom > *", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.9 }, 0.6)
        .fromTo(".hero .sticker", { scale: 0 }, { scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(2.5)" }, 0.9);
    },
    { scope: root }
  );

  useGSAP(() => { if (ready) intro.current?.play(); }, { dependencies: [ready] });

  // mouse parallax + scroll-out
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.fine, () => {
        const bx = gsap.quickTo(".hero__blob", "x", { duration: 1.2, ease: "power3" });
        const by = gsap.quickTo(".hero__blob", "y", { duration: 1.2, ease: "power3" });
        const br = gsap.quickTo(".hero__blob", "rotationY", { duration: 1.2, ease: "power3" });
        const move = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          bx(nx * 50);
          by(ny * 30);
          br(nx * 18);
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });

      mm.add(MQ.motion, () => {
        gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
          .to(".hero__name", { yPercent: -25, letterSpacing: "0.04em", ease: "none" }, 0)
          .to(".hero__blob-wrap", { yPercent: -60, scale: 0.85, rotate: -6, ease: "none" }, 0)
          .to(".hero__bottom", { yPercent: 40, opacity: 0, ease: "none" }, 0);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className="hero">
      <div className="hero__meta container t-mono">
        <span>(Portfolio ©{profile.year})</span>
        <RoleTicker roles={profile.roles} />
        <span className="hero__based">Based in {profile.route.at(-1)}, KR</span>
      </div>

      <div className="hero__stage container">
        <h1 className="hero__name t-display" aria-label={profile.name}>
          {profile.lastName.split("").map((l, i) => (
            <span className="hero__mask" key={i} aria-hidden="true">
              <span className="hero__letter">{l}</span>
            </span>
          ))}
        </h1>

        <div className="hero__blob-wrap">
          <img src={nameBlob} alt="Ekaterina" className="hero__blob" draggable="false" width="1920" height="472" fetchPriority="high" />
        </div>

        <Sticker shape="image" rotate={8} className="hero__memoji" data-cursor="drag">
          <img src={memoji} alt="Kate memoji waving" width="420" height="420" />
        </Sticker>
        <Sticker color="pink" rotate={-10} className="hero__st-1">✦ hi, i&apos;m kate</Sticker>
        <Sticker color="blue" rotate={6} className="hero__st-2">UI · UX · WEB</Sticker>
      </div>

      <div className="hero__bottom container">
        <CityRoute cities={profile.route} />
        <span className="hero__nick t-blob">{profile.nickname}</span>
        <SpinBadge text="open to work ✦ 웹디자이너 ✦ web publisher ✦ " />
      </div>
    </section>
  );
}
