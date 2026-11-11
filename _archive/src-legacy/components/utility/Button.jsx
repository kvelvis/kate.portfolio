import React from "react";
import "../../App.css";

function Button({ label, title, className, href, onClick, showIcon }) {
  const handleClick = () => {
    if (onClick) {
      onClick();                      // если передана своя функция
    } else if (href) {
      window.open(href, "_blank");    // иначе открывает ссылку
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-primary mt-5 ${className || ""}`}
    >
      {showIcon && <span style={{ marginRight: "8px" }}>💬</span>}
      {label || title}
    </button>
  );
}

export default Button;
