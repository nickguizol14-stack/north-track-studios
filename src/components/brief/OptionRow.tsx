"use client";
import { CSSProperties, useState } from "react";

export interface OptionRowProps {
  index: string;        // "01"
  title: string;        // italic Fraunces
  detail: string;       // mono / sans body
  selected: boolean;
  onSelect: () => void;
}

export function OptionRow({ index, title, detail, selected, onSelect }: OptionRowProps) {
  const [hover, setHover] = useState(false);
  const active = selected || hover;

  const titleColor = selected
    ? "var(--color-gold-brightest)"
    : hover
      ? "var(--color-text-primary)"
      : "var(--color-text-body-soft)";

  const ruleWidth = selected ? 96 : hover ? 56 : 24;
  const ruleBg = selected
    ? "linear-gradient(90deg, var(--color-gold), var(--color-gold-brightest) 60%, transparent)"
    : hover
      ? "rgba(200, 168, 78, 0.5)"
      : "rgba(200, 168, 78, 0.2)";
  const ruleShadow = selected ? "0 0 8px rgba(200, 168, 78, 0.5)" : "none";

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "64px 1fr 32px",
        gap: 28,
        padding: "24px 0",
        cursor: "pointer",
        borderTop: "1px solid rgba(200, 168, 78, 0.08)",
        alignItems: "start",
        position: "relative",
        paddingLeft: active ? 12 : 0,
        transition: "padding-left 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Selected accent line on left */}
      {selected && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 24,
            bottom: 24,
            width: 1,
            background: "var(--color-gold)",
            boxShadow: "0 0 6px rgba(200, 168, 78, 0.6)",
          }}
        />
      )}

      {/* Number */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.4em",
          color: selected ? "var(--color-gold)" : hover ? "var(--color-text-muted)" : "var(--color-text-faint)",
          textTransform: "uppercase",
          paddingTop: 10,
          transition: "color 0.4s ease",
        }}
      >
        {index}
      </div>

      {/* Content */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
            letterSpacing: "-0.015em",
            color: titleColor,
            lineHeight: 1.1,
            marginBottom: 12,
            transition: "color 0.4s ease, text-shadow 0.4s ease",
            textShadow: selected ? "0 0 22px rgba(232, 200, 120, 0.35)" : "none",
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: ruleWidth,
            height: 1,
            background: ruleBg,
            boxShadow: ruleShadow,
            marginBottom: 12,
            transition: "width 0.55s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, box-shadow 0.4s ease",
            position: "relative",
          }}
          aria-hidden
        >
          {selected && (
            <>
              <span
                style={{
                  position: "absolute",
                  width: 1.5,
                  height: 1.5,
                  borderRadius: "50%",
                  background: "var(--color-gold-bright)",
                  boxShadow: "0 0 4px var(--color-gold)",
                  top: -8,
                  left: 24,
                  opacity: 0,
                  animation: "opt-drift 3s ease-in-out infinite",
                  animationDelay: "0s",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  width: 1.5,
                  height: 1.5,
                  borderRadius: "50%",
                  background: "var(--color-gold-bright)",
                  boxShadow: "0 0 4px var(--color-gold)",
                  top: -8,
                  left: 48,
                  opacity: 0,
                  animation: "opt-drift 3s ease-in-out infinite",
                  animationDelay: "1.4s",
                }}
              />
            </>
          )}
        </div>
        <div style={detailStyle(active, selected)}>{detail}</div>
      </div>

      {/* Check dot */}
      <div
        style={{
          width: 24,
          height: 24,
          border: "1px solid",
          borderColor: selected
            ? "var(--color-gold-brightest)"
            : hover
              ? "rgba(200, 168, 78, 0.6)"
              : "rgba(200, 168, 78, 0.25)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: selected ? "var(--color-bg-deep)" : hover ? "var(--color-gold)" : "var(--color-text-faint)",
          background: selected ? "var(--color-gold)" : "transparent",
          boxShadow: selected ? "0 0 16px rgba(200, 168, 78, 0.55)" : "none",
          marginTop: 8,
          transition: "all 0.4s ease",
        }}
      >
        {selected ? "✓" : "+"}
      </div>
    </div>
  );
}

function detailStyle(active: boolean, selected: boolean): CSSProperties {
  return {
    fontSize: "0.95rem",
    color: selected ? "var(--color-text-body-soft)" : active ? "var(--color-text-body-soft)" : "var(--color-text-muted)",
    lineHeight: 1.6,
    fontWeight: 300,
    transition: "color 0.4s ease",
  };
}
