// src/components/chapters/ChapterHeadline.tsx
import { ReactNode } from "react";

export interface ChapterHeadlineProps {
  children: ReactNode;
  /** Tag to render. Defaults to h2. */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function ChapterHeadline({ children, as: Tag = "h2", className }: ChapterHeadlineProps) {
  return (
    <Tag
      className={className}
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 300,
        fontSize: "clamp(2.6rem, 5vw, 4.4rem)",
        letterSpacing: "-0.025em",
        color: "var(--color-text-primary)",
        lineHeight: 1.02,
        marginBottom: 36,
      }}
    >
      <style>{`
        .chapter-headline-em em {
          font-style: italic;
          color: var(--color-gold-bright);
          font-weight: 300;
        }
      `}</style>
      <span className="chapter-headline-em">{children}</span>
    </Tag>
  );
}
