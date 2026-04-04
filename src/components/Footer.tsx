import { CompassLogo } from "./CompassLogo";

export function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <CompassLogo size={28} />
              <span className="text-sm font-semibold tracking-widest uppercase">
                North Track Studios
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-md">
              Engineering precision systems at the intersection of design and
              technology. We don&apos;t follow the map — we draw it.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-4">
              Navigate
            </h4>
            <div className="flex flex-col gap-3">
              {["Services", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-muted hover:text-gold transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@northtrackstudios.com"
                className="text-sm text-muted hover:text-gold transition-colors"
              >
                hello@northtrackstudios.com
              </a>
              <span className="text-sm text-muted">GitHub</span>
              <span className="text-sm text-muted">LinkedIn</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gold-line mt-12 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted font-mono">
            &copy; {new Date().getFullYear()} North Track Studios. All rights reserved.
          </p>
          <p className="text-xs text-muted/50 font-mono tracking-wider">
            40.7128&deg; N &middot; 74.0060&deg; W
          </p>
        </div>
      </div>
    </footer>
  );
}
