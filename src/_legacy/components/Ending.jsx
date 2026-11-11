import ContactPopup from "./popup/Contact.jsx";
import LikeHeart from "./utility/LikeHeart.jsx";
import React from "react";
import ContactSticker from "../assets/img/contact-sticker.webp";
import cloud from "../assets/img/cloud.png";
function Ending() {
  return (
    <div className="ending-box text-center">
      <div className="mt-4 d-flex justify-content-center">
        <div className="glass-box text-center p-4">
          <h1 className="reginy-font mb-0">
            If you are interested in my{" "}
            <span className="afronaut-font blue-cl">portfolio</span>
            <br />
            <span className="bagel-font">like</span> and{" "}
            <span className="bagel-font">contact me</span>
            <span className="ms-3 align-middle">
              <LikeHeart />
            </span>
          </h1>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <ContactPopup />
        <img src={ContactSticker} alt="Name" className="contact-sticker" />
      </div>

      {/* tech stack */}

      <div className="copyright p-0 mt-5 text-start">
        <div className="row justify-content-start mt-0">
          <div className="col-auto">
            <p className="mb-0 p-0">This portfolio was made with</p>
          </div>

          <div className="col-auto d-flex align-items-center p-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
              alt="React"
              style={{ width: 35, height: 24 }}
              className="pe-2"
            />
            <span>React</span>
          </div>

          <div className="col-auto p-1">
            <span>and</span>
          </div>

          <div className="col-auto d-flex align-items-center p-1">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg"
              alt="Bootstrap"
              style={{ width: 35, height: 24 }}
              className="pe-2"
            />
            <span>Bootstrap</span>
          </div>
        </div>
        <span className="p-0 m-0 d-block">
          해당 웹사이트는 개인 포트폴리오 사이트이며 모든 작업에는 상업적 이용
          목적이 없습니다.
        </span>

        <span className="p-0 m-0">Copyright ⓒ 2026 VLASOVA EKATERINA</span>
      </div>
    </div>
  );
}

export default Ending;
