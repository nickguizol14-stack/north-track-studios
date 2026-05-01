import { CSSProperties } from "react";
import { GoldRule } from "@/components/primitives";

export interface WorkPinnedNameProps {
  meta: string;
  name: string;
  sub: string;
}

export function WorkPinnedName({ meta, name, sub }: WorkPinnedNameProps) {
  return (
    <div style={{ position: "sticky", top: "18vh", alignSelf: "start" }}>
      <div style={metaStyle}>{meta}</div>
      <div style={nameStyle}>{name}</div>
      <div style={subStyle}>{sub}</div>
      <div style={{ marginTop: 24, width: 96 }}>
        <GoldRule withParticles thickness={1} width="96px" />
      </div>
    </div>
  );
}

const metaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 22,
};
const nameStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(4rem, 9vw, 8rem)",
  letterSpacing: "-0.04em",
  color: "var(--color-gold-brightest)",
  lineHeight: 0.92,
  textShadow: "0 0 40px rgba(232, 200, 120, 0.18)",
};
const subStyle: CSSProperties = {
  marginTop: 24,
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "1.05rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.6,
  maxWidth: "28ch",
};
