// src/app/work/[slug]/page.tsx
import { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { WorkPinnedName } from "@/components/chapters/work/WorkPinnedName";
import { ContactClosing } from "@/components/closing/ContactClosing";
import { FooterMini } from "@/components/closing/FooterMini";

interface Beat {
  tag: string;
  body: string;
  tags?: string;
}

interface Case {
  num: string;
  year: string;
  client: string;
  name: string;
  sub: string;
  beats: Beat[];
}

const CASES: Record<string, Case> = {
  synapse: {
    num: "Project 01",
    year: "2025",
    client: "Private · Lead",
    name: "Synapse",
    sub: "An internal research workbench for a hedge fund (private).",
    beats: [
      { tag: "Beat 01 · The piece", body: "Analysts query the firm's full corpus through a single conversational surface. The system retrieves, cites, and reasons across structured and unstructured sources — and tells you when it doesn't know." },
      { tag: "Beat 02 · The challenge", body: "Six different research silos. Twenty-eight analysts asking the same questions across them in slightly different ways. The fix wasn't another search box — it was a system that knew which silo to ask, in what order, with what authority." },
      { tag: "Beat 03 · What shipped", body: "A multi-agent retrieval graph with a single interface, source-cited responses, an evaluation harness scoring every answer against analyst-curated gold, and a custom dashboard for the head of research to monitor query patterns and flag drift.", tags: "Claude · LangGraph · pgvector · Modal · Next.js" },
    ],
  },
  lumen: {
    num: "Project 02",
    year: "2024",
    client: "The New Atlas · Lead",
    name: "Lumen",
    sub: "A public-facing AI search experience for a publication's 12-year archive.",
    beats: [
      { tag: "Beat 01 · The piece", body: "Reads like an editorial — structured answers with cited paragraphs, related stories, and a timeline of how a story evolved over a decade." },
      { tag: "Beat 02 · What shipped", body: "Hybrid retrieval over the archive, citation architecture that links every paragraph back to the source, and an editor-facing dashboard for surfacing under-cited pieces.", tags: "Editorial UX · Hybrid retrieval · Citation" },
    ],
  },
  threshold: {
    num: "Project 03",
    year: "2025",
    client: "Block Eleven · Lead",
    name: "Threshold",
    sub: "Agent-driven incident response system for a security firm.",
    beats: [
      { tag: "Beat 01 · The piece", body: "Triages alerts, writes the first draft of the runbook execution, and routes humans only when the system's confidence drops below threshold." },
      { tag: "Beat 02 · What shipped", body: "An agent orchestration layer wired to existing security tooling, a confidence-routing policy engine, and a paired runbook editor for the SOC team.", tags: "Agent orchestration · Tool use · Confidence routing" },
    ],
  },
};

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CASES[slug];
  if (!c) notFound();

  return (
    <>
      <ScrollProgress />
      <NavShell show />

      <main style={{ paddingTop: 120 }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "100px 32px 100px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
            gap: 80,
            alignItems: "start",
            minHeight: "240vh",
          }}
        >
          <WorkPinnedName meta={`${c.num} · ${c.year} · ${c.client}`} name={c.name} sub={c.sub} />
          <div style={{ paddingTop: 100, display: "flex", flexDirection: "column", gap: 110, maxWidth: "56ch" }}>
            {c.beats.map((b, i) => (
              <div key={i}>
                <div style={beatTagStyle}>{b.tag}</div>
                <p style={beatBodyStyle}>{b.body}</p>
                {b.tags && <div style={beatTagsStyle}>{b.tags}</div>}
              </div>
            ))}
          </div>
        </div>
      </main>

      <ContactClosing />
      <FooterMini />
    </>
  );
}

const beatTagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.4em",
  color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 14,
};
const beatBodyStyle: CSSProperties = {
  fontSize: "1.02rem", color: "var(--color-text-body)",
  lineHeight: 1.78, fontWeight: 300,
};
const beatTagsStyle: CSSProperties = {
  marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 9,
  letterSpacing: "0.32em", color: "var(--color-text-subtle)", textTransform: "uppercase",
};
