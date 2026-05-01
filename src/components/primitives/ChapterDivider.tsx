import { CSSProperties } from "react";

export interface ChapterDividerProps {
  width?: number;
  className?: string;
}

export function ChapterDivider({ width = 64, className }: ChapterDividerProps) {
  return (
    <div
      className={`chapter-divider ${className ?? ""}`}
      style={{
        width,
        height: 1,
        background: "linear-gradient(90deg, var(--color-gold), transparent)",
        boxShadow: "0 0 6px var(--rule-glow)",
        marginBottom: 18,
        position: "relative",
      }}
      aria-hidden
    >
      <span className="chapter-divider-p" style={{ ...particleStyle, left: 18, animationDelay: "0s" }} />
      <span className="chapter-divider-p" style={{ ...particleStyle, left: 32, animationDelay: "1.2s" }} />
    </div>
  );
}

const particleStyle: CSSProperties = {
  position: "absolute",
  top: -8,
  width: 2,
  height: 2,
  borderRadius: "50%",
  background: "var(--color-gold-bright)",
  boxShadow: "0 0 4px var(--color-gold)",
  opacity: 0,
  animation: "drift-up 3s ease-in-out infinite",
};
