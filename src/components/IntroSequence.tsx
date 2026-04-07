"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/**
 * IntroSequence v4 — BotW explosion → particle text formation → wave reveal
 *
 * Timeline:
 *   0.0s  Black screen
 *   0.2s  Logo fades in
 *   0.6s  Glow builds behind logo
 *   2.4s  EXPLOSION — logo vanishes, 550+ gold streaks burst radially
 *   3.2s  Particles float aimlessly, decelerating (the drift)
 *   3.8s  First "scout" particles begin pulling toward text targets
 *   4.2s  Cascade — more and more particles join, accelerating into place
 *   5.0s  All particles settled into "NORTH TRACK" + underline shape
 *   5.3s  Brief hold — shimmer/sparkle across the formed text
 *   5.6s  Metallic solidify — particles brighten, text looks solid gold
 *   5.9s  Gold wave radiates outward from text center
 *   5.9–7.2s  Wave expands, cutting a hole in overlay, revealing real page
 *   7.2s  Intro fully gone
 */

const GOLD = [
  [200, 168, 78],
  [218, 190, 110],
  [232, 212, 138],
  [180, 148, 58],
  [245, 225, 160],
];

const GOLD_BRIGHT = [
  [255, 240, 200],
  [255, 230, 180],
  [250, 225, 170],
  [255, 245, 210],
];

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  peak: number;
  born: number;
  lifespan: number;
  color: number[];
  streak: boolean;
  friction: number;
  // Convergence target
  targetX: number;
  targetY: number;
  hasTarget: boolean;
  convergeDelay: number; // ms after convergence starts before this one begins
  converging: boolean;
  arrived: boolean;
  // For shimmer phase
  shimmerPhase: number;
}

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTime = useRef(0);
  const motes = useRef<Mote[]>([]);
  const animRef = useRef<number>(0);
  const completedRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [logoStyle, setLogoStyle] = useState({
    opacity: 0,
    scale: 1,
    transition: "opacity 0.7s ease-out, transform 0.14s ease",
  });
  const [done, setDone] = useState(false);

  const flashRef = useRef(0);
  const waveRef = useRef({ active: false, radius: 0, cx: 0, cy: 0, startTime: 0 });
  const metallicRef = useRef<HTMLDivElement>(null);
  const [metallicOpacity, setMetallicOpacity] = useState(0);

  const onCompleteCb = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    startTime.current = performance.now();

    // ─── Sample text targets from the real DOM element ──────────────────

    let textTargets: { x: number; y: number }[] = [];
    let textCenterX = w / 2;
    let textCenterY = h * 0.4;

    // Force the hero text elements into their final resting state
    // (stop CSS animations, remove transforms) so getBoundingClientRect
    // returns the REAL final positions — then restore originals.
    const forceHeroFinalState = () => {
      const wrapper = document.getElementById("hero-north-track-wrapper");
      if (!wrapper) return [];

      // Walk up from wrapper and collect all animated ancestors up to the section
      const ancestors: { el: HTMLElement; orig: { animation: string; transform: string; opacity: string; clipPath: string } }[] = [];
      let node: HTMLElement | null = wrapper;
      while (node && node !== document.body) {
        const cs = getComputedStyle(node);
        if (cs.animationName !== "none" || cs.transform !== "none" || cs.opacity !== "1" || cs.clipPath !== "none") {
          ancestors.push({
            el: node,
            orig: {
              animation: node.style.animation,
              transform: node.style.transform,
              opacity: node.style.opacity,
              clipPath: node.style.clipPath,
            },
          });
          node.style.animation = "none";
          node.style.transform = "none";
          node.style.opacity = "1";
          node.style.clipPath = "none";
        }
        node = node.parentElement;
      }
      // Also force the wrapper and its children
      const allInner = wrapper.querySelectorAll("*");
      allInner.forEach((child) => {
        const el = child as HTMLElement;
        const cs = getComputedStyle(el);
        if (cs.animationName !== "none" || cs.transform !== "none" || cs.clipPath !== "none") {
          ancestors.push({
            el,
            orig: {
              animation: el.style.animation,
              transform: el.style.transform,
              opacity: el.style.opacity,
              clipPath: el.style.clipPath,
            },
          });
          el.style.animation = "none";
          el.style.transform = "none";
          el.style.opacity = "1";
          el.style.clipPath = "none";
        }
      });

      // Force layout reflow so getBoundingClientRect sees the forced state
      wrapper.getBoundingClientRect();

      return ancestors;
    };

    const restoreHeroState = (saved: { el: HTMLElement; orig: { animation: string; transform: string; opacity: string; clipPath: string } }[]) => {
      for (const { el, orig } of saved) {
        el.style.animation = orig.animation;
        el.style.transform = orig.transform;
        el.style.opacity = orig.opacity;
        el.style.clipPath = orig.clipPath;
      }
    };

    const sampleTextTargets = () => {
      const el = document.getElementById("hero-north-track");
      const strokeEl = document.getElementById("hero-north-track-stroke");
      const wrapper = document.getElementById("hero-north-track-wrapper");
      if (!el) return;

      // Force all ancestors to final state so positions are accurate
      const saved = forceHeroFinalState();

      const rect = el.getBoundingClientRect();
      textCenterX = rect.left + rect.width / 2;
      textCenterY = rect.top + rect.height / 2 + rect.height * 0.5;

      // ── Position the metallic DOM clone at the exact spot ──
      if (metallicRef.current && wrapper) {
        const m = metallicRef.current;
        m.innerHTML = "";

        const clone = wrapper.cloneNode(true) as HTMLElement;
        clone.removeAttribute("id");
        clone.style.opacity = "1";
        clone.style.transform = "none";
        clone.style.clipPath = "none";
        clone.style.animation = "none";
        const allEls = clone.querySelectorAll("*");
        allEls.forEach((child) => {
          const c = child as HTMLElement;
          c.style.clipPath = "none";
          c.style.opacity = "1";
          c.style.transform = "none";
          c.style.animation = "none";
        });
        const wrapperRect = wrapper.getBoundingClientRect();
        m.style.position = "absolute";
        m.style.left = `${wrapperRect.left}px`;
        m.style.top = `${wrapperRect.top}px`;
        m.style.width = `${wrapperRect.width}px`;
        m.style.height = `${wrapperRect.height}px`;
        m.style.pointerEvents = "none";
        m.appendChild(clone);
      }

      // ── Sample particle targets via canvas fillText for letter outlines ──
      // We use the forced-final-state rect for correct positioning,
      // but canvas fillText for actual letter-shape pixel sampling.
      const style = getComputedStyle(el);
      const fontFamily = style.fontFamily;
      const fontSize = style.fontSize;
      const fontWeight = style.fontWeight;
      const letterSpacing = style.letterSpacing;
      const text = "North Track";

      const offscreen = document.createElement("canvas");
      const padding = 40;
      offscreen.width = rect.width + padding * 2;
      offscreen.height = rect.height + padding * 2;
      const offCtx = offscreen.getContext("2d");

      textTargets = [];

      if (offCtx) {
        offCtx.fillStyle = "#ffffff";
        offCtx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
        if (letterSpacing && letterSpacing !== "normal") {
          offCtx.letterSpacing = letterSpacing;
        }
        offCtx.textBaseline = "top";
        offCtx.fillText(text, padding, padding);

        // Also render the underline stroke
        if (strokeEl) {
          const strokeRect = strokeEl.getBoundingClientRect();
          const strokeY = strokeRect.top - rect.top + padding;
          const strokeX = strokeRect.left - rect.left + padding;
          offCtx.fillRect(strokeX, strokeY, strokeRect.width, 3);
        }

        // Sample opaque pixels — these give actual letter outlines
        const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        const pixels = imageData.data;
        const step = 3;

        const yOffset = rect.height * 0.5; // nudge particle targets down 20% of text height
        for (let sy = 0; sy < offscreen.height; sy += step) {
          for (let sx = 0; sx < offscreen.width; sx += step) {
            const idx = (sy * offscreen.width + sx) * 4;
            if (pixels[idx + 3] > 40) {
              // Map offscreen coords back to viewport using the forced-state rect
              textTargets.push({
                x: rect.left + sx - padding,
                y: rect.top + sy - padding + yOffset,
              });
            }
          }
        }
      }

      // Restore original styles
      restoreHeroState(saved);
    };

    // ─── Spawn BotW-style radial streak explosion ─────────────────────

    const spawnExplosion = (now: number) => {
      const cx = w / 2;
      const cy = h * 0.46;

      const createMote = (
        speed: number,
        sizeRange: [number, number],
        peakRange: [number, number],
        lifeRange: [number, number],
        frictionRange: [number, number],
        isStreak: boolean,
        colors: number[][],
        posSpread: number,
      ): Mote => {
        const angle = Math.random() * Math.PI * 2;
        return {
          x: cx + (Math.random() - 0.5) * posSpread,
          y: cy + (Math.random() - 0.5) * posSpread,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * (speed * 0.1),
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * (speed * 0.1),
          size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
          peak: peakRange[0] + Math.random() * (peakRange[1] - peakRange[0]),
          born: now,
          lifespan: lifeRange[0] + Math.random() * (lifeRange[1] - lifeRange[0]),
          color: colors[Math.floor(Math.random() * colors.length)],
          streak: isStreak,
          friction: frictionRange[0] + Math.random() * (frictionRange[1] - frictionRange[0]),
          targetX: 0,
          targetY: 0,
          hasTarget: false,
          convergeDelay: 0,
          converging: false,
          arrived: false,
          shimmerPhase: Math.random() * Math.PI * 2,
        };
      };

      // Layer 1: Ultra-fast long streaks
      for (let i = 0; i < 120; i++) {
        const spd = 12 + Math.random() * 20;
        motes.current.push(createMote(spd, [1.5, 3.5], [0.5, 1.0], [3000, 5000], [0.955, 0.975], true, GOLD_BRIGHT, 10));
      }
      // Layer 2: Fast streaks
      for (let i = 0; i < 200; i++) {
        const spd = 5 + Math.random() * 12;
        motes.current.push(createMote(spd, [1, 2.8], [0.3, 0.9], [3500, 6000], [0.965, 0.980], true, GOLD, 15));
      }
      // Layer 3: Slow sparks
      for (let i = 0; i < 150; i++) {
        const spd = 1 + Math.random() * 5;
        motes.current.push(createMote(spd, [0.5, 2.0], [0.2, 0.6], [4000, 7000], [0.975, 0.990], true, GOLD, 20));
      }
      // Layer 4: Tiny embers
      for (let i = 0; i < 80; i++) {
        const spd = 0.2 + Math.random() * 1.5;
        motes.current.push(createMote(spd, [0.4, 1.2], [0.15, 0.5], [5000, 8000], [0.992, 0.998], false, GOLD, 30));
      }
    };

    // ─── Assign convergence targets to particles ────────────────────────

    const assignTargets = (now: number) => {
      // Always sample fresh — ensures we get final positions after all CSS animations settle
      sampleTextTargets();
      if (textTargets.length === 0) return;

      const particles = motes.current;
      const targets = [...textTargets];

      // Shuffle targets
      for (let i = targets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targets[i], targets[j]] = [targets[j], targets[i]];
      }

      // Sort particles by distance to the text center — closer ones are "scouts"
      const withDist = particles.map((m, idx) => ({
        idx,
        dist: Math.sqrt((m.x - textCenterX) ** 2 + (m.y - textCenterY) ** 2),
      }));
      withDist.sort((a, b) => a.dist - b.dist);

      // Assign: each particle gets a target from the shuffled list
      // Stagger: scouts (closest) get delay=0, further ones get longer delays
      const totalParticles = withDist.length;
      const totalTargets = targets.length;

      for (let i = 0; i < totalParticles; i++) {
        const m = particles[withDist[i].idx];
        const targetIdx = i % totalTargets;
        m.targetX = targets[targetIdx].x;
        m.targetY = targets[targetIdx].y;
        m.hasTarget = true;

        // Staggered delay: scouts start at 0ms, the bulk follows 200-1200ms later
        // Use a cubic curve so few start early, then a cascade rush
        const normalizedOrder = i / totalParticles;
        const delayCurve = normalizedOrder * normalizedOrder * normalizedOrder;
        m.convergeDelay = delayCurve * 1200;
      }
    };

    // ─── Animation state ────────────────────────────────────────────────

    let ambientDone = false;
    let explosionDone = false;
    let explosionTime = 0;
    let targetsAssigned = false;
    let convergeStartTime = 0;
    let allArrived = false;
    let solidifyStartTime = 0;
    let solidifyProgress = 0; // 0 = particles, 1 = full metallic text
    let solidifyComplete = false;
    let holdStartTime = 0;
    let waveFired = false;

    // Metallic text is now rendered via DOM clone (metallicRef) — no canvas text drawing needed

    // ─── The animation loop ─────────────────────────────────────────────

    const frame = (now: number) => {
      const elapsed = now - startTime.current;
      const t = elapsed / 1000;

      ctx.clearRect(0, 0, w, h);

      // ── PHASE 1: Logo fade-in ──
      if (t >= 0.2 && t < 0.25) {
        setLogoStyle({
          opacity: 1,
          scale: 1,
          transition: "opacity 0.7s ease-out, transform 0.14s ease",
        });
      }

      // ── Building glow ──
      let glow = 0;
      if (t >= 0.6 && t <= 2.3) {
        const p = (t - 0.6) / 1.7;
        glow = Math.pow(Math.sin(p * Math.PI * 0.5), 0.7) * 0.65;
      }
      if (t >= 2.0 && t < 2.4) {
        const ramp = (t - 2.0) / 0.4;
        glow = Math.max(glow, 0.65 + ramp * 0.35);
      }

      // ── Ambient particles ──
      if (t >= 0.8 && !ambientDone) {
        ambientDone = true;
        for (let i = 0; i < 30; i++) {
          motes.current.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -Math.random() * 0.3 - 0.05,
            size: Math.random() * 2 + 0.5,
            peak: Math.random() * 0.4 + 0.15,
            born: now,
            lifespan: 2500,
            color: GOLD[Math.floor(Math.random() * GOLD.length)],
            streak: false,
            friction: 0.999,
            targetX: 0, targetY: 0, hasTarget: false,
            convergeDelay: 0, converging: false, arrived: false,
            shimmerPhase: Math.random() * Math.PI * 2,
          });
        }
      }

      // ── Backlight glow ──
      if (glow > 0.01) {
        const cx = w / 2;
        const cy = h * 0.46;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1.5, 1);
        const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 180);
        core.addColorStop(0, `rgba(200,168,78,${glow * 0.5})`);
        core.addColorStop(0.4, `rgba(200,168,78,${glow * 0.3})`);
        core.addColorStop(0.7, `rgba(200,168,78,${glow * 0.1})`);
        core.addColorStop(1, `rgba(200,168,78,0)`);
        ctx.fillStyle = core;
        ctx.fillRect(-300, -300, 600, 600);
        ctx.restore();
      }

      // ── PHASE 2: EXPLOSION ──
      if (t >= 2.4 && !explosionDone) {
        explosionDone = true;
        explosionTime = now;
        flashRef.current = 1.0;

        setLogoStyle({
          opacity: 0,
          scale: 1.05,
          transition: "opacity 0.01s linear, transform 0.01s linear",
        });

        spawnExplosion(now);
      }

      // ── Core flash ──
      if (flashRef.current > 0.01) {
        const cx = w / 2;
        const cy = h * 0.46;
        const fi = flashRef.current;
        flashRef.current *= 0.92;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100 * fi);
        inner.addColorStop(0, `rgba(255,250,230,${fi * 0.9})`);
        inner.addColorStop(0.3, `rgba(255,235,180,${fi * 0.6})`);
        inner.addColorStop(0.6, `rgba(200,168,78,${fi * 0.3})`);
        inner.addColorStop(1, `rgba(200,168,78,0)`);
        ctx.fillStyle = inner;
        ctx.fillRect(cx - 200, cy - 200, 400, 400);
        ctx.restore();
      }

      // ── PHASE 3: DRIFT → assign targets after explosion settles ──
      if (explosionDone && !targetsAssigned) {
        const timeSinceExplosion = (now - explosionTime) / 1000;
        if (timeSinceExplosion >= 0.8) {
          targetsAssigned = true;
          convergeStartTime = now;
          assignTargets(now);
        }
      }

      // ── PHASE 4: STAGGERED CONVERGENCE ──
      if (targetsAssigned && !allArrived) {
        const convergeElapsed = now - convergeStartTime;
        let arrivedCount = 0;
        let totalWithTarget = 0;

        for (const m of motes.current) {
          if (!m.hasTarget) continue;
          totalWithTarget++;

          // Has this particle's delay elapsed?
          if (convergeElapsed < m.convergeDelay) continue;

          m.converging = true;
          const timeSinceStart = convergeElapsed - m.convergeDelay;

          // Ease-in spring: pull strength increases over time
          // First 300ms: gentle pull, then it ramps up
          const pullAge = timeSinceStart / 1000;
          const pullStrength = Math.min(pullAge * pullAge * 0.15, 0.12);

          const dx = m.targetX - m.x;
          const dy = m.targetY - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 2) {
            // Arrived — snap and hold
            m.x = m.targetX;
            m.y = m.targetY;
            m.vx = 0;
            m.vy = 0;
            m.arrived = true;
            arrivedCount++;
          } else {
            // Apply spring force toward target
            m.vx += dx * pullStrength;
            m.vy += dy * pullStrength;

            // Damping increases as we get closer — smooth deceleration
            const dampFactor = dist < 20 ? 0.85 : dist < 80 ? 0.90 : 0.94;
            m.vx *= dampFactor;
            m.vy *= dampFactor;

            if (dist < 5) arrivedCount++;
          }
        }

        if (totalWithTarget > 0 && arrivedCount >= totalWithTarget * 0.95) {
          allArrived = true;
          // Snap any stragglers
          for (const m of motes.current) {
            if (m.hasTarget && !m.arrived) {
              m.x = m.targetX;
              m.y = m.targetY;
              m.vx = 0;
              m.vy = 0;
              m.arrived = true;
            }
          }
        }
      }

      // ── PHASE 5: GRADUAL METALLIC SOLIDIFY ──
      // Particles are in place → gradually crossfade to real metallic gradient text
      if (allArrived && !solidifyComplete) {
        if (solidifyStartTime === 0) solidifyStartTime = now;
        const solidifyAge = (now - solidifyStartTime) / 1000;

        // Ease-in-out over 0.8s: particles fade, metallic text appears
        const raw = Math.min(solidifyAge / 0.8, 1);
        solidifyProgress = raw * raw * (3 - 2 * raw); // smoothstep

        // Fade in the DOM-cloned metallic text
        setMetallicOpacity(solidifyProgress);

        if (raw >= 1) {
          solidifyComplete = true;
          holdStartTime = now;
        }
      }

      // ── PHASE 5b: HOLD — fully metallic text sits for 250ms ──
      if (solidifyComplete && !waveFired) {
        // Keep the DOM-cloned metallic text fully visible
        setMetallicOpacity(1);

        const holdAge = (now - holdStartTime) / 1000;
        if (holdAge >= 0.25) {
          waveFired = true;
          waveRef.current = {
            active: true,
            radius: 0,
            cx: textCenterX,
            cy: textCenterY,
            startTime: now,
          };
        }
      }

      // ── PHASE 6: GOLD WAVE REVEAL (slower) ──
      if (waveRef.current.active) {
        const wave = waveRef.current;
        const waveAge = (now - wave.startTime) / 1000;
        // Slower wave: 2.2s duration (was 1.3s)
        const waveProgress = Math.min(waveAge / 2.2, 1);
        // Ease-out cubic: fast initial sweep, graceful deceleration
        const eased = 1 - Math.pow(1 - waveProgress, 3);
        // Max radius = distance from center to farthest corner
        const maxR = Math.sqrt(
          Math.max(wave.cx, w - wave.cx) ** 2 +
          Math.max(wave.cy, h - wave.cy) ** 2
        ) + 100;
        wave.radius = eased * maxR;

        // Apply mask to overlay — cut a circular hole
        if (overlayRef.current) {
          const maskStr = `radial-gradient(circle ${wave.radius}px at ${wave.cx}px ${wave.cy}px, transparent ${Math.max(wave.radius - 40, 0)}px, black ${wave.radius + 15}px)`;
          overlayRef.current.style.maskImage = maskStr;
          overlayRef.current.style.webkitMaskImage = maskStr;
        }

        // Draw the gold wave ring FIRST (behind text)
        const ringWidth = 80;
        const innerR = Math.max(wave.radius - ringWidth, 0);
        const outerR = wave.radius;
        const ringAlpha = 0.3 * (1 - waveProgress * 0.6);

        if (ringAlpha > 0.01) {
          const grad = ctx.createRadialGradient(
            wave.cx, wave.cy, innerR,
            wave.cx, wave.cy, outerR
          );
          grad.addColorStop(0, `rgba(200,168,78,0)`);
          grad.addColorStop(0.25, `rgba(232,212,138,${ringAlpha * 0.3})`);
          grad.addColorStop(0.45, `rgba(255,240,200,${ringAlpha * 0.8})`);
          grad.addColorStop(0.55, `rgba(255,240,200,${ringAlpha})`);
          grad.addColorStop(0.75, `rgba(232,212,138,${ringAlpha * 0.3})`);
          grad.addColorStop(1, `rgba(200,168,78,0)`);
          ctx.beginPath();
          ctx.arc(wave.cx, wave.cy, outerR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Metallic DOM text stays on top of the wave — topmost layer
        // It stays solid until the wave has fully passed, then fades
        const textFade = waveProgress < 0.85 ? 1 : Math.max(0, 1 - (waveProgress - 0.85) / 0.15);
        setMetallicOpacity(textFade);

        // Complete
        if (waveProgress >= 1 && !completedRef.current) {
          completedRef.current = true;
          setDone(true);
          onCompleteCb();
          return;
        }
      }

      // ── Draw all particles ──
      motes.current = motes.current.filter((m) => {
        const age = now - m.born;
        if (age > m.lifespan && !m.hasTarget) return false;
        // Keep targeted particles alive through the whole animation
        if (m.hasTarget && completedRef.current) return false;

        // Physics: only apply if not arrived
        if (!m.arrived) {
          if (!m.converging) {
            m.vx *= m.friction;
            m.vy *= m.friction;
            if (!m.streak) m.vy += 0.003;
          }
          m.x += m.vx;
          m.y += m.vy;
        }

        // Alpha
        const lifeP = m.hasTarget ? 1 : Math.min(age / m.lifespan, 1);
        let alpha: number;
        if (m.arrived) {
          // Arrived particles: sparkle, but fade out as metallic text solidifies
          const sparkle = Math.sin(now * 0.008 + m.shimmerPhase) * 0.15 + 0.85;
          const particleFade = 1 - solidifyProgress; // fade as metallic takes over
          alpha = m.peak * sparkle * particleFade;
          if (alpha < 0.005) return true; // skip drawing but keep alive
        } else if (m.hasTarget && m.converging) {
          // Converging: brightens as it approaches
          const dist = Math.sqrt((m.x - m.targetX) ** 2 + (m.y - m.targetY) ** 2);
          const approachBright = Math.max(0, 1 - dist / 300);
          alpha = m.peak * (0.6 + approachBright * 0.4);
        } else {
          if (lifeP < 0.05) alpha = (lifeP / 0.05) * m.peak;
          else if (lifeP > 0.4) alpha = ((1 - lifeP) / 0.6) * m.peak;
          else alpha = m.peak;
        }

        // If inside wave radius, particle is consumed
        if (waveRef.current.active) {
          const dxW = m.x - waveRef.current.cx;
          const dyW = m.y - waveRef.current.cy;
          const distToWave = Math.sqrt(dxW * dxW + dyW * dyW);
          if (distToWave < waveRef.current.radius - 20) {
            return false; // consumed by wave
          }
          // Particles near wave edge get extra bright
          if (distToWave < waveRef.current.radius + 30) {
            alpha = Math.min(alpha * 1.5, 1.0);
          }
        }

        if (alpha < 0.005) return true; // skip drawing but keep alive

        const [r, g, b] = m.color;

        if (m.streak && !m.arrived && !m.converging) {
          // ── Draw as streak ──
          const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
          const streakLen = Math.min(speed * 4, 60);

          if (streakLen < 0.5) {
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.size * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.7})`;
            ctx.fill();
            return true;
          }

          const nx = m.vx / speed;
          const ny = m.vy / speed;
          const tailX = m.x - nx * streakLen;
          const tailY = m.y - ny * streakLen;

          ctx.save();
          ctx.lineCap = "round";

          if (speed > 3) {
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.08})`;
            ctx.lineWidth = m.size * 6;
            ctx.stroke();
          }

          const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
          grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
          grad.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.3})`);
          grad.addColorStop(1, `rgba(${Math.min(r + 40, 255)},${Math.min(g + 40, 255)},${Math.min(b + 30, 255)},${alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = m.size;
          ctx.stroke();

          if (alpha > 0.2) {
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.size * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.min(r + 50, 255)},${Math.min(g + 50, 255)},${Math.min(b + 40, 255)},${alpha * 0.9})`;
            ctx.fill();
          }

          ctx.restore();
        } else {
          // ── Draw as dot/ember ──
          // Converging particles get a soft trail
          if (m.converging && !m.arrived) {
            const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
            if (speed > 1) {
              const trailLen = Math.min(speed * 2.5, 25);
              const nx = m.vx / speed;
              const ny = m.vy / speed;
              ctx.save();
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(m.x - nx * trailLen, m.y - ny * trailLen);
              ctx.lineTo(m.x, m.y);
              const tg = ctx.createLinearGradient(
                m.x - nx * trailLen, m.y - ny * trailLen, m.x, m.y
              );
              tg.addColorStop(0, `rgba(${r},${g},${b},0)`);
              tg.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.5})`);
              ctx.strokeStyle = tg;
              ctx.lineWidth = m.size * 0.8;
              ctx.stroke();
              ctx.restore();
            }
          }

          // Halo
          const haloR = m.arrived ? m.size * 3 : m.size * 5;
          const halo = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, haloR);
          halo.addColorStop(0, `rgba(${r},${g},${b},${alpha * (m.arrived ? 0.25 : 0.15)})`);
          halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(m.x, m.y, haloR, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.arrived ? m.size * 0.7 : m.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.min(r + 50, 255)},${Math.min(g + 50, 255)},${Math.min(b + 40, 255)},${alpha})`;
          ctx.fill();
        }

        return true;
      });

      // Fallback timeout
      if (t >= 10 && !completedRef.current) {
        completedRef.current = true;
        setDone(true);
        onCompleteCb();
        return;
      }

      animRef.current = requestAnimationFrame(frame);
    };

    animRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [onCompleteCb]);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: "#070709",
        pointerEvents: "all",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Pixel-perfect metallic text clone — sits ABOVE canvas and wave */}
      <div
        ref={metallicRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          opacity: metallicOpacity,
          willChange: "opacity",
        }}
      />

      {/* Logo */}
      <div
        className="relative z-10"
        style={{
          opacity: logoStyle.opacity,
          transform: `scale(${logoStyle.scale})`,
          transition: logoStyle.transition,
          willChange: "transform, opacity",
        }}
      >
        <Image
          src="/logo.png"
          alt="North Track Studios"
          width={420}
          height={280}
          priority
          className="select-none"
          style={{ filter: "drop-shadow(0 0 20px rgba(200,168,78,0.1))" }}
        />
      </div>
    </div>
  );
}
