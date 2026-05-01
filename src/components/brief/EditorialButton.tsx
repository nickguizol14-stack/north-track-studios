"use client";
import { CSSProperties, ReactNode, useState } from "react";

export interface EditorialButtonProps {
  children: ReactNode;
  /** When true, button is enabled and styled gold. Default true. */
  ready?: boolean;
  /** "forward" arrow → on right; "back" arrow ← on left. Default forward. */
  direction?: "forward" | "back";
  onClick?: () => void;
  className?: string;
}

export function EditorialButton({
  children,
  ready = true,
  direction = "forward",
  onClick,
  className,
}: EditorialButtonProps) {
  const [hover, setHover] = useState(false);

  const arrow = direction === "forward" ? "→" : "←";
  const arrowOffset = direction === "forward" ? 8 : -8;

  const baseColor = ready
    ? hover
      ? "var(--color-gold-brightest)"
      : "var(--color-gold)"
    : "var(--color-text-faint)";

  const ruleBg = ready
    ? hover
      ? "linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-brightest) 50%, var(--color-gold) 100%)"
      : "var(--color-gold)"
    : "rgba(200, 168, 78, 0.18)";
  const ruleShadow = ready
    ? hover
      ? "0 0 18px rgba(232, 200, 120, 0.7)"
      : "0 0 8px rgba(200, 168, 78, 0.5)"
    : "none";

  return (
    <button
      type="button"
      className={`editorial-btn ${className ?? ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (ready && onClick) onClick();
      }}
      disabled={!ready}
      style={{
        ...wrapStyle,
        color: baseColor,
        cursor: ready ? "pointer" : "not-allowed",
      }}
    >
      {direction === "back" && (
        <span
          style={{
            display: "inline-block",
            fontSize: 16,
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: ready && hover ? `translateX(${arrowOffset}px)` : "translateX(0)",
            marginRight: 14,
          }}
        >
          {arrow}
        </span>
      )}
      {children}
      {direction === "forward" && (
        <span
          style={{
            display: "inline-block",
            fontSize: 16,
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: ready && hover ? `translateX(${arrowOffset}px)` : "translateX(0)",
            marginLeft: 14,
          }}
        >
          {arrow}
        </span>
      )}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          background: ruleBg,
          boxShadow: ruleShadow,
          transition: "background 0.4s ease, box-shadow 0.4s ease",
        }}
      />
    </button>
  );
}

const wrapStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.42em",
  textTransform: "uppercase",
  background: "transparent",
  border: "none",
  padding: "18px 4px",
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  transition: "color 0.4s ease",
};
