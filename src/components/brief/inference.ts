export interface InferredCell {
  title: string;
  detail: string;
}

const FALLBACK: InferredCell = { title: "—", detail: "—" };

const PROJECT: Record<string, InferredCell> = {
  agent: {
    title: "Agent system",
    detail: "Multi-agent orchestration with tool use, evaluation harness, observability.",
  },
  search: {
    title: "Knowledge experience",
    detail: "Hybrid retrieval over your corpus, citation architecture, editorial UX.",
  },
  tool: {
    title: "Internal workbench",
    detail: "Custom interface for power users, decision support, data access patterns.",
  },
  unclear: {
    title: "Discovery engagement",
    detail: "Workshop-led shape-finding before we commit to a build.",
  },
};

const STAGE: Record<string, InferredCell> = {
  thinking: { title: "Begin with a brief", detail: "We map the territory before we touch code." },
  spec: { title: "Move into Define + Build", detail: "Skip discovery, go straight to spec validation and increments." },
  wall: { title: "Audit + intervene", detail: "Identify the wall, plan around it, ship the unblock." },
  shipped: { title: "Optimization audit", detail: "Performance, quality, cost — the unsexy second 80%." },
};

const SCOPE: Record<string, InferredCell> = {
  brief: { title: "2 weeks · written opinion", detail: "Single document, one opinion, no engineering." },
  prototype: { title: "4–6 weeks · prototype", detail: "Working proof, ready to validate with real users." },
  build: { title: "8–12 weeks · production system", detail: "Deployed in your stack, with handoff and runbook." },
  partner: { title: "Ongoing · named partnership", detail: "Continued engagement, on-call for the long arc." },
};

export function inferProject(id: string): InferredCell {
  return PROJECT[id] ?? FALLBACK;
}
export function inferStage(id: string): InferredCell {
  return STAGE[id] ?? FALLBACK;
}
export function inferScope(id: string): InferredCell {
  return SCOPE[id] ?? FALLBACK;
}
