"use client";
import Link from "next/link";
import { CSSProperties, useState } from "react";

export function BriefTeaser() {
  const [draft, setDraft] = useState("");
  const href = draft.trim()
    ? `/brief?seed=${encodeURIComponent(draft.trim())}`
    : "/brief";

  return (
    <section
      style={{
        background: "var(--color-bg-deep)",
        padding: "120px 32px 140px",
        borderTop: "1px solid rgba(200, 168, 78, 0.06)",
      }}
    >
      <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
        <div style={numStyle}>05 / Brief</div>
        <h2 style={promptStyle}>
          What&rsquo;s the question you keep <em style={emStyle}>coming back to</em>?
        </h2>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="The real one, not the polished one."
          rows={3}
          style={inputStyle}
        />
        <div style={ruleStyle} aria-hidden />
        <div style={{ marginTop: 32 }}>
          <Link href={href} style={ctaStyle}>
            Continue the brief <span style={{ marginLeft: 12 }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

const numStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 24,
};
const promptStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(1.8rem, 4vw, 3rem)",
  letterSpacing: "-0.025em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 36,
};
const emStyle: CSSProperties = {
  color: "var(--color-gold-brightest)",
  fontStyle: "italic",
  fontWeight: 400,
  textShadow: "0 0 18px rgba(232, 200, 120, 0.35)",
};
const inputStyle: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
  padding: "6px 0 14px",
  caretColor: "var(--color-gold-brightest)",
  resize: "none",
  textAlign: "center",
};
const ruleStyle: CSSProperties = {
  height: 1,
  background:
    "linear-gradient(90deg, rgba(200, 168, 78, 0.25), rgba(200, 168, 78, 0.5) 50%, rgba(200, 168, 78, 0.25))",
  boxShadow: "0 0 4px rgba(200, 168, 78, 0.2)",
};
const ctaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.42em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  padding: "18px 4px",
  borderBottom: "1px solid var(--color-gold)",
  boxShadow: "0 1px 0 0 rgba(200, 168, 78, 0.5)",
};
