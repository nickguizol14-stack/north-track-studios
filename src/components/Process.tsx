"use client";

import { GoldBrushText, GoldReveal, ThunderShimmer } from "./GoldPaint";

const steps = [
  {
    phase: "Discovery",
    title: "Map the Terrain",
    description:
      "Deep technical discovery. We audit your existing systems, interview stakeholders, and map the full landscape — constraints, opportunities, and the shortest path to production value.",
    duration: "1–2 weeks",
  },
  {
    phase: "Architecture",
    title: "Draw the Blueprint",
    description:
      "System design that accounts for scale, cost, and operational reality. Data models, API contracts, infrastructure topology, and AI integration points — all documented before a line of code is written.",
    duration: "1–2 weeks",
  },
  {
    phase: "Engineering",
    title: "Build with Precision",
    description:
      "Iterative development in tight cycles. Weekly demos, continuous integration, automated testing. Every component is production-ready from sprint one — not a prototype that gets rewritten later.",
    duration: "4–12 weeks",
  },
  {
    phase: "Launch",
    title: "Deploy & Monitor",
    description:
      "Staged rollouts with canary deployments, real-time monitoring, and automated rollback. We don't throw code over the wall — we stay through launch and beyond, ensuring the system performs.",
    duration: "1–2 weeks",
  },
  {
    phase: "Evolution",
    title: "Iterate & Scale",
    description:
      "Post-launch optimization, feature iteration, and scaling. Performance tuning, model retraining, infrastructure right-sizing — we treat launched products as living systems, not finished artifacts.",
    duration: "Ongoing",
  },
];

export function Process() {
  return (
    <section id="process" className="relative py-36">
      <div className="mx-auto max-w-7xl px-6">
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
                    className={`pl-12 md:pl-0 border border-gold/[0.05] bg-card/30 p-6 card-alive sway-${(i % 5) + 1} ${
                      i % 2 === 0
                        ? "md:pr-16 md:text-right"
                        : "md:col-start-2 md:pl-16"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3"
                      style={{ justifyContent: i % 2 === 0 ? undefined : undefined }}
                    >
                      <span className="text-[10px] tracking-[0.4em] uppercase text-gold/50 font-mono">
                        {step.phase}
                      </span>
                      <span className="text-[9px] text-muted font-mono">
                        {step.duration}
                      </span>
                    </div>

                    <h3 className="text-xl font-extralight tracking-tight text-foreground-warm">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted leading-relaxed">
                      {step.description}
                    </p>
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
