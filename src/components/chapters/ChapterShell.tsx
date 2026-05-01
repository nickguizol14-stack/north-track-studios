// src/components/chapters/ChapterShell.tsx
import { CSSProperties, ReactNode } from "react";

export interface ChapterShellProps {
  aside: ReactNode;
  body: ReactNode;
  /** Optional right-side margin notes column. */
  margin?: ReactNode;
  /** CSS grid-template-columns. Defaults to "240px 1fr 1fr". */
  gridTemplate?: string;
  /** Section padding (top/bottom). Defaults to "140px 0 120px". */
  padding?: string;
  /** Additional className on the section. */
  className?: string;
  /** Additional style on the section. */
  style?: CSSProperties;
}

export function ChapterShell({
  aside,
  body,
  margin,
  gridTemplate = "240px 1fr 1fr",
  padding = "140px 0 120px",
  className,
  style,
}: ChapterShellProps) {
  return (
    <section
      className={`chapter ${className ?? ""}`}
      style={{
        position: "relative",
        background: "var(--color-bg-deep)",
        padding,
        borderTop: "1px solid rgba(200, 168, 78, 0.06)",
        ...style,
      }}
    >
      <div
        className="chapter-inner"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: gridTemplate,
          gap: 56,
          position: "relative",
          zIndex: 1,
        }}
      >
        <aside style={{ position: "relative" }}>
          <div style={{ position: "sticky", top: 120 }}>{aside}</div>
        </aside>
        <div className="chapter-body">{body}</div>
        {margin && <div className="chapter-margin">{margin}</div>}
      </div>
    </section>
  );
}
