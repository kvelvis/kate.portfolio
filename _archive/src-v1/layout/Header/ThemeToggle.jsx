import { useTheme } from "../../../app/Theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      className={`theme-toggle ${dark ? "is-dark" : ""}`}
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title="Theme"
    >
      <span className="theme-toggle__knob" aria-hidden="true">
        {dark ? "☾" : "☀"}
      </span>
    </button>
  );
}
