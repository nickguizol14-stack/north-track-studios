import { CompassLogoLarge } from "./CompassLogo";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-overlay">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-surface" />

      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-8 left-8 w-16 h-px bg-gradient-to-r from-gold/40 to-transparent" />
        <div className="absolute top-8 left-8 w-px h-16 bg-gradient-to-b from-gold/40 to-transparent" />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32">
        <div className="absolute top-8 right-8 w-16 h-px bg-gradient-to-l from-gold/40 to-transparent" />
        <div className="absolute top-8 right-8 w-px h-16 bg-gradient-to-b from-gold/40 to-transparent" />
      </div>

      {/* Compass background element */}
      <div className="absolute opacity-[0.04]">
        <CompassLogoLarge />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Mono tag */}
        <div className="animate-fade-in-up">
          <span className="inline-block border border-gold/20 px-4 py-1.5 text-[10px] tracking-[0.4em] uppercase text-gold font-mono mb-8">
            Software &middot; AI &middot; Infrastructure
          </span>
        </div>

        {/* Main headline */}
        <h1 className="animate-fade-in-up animation-delay-100 text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95]">
          <span className="block text-foreground">We build what</span>
          <span className="block text-gradient-gold mt-2">others blueprint.</span>
        </h1>

        {/* Divider */}
        <div className="animate-fade-in-up animation-delay-200 mx-auto my-8 w-24 gold-line" />

        {/* Subtitle */}
        <p className="animate-fade-in-up animation-delay-300 mx-auto max-w-2xl text-base md:text-lg text-muted-light leading-relaxed font-light">
          North Track Studios is a precision technology studio. We engineer
          systems that scale, interfaces that resonate, and architectures that
          endure.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up animation-delay-400 mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#services"
            className="group relative border border-gold/30 px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-gold hover:bg-gold hover:text-background transition-all duration-500"
          >
            <span className="relative z-10">Explore Our Work</span>
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-muted-light hover:text-foreground transition-colors duration-300"
          >
            Get in Touch
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in-up animation-delay-600 mt-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.4em] uppercase text-muted font-mono">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
