export interface ChapterBreakProps {
  n: string;
  label?: string;
  className?: string;
}

export function ChapterBreak({ n, label = "end", className }: ChapterBreakProps) {
  return (
    <div
      className={`chapter-break ${className ?? ""}`}
      style={{
        padding: "80px 32px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 48,
          height: 1,
          background: "rgba(200, 168, 78, 0.5)",
          margin: "0 auto 14px",
          position: "relative",
        }}
        aria-hidden
      >
        <span
          style={{
            position: "absolute",
            width: 1.5,
            height: 1.5,
            borderRadius: "50%",
            background: "var(--color-gold-bright)",
            top: -6,
            left: 14,
          }}
        />
        <span
          style={{
            position: "absolute",
            width: 1.5,
            height: 1.5,
            borderRadius: "50%",
            background: "var(--color-gold-bright)",
            top: -6,
            left: 28,
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.5em",
          color: "var(--color-text-subtle)",
          textTransform: "uppercase",
        }}
      >
        {label} · {n}
      </div>
    </div>
  );
}
