import React from "react";
import "../../App.css";

function CaseBox({ href, title, className, imgSrc, alt }) {
  return (
    <div className={`caseBox mt-5 ${className || ""}`}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={imgSrc} alt={alt || title} className="caseImage" />
        <p>{title}</p>
      </a>
    </div>
  );
}

export default CaseBox;
