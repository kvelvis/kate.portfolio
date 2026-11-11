import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import Button from "./Button.jsx";
import Name from "../assets/img/33.png";

function Main() {
  return (
    <div className="m-3">
      <div className="main-wrap p-3">
        <div className="name-img-wrap">
          <img src={Name} alt="Name" className="your-class-name" />
        </div>
        <div className="first-line d-flex justify-content-between align-items-end">
          <p className="anton text-start"> WEB PUBLISHER</p>
          <p className="anton text-end">
            WEB PUBLISHER <br />
            PORTFOLIO 2026
          </p>
        </div>
        <div className="second-line">
          <h1 className="anton">VLASOVA EKATERINA</h1>
        </div>
        <div className="third-line d-flex flex-start">
          <div className="blockA">
            <ul className="city-line d-flex align-items-center gap-2 p-0">
              <li>Chelyabinsk</li>
              <li className="arrow"></li>
              <li>Busan</li>
              <li className="arrow"></li>
              <li>Seoul</li>
            </ul>
            <div className="copyright-line p-2">
              <p className="p-0 m-0 text-start">
                Portfolio was designed by Vlasova Ekaterina in 2026
              </p>
            </div>
          </div>
          <div className="blockB">
            <h2 className="p-0 m-0">케이트</h2>
          </div>
        </div>
      </div>
      
    </div>
  );
}
export default Main;
