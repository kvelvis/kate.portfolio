import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // для работы бургер-меню
import LogoStar from "../assets/img/star.png";
import ContactPopup from "./popup/Contact.jsx";

function Header({
  onAboutClick,
  onGraphicClick,
  onFigmaClick,
  onCasesClick,
  children,
}) {
  // Сворачиваем меню после клика (на мобиле)
  const collapseAfterClick = () => {
    const el = document.getElementById("navbarText");
    if (el && el.classList.contains("show")) {

      const collapse = new window.bootstrap.Collapse(el, { toggle: false });
      collapse.hide();
    }
  };

  const handle = (fn) => (e) => {
    e.preventDefault();
    fn?.();
    collapseAfterClick();
  };

  return (
    <div className="head">
      <nav className="navbar navbar-expand-lg m-3">
        <div className="container-fluid ">
          <a className="navbar-brand" href="#">
            <img src={LogoStar} alt="logo" className="logo-img" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#" onClick={handle(onAboutClick)}>
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="#" onClick={handle(onGraphicClick)}>
                  Graphic
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="#" onClick={handle(onFigmaClick)}>
                  Figma
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="#" onClick={handle(onCasesClick)}>
                  Cases
                </a>
              </li>
            </ul>
            <span className="navbar-text d-flex">
              {children}
              <ContactPopup />
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
