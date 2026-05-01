// src/components/chapters/capabilities/CapabilityRow.tsx
import { CSSProperties, forwardRef } from "react";
import { GoldRule } from "@/components/primitives";

export interface CapabilityRowProps {
  index: string;        // e.g. "01"
  concept: string;      // italic Fraunces, e.g. "Intelligence"
  formal: string;       // mono caps, e.g. "AI Systems"
  body: string;
  kit: string;
}

export const CapabilityRow = forwardRef<HTMLDivElement, CapabilityRowProps>(
  function CapabilityRow({ index, concept, formal, body, kit }, ref) {
    return (
      <div
        ref={ref}
        data-cap-index={index}
        data-cap-concept={concept}
        style={{
          padding: "50px 0 60px",
          borderTop: "1px solid rgba(200, 168, 78, 0.08)",
          position: "relative",
        }}
      >
        <div style={indexStyle}>
          {index} / {concept}
        </div>
        <h3 style={titleStyle}>
          <em style={emStyle}>{concept}</em>
          <span style={formalStyle}>{formal}</span>
        </h3>
        <div style={{ margin: "22px 0" }}>
          <GoldRule withParticles thickness={1} />
        </div>
        <p style={bodyStyle}>{body}</p>
        <div style={kitStyle}>
          <span style={kitLabelStyle}>Kit</span>
          {kit}
        </div>
      </div>
    );
  },
);

const indexStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 14,
};
const titleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
  letterSpacing: "-0.02em",
  color: "var(--color-text-primary)",
  lineHeight: 1.05,
  marginBottom: 8,
  display: "flex",
  alignItems: "baseline",
  gap: 24,
  flexWrap: "wrap",
};
const emStyle: CSSProperties = {
  fontStyle: "italic",
  color: "var(--color-gold-bright)",
  fontWeight: 300,
};
const formalStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontStyle: "normal",
  fontSize: 11,
  letterSpacing: "0.4em",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
};
const bodyStyle: CSSProperties = {
  fontSize: "1rem",
  color: "var(--color-text-body)",
  lineHeight: 1.75,
  fontWeight: 300,
  maxWidth: "60ch",
  marginBottom: 18,
};
const kitStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-subtle)",
  textTransform: "uppercase",
  lineHeight: 1.7,
};
const kitLabelStyle: CSSProperties = {
  color: "var(--color-gold)",
  marginRight: 10,
};
