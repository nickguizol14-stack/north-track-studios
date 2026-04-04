"use client";

import { GoldBrushText, GoldReveal, ThunderShimmer } from "./GoldPaint";
import { GoldParticles } from "./GoldParticles";

const stats = [
  { value: "50+", label: "Systems Deployed" },
  { value: "12", label: "AI Models in Prod" },
  { value: "99.97%", label: "Uptime SLA" },
  { value: "<120ms", label: "P95 Latency" },
];

const principles = [
  {
    title: "Intelligence by Default",
    description:
      "Every system we build is AI-aware from the ground up. Not bolted on, not an afterthought — intelligence is the foundation, not the feature.",
  },
  {
    title: "Ship What Survives",
    description:
      "We don't build demos. Every line of code is tested against production reality — load tested, chaos tested, and monitored from the moment it deploys.",
  },
  {
    title: "Architect for the Unseen",
    description:
      "The best infrastructure is the kind nobody notices. We build systems that scale silently, fail gracefully, and recover automatically.",
  },
  {
    title: "Design with Conviction",
    description:
      "Interfaces are not decoration. They are the product. Every interaction is deliberate, every animation purposeful, every pixel earned.",
  },
];

const techStack = [
  { category: "AI / ML", tools: ["Claude", "GPT-4", "LangChain", "Hugging Face", "PyTorch", "Weights & Biases"] },
  { category: "Backend", tools: ["Node.js", "Python", "Go", "Rust", "PostgreSQL", "Redis"] },
  { category: "Frontend", tools: ["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion", "Three.js"] },
  { category: "Infra", tools: ["Vercel", "AWS", "Docker", "Kubernetes", "Terraform", "Datadog"] },
];

export function About() {
  return (
    <section id="about" className="relative py-36 overflow-hidden">
      {/* Sparse particles for depth */}
      <GoldParticles density={25} speed={0.15} />

      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-20">
          <GoldReveal>
            <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-mono">
              Philosophy
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
                Built different. By design.
              </GoldBrushText>
            </ThunderShimmer>
          </div>

        </div>

        {/* Two-column: narrative + principles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left — narrative */}
          <div>
            <GoldReveal delay={100}>
              <p className="text-lg text-foreground-warm leading-relaxed font-light">
                North Track Studios operates at the boundary between artificial
                intelligence and human craft. We are engineers, researchers, and
                designers who believe the next generation of technology should
                feel as considered as it is capable.
              </p>
            </GoldReveal>

            <GoldReveal delay={200}>
              <p className="mt-6 text-base text-muted-light leading-relaxed">
                We partner with companies building at the frontier — startups
                deploying their first AI agent, enterprises modernizing decade-old
                systems, and visionaries who need a technical team that moves as
                fast as their ambition. From architecture to deployment, we own
                every layer.
              </p>
            </GoldReveal>

            <GoldReveal delay={300}>
              <p className="mt-6 text-base text-muted leading-relaxed">
                Our name comes from a simple idea: there is always a direction
                forward. North Track is the bearing you follow when the terrain
                is unmapped. That&apos;s the work we do — navigate complexity,
                chart the path, build the bridge.
              </p>
            </GoldReveal>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <GoldReveal key={stat.label} delay={400 + i * 100} direction="up">
                  <div className={`border-l border-gold/25 pl-4 card-alive sway-${(i % 4) + 1}`}>
                    <div className="text-2xl font-extralight text-gradient-gold">
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-[9px] tracking-[0.25em] uppercase text-muted font-mono leading-tight">
                      {stat.label}
                    </div>
                  </div>
                </GoldReveal>
              ))}
            </div>
          </div>

          {/* Right — principles */}
          <div className="flex flex-col gap-5">
            {principles.map((principle, i) => (
              <GoldReveal key={principle.title} delay={200 + i * 150} direction="right">
                <div className={`group border border-gold/[0.08] bg-card/50 p-7 relative hover:border-gold/20 card-alive sway-${(i % 4) + 1}`}>
                  {/* Gold left accent bar */}
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />

                  <div className="flex items-start gap-5">
                    <span className="text-[11px] font-mono text-gold/30 mt-0.5 shrink-0">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-light tracking-tight text-foreground-warm group-hover:text-gold transition-colors duration-500">
                        {principle.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-muted leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              </GoldReveal>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-28">
          <GoldReveal>
            <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-mono">
              Technology
            </span>
          </GoldReveal>

          <div className="mt-5 mb-12">
            <ThunderShimmer interval={10000} intensity={0.25}>
              <GoldBrushText
                as="h3"
                className="text-2xl md:text-3xl font-extralight tracking-tight"
                delay={0}
                speed={200}
              >
                Our stack
              </GoldBrushText>
            </ThunderShimmer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((group, i) => (
              <GoldReveal key={group.category} delay={i * 100} direction="up">
                <div className={`border border-gold/[0.06] bg-card/30 p-6 card-alive sway-${(i % 4) + 1}`}>
                  <h4 className="text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-4">
                    {group.category}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {group.tools.map((tool) => (
                      <span key={tool} className="text-sm text-muted-light font-light">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </GoldReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
