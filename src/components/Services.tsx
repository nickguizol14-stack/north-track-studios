const services = [
  {
    number: "01",
    title: "Software Engineering",
    description:
      "Full-stack systems built for scale. From APIs and microservices to production-grade web applications — engineered with precision.",
    tags: ["Next.js", "Node.js", "TypeScript", "PostgreSQL"],
  },
  {
    number: "02",
    title: "AI & Machine Learning",
    description:
      "Intelligent systems that learn, adapt, and deliver. Custom models, LLM integration, and AI-powered workflows embedded into your stack.",
    tags: ["LLMs", "RAG", "Fine-tuning", "AI Agents"],
  },
  {
    number: "03",
    title: "Cloud Infrastructure",
    description:
      "Scalable, resilient infrastructure designed for zero downtime. We architect the backbone your applications depend on.",
    tags: ["AWS", "Vercel", "Docker", "CI/CD"],
  },
  {
    number: "04",
    title: "Product Design",
    description:
      "Interfaces that command attention. Design systems, prototypes, and production UI — where aesthetics meet engineering.",
    tags: ["UI/UX", "Design Systems", "Prototyping", "Motion"],
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-32 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-20">
          <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-mono">
            What We Do
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-tight">
            Precision-built
            <span className="text-gradient-gold"> services</span>
          </h2>
          <div className="gold-line w-16 mt-6" />
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.number}
              className="group relative border border-gold/10 bg-card p-8 md:p-10 hover:border-gold/30 transition-all duration-500"
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8">
                <div className="absolute top-0 right-0 w-full h-px bg-gold/30 group-hover:bg-gold/60 transition-colors" />
                <div className="absolute top-0 right-0 w-px h-full bg-gold/30 group-hover:bg-gold/60 transition-colors" />
              </div>

              {/* Number */}
              <span className="text-[11px] font-mono text-gold/40 tracking-wider">
                {service.number}
              </span>

              {/* Title */}
              <h3 className="mt-4 text-xl md:text-2xl font-light tracking-tight group-hover:text-gold transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-sm text-muted leading-relaxed">
                {service.description}
              </p>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-gold/10 px-3 py-1 text-[10px] tracking-wider uppercase text-muted font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
