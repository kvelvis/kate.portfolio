import { useMagnetic } from "../../../hooks/useMagnetic";
import "./Button.css";

/**
 * Кнопка/ссылка с «прокруткой» текста на hover и магнитом.
 * variant: "primary" | "ghost" | "acid"
 */
export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  magnetic = true,
  ...rest
}) {
  const ref = useMagnetic(magnetic ? 0.3 : 0);
  const Tag = href ? "a" : "button";
  const external = href && /^https?:|^\/cases\//.test(href);

  return (
    <Tag
      ref={ref}
      href={href}
      className={`btn btn--${variant} btn--${size} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(!href ? { type: "button" } : {})}
      {...rest}
    >
      <span className="btn__roll" data-text={typeof children === "string" ? children : undefined}>
        <span>{children}</span>
      </span>
      {icon && <span className="btn__icon" aria-hidden="true">{icon}</span>}
    </Tag>
  );
}
