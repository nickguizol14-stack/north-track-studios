import Link from "next/link";
import { CSSProperties } from "react";
import { CornerGlyphs } from "@/components/intro/CornerGlyphs";

export function ContactClosing() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 50%, var(--color-bg-radial) 0%, var(--color-bg-deep) 80%)",
        borderTop: "1px solid rgba(200, 168, 78, 0.06)",
        padding: "80px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div className="grid-overlay" aria-hidden />
      <CornerGlyphs />

      <div style={{ textAlign: "center", maxWidth: 640, position: "relative", zIndex: 5 }}>
        <div style={tagStyle}>Closing</div>
        <h2 style={headlineStyle}>
          A short conversation, <em style={emStyle}>privately</em>.
        </h2>
        <div style={ruleStyle} aria-hidden />
        <p style={bodyStyle}>
          If you have an idea you&rsquo;ve been turning over and you&rsquo;d like
          a second opinion before it becomes a project, write to us. The first
          conversation is short, off the record, and free of charge.
        </p>
        <Link href="/brief" style={ctaStyle}>
          Begin a brief <span style={{ marginLeft: 12 }}>→</span>
        </Link>
        <div style={auxStyle}>
          Or write directly &middot;{" "}
          <a href="mailto:hello@northtrack.studio" style={auxLinkStyle}>
            hello@northtrack.studio
          </a>
        </div>
      </div>
    </section>
  );
}

const tagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 30,
};
const headlineStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "clamp(2.4rem, 4.8vw, 4rem)",
  letterSpacing: "-0.025em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 32,
};
const emStyle: CSSProperties = {
  fontStyle: "italic",
  color: "var(--color-gold-bright)",
};
const ruleStyle: CSSProperties = {
  width: 280,
  height: 1,
  background:
    "linear-gradient(90deg, transparent, var(--color-gold) 25%, var(--color-gold-brightest) 50%, var(--color-gold) 75%, transparent)",
  boxShadow: "0 0 12px rgba(232, 200, 120, 0.5)",
  margin: "0 auto 28px",
  borderRadius: "999px",
};
const bodyStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "1.05rem",
  color: "var(--color-text-body)",
  lineHeight: 1.7,
  marginBottom: 38,
  maxWidth: "50ch",
  marginLeft: "auto",
  marginRight: "auto",
};
const ctaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.42em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  textDecoration: "none",
  padding: "14px 38px",
  border: "1px solid rgba(200, 168, 78, 0.4)",
  borderRadius: "999px",
  display: "inline-block",
  transition: "all 0.4s ease",
};
const auxStyle: CSSProperties = {
  marginTop: 28,
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
};
const auxLinkStyle: CSSProperties = {
  color: "var(--color-text-body)",
  textDecoration: "none",
};
