import { useEffect, useState } from "react";
import { useLang } from "../../app/I18n";
import { notifyLike } from "../../app/notify";
import "./Like.css";

const KEY = "liked";
const read = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/** Floating like button: appears after the first screen, one like per visitor. */
export default function Like() {
  const { t } = useLang();
  const [liked, setLiked] = useState(read);
  const [shown, setShown] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    const on = () => setShown(scrollY > innerHeight * 0.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  const like = () => {
    if (liked) return;
    setLiked(true);
    setPop(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    notifyLike();
  };

  return (
    <button
      type="button"
      className={`like${shown ? " is-shown" : ""}${liked ? " is-liked" : ""}${pop ? " is-pop" : ""}`}
      onClick={like}
      onAnimationEnd={() => setPop(false)}
      aria-pressed={liked}
      tabIndex={shown ? 0 : -1}
    >
      <span className="like__heart" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8.2 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.6 0 5.5 3.7 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
        </svg>
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="like__text" aria-live="polite">
        {liked
          ? t({ ko: "감사합니다!", en: "Thank you!", ru: "Спасибо!" })
          : t({ ko: "포트폴리오가 마음에 드셨나요?", en: "Like this portfolio?", ru: "Понравилось портфолио?" })}
      </span>
    </button>
  );
}
