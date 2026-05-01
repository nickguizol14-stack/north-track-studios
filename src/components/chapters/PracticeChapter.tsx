// src/components/chapters/PracticeChapter.tsx
import { ChapterShell } from "./ChapterShell";
import { ChapterHeadline } from "./ChapterHeadline";
import { ChapterDivider } from "@/components/primitives";

export function PracticeChapter() {
  return (
    <ChapterShell
      aside={
        <>
          <div style={asideNumStyle}>01 / Practice</div>
          <h3 style={asideTitleStyle}>What we are</h3>
          <ChapterDivider />
          <div style={asideTextStyle}>
            A small studio.<br />
            Applied AI.<br />
            Interfaces.<br />
            Engineered systems.
          </div>
        </>
      }
      body={
        <div style={{ gridColumn: "1 / -1", maxWidth: 700 }}>
          <ChapterHeadline>
            We build <em>intelligent</em> systems and the <em>interfaces</em> they live in.
          </ChapterHeadline>
          <p style={leadStyle}>
            NorthTrack Studios is a small workshop working at the intersection of
            applied AI and the surfaces that carry it. We design quietly and ship
            deliberately.
          </p>
          <p style={bodyStyle}>
            Most of what we make is invisible by the time it works —{" "}
            <b style={bodyEmStyle}>retrieval pipelines, agent graphs, decision systems</b>{" "}
            humming beneath an interface that someone elsewhere is trying to use without
            thinking about us.
          </p>
          <p style={bodyStyle}>
            That&rsquo;s the goal. The interface becomes the brand; the brand recedes
            into the work.
          </p>
        </div>
      }
      margin={
        <div style={marginNotesStyle}>
          <div style={marginNoteStyle}>
            <span style={marginLabelStyle}>Founded</span>
            2024 · Brooklyn
          </div>
          <div style={marginNoteStyle}>
            <span style={marginLabelStyle}>Practice</span>
            AI systems · Interface design · Production engineering
          </div>
          <div style={marginNoteStyle}>
            <span style={marginLabelStyle}>Annual capacity</span>
            4–6 named engagements
          </div>
        </div>
      }
    />
  );
}

const asideNumStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 16,
};
const asideTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "1.6rem",
  letterSpacing: "-0.01em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 20,
};
const asideTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-subtle)",
  lineHeight: 1.7,
  textTransform: "uppercase",
};
const leadStyle: React.CSSProperties = {
  fontSize: "1.05rem",
  color: "var(--color-text-body)",
  lineHeight: 1.75,
  fontWeight: 300,
  maxWidth: "56ch",
  marginBottom: 28,
};
const bodyStyle: React.CSSProperties = {
  color: "var(--color-text-muted)",
  lineHeight: 1.85,
  fontWeight: 300,
  maxWidth: "60ch",
  marginBottom: 18,
  fontSize: "0.95rem",
};
const bodyEmStyle: React.CSSProperties = {
  color: "var(--color-text-body-soft)",
  fontWeight: 400,
};
const marginNotesStyle: React.CSSProperties = {
  paddingTop: 80,
  paddingLeft: 24,
  borderLeft: "1px solid rgba(200, 168, 78, 0.1)",
};
const marginNoteStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-muted)",
  lineHeight: 1.7,
  marginBottom: 24,
  textTransform: "uppercase",
};
const marginLabelStyle: React.CSSProperties = {
  color: "var(--color-gold)",
  display: "block",
  marginBottom: 4,
};
