import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../../lib/gsap";
import { useScrollTo, useLenis } from "../../../app/SmoothScroll";
import { useContact } from "../../../app/ContactProvider";
import { navLinks } from "../../../data/profile";
import { inertOutside } from "../../../lib/a11y";
import Button from "../../ui/Button/Button";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";
import logo from "../../../assets/img/star.png";
import "./Header.css";

export default function Header() {
  const root = useRef(null);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const openContact = useContact();
  const burger = useRef(null);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  // hide the header on scroll down, show it on scroll up (and whenever it gets keyboard focus)
  useGSAP(
    () => {
      const show = gsap.quickTo(root.current, "yPercent", { duration: 0.45, ease: "power3.out" });
      const onFocus = () => show(0);
      root.current.addEventListener("focusin", onFocus);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          root.current.classList.toggle("is-scrolled", self.scroll() > 40);
          if (menuOpenRef.current || root.current.contains(document.activeElement)) return;
          show(self.direction === 1 && self.scroll() > 400 ? -130 : 0);
        },
      });
      gsap.to(".header__logo img", {
        rotate: 360,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.6 },
      });
      gsap.to(".header__progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
      return () => root.current?.removeEventListener("focusin", onFocus);
    },
    { scope: root }
  );

  // highlight the nav item of the section in view
  useEffect(() => {
    const triggers = navLinks.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => setActive((cur) => (self.isActive ? id : cur === id ? "" : cur)),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  // lock scrolling while the menu is open (start again only after it was open)
  const wasOpen = useRef(false);
  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else if (wasOpen.current) lenis.start();
    wasOpen.current = menuOpen;
  }, [menuOpen, lenis]);

  // mobile menu keyboard support: Esc closes it, the page behind is unreachable, focus returns to the burger
  useEffect(() => {
    if (!menuOpen) return;
    const restore = inertOutside(["main", "footer"]);
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      burger.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      restore();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const go = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (id === "contact") return openContact();
    scrollTo(id);
  };

  return (
    <>
      <header ref={root} className="header">
        <div className="header__inner">
          <a href="#top" className="header__logo" onClick={go("top")} aria-label="Home">
            <img src={logo} alt="" width="250" height="170" />
            <span className="t-mono">kate.dev</span>
          </a>

          <nav className="header__nav" aria-label="Main">
            <ul>
              {navLinks
                .filter((l) => l.id !== "contact")
                .map((l, i) => (
                  <li key={l.id}>
                    <a
                      href={`#${l.id}`}
                      onClick={go(l.id)}
                      className={active === l.id ? "is-active" : ""}
                    >
                      <sup>0{i + 1}</sup>
                      {l.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="header__actions">
            <ThemeToggle />
            <Button size="sm" onClick={openContact} className="header__cta" icon="↗">
              Contact
            </Button>
            <button
              ref={burger}
              className={`header__burger ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <span className="header__progress" aria-hidden="true" />
      </header>

      <MobileMenu open={menuOpen} onNavigate={go} active={active} />
    </>
  );
}
