export interface ScrollCueProps {
  /** When true, hide the cue. */
  hidden?: boolean;
}

export function ScrollCue({ hidden = false }: ScrollCueProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: hidden ? 0 : 0.7,
        transition: "opacity 0.4s ease",
      }}
      aria-hidden
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.5em",
          color: "var(--color-text-subtle)",
          textTransform: "uppercase",
        }}
      >
        begin
      </span>
      <div
        style={{
          width: 1,
          height: 32,
          background:
            "linear-gradient(to bottom, rgba(200, 168, 78, 0.5), transparent)",
          animation: "scroll-cue-stem-pulse 1.6s ease-in-out infinite",
        }}
      />
    </div>
  );
}
