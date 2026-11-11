import React from 'react';

function Button({ label = "Default",wrappClassName = "", className = "", onClick, type = "button", showIcon = false }) {
    return (
        <div className={`d-flex justify-content-end $ {wrappClassName}`}>
            <button
        type={type}
        className={`btn btn-primary ${className}`}
        onClick={onClick}
      >
        {label}
        {showIcon && <i className="bi bi-arrow-right ms-2"></i>}
      </button></div>
      
    );
  }
  
  export default Button;