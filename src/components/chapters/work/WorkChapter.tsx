import { CSSProperties } from "react";
import { ChapterDivider } from "@/components/primitives";
import { WorkPinnedName } from "./WorkPinnedName";
import { WorkStackRow } from "./WorkStackRow";
import { WorkStackDivider } from "./WorkStackDivider";

export function WorkChapter() {
  return (
    <section
      style={{
        background: "var(--color-bg-deep)",
        padding: "140px 0 60px",
        borderTop: "1px solid rgba(200, 168, 78, 0.06)",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 56,
        }}
      >
        {/* Aside */}
        <aside>
          <div style={{ position: "sticky", top: 120 }}>
            <div style={asideNumStyle}>03 / Work</div>
            <h3 style={asideTitleStyle}>Selected</h3>
            <ChapterDivider />
            <div style={asideTextStyle}>
              Three pieces.<br />
              2024 — 2025.<br />
              Available on request.
            </div>
          </div>
        </aside>

        {/* Body */}
        <div>
          {/* Project 1 — pinned name + scrolling beats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
              gap: 80,
              alignItems: "start",
              minHeight: "240vh",
              paddingBottom: 100,
            }}
          >
            <WorkPinnedName
              meta="Project 01 · 2025 · Lead"
              name="Synapse"
              sub="An internal research workbench for a hedge fund (private)."
            />
            <div style={{ paddingTop: 100, display: "flex", flexDirection: "column", gap: 110, maxWidth: "56ch" }}>
              <Beat
                tag="Beat 01 · The piece"
                body={
                  <>
                    Analysts query the firm&rsquo;s full corpus through a single conversational
                    surface. The system retrieves, cites, and reasons across structured and
                    unstructured sources — and tells you when it doesn&rsquo;t know.
                  </>
                }
              />
              <Beat
                tag="Beat 02 · The challenge"
                body={
                  <>
                    Six different research silos. Twenty-eight analysts asking the same
                    questions across them in slightly different ways. The fix wasn&rsquo;t
                    another search box — it was a system that knew{" "}
                    <b style={beatBodyEmStyle}>which silo to ask, in what order, with what authority.</b>
                  </>
                }
              />
              <Beat
                tag="Beat 03 · What shipped"
                body={
                  <>
                    A multi-agent retrieval graph with a single interface, source-cited
                    responses, an evaluation harness scoring every answer against
                    analyst-curated gold, and a custom dashboard for the head of research
                    to monitor query patterns and flag drift.
                  </>
                }
                tags="Claude · LangGraph · pgvector · Modal · Next.js"
              />
            </div>
          </div>

          <WorkStackDivider />

          <WorkStackRow
            name="Lumen"
            meta="Project 02 · 2024"
            client="The New Atlas · Lead"
            body="A public-facing AI search experience built on a publication's 12-year archive. Reads like an editorial — structured answers with cited paragraphs, related stories, and a timeline of how a story evolved over a decade."
            tags="Editorial UX · Hybrid retrieval · Citation architecture · Public beta"
          />

          <WorkStackDivider />

          <WorkStackRow
            name="Threshold"
            meta="Project 03 · 2025"
            client="Block Eleven · Lead"
            body="An agent-driven incident response system for a security firm. Triages alerts, writes the first draft of the runbook execution, and routes humans only when the system's confidence drops below threshold."
            tags="Agent orchestration · Tool use · Confidence routing · Internal production"
          />
        </div>
      </div>
    </section>
  );
}

interface BeatProps {
  tag: string;
  body: React.ReactNode;
  tags?: string;
}
function Beat({ tag, body, tags }: BeatProps) {
  return (
    <div>
      <div style={beatTagStyle}>{tag}</div>
      <p style={beatBodyStyle}>{body}</p>
      {tags && (
        <div style={beatTagsStyle}>
          {tags}
        </div>
      )}
    </div>
  );
}

const asideNumStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 16,
};
const asideTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "1.6rem",
  letterSpacing: "-0.01em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 20,
};
const asideTextStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-subtle)",
  lineHeight: 1.7,
  textTransform: "uppercase",
};
const beatTagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 14,
};
const beatBodyStyle: CSSProperties = {
  fontSize: "1.02rem",
  color: "var(--color-text-body)",
  lineHeight: 1.78,
  fontWeight: 300,
};
const beatBodyEmStyle: CSSProperties = {
  color: "var(--color-text-primary)",
  fontWeight: 400,
};
const beatTagsStyle: CSSProperties = {
  marginTop: 16,
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.32em",
  color: "var(--color-text-subtle)",
  textTransform: "uppercase",
};
