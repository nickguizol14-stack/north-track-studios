"use client";

import Link from "next/link";
import { CompassLogoLarge } from "./CompassLogo";
import { GoldBrushText, ThunderShimmer } from "./GoldPaint";
import { GoldParticles } from "./GoldParticles";

const services = [
  { title: "AI Consulting", desc: "Strategy, architecture & deployment of intelligent systems" },
  { title: "Web Design", desc: "Interfaces crafted at the intersection of beauty & performance" },
  { title: "Engineered Automation", desc: "Production-grade pipelines that scale without overhead" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end pb-28 lg:items-center lg:pb-0 lg:pt-24 overflow-hidden vignette">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070709] via-[#0a0912] to-[#12111a]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay" />

      {/* Ambient particles */}
      <GoldParticles density={70} speed={0.3} />

      {/* Compass — ghosted behind content */}
      <div className="absolute opacity-[0.03]" style={{ right: "5%", top: "15%" }}>
        <CompassLogoLarge />
      </div>

      {/* Gold corner accents — top-right and bottom-right only */}
      <ThunderShimmer interval={14000} intensity={0.2}>
        <div className="absolute top-0 right-0 w-40 h-40">
          <div className="absolute top-10 right-10 w-20 h-px bg-gradient-to-l from-gold/50 to-transparent" />
          <div className="absolute top-10 right-10 w-px h-20 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>
      </ThunderShimmer>
      <ThunderShimmer interval={13000} intensity={0.15}>
        <div className="absolute bottom-0 right-0 w-40 h-40">
          <div className="absolute bottom-10 right-10 w-20 h-px bg-gradient-to-l from-gold/30 to-transparent" />
          <div className="absolute bottom-10 right-10 w-px h-20 bg-gradient-to-t from-gold/30 to-transparent" />
        </div>
      </ThunderShimmer>

      {/* ─── Split content ─── */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-14 lg:gap-20">

          {/* ─── Left: studio name ─── */}
          <div className="lg:w-[55%]">
            <div className="animate-fade-in-up">
              <span className="block text-[10px] tracking-[0.6em] uppercase text-gold-dim font-mono mb-6">
                Est. 2024
              </span>
            </div>

            <div className="animate-fade-in-up delay-100">
              <h1 className="font-extralight tracking-tight leading-[0.9]">
                <ThunderShimmer interval={10000} intensity={0.35}>
                  <GoldBrushText
                    as="span"
                    id="hero-north-track"
                    className="text-6xl md:text-8xl lg:text-[7rem] font-extralight tracking-tight"
                    delay={0}
                    speed={200}
                  >
                    North Track
                  </GoldBrushText>
                </ThunderShimmer>
                <br />
                <span className="text-foreground-warm opacity-60 text-5xl md:text-6xl lg:text-[4.5rem] font-thin tracking-[0.05em]">
                  Studios
                </span>
              </h1>
            </div>

            <div className="animate-fade-in-up delay-400 mt-10">
              <p className="max-w-md text-base text-muted-light leading-relaxed font-light">
                An AI-native technology studio. We architect intelligent systems
                and engineer interfaces that feel like the future arrived early.
              </p>
            </div>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-500 mt-10 flex flex-col sm:flex-row items-start gap-5">
              <ThunderShimmer interval={10000} intensity={0.3}>
                <Link
                  href="/capabilities"
                  className="group relative border border-gold/40 px-9 py-4 text-[11px] tracking-[0.25em] uppercase text-gold hover:bg-gold hover:text-background transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10">View Capabilities</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </ThunderShimmer>
              <Link
                href="/contact"
                className="px-9 py-4 text-[11px] tracking-[0.25em] uppercase text-muted-light hover:text-gold transition-colors duration-300"
              >
                Start a Conversation
              </Link>
            </div>
          </div>

          {/* ─── Right: service bullets ─── */}
          <div className="lg:w-[45%] flex flex-col gap-8">
            {services.map((s, i) => (
              <div
                key={s.title}
                className={`animate-fade-in-up delay-${(i + 3) * 100} group flex items-start gap-4 cursor-default`}
              >
                {/* Bullet dot */}
                <div className="mt-2.5 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/40 group-hover:bg-gold group-hover:shadow-[0_0_8px_var(--gold-glow-strong)] transition-all duration-500" />
                </div>

                <div>
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-extralight tracking-wide text-foreground-warm group-hover:text-gold transition-colors duration-500">
                    {s.title}
                  </h3>

                  {/* Underline — expands on hover */}
                  <div className="mt-1.5 h-px w-8 group-hover:w-full bg-gradient-to-r from-gold/50 to-gold/0 transition-all duration-700 ease-out" />

                  {/* Desc */}
                  <p className="mt-2 text-sm text-muted leading-relaxed font-light opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Coordinates accent */}
            <div className="animate-fade-in-up delay-700 pt-2 pl-5">
              <span className="text-[9px] text-gold-dim/40 font-mono tracking-[0.4em]">
                40.7128° N &middot; 74.0060° W
              </span>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in-up delay-800 mt-16 flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[9px] tracking-[0.5em] uppercase text-gold-dim font-mono">
              Explore
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-gold/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
