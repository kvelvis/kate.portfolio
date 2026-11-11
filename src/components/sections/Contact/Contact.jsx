import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../../../lib/gsap";
import { useContact } from "../../../app/ContactProvider";
import { useScrollTo } from "../../../app/SmoothScroll";
import Button from "../../ui/Button/Button";
import LikeHeart from "../../ui/LikeHeart/LikeHeart";
import Sticker from "../../ui/Sticker/Sticker";
import sticker from "../../../assets/img/contact-sticker.webp";
import "./Contact.css";

export default function Contact() {
  const root = useRef(null);
  const openContact = useContact();
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } })
          .from(".contact__line > span", { yPercent: 110, stagger: 0.1, duration: 1.2, ease: "expo.out" })
          .from(".contact__memoji", { scale: 0, rotate: -40, duration: 1, ease: "back.out(2)" }, 0.4)
          .from(".contact__actions > *", { y: 30, opacity: 0, stagger: 0.08, duration: 0.7 }, 0.6);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="contact" className="contact section">
      <div className="container contact__inner">
        <p className="contact__kicker t-mono">(06) — if you are interested in my portfolio</p>

        <h2 className="contact__title t-display">
          <span className="contact__line"><span>Like</span></span>
          <span className="contact__line">
            <span>
              &amp; <em className="t-blob">contact</em>
            </span>
          </span>
          <span className="contact__line">
            <span>
              me <LikeHeart />
            </span>
          </span>
        </h2>

        <Sticker shape="image" rotate={-8} className="contact__memoji" data-cursor="drag">
          <img src={sticker} alt="Kate memoji calling" />
        </Sticker>
        <Sticker shape="star" color="acid" rotate={12} className="contact__star">
          hire
          <br />
          me!
        </Sticker>

        <div className="contact__actions">
          <Button size="lg" onClick={openContact} icon="↗">
            Contact me
          </Button>
          <Button size="lg" variant="ghost" href="#top" onClick={(e) => { e.preventDefault(); scrollTo("top", { duration: 2 }); }}>
            Back to top ↑
          </Button>
        </div>
      </div>
    </section>
  );
}
