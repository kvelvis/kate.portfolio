import React, { useState } from "react";


function LikeHeart() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      className="heartBtn"
      onClick={() => setLiked(v => !v)}
      type="button"
      aria-label="like"
    >
      <svg
        viewBox="0 0 16 16"
        className={`heartSvg ${liked ? "liked" : ""}`}
      >
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z"/>
      </svg>
    </button>
  );
}

export default LikeHeart;
