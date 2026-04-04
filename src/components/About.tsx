const stats = [
  { value: "50+", label: "Systems Shipped" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<200ms", label: "Avg Response" },
  { value: "24/7", label: "Monitoring" },
];

const principles = [
  {
    title: "Engineer First",
    description:
      "Every decision starts with engineering rigor. We don't cut corners — we eliminate them from the blueprint.",
  },
  {
    title: "Ship with Precision",
    description:
      "We measure twice and deploy once. Every release is tested, monitored, and built to withstand production reality.",
  },
  {
    title: "Scale by Design",
    description:
      "Architecture isn't an afterthought. We build systems that grow with you — not systems you grow out of.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-32 grid-overlay">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-20">
          <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-mono">
            Who We Are
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-tight">
            Built different.
            <span className="text-gradient-gold"> By design.</span>
          </h2>
          <div className="gold-line w-16 mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — narrative */}
          <div>
            <p className="text-lg text-muted-light leading-relaxed font-light">
              North Track Studios exists at the intersection of engineering
              discipline and creative ambition. We&apos;re a team of builders
              who believe that the best technology is invisible — it just works,
              at scale, under pressure.
            </p>
            <p className="mt-6 text-base text-muted leading-relaxed">
              We partner with startups, enterprises, and visionaries who need
              more than a vendor — they need a technical co-pilot. From first
              commit to production, we own the outcome.
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="border-l border-gold/20 pl-4">
                  <div className="text-2xl font-light text-gradient-gold">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10px] tracking-[0.2em] uppercase text-muted font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — principles */}
          <div className="flex flex-col gap-8">
            {principles.map((principle, i) => (
              <div
                key={principle.title}
                className="border border-gold/10 bg-card p-6 relative"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold/40 to-transparent" />
                <div className="flex items-start gap-4">
                  <span className="text-[11px] font-mono text-gold/40 mt-1">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-light tracking-tight">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
