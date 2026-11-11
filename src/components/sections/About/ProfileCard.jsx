import { useRef } from "react";
import { gsap, Draggable, useGSAP, MQ } from "../../../lib/gsap";
import { profile } from "../../../data/profile";
import memoji from "../../../assets/img/memoji.webp";

/** «Бейдж на ленте»: качается при скролле, на десктопе его можно оттянуть — пружинит обратно */
export default function ProfileCard() {
  const root = useRef(null);

  useGSAP(
    () => {
      const card = root.current.querySelector(".id-card");
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          root.current,
          { rotate: -7 },
          {
            rotate: 5,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
      });

      mm.add(MQ.fine, () => {
        const [d] = Draggable.create(card, {
          type: "x,y",
          onDrag() {
            gsap.set(card, { rotate: this.x * 0.08 });
          },
          onRelease() {
            gsap.to(card, { x: 0, y: 0, rotate: 0, duration: 1.4, ease: "elastic.out(1, 0.3)" });
          },
        });
        return () => d.kill();
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="id-wrap">
      <span className="id-strap" aria-hidden="true" />
      <article className="id-card" data-cursor="pull">
        <span className="id-card__hole" aria-hidden="true" />
        <header className="id-card__head t-mono">
          <span>ID · {profile.year}-KR</span>
          <span className="id-card__status">
            <i /> open to work
          </span>
        </header>
        <div className="id-card__photo">
          <img src={memoji} alt="Kate memoji" draggable="false" width="420" height="420" loading="lazy" decoding="async" />
        </div>
        <p className="id-card__name t-display">{profile.firstName}</p>
        <p className="id-card__nick t-blob">{profile.nickname}</p>
        <dl className="id-card__info">
          <div>
            <dt className="t-mono">From</dt>
            <dd>{profile.route[0]}</dd>
          </div>
          <div>
            <dt className="t-mono">Now</dt>
            <dd>{profile.route.at(-1)}</dd>
          </div>
          <div>
            <dt className="t-mono">Focus</dt>
            <dd>{profile.roles.join(" · ")}</dd>
          </div>
        </dl>
        <span className="id-card__barcode" aria-hidden="true" />
      </article>
    </div>
  );
}
