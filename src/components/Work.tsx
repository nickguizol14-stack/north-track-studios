"use client";

import { GoldBrushText, GoldReveal, ThunderShimmer, WordReveal } from "./GoldPaint";

const projects = [
  {
    label: "AI Agent Platform",
    title: "Autonomous Fleet Intelligence",
    description:
      "Built an autonomous agent orchestration platform for a logistics company managing 10,000+ vehicles. Multi-agent system with real-time decision making, predictive routing, and anomaly detection — reducing operational costs by 34%.",
    metrics: ["10K+ vehicles", "34% cost reduction", "< 50ms decisions"],
    tags: ["Multi-Agent", "Real-time ML", "Event Streaming"],
  },
  {
    label: "Generative Interface",
    title: "AI-Powered Research Dashboard",
    description:
      "Designed and engineered a streaming research interface for a biotech firm. Natural language queries against 2M+ scientific papers with real-time synthesis, citation graphs, and collaborative annotation — replacing a 6-person research workflow.",
    metrics: ["2M+ papers indexed", "6x faster research", "95% accuracy"],
    tags: ["RAG Pipeline", "Streaming UI", "Vector Search"],
  },
  {
    label: "Platform Migration",
    title: "Legacy to Intelligence",
    description:
      "Migrated a Fortune 500 company's monolithic .NET system to a modern event-driven architecture with AI-powered automation. Zero-downtime migration over 8 months — now processing 4x the throughput on 60% of the infrastructure cost.",
    metrics: ["4x throughput", "60% cost savings", "Zero downtime"],
    tags: ["Event-Driven", "Cloud Native", "AI Automation"],
  },
];

export function Work() {
  return (
    <section id="work" className="relative py-36 bg-surface">
      <div className="painted-divider" />

      <div className="mx-auto max-w-7xl px-6 pt-8">
        {/* Section header */}
        <div className="mb-24">
          <GoldReveal>
            <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-mono">
              Selected Work
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
                Case studies
              </GoldBrushText>
            </ThunderShimmer>
          </div>

          <GoldReveal delay={300}>
            <WordReveal
              as="p"
              className="mt-8 max-w-xl text-base text-muted-light leading-relaxed font-light"
              delay={0}
              stagger={40}
            >
              A selection of systems we&apos;ve engineered. Each one started as an impossible brief and shipped as production infrastructure.
            </WordReveal>
          </GoldReveal>
        </div>

        {/* Project cards — stacked, full width */}
        <div className="flex flex-col gap-8">
          {projects.map((project, i) => (
            <GoldReveal key={project.title} delay={i * 150} direction="up">
              <div className={`group border border-gold/[0.08] bg-card relative overflow-hidden hover:border-gold/20 card-alive sway-${(i % 3) + 1}`}>
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

                <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left — label + title */}
                  <div className="lg:col-span-2">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-gold/50 font-mono">
                      {project.label}
                    </span>
                    <WordReveal
                      as="h3"
                      className="mt-3 text-2xl md:text-3xl font-extralight tracking-tight text-foreground-warm group-hover:text-gold transition-colors duration-500"
                      delay={i * 80}
                      stagger={70}
                    >
                      {project.title}
                    </WordReveal>
                    <WordReveal
                      as="p"
                      className="mt-5 text-sm text-muted leading-relaxed max-w-2xl"
                      delay={i * 80 + 100}
                      stagger={30}
                    >
                      {project.description}
                    </WordReveal>

                    {/* Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-gold/10 bg-gold/[0.02] px-3 py-1 text-[9px] tracking-wider uppercase text-muted font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right — metrics */}
                  <div className="flex flex-col justify-center gap-4 lg:border-l lg:border-gold/10 lg:pl-8">
                    {project.metrics.map((metric) => (
                      <div key={metric} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-gold/40 rotate-45" />
                        <span className="text-sm font-light text-foreground-warm">
                          {metric}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom glow on hover */}
                <div className="absolute bottom-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/15 transition-all duration-700" />
              </div>
            </GoldReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
