export function Contact() {
  return (
    <section id="contact" className="relative py-32 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — CTA */}
          <div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-mono">
              Start a Project
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Ready to build
              <br />
              <span className="text-gradient-gold">something real?</span>
            </h2>
            <div className="gold-line w-16 mt-6" />
            <p className="mt-8 text-base text-muted leading-relaxed max-w-md">
              We take on a limited number of projects to ensure every engagement
              gets the depth it deserves. Tell us what you&apos;re building.
            </p>

            {/* Contact details */}
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-px h-4 bg-gold/40" />
                <a
                  href="mailto:hello@northtrackstudios.com"
                  className="text-sm text-muted-light hover:text-gold transition-colors font-mono"
                >
                  hello@northtrackstudios.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-px h-4 bg-gold/40" />
                <span className="text-sm text-muted font-mono">
                  Response within 24 hours
                </span>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="border border-gold/10 bg-card p-8 md:p-10">
            <form className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-transparent border-b border-gold/20 pb-2 text-sm text-foreground outline-none focus:border-gold/60 transition-colors placeholder:text-muted/40"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-transparent border-b border-gold/20 pb-2 text-sm text-foreground outline-none focus:border-gold/60 transition-colors placeholder:text-muted/40"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="project"
                  className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-2"
                >
                  Project Details
                </label>
                <textarea
                  id="project"
                  name="project"
                  rows={4}
                  className="w-full bg-transparent border-b border-gold/20 pb-2 text-sm text-foreground outline-none focus:border-gold/60 transition-colors placeholder:text-muted/40 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="mt-2 border border-gold/30 px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-gold hover:bg-gold hover:text-background transition-all duration-500 self-start"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
