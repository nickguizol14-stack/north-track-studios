import { CSSProperties } from "react";

export function WorkStackDivider() {
  return (
    <div
      style={{
        margin: "90px 0",
        height: 1,
        background:
          "linear-gradient(90deg, transparent, rgba(200, 168, 78, 0.4) 30%, rgba(200, 168, 78, 0.4) 70%, transparent)",
        boxShadow: "0 0 8px rgba(200, 168, 78, 0.3)",
        position: "relative",
      }}
      aria-hidden
    >
      <span style={{ ...particleStyle, left: "30%", animationDelay: "0s" }} />
      <span style={{ ...particleStyle, left: "32%", animationDelay: "1.6s" }} />
    </div>
  );
}

const particleStyle: CSSProperties = {
  position: "absolute",
  width: 2,
  height: 2,
  borderRadius: "50%",
  background: "var(--color-gold-bright)",
  boxShadow: "0 0 4px var(--color-gold)",
  top: -8,
  opacity: 0,
  animation: "drift-up 4s ease-in-out infinite",
};
