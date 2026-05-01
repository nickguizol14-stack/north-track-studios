// src/components/sublayouts/SubPageHero.tsx
import { CSSProperties } from "react";

export interface SubPageHeroProps {
  /** URL slug, displayed in the small mono tag (e.g. "capabilities" → "/ Capabilities"). */
  slug: string;
  /** Italic Fraunces wordmark, displayed as the page title. */
  wordmark: string;
  /** One-line italic subtitle below. */
  subtitle: string;
}

export function SubPageHero({ slug, wordmark, subtitle }: SubPageHeroProps) {
  const cap = slug.charAt(0).toUpperCase() + slug.slice(1);
  return (
    <div style={wrapStyle}>
      <div style={tagStyle}>/ {cap}</div>
      <h1 style={wordmarkStyle}>{wordmark}</h1>
      <p style={subtitleStyle}>{subtitle}</p>
    </div>
  );
}

const wrapStyle: CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "180px 32px 80px",
};
const tagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 18,
};
const wordmarkStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(3rem, 7vw, 6rem)",
  letterSpacing: "-0.03em",
  color: "var(--color-gold-brightest)",
  lineHeight: 0.95,
  textShadow: "0 0 30px rgba(232, 200, 120, 0.18)",
  marginBottom: 18,
};
const subtitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "1.1rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.5,
};
