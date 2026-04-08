"use client";

import { GoldBrushText, GoldReveal, ThunderShimmer, WordReveal } from "./GoldPaint";

const capabilities = [
  {
    number: "01",
    title: "AI Systems & Agents",
    description:
      "Custom LLM orchestration, autonomous agents, RAG pipelines, and fine-tuned models — deployed to production, not just prototyped. We build AI that works at enterprise scale with real-time monitoring and human-in-the-loop controls.",
    tags: ["LLM Orchestration", "Autonomous Agents", "RAG", "Fine-tuning", "MLOps"],
    accent: "from-gold/20 to-gold-deep/5",
  },
  {
    number: "02",
    title: "Platform Engineering",
    description:
      "Full-stack systems designed for zero-downtime, horizontal scale, and operational clarity. APIs, microservices, event-driven architectures — built on modern infrastructure with observability baked in from day one.",
    tags: ["Distributed Systems", "Event-Driven", "GraphQL", "gRPC", "Observability"],
    accent: "from-gold-deep/15 to-transparent",
  },
  {
    number: "03",
    title: "Generative Interfaces",
    description:
      "AI-powered UIs that adapt, respond, and evolve. Real-time streaming interfaces, generative dashboards, and conversational experiences that push the boundary of what a frontend can do.",
    tags: ["Streaming UI", "AI Chat", "Generative UX", "Real-time", "WebSocket"],
    accent: "from-gold/15 to-gold-warm/5",
  },
  {
    number: "04",
    title: "Data Infrastructure",
    description:
      "Vector databases, embedding pipelines, knowledge graphs, and real-time analytics systems. The invisible infrastructure that makes intelligence possible — fast, reliable, and ready for scale.",
    tags: ["Vector DB", "Embeddings", "Knowledge Graphs", "ETL", "Analytics"],
    accent: "from-gold-deep/10 to-transparent",
  },
  {
    number: "05",
    title: "Cloud Architecture",
    description:
      "Infrastructure as code, multi-region deployments, edge computing, and cost-optimized cloud strategies. We architect for resilience — so your systems stay up when everything else goes down.",
    tags: ["IaC", "Multi-Region", "Edge", "Kubernetes", "CI/CD"],
    accent: "from-gold/10 to-gold-deep/5",
  },
  {
    number: "06",
    title: "Design Systems",
    description:
      "Component libraries, design tokens, motion systems, and brand-aligned UI kits — engineered for consistency at scale. Every pixel intentional, every interaction considered, every component production-tested.",
    tags: ["Component Library", "Design Tokens", "Motion", "Accessibility", "Figma→Code"],
    accent: "from-gold-warm/15 to-transparent",
  },
];

export function Services() {
  return (
    <section id="capabilities" className="relative py-36 bg-surface">
      {/* Painted top border */}
      <div className="painted-divider" />

      <div className="mx-auto max-w-7xl px-6 pt-8">
        {/* Section header */}
        <div className="mb-24">
          <GoldReveal delay={0}>
            <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-mono">
              Capabilities
            </span>
          </GoldReveal>

          <div className="mt-5">
            <ThunderShimmer interval={10000} intensity={0.3}>
              <GoldBrushText
                as="h2"
                className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight"
                delay={0}
                speed={200}
              >
                What we engineer
              </GoldBrushText>
            </ThunderShimmer>
          </div>

          <GoldReveal delay={300}>
            <WordReveal
              as="p"
              className="mt-8 max-w-xl text-base text-muted-light leading-relaxed font-light"
              delay={100}
              stagger={35}
            >
              Six core disciplines, unified by a single principle: build intelligent systems that perform in production, not just in demos.
            </WordReveal>
          </GoldReveal>
        </div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, i) => (
            <GoldReveal
              key={cap.number}
              delay={i * 100}
              direction={i % 2 === 0 ? "left" : "right"}
            >
              <div className={`group relative border border-gold/[0.08] bg-card h-full p-8 hover:border-gold/25 card-alive sway-${(i % 6) + 1}`}>
                {/* Top gradient accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${cap.accent}`}
                />

                {/* Corner mark */}
                <div className="absolute top-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-full h-px bg-gold/40" />
                  <div className="absolute top-0 right-0 w-px h-full bg-gold/40" />
                </div>

                {/* Number */}
                <span className="text-[11px] font-mono text-gold/30 tracking-wider">
                  {cap.number}
                </span>

                {/* Title */}
                <WordReveal
                  as="h3"
                  className="mt-4 text-lg font-light tracking-tight text-foreground-warm group-hover:text-gold transition-colors duration-500"
                  delay={i * 80}
                  stagger={70}
                >
                  {cap.title}
                </WordReveal>

                {/* Description */}
                <WordReveal
                  as="p"
                  className="mt-4 text-sm text-muted leading-relaxed"
                  delay={i * 80 + 150}
                  stagger={25}
                >
                  {cap.description}
                </WordReveal>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {cap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-gold/[0.08] bg-gold/[0.02] px-2.5 py-1 text-[9px] tracking-wider uppercase text-muted font-mono group-hover:border-gold/15 transition-colors duration-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover glow */}
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gold/0 group-hover:bg-gold/20 transition-all duration-700" />
              </div>
            </GoldReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
