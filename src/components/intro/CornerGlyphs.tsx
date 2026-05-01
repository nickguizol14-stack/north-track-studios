import { CSSProperties } from "react";

const baseStyle: CSSProperties = {
  position: "absolute",
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "#4a4a4a",
  textTransform: "uppercase",
  transition: "opacity 0.6s ease",
};

export interface CornerGlyphsProps {
  /** When true, fade out (for handoff state). */
  hidden?: boolean;
}

export function CornerGlyphs({ hidden = false }: CornerGlyphsProps) {
  const opacity = hidden ? 0 : 1;
  return (
    <>
      <div style={{ ...baseStyle, top: 70, left: 32, opacity }}>NTS · vol. 02</div>
      <div style={{ ...baseStyle, top: 70, right: 32, textAlign: "right", opacity }}>
        est. 2024
        <br />
        40.7128° N · 74.0060° W
      </div>
      <div style={{ ...baseStyle, bottom: 70, left: 32, opacity }}>Index · 00</div>
      <div style={{ ...baseStyle, bottom: 70, right: 32, textAlign: "right", opacity }}>
        Issue 01 · Spring
      </div>
    </>
  );
}
