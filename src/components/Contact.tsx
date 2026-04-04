"use client";

import { GoldBrushText, GoldReveal, ThunderShimmer } from "./GoldPaint";
import { GoldParticles } from "./GoldParticles";

export function Contact() {
  return (
    <section id="contact" className="relative py-36 bg-surface overflow-hidden">
      <div className="painted-divider" />

      <GoldParticles density={25} speed={0.15} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left — CTA */}
          <div>
            <GoldReveal>
              <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-mono">
                Start a Project
              </span>
            </GoldReveal>

            <div className="mt-5">
              <ThunderShimmer interval={10000} intensity={0.3}>
                <GoldBrushText
                  as="h2"
                  className="text-4xl md:text-5xl font-extralight tracking-tight"
                  delay={0}
                  speed={400}
                >
                  Let&apos;s build something
                </GoldBrushText>
              </ThunderShimmer>
            </div>
            <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-foreground-warm mt-1">
              that matters.
            </h2>

            <GoldReveal delay={300}>
              <p className="mt-8 text-base text-muted-light leading-relaxed max-w-md font-light">
                We take on a carefully selected number of engagements each
                quarter. If you&apos;re building at the intersection of AI and
                ambition, we want to hear from you.
              </p>
            </GoldReveal>

            {/* Contact details */}
            <GoldReveal delay={400}>
              <div className="mt-12 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-gradient-to-r from-gold/50 to-transparent" />
                  <a
                    href="mailto:hello@northtrackstudios.com"
                    className="text-sm text-muted-light hover:text-gold transition-colors font-mono"
                  >
                    hello@northtrackstudios.com
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-gradient-to-r from-gold/30 to-transparent" />
                  <span className="text-sm text-muted font-mono">
                    Typical response: under 24 hours
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-gradient-to-r from-gold/20 to-transparent" />
                  <span className="text-sm text-muted font-mono">
                    Engagements from $25K
                  </span>
                </div>
              </div>
            </GoldReveal>
          </div>

          {/* Right — Form */}
          <GoldReveal delay={200} direction="right">
            <div className="border border-gold/[0.08] bg-card p-8 md:p-10 relative card-alive sway-2">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4">
                <div className="absolute top-0 left-0 w-full h-px bg-gold/30" />
                <div className="absolute top-0 left-0 w-px h-full bg-gold/30" />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4">
                <div className="absolute bottom-0 right-0 w-full h-px bg-gold/30" />
                <div className="absolute bottom-0 right-0 w-px h-full bg-gold/30" />
              </div>

              <form className="flex flex-col gap-7">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-3"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full bg-transparent border-b border-gold/15 pb-3 text-sm text-foreground outline-none focus:border-gold/50 transition-colors placeholder:text-muted/30"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-3"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-transparent border-b border-gold/15 pb-3 text-sm text-foreground outline-none focus:border-gold/50 transition-colors placeholder:text-muted/30"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-3"
                  >
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    className="w-full bg-transparent border-b border-gold/15 pb-3 text-sm text-muted-light outline-none focus:border-gold/50 transition-colors appearance-none"
                  >
                    <option value="" className="bg-card">Select range</option>
                    <option value="25-50" className="bg-card">$25K – $50K</option>
                    <option value="50-100" className="bg-card">$50K – $100K</option>
                    <option value="100-250" className="bg-card">$100K – $250K</option>
                    <option value="250+" className="bg-card">$250K+</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="project"
                    className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-3"
                  >
                    Tell Us About Your Project
                  </label>
                  <textarea
                    id="project"
                    name="project"
                    rows={4}
                    className="w-full bg-transparent border-b border-gold/15 pb-3 text-sm text-foreground outline-none focus:border-gold/50 transition-colors placeholder:text-muted/30 resize-none"
                    placeholder="What are you building? What problem are you solving?"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-3 border border-gold/30 px-9 py-4 text-[11px] tracking-[0.25em] uppercase text-gold hover:bg-gold hover:text-background transition-all duration-500 self-start"
                >
                  Send Brief
                </button>
              </form>
            </div>
          </GoldReveal>
        </div>
      </div>
    </section>
  );
}
