"use client";

import { CompassLogoLarge } from "./CompassLogo";
import { GoldBrushText, ThunderShimmer } from "./GoldPaint";
import { GoldParticles } from "./GoldParticles";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden vignette">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070709] via-[#0a0912] to-[#12111a]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay" />

      {/* Ambient particles — prominent */}
      <GoldParticles density={70} speed={0.3} />

      {/* Compass — ghosted behind content */}
      <div className="absolute opacity-[0.03]">
        <CompassLogoLarge />
      </div>

      {/* Gold corner accents with thunder shimmer */}
      <ThunderShimmer interval={12000} intensity={0.25}>
        <div className="absolute top-0 left-0 w-40 h-40">
          <div className="absolute top-10 left-10 w-20 h-px bg-gradient-to-r from-gold/50 to-transparent" />
          <div className="absolute top-10 left-10 w-px h-20 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>
      </ThunderShimmer>
      <ThunderShimmer interval={14000} intensity={0.2}>
        <div className="absolute top-0 right-0 w-40 h-40">
          <div className="absolute top-10 right-10 w-20 h-px bg-gradient-to-l from-gold/50 to-transparent" />
          <div className="absolute top-10 right-10 w-px h-20 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>
      </ThunderShimmer>
      <ThunderShimmer interval={11000} intensity={0.15}>
        <div className="absolute bottom-0 left-0 w-40 h-40">
          <div className="absolute bottom-10 left-10 w-20 h-px bg-gradient-to-r from-gold/30 to-transparent" />
          <div className="absolute bottom-10 left-10 w-px h-20 bg-gradient-to-t from-gold/30 to-transparent" />
        </div>
      </ThunderShimmer>
      <ThunderShimmer interval={13000} intensity={0.15}>
        <div className="absolute bottom-0 right-0 w-40 h-40">
          <div className="absolute bottom-10 right-10 w-20 h-px bg-gradient-to-l from-gold/30 to-transparent" />
          <div className="absolute bottom-10 right-10 w-px h-20 bg-gradient-to-t from-gold/30 to-transparent" />
        </div>
      </ThunderShimmer>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Main headline — painted in */}
        <div className="animate-fade-in-up delay-200">
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extralight tracking-tight leading-[0.95]">
            <span className="block text-foreground-warm mb-2">Where intelligence</span>
            <ThunderShimmer interval={10000} intensity={0.35}>
              <GoldBrushText
                as="span"
                className="text-5xl md:text-7xl lg:text-[5.5rem] font-extralight tracking-tight"
                delay={200}
                speed={600}
              >
                meets craft.
              </GoldBrushText>
            </ThunderShimmer>
          </h1>
        </div>


        {/* Subtitle */}
        <p className="animate-fade-in-up delay-400 mx-auto max-w-2xl text-base md:text-lg text-muted-light leading-relaxed font-light">
          North Track Studios is an AI-native technology studio. We architect
          intelligent systems, engineer production-grade platforms, and design
          interfaces that feel like the future arrived early.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up delay-500 mt-14 flex flex-col sm:flex-row items-center justify-center gap-5">
          <ThunderShimmer interval={10000} intensity={0.3}>
            <a
              href="#capabilities"
              className="group relative border border-gold/40 px-9 py-4 text-[11px] tracking-[0.25em] uppercase text-gold hover:bg-gold hover:text-background transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10">View Capabilities</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          </ThunderShimmer>
          <a
            href="#contact"
            className="px-9 py-4 text-[11px] tracking-[0.25em] uppercase text-muted-light hover:text-gold transition-colors duration-300"
          >
            Start a Conversation
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in-up delay-800 mt-24">
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
