"use client";

import { GoldBrushText, GoldReveal, ThunderShimmer, WordReveal } from "./GoldPaint";
import { ConstellationBackground } from "./ConstellationBackground";

const steps = [
  {
    phase: "Consultation",
    title: "Understand Your Vision",
    description:
      "We start with a deep conversation. What are you building, who is it for, and what does success look like? We listen first, then align on scope, goals, and the path forward.",
  },
  {
    phase: "Research",
    title: "Map the Landscape",
    description:
      "We audit existing systems, study your market, and research the technical landscape. Constraints, opportunities, and the shortest path to production value — all mapped before a line of code.",
  },
  {
    phase: "Reconvene",
    title: "Align & Architect",
    description:
      "We present our findings and proposed architecture. Data models, API contracts, infrastructure topology, and AI integration points — reviewed together so nothing is left to assumption.",
  },
  {
    phase: "Build Phase",
    title: "Engineer with Precision",
    description:
      "Iterative development in tight cycles. Weekly demos, continuous integration, automated testing. Every component is production-ready from sprint one — not a prototype that gets rewritten later.",
  },
  {
    phase: "Delivery / Alterations",
    title: "Launch & Refine",
    description:
      "Staged rollouts with real-time monitoring and automated rollback. Post-launch we iterate — performance tuning, feature refinement, and scaling. We treat shipped products as living systems.",
  },
];

export function Process() {
  return (
    <section id="process" className="relative py-36 overflow-hidden">
      {/* Constellation background — continues from Star Chart transition */}
      <ConstellationBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-24">
          <GoldReveal>
            <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-mono">
              How We Work
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
                Our process
              </GoldBrushText>
            </ThunderShimmer>
          </div>

        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical gold line */}
          <div className="absolute left-[19px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/15 to-transparent" />

          <div className="flex flex-col gap-16">
            {steps.map((step, i) => (
              <GoldReveal
                key={step.phase}
                delay={i * 120}
                direction={i % 2 === 0 ? "left" : "right"}
              >
                <div
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 ${
                    i % 2 === 0 ? "" : "md:direction-rtl"
                  }`}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-[16px] md:left-1/2 md:-translate-x-1/2 top-1 w-[7px] h-[7px] bg-gold/60 rotate-45" />

                  {/* Content */}
                  <div
                    className={`pl-12 md:pl-10 border border-gold/[0.05] bg-card/30 py-6 pr-8 md:pr-10 rounded-2xl overflow-hidden card-alive sway-${(i % 5) + 1} md:max-w-[85%] ${
                      i % 2 === 0
                        ? "md:ml-auto md:mr-8"
                        : "md:col-start-2 md:ml-8"
                    }`}
                  >
                    <span className="text-[10px] tracking-[0.4em] uppercase text-gold/50 font-mono">
                      {step.phase}
                    </span>

                    <WordReveal
                      as="h3"
                      className="mt-3 text-xl font-extralight tracking-tight text-foreground-warm"
                      delay={i * 80}
                      stagger={70}
                    >
                      {step.title}
                    </WordReveal>
                    <WordReveal
                      as="p"
                      className="mt-3 text-sm text-muted leading-relaxed"
                      delay={i * 80 + 100}
                      stagger={30}
                    >
                      {step.description}
                    </WordReveal>
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
