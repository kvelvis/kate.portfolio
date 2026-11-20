import { useRef } from "react";
import { gsap, Draggable, useGSAP, MQ } from "../../../lib/gsap";
import { profile } from "../../../data/profile";
import memoji from "../../../assets/img/memoji.webp";

/**
 * ID badge on a lanyard: swings on scroll and can be pulled — it springs back.
 * Mouse: drag in any direction. Touch: horizontal swipe (vertical swipes keep scrolling the page).
 * The card pivots at its hole and the strap stretches/turns to follow it.
 */
export default function ProfileCard() {
  const root = useRef(null);

  useGSAP(
    () => {
      const card = root.current.querySelector(".id-card");
      const strap = root.current.querySelector(".id-strap");
      const mm = gsap.matchMedia();
      gsap.set(card, { transformOrigin: "50% 15px" }); // center of the hole
      gsap.set(strap, { transformOrigin: "50% 0%" });

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

      // "always" makes this run on every device; the other keys only switch behavior
      mm.add({ always: "all", fine: MQ.fine, reduce: "(prefers-reduced-motion: reduce)" }, ({ conditions }) => {
        // strap top stays fixed; its bottom follows the card's hole
        const follow = (x, y) => {
          const h = strap.offsetHeight || 1;
          const len = Math.max(h * 0.4, Math.hypot(x, h + y));
          gsap.set(strap, { rotate: (-Math.atan2(x, h + y) * 180) / Math.PI, scaleY: len / h });
        };
        const back = conditions.reduce
          ? { duration: 0.3, ease: "power2.out" }
          : { duration: 1.4, ease: "elastic.out(1, 0.3)" };

        const [d] = Draggable.create(card, {
          type: conditions.fine ? "x,y" : "x",
          onDrag() {
            gsap.set(card, { rotate: this.x * 0.08 });
            follow(this.x, this.y);
          },
          onRelease() {
            gsap.to(card, {
              x: 0,
              y: 0,
              rotate: 0,
              ...back,
              onUpdate: () => follow(gsap.getProperty(card, "x"), gsap.getProperty(card, "y")),
            });
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
