import { CSSProperties } from "react";

export interface WorkStackRowProps {
  name: string;
  meta: string;
  client: string;
  body: string;
  tags: string;
}

export function WorkStackRow({ name, meta, client, body, tags }: WorkStackRowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "baseline",
      }}
    >
      <div style={nameStyle}>{name}</div>
      <div style={metaStyle}>
        {meta}
        <span style={metaLineStyle}>{client}</span>
      </div>
      <p style={bodyStyle}>{body}</p>
      <div style={tagsStyle}>
        <span style={kitLabelStyle}>Tags</span>
        {tags}
      </div>
    </div>
  );
}

const nameStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)",
  letterSpacing: "-0.025em",
  color: "var(--color-gold-brightest)",
  lineHeight: 1,
  textShadow: "0 0 30px rgba(232, 200, 120, 0.12)",
};
const metaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.4em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  lineHeight: 1.7,
};
const metaLineStyle: CSSProperties = {
  color: "var(--color-text-muted)",
  display: "block",
  marginTop: 4,
};
const bodyStyle: CSSProperties = {
  gridColumn: "1 / -1",
  marginTop: 22,
  fontSize: "1rem",
  color: "var(--color-text-body)",
  lineHeight: 1.78,
  fontWeight: 300,
  maxWidth: "70ch",
};
const tagsStyle: CSSProperties = {
  gridColumn: "1 / -1",
  marginTop: 14,
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.32em",
  color: "var(--color-text-subtle)",
  textTransform: "uppercase",
};
const kitLabelStyle: CSSProperties = {
  color: "var(--color-gold)",
  marginRight: 10,
};
