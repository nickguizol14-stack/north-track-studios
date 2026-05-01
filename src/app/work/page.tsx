// src/app/work/page.tsx
"use client";
import { useState } from "react";
import { CSSProperties } from "react";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { SubPageHero } from "@/components/sublayouts/SubPageHero";
import { WorkStackRow } from "@/components/chapters/work/WorkStackRow";
import { WorkStackDivider } from "@/components/chapters/work/WorkStackDivider";
import { CascadeReveal } from "@/components/subpages/CascadeReveal";
import { ContactClosing } from "@/components/closing/ContactClosing";
import { FooterMini } from "@/components/closing/FooterMini";

interface Project {
  slug: string;
  num: string;
  year: string;
  name: string;
  client: string;
  body: string;
  tags: string;
}

const PROJECTS: Project[] = [
  { slug: "synapse",   num: "Project 01", year: "2025", name: "Synapse",   client: "Private · Lead",         body: "An internal research workbench. Analysts query the firm's full corpus through a single conversational surface; the system retrieves, cites, and reasons across structured and unstructured sources.", tags: "RAG · Multi-agent · Eval harness · Internal tooling" },
  { slug: "lumen",     num: "Project 02", year: "2024", name: "Lumen",     client: "The New Atlas · Lead",   body: "A public-facing AI search experience built on a publication's 12-year archive. Reads like an editorial — structured answers with cited paragraphs, related stories, and a timeline of how a story evolved.", tags: "Editorial UX · Hybrid retrieval · Citation architecture" },
  { slug: "threshold", num: "Project 03", year: "2025", name: "Threshold", client: "Block Eleven · Lead",    body: "An agent-driven incident response system for a security firm. Triages alerts, writes the first draft of the runbook execution, and routes humans only when the system isn't confident.", tags: "Agent orchestration · Tool use · Confidence routing" },
];

export default function WorkPage() {
  const [filter, setFilter] = useState<"all" | "2024" | "2025">("all");
  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.year === filter);

  return (
    <>
      <ScrollProgress />
      <NavShell show />
      <SubPageHero slug="work" wordmark="Work" subtitle={`${PROJECTS.length} pieces, 2024–2025.`} />

      {/* Filter row */}
      <div style={filterRowStyle}>
        {["all", "2025", "2024"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as "all" | "2024" | "2025")}
            style={{
              ...filterPillStyle,
              color: filter === f ? "var(--color-gold)" : "var(--color-text-muted)",
              borderColor: filter === f ? "var(--color-gold)" : "rgba(200, 168, 78, 0.2)",
            }}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <main
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "60px 32px 100px",
        }}
      >
        {filtered.map((p, i) => (
          <CascadeReveal key={p.slug} index={i}>
            <WorkStackRow
              name={p.name}
              meta={`${p.num} · ${p.year}`}
              client={p.client}
              body={p.body}
              tags={p.tags}
            />
            {i < filtered.length - 1 && <WorkStackDivider />}
          </CascadeReveal>
        ))}
      </main>

      <ContactClosing />
      <FooterMini />
    </>
  );
}

const filterRowStyle: CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: "0 32px",
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};
const filterPillStyle: CSSProperties = {
  padding: "10px 22px",
  borderRadius: 999,
  background: "transparent",
  border: "1px solid",
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "color 0.3s ease, border-color 0.3s ease",
};
