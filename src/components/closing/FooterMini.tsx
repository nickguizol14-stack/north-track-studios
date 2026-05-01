import { CSSProperties } from "react";

export function FooterMini() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(200, 168, 78, 0.1)",
        padding: 32,
        background: "var(--color-bg-deep)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.4em",
        color: "var(--color-text-faint)",
        textTransform: "uppercase",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div>
        NorthTrack Studios <span style={goldStyle}>·</span>{" "}
        <span style={goldStyle}>est. 2024</span>
      </div>
      <div>40.7128° N · 74.0060° W</div>
      <div>Vol. 02 · Issue 01</div>
    </footer>
  );
}

const goldStyle: CSSProperties = { color: "var(--color-gold)" };
