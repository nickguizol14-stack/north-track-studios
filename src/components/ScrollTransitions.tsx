"use client";

import { useEffect, useRef, useMemo } from "react";
import { useScrollProgress } from "./useScrollProgress";

// ─── Types ───────────────────────────────────────────────────────────────

type TransitionVariant =
  | "the-forge"
  | "neural-web"
  | "gold-pour"
  | "star-chart"
  | "kintsugi"
  | "aurora";

interface ScrollTransitionProps {
  variant: TransitionVariant;
  height?: string;
  className?: string;
}

// ─── Main component ──────────────────────────────────────────────────────

export function ScrollTransition({
  variant,
  height,
  className = "",
}: ScrollTransitionProps) {
  const defaultHeights: Record<TransitionVariant, string> = {
    "the-forge": "100vh",
    "neural-web": "80vh",
    "gold-pour": "100vh",
    "star-chart": "45vh",
    "kintsugi": "90vh",
    "aurora": "80vh",
  };

  const h = height || defaultHeights[variant];

  const renderers: Record<TransitionVariant, React.FC> = {
    "the-forge": TheForge,
    "neural-web": NeuralWeb,
    "gold-pour": GoldPour,
    "star-chart": StarChart,
    "kintsugi": Kintsugi,
    "aurora": Aurora,
  };

  const Renderer = renderers[variant];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ height: h }}
    >
      {/* Top border — painted gold line */}
      <div className="absolute top-0 left-0 right-0 z-20 painted-divider" />

      <Renderer />

      {/* Bottom border — painted gold line */}
      <div className="absolute bottom-0 left-0 right-0 z-20 painted-divider" />
    </div>
  );
}

// ─── Shared: read theme colors from CSS vars ────────────────────────────

function getGoldColors() {
  const cs = getComputedStyle(document.documentElement);
  const r = parseInt(cs.getPropertyValue("--glow-r")) || 200;
  const g = parseInt(cs.getPropertyValue("--glow-g")) || 168;
  const b = parseInt(cs.getPropertyValue("--glow-b")) || 78;
  return { r, g, b };
}

// ─── Shared: ease functions ─────────────────────────────────────────────

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. THE FORGE — Hero → Services
//
// Molten gold veins crack through obsidian. A central crucible glows and
// pulses. Embers and sparks rise. The obsidian fractures wider as you
// scroll, gold light bleeding through every crack.
// ═══════════════════════════════════════════════════════════════════════════

interface Vein {
  points: { x: number; y: number }[];
  width: number;
  delay: number;
  glow: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

function TheForge() {
  const { ref, progress } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const veinsRef = useRef<Vein[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const initRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!initRef.current) {
      initRef.current = true;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      // Generate fracture veins radiating from center
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const length = Math.random() * Math.min(w, h) * 0.5 + Math.min(w, h) * 0.2;
        const segments = Math.floor(Math.random() * 8) + 6;
        const points: { x: number; y: number }[] = [{ x: cx, y: cy }];

        for (let s = 1; s <= segments; s++) {
          const t = s / segments;
          const jitter = (Math.random() - 0.5) * 60 * t;
          const branchAngle = angle + (Math.random() - 0.5) * 0.6 * t;
          points.push({
            x: cx + Math.cos(branchAngle) * length * t + jitter,
            y: cy + Math.sin(branchAngle) * length * t + jitter * 0.5,
          });
        }

        veinsRef.current.push({
          points,
          width: Math.random() * 3 + 1,
          delay: Math.random() * 0.3,
          glow: Math.random() * 0.5 + 0.5,
        });

        // Sub-branches
        if (Math.random() > 0.4) {
          const branchFrom = Math.floor(segments * 0.4 + Math.random() * segments * 0.4);
          const branchPt = points[branchFrom];
          const branchAngle2 = angle + (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.8);
          const branchLen = length * (0.2 + Math.random() * 0.3);
          const branchSegs = Math.floor(Math.random() * 4) + 3;
          const branchPts: { x: number; y: number }[] = [{ x: branchPt.x, y: branchPt.y }];

          for (let s = 1; s <= branchSegs; s++) {
            const t2 = s / branchSegs;
            branchPts.push({
              x: branchPt.x + Math.cos(branchAngle2) * branchLen * t2 + (Math.random() - 0.5) * 20,
              y: branchPt.y + Math.sin(branchAngle2) * branchLen * t2 + (Math.random() - 0.5) * 15,
            });
          }

          veinsRef.current.push({
            points: branchPts,
            width: Math.random() * 1.5 + 0.5,
            delay: Math.random() * 0.4 + 0.1,
            glow: Math.random() * 0.3 + 0.3,
          });
        }
      }
    }

    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { r, g, b } = getGoldColors();

    ctx.clearRect(0, 0, w, h);
    frameRef.current++;

    const p = progress;
    const cx = w / 2;
    const cy = h / 2;

    // Deep black background
    ctx.fillStyle = "#050507";
    ctx.fillRect(0, 0, w, h);

    // Crucible glow at center — intensifies with scroll
    const crucibleIntensity = easeInOut(Math.min(1, p / 0.4));
    const pulse = Math.sin(frameRef.current * 0.03) * 0.1 + 0.9;

    if (crucibleIntensity > 0.01) {
      const radius = Math.min(w, h) * (0.15 + p * 0.25);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, `rgba(${Math.min(r + 60, 255)},${Math.min(g + 40, 255)},${Math.min(b + 20, 255)},${crucibleIntensity * 0.5 * pulse})`);
      grad.addColorStop(0.3, `rgba(${r},${g},${b},${crucibleIntensity * 0.2 * pulse})`);
      grad.addColorStop(0.6, `rgba(${r},${g},${b},${crucibleIntensity * 0.05})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Draw veins — progressive reveal
    for (const vein of veinsRef.current) {
      const veinProgress = easeOut(Math.max(0, Math.min(1, (p - vein.delay) / 0.5)));
      if (veinProgress < 0.01) continue;

      const pts = vein.points;
      const revealCount = Math.floor(pts.length * veinProgress);
      if (revealCount < 2) continue;

      // Molten glow behind the vein
      ctx.save();
      ctx.shadowColor = `rgba(${Math.min(r + 40, 255)},${Math.min(g + 30, 255)},${b},${vein.glow * veinProgress * pulse})`;
      ctx.shadowBlur = 20 + veinProgress * 15;
      ctx.strokeStyle = `rgba(${Math.min(r + 50, 255)},${Math.min(g + 40, 255)},${Math.min(b + 20, 255)},${veinProgress * 0.9})`;
      ctx.lineWidth = vein.width * (0.5 + veinProgress * 0.5);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < revealCount; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      // Partial segment for smooth reveal
      if (revealCount < pts.length) {
        const frac = (pts.length * veinProgress) - revealCount;
        const prev = pts[revealCount - 1];
        const next = pts[revealCount];
        ctx.lineTo(prev.x + (next.x - prev.x) * frac, prev.y + (next.y - prev.y) * frac);
      }
      ctx.stroke();
      ctx.restore();

      // Hot white core
      ctx.strokeStyle = `rgba(${Math.min(r + 80, 255)},${Math.min(g + 70, 255)},${Math.min(b + 60, 255)},${veinProgress * 0.4})`;
      ctx.lineWidth = Math.max(0.5, vein.width * 0.3);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < revealCount; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    }

    // Sparks — spawn from vein tips
    if (p > 0.2) {
      const spawnRate = Math.min(3, Math.floor(p * 5));
      for (let i = 0; i < spawnRate; i++) {
        if (sparksRef.current.length < 120 && Math.random() < 0.3) {
          const vein = veinsRef.current[Math.floor(Math.random() * veinsRef.current.length)];
          const tip = vein.points[vein.points.length - 1];
          sparksRef.current.push({
            x: tip.x + (Math.random() - 0.5) * 20,
            y: tip.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 4 - 1,
            life: 0,
            maxLife: Math.random() * 40 + 20,
            size: Math.random() * 2.5 + 0.5,
          });
        }
      }

      sparksRef.current = sparksRef.current.filter((s) => {
        s.life++;
        if (s.life > s.maxLife) return false;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05; // gravity

        const lifeRatio = s.life / s.maxLife;
        const a = lifeRatio < 0.2 ? lifeRatio / 0.2 : (1 - lifeRatio) / 0.8;

        const sparkGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
        sparkGrad.addColorStop(0, `rgba(${Math.min(r + 60, 255)},${Math.min(g + 50, 255)},${Math.min(b + 40, 255)},${a * 0.8})`);
        sparkGrad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.3})`);
        sparkGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = sparkGrad;
        ctx.fill();

        return true;
      });
    }

    // Ambient heat distortion — vignette deepens
    const vigGrad = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.2, cx, cy, Math.max(w, h) * 0.7);
    vigGrad.addColorStop(0, "rgba(0,0,0,0)");
    vigGrad.addColorStop(1, `rgba(5,5,7,${0.4 + p * 0.3})`);
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

  }, [progress, ref]);

  // Continuous animation for sparks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf: number;
    const tick = () => {
      // Re-trigger the scroll-based render by incrementing frame
      frameRef.current++;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. NEURAL WEB — Services → Work
//
// A network of gold nodes and connections materializes. Nodes pulse and
// light up in cascading sequences. Data flows along the connections as
// glowing orbs. Like a neural network or constellation map coming alive.
// ═══════════════════════════════════════════════════════════════════════════

interface Node {
  x: number;
  y: number;
  size: number;
  pulseOffset: number;
  connections: number[];
}

interface DataOrb {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  size: number;
}

function NeuralWeb() {
  const { ref, progress } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const orbsRef = useRef<DataOrb[]>([]);
  const initRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!initRef.current) {
      initRef.current = true;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Place nodes in a semi-random grid
      const cols = 8;
      const rows = 5;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col + 0.5) / cols * w + (Math.random() - 0.5) * (w / cols) * 0.6;
          const y = (row + 0.5) / rows * h + (Math.random() - 0.5) * (h / rows) * 0.6;
          nodesRef.current.push({
            x,
            y,
            size: Math.random() * 3 + 2,
            pulseOffset: Math.random() * Math.PI * 2,
            connections: [],
          });
        }
      }

      // Connect nearby nodes
      const nodes = nodesRef.current;
      const maxDist = Math.min(w, h) * 0.3;
      for (let i = 0; i < nodes.length; i++) {
        const distances: { idx: number; dist: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            distances.push({ idx: j, dist });
          }
        }
        distances.sort((a, b) => a.dist - b.dist);
        nodes[i].connections = distances.slice(0, 3).map((d) => d.idx);
      }
    }

    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { r, g, b } = getGoldColors();

    ctx.clearRect(0, 0, w, h);
    frameRef.current++;

    const p = progress;
    const frame = frameRef.current;

    // Background
    ctx.fillStyle = "#060608";
    ctx.fillRect(0, 0, w, h);

    const nodes = nodesRef.current;
    const nodeReveal = easeOut(Math.min(1, p / 0.35));
    const connectionReveal = easeOut(Math.max(0, Math.min(1, (p - 0.1) / 0.4)));
    const dataFlowActive = p > 0.25;

    // Draw connections first (behind nodes)
    if (connectionReveal > 0.01) {
      const drawnPairs = new Set<string>();
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        for (const j of node.connections) {
          const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
          if (drawnPairs.has(key)) continue;
          drawnPairs.add(key);

          const other = nodes[j];
          const dist = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
          const maxD = Math.min(w, h) * 0.3;
          const distAlpha = 1 - dist / maxD;

          ctx.strokeStyle = `rgba(${r},${g},${b},${connectionReveal * distAlpha * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    }

    // Spawn data orbs
    if (dataFlowActive && Math.random() < 0.15 && orbsRef.current.length < 30) {
      const fromIdx = Math.floor(Math.random() * nodes.length);
      const node = nodes[fromIdx];
      if (node.connections.length > 0) {
        const toIdx = node.connections[Math.floor(Math.random() * node.connections.length)];
        orbsRef.current.push({
          fromNode: fromIdx,
          toNode: toIdx,
          progress: 0,
          speed: Math.random() * 0.03 + 0.01,
          size: Math.random() * 2 + 1.5,
        });
      }
    }

    // Draw data orbs
    orbsRef.current = orbsRef.current.filter((orb) => {
      orb.progress += orb.speed;
      if (orb.progress > 1) return false;

      const from = nodes[orb.fromNode];
      const to = nodes[orb.toNode];
      const x = from.x + (to.x - from.x) * orb.progress;
      const y = from.y + (to.y - from.y) * orb.progress;

      const orbGrad = ctx.createRadialGradient(x, y, 0, x, y, orb.size * 6);
      orbGrad.addColorStop(0, `rgba(${Math.min(r + 60, 255)},${Math.min(g + 50, 255)},${Math.min(b + 40, 255)},0.7)`);
      orbGrad.addColorStop(0.3, `rgba(${r},${g},${b},0.3)`);
      orbGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(x, y, orb.size * 6, 0, Math.PI * 2);
      ctx.fillStyle = orbGrad;
      ctx.fill();

      return true;
    });

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeDelay = (node.x / w + node.y / h) * 0.3;
      const nodeAlpha = easeOut(Math.max(0, Math.min(1, (p - nodeDelay) / 0.3)));
      if (nodeAlpha < 0.01) continue;

      const pulse = Math.sin(frame * 0.04 + node.pulseOffset) * 0.3 + 0.7;

      // Glow
      const glowR = node.size * 8;
      const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR);
      grad.addColorStop(0, `rgba(${r},${g},${b},${nodeAlpha * 0.3 * pulse})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${nodeAlpha * 0.08 * pulse})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * nodeAlpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.min(r + 40, 255)},${Math.min(g + 40, 255)},${Math.min(b + 30, 255)},${nodeAlpha * pulse})`;
      ctx.fill();
    }

    // Edge vignette
    const vigGrad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.65);
    vigGrad.addColorStop(0, "rgba(0,0,0,0)");
    vigGrad.addColorStop(1, "rgba(6,6,8,0.7)");
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

  }, [progress, ref]);

  useEffect(() => {
    let raf: number;
    const tick = () => { frameRef.current++; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. GOLD POUR — Work → About
//
// Thick liquid gold pours from the top and pools at the bottom. Multiple
// streams with different speeds. The pool ripples and glows. Volumetric,
// heavy, visceral. Like watching a foundry pour.
// ═══════════════════════════════════════════════════════════════════════════

interface GoldStream {
  x: number;
  width: number;
  speed: number;
  delay: number;
  wobble: number;
  wobbleSpeed: number;
}

function GoldPour() {
  const { ref, progress } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamsRef = useRef<GoldStream[]>([]);
  const initRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!initRef.current) {
      initRef.current = true;
      const rect = container.getBoundingClientRect();
      const w = rect.width;

      // Multiple pour streams at different positions
      const streamCount = 5;
      for (let i = 0; i < streamCount; i++) {
        streamsRef.current.push({
          x: w * (0.15 + (i / (streamCount - 1)) * 0.7),
          width: Math.random() * 30 + 15,
          speed: Math.random() * 0.3 + 0.8,
          delay: i * 0.08 + Math.random() * 0.05,
          wobble: Math.random() * 10 + 5,
          wobbleSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    }

    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { r, g, b } = getGoldColors();

    ctx.clearRect(0, 0, w, h);
    frameRef.current++;
    const frame = frameRef.current;

    const p = progress;

    // Dark background
    ctx.fillStyle = "#050507";
    ctx.fillRect(0, 0, w, h);

    // Pool at bottom — grows as gold pours in
    const poolLevel = easeOut(Math.max(0, Math.min(1, (p - 0.15) / 0.6)));
    const poolHeight = poolLevel * h * 0.35;
    const poolY = h - poolHeight;

    if (poolHeight > 1) {
      // Pool glow
      const poolGrad = ctx.createLinearGradient(0, poolY - 40, 0, h);
      poolGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      poolGrad.addColorStop(0.1, `rgba(${r},${g},${b},${poolLevel * 0.15})`);
      poolGrad.addColorStop(0.4, `rgba(${Math.min(r + 30, 255)},${Math.min(g + 20, 255)},${b},${poolLevel * 0.25})`);
      poolGrad.addColorStop(1, `rgba(${r},${g},${b},${poolLevel * 0.15})`);
      ctx.fillStyle = poolGrad;
      ctx.fillRect(0, poolY - 40, w, h - poolY + 40);

      // Surface ripples
      ctx.strokeStyle = `rgba(${Math.min(r + 50, 255)},${Math.min(g + 40, 255)},${Math.min(b + 20, 255)},${poolLevel * 0.3})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const rippleX = w * (0.2 + Math.random() * 0.6);
        const rippleW = 30 + Math.sin(frame * 0.02 + i) * 15;
        ctx.beginPath();
        ctx.ellipse(rippleX, poolY + 5, rippleW, 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Bright surface line
      const surfGrad = ctx.createLinearGradient(0, poolY, w, poolY);
      surfGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      surfGrad.addColorStop(0.2, `rgba(${Math.min(r + 50, 255)},${Math.min(g + 40, 255)},${Math.min(b + 20, 255)},${poolLevel * 0.5})`);
      surfGrad.addColorStop(0.5, `rgba(${Math.min(r + 70, 255)},${Math.min(g + 60, 255)},${Math.min(b + 40, 255)},${poolLevel * 0.7})`);
      surfGrad.addColorStop(0.8, `rgba(${Math.min(r + 50, 255)},${Math.min(g + 40, 255)},${Math.min(b + 20, 255)},${poolLevel * 0.5})`);
      surfGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = surfGrad;
      ctx.fillRect(0, poolY - 2, w, 4);
    }

    // Pour streams
    for (const stream of streamsRef.current) {
      const streamProgress = easeOut(Math.max(0, Math.min(1, (p - stream.delay) / (0.5 * stream.speed))));
      if (streamProgress < 0.01) continue;

      const streamLength = streamProgress * (poolY > 0 ? poolY : h * 0.7);
      const wobbleX = Math.sin(frame * stream.wobbleSpeed) * stream.wobble * streamProgress;

      // Stream glow — wide diffuse light
      ctx.save();
      ctx.shadowColor = `rgba(${r},${g},${b},0.4)`;
      ctx.shadowBlur = 30;

      const streamGrad = ctx.createLinearGradient(0, 0, 0, streamLength);
      streamGrad.addColorStop(0, `rgba(${Math.min(r + 50, 255)},${Math.min(g + 40, 255)},${Math.min(b + 20, 255)},${streamProgress * 0.8})`);
      streamGrad.addColorStop(0.7, `rgba(${r},${g},${b},${streamProgress * 0.6})`);
      streamGrad.addColorStop(1, `rgba(${r},${g},${b},${streamProgress * 0.3})`);

      // Draw stream as a tapered shape
      const topW = stream.width * 0.4;
      const botW = stream.width * (0.8 + Math.sin(frame * 0.03) * 0.15);
      const sx = stream.x + wobbleX;

      ctx.beginPath();
      ctx.moveTo(sx - topW / 2, 0);
      ctx.quadraticCurveTo(sx - botW / 2 + wobbleX * 0.5, streamLength * 0.5, sx - botW / 2, streamLength);
      ctx.lineTo(sx + botW / 2, streamLength);
      ctx.quadraticCurveTo(sx + botW / 2 + wobbleX * 0.5, streamLength * 0.5, sx + topW / 2, 0);
      ctx.closePath();
      ctx.fillStyle = streamGrad;
      ctx.fill();

      // Hot center line
      ctx.strokeStyle = `rgba(${Math.min(r + 80, 255)},${Math.min(g + 70, 255)},${Math.min(b + 50, 255)},${streamProgress * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.quadraticCurveTo(sx + wobbleX * 0.5, streamLength * 0.5, sx, streamLength);
      ctx.stroke();

      ctx.restore();

      // Splash particles where stream meets pool
      if (poolHeight > 5 && streamProgress > 0.5) {
        for (let sp = 0; sp < 3; sp++) {
          const splashX = sx + (Math.random() - 0.5) * stream.width;
          const splashY = poolY + Math.random() * 10;
          const splashSize = Math.random() * 3 + 1;
          const splashA = Math.random() * 0.4 + 0.2;

          const spGrad = ctx.createRadialGradient(splashX, splashY, 0, splashX, splashY, splashSize * 4);
          spGrad.addColorStop(0, `rgba(${Math.min(r + 50, 255)},${Math.min(g + 40, 255)},${Math.min(b + 20, 255)},${splashA})`);
          spGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(splashX, splashY, splashSize * 4, 0, Math.PI * 2);
          ctx.fillStyle = spGrad;
          ctx.fill();
        }
      }
    }

    // Ambient glow from above — light source
    const topGlow = ctx.createRadialGradient(w / 2, -h * 0.1, 0, w / 2, -h * 0.1, w * 0.6);
    topGlow.addColorStop(0, `rgba(${r},${g},${b},${p * 0.08})`);
    topGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, w, h * 0.5);

  }, [progress, ref]);

  useEffect(() => {
    let raf: number;
    const tick = () => { frameRef.current++; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. STAR CHART — About → Process
//
// Stars/particles materialize and then golden constellation lines draw
// between them, forming a north star / compass pattern. A navigational
// chart assembling itself. Wayfinding moment.
// ═══════════════════════════════════════════════════════════════════════════

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  revealDelay: number;
}

interface ConstellationLine {
  from: number;
  to: number;
  delay: number;
}

function StarChart() {
  const { ref, progress } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const constellationRef = useRef<ConstellationLine[]>([]);
  const initRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!initRef.current) {
      initRef.current = true;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      // Background stars — scattered
      for (let i = 0; i < 120; i++) {
        starsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.5 + 0.3,
          brightness: Math.random() * 0.5 + 0.2,
          twinkleSpeed: Math.random() * 0.05 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
          revealDelay: Math.random() * 0.3,
        });
      }

      // Constellation stars — compass rose shape
      // Long cardinal spikes, shorter intercardinal spikes,
      // flared center body, tick-mark ring
      const constStars: { x: number; y: number }[] = [];
      const cardLen = Math.min(w, h) * 0.32;  // long cardinal reach
      const diagLen = cardLen * 0.55;          // shorter intercardinals
      const flare = cardLen * 0.12;            // width of cardinal spike flanks
      const innerR = cardLen * 0.2;            // inner body radius

      // 0: Center
      constStars.push({ x: cx, y: cy });

      // Cardinal tips (1-4)
      constStars.push({ x: cx, y: cy - cardLen });           // 1 N
      constStars.push({ x: cx + cardLen, y: cy });            // 2 E
      constStars.push({ x: cx, y: cy + cardLen });            // 3 S
      constStars.push({ x: cx - cardLen, y: cy });            // 4 W

      // Cardinal spike flanks — give each spike a pointed shape (5-12)
      constStars.push({ x: cx - flare, y: cy - innerR });     // 5 N-left base
      constStars.push({ x: cx + flare, y: cy - innerR });     // 6 N-right base
      constStars.push({ x: cx + innerR, y: cy - flare });     // 7 E-top base
      constStars.push({ x: cx + innerR, y: cy + flare });     // 8 E-bottom base
      constStars.push({ x: cx + flare, y: cy + innerR });     // 9 S-right base
      constStars.push({ x: cx - flare, y: cy + innerR });     // 10 S-left base
      constStars.push({ x: cx - innerR, y: cy + flare });     // 11 W-bottom base
      constStars.push({ x: cx - innerR, y: cy - flare });     // 12 W-top base

      // Intercardinal tips (13-16)
      const d = diagLen * 0.707;
      constStars.push({ x: cx + d, y: cy - d });              // 13 NE
      constStars.push({ x: cx + d, y: cy + d });              // 14 SE
      constStars.push({ x: cx - d, y: cy + d });              // 15 SW
      constStars.push({ x: cx - d, y: cy - d });              // 16 NW

      // Outer ring tick marks — 12 points around a circle (17-28)
      const ringR = cardLen * 0.75;
      for (let t = 0; t < 12; t++) {
        const angle = (t / 12) * Math.PI * 2 - Math.PI / 2;
        constStars.push({
          x: cx + Math.cos(angle) * ringR,
          y: cy + Math.sin(angle) * ringR,
        });
      }

      const startIdx = starsRef.current.length;
      for (let si = 0; si < constStars.length; si++) {
        const cs = constStars[si];
        // Tips and center are brighter/bigger
        const isTip = si >= 1 && si <= 4;
        const isCenter = si === 0;
        starsRef.current.push({
          x: cs.x + (Math.random() - 0.5) * 5,
          y: cs.y + (Math.random() - 0.5) * 5,
          size: isCenter ? 3.5 : isTip ? 3 : Math.random() * 1.5 + 1.5,
          brightness: isCenter ? 0.9 : isTip ? 0.85 : Math.random() * 0.3 + 0.5,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
          revealDelay: 0.05 + Math.random() * 0.1,
        });
      }

      // Constellation connections — compass rose shape
      const c = (a: number, b: number, delay: number) => {
        constellationRef.current.push({ from: startIdx + a, to: startIdx + b, delay });
      };

      // N spike: flank bases → tip
      c(5, 1, 0.15); c(6, 1, 0.15);
      // E spike
      c(7, 2, 0.18); c(8, 2, 0.18);
      // S spike
      c(9, 3, 0.21); c(10, 3, 0.21);
      // W spike
      c(11, 4, 0.24); c(12, 4, 0.24);

      // Inner body — connect flanks around center to form the compass body
      c(6, 7, 0.28); c(8, 9, 0.30); c(10, 11, 0.32); c(12, 5, 0.34);

      // Center to each flank base
      c(0, 5, 0.12); c(0, 6, 0.12);
      c(0, 7, 0.14); c(0, 8, 0.14);
      c(0, 9, 0.16); c(0, 10, 0.16);
      c(0, 11, 0.18); c(0, 12, 0.18);

      // Intercardinal spikes from body corners
      c(6, 13, 0.36); c(7, 13, 0.36);   // NE
      c(8, 14, 0.38); c(9, 14, 0.38);   // SE
      c(10, 15, 0.40); c(11, 15, 0.40); // SW
      c(12, 16, 0.42); c(5, 16, 0.42);  // NW

      // Outer ring connections — dotted circle
      for (let t = 0; t < 12; t++) {
        c(17 + t, 17 + ((t + 1) % 12), 0.44 + t * 0.008);
      }
      // Connect ring to nearest cardinal/intercardinal tips
      c(17, 1, 0.50);  // ring-N → N tip
      c(20, 2, 0.51);  // ring-E → E tip
      c(23, 3, 0.52);  // ring-S → S tip
      c(26, 4, 0.53);  // ring-W → W tip
    }

    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { r, g, b } = getGoldColors();

    ctx.clearRect(0, 0, w, h);
    frameRef.current++;
    const frame = frameRef.current;

    const p = progress;

    // Deep space background — gradient from section bg to darker
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "#070709");
    bgGrad.addColorStop(0.5, "#050507");
    bgGrad.addColorStop(1, "#070709");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const stars = starsRef.current;

    // Draw stars
    for (const star of stars) {
      const starAlpha = easeOut(Math.max(0, Math.min(1, (p - star.revealDelay) / 0.2)));
      if (starAlpha < 0.01) continue;

      const twinkle = (Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) + 1) / 2;
      const a = starAlpha * star.brightness * (0.5 + twinkle * 0.5);

      // Glow
      const glowR = star.size * 6;
      const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowR);
      grad.addColorStop(0, `rgba(${Math.min(r + 40, 255)},${Math.min(g + 40, 255)},${Math.min(b + 30, 255)},${a * 0.5})`);
      grad.addColorStop(0.3, `rgba(${r},${g},${b},${a * 0.15})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(star.x, star.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * starAlpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.min(r + 60, 255)},${Math.min(g + 55, 255)},${Math.min(b + 45, 255)},${a})`;
      ctx.fill();

      // Cross flare on bright stars
      if (star.brightness > 0.6 && star.size > 2.5) {
        const flareLen = star.size * 8 * twinkle;
        ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(star.x - flareLen, star.y);
        ctx.lineTo(star.x + flareLen, star.y);
        ctx.moveTo(star.x, star.y - flareLen);
        ctx.lineTo(star.x, star.y + flareLen);
        ctx.stroke();
      }
    }

    // Draw constellation lines
    for (const line of constellationRef.current) {
      const lineProgress = easeOut(Math.max(0, Math.min(1, (p - line.delay) / 0.15)));
      if (lineProgress < 0.01) continue;

      const from = stars[line.from];
      const to = stars[line.to];

      const endX = from.x + (to.x - from.x) * lineProgress;
      const endY = from.y + (to.y - from.y) * lineProgress;

      ctx.save();
      ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;
      ctx.shadowBlur = 6;
      ctx.strokeStyle = `rgba(${r},${g},${b},${lineProgress * 0.4})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
    }

    // Center north star glow — appears after constellation forms
    if (p > 0.4) {
      const glowIntensity = easeInOut(Math.min(1, (p - 0.4) / 0.3));
      const pulse = Math.sin(frame * 0.03) * 0.15 + 0.85;
      const nsR = Math.min(w, h) * 0.12;
      const nsGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, nsR);
      nsGrad.addColorStop(0, `rgba(${Math.min(r + 50, 255)},${Math.min(g + 40, 255)},${Math.min(b + 20, 255)},${glowIntensity * 0.3 * pulse})`);
      nsGrad.addColorStop(0.5, `rgba(${r},${g},${b},${glowIntensity * 0.08 * pulse})`);
      nsGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = nsGrad;
      ctx.fillRect(0, 0, w, h);
    }

  }, [progress, ref]);

  useEffect(() => {
    let raf: number;
    const tick = () => { frameRef.current++; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. KINTSUGI — Process → Survey
//
// The screen "cracks" like obsidian with brilliant gold light bleeding
// through. Cracks spread across the viewport, widen, and gold luminance
// pours through them. The Japanese art of golden repair.
// ═══════════════════════════════════════════════════════════════════════════

interface Crack {
  segments: { x: number; y: number }[];
  width: number;
  delay: number;
  glowIntensity: number;
}

function Kintsugi() {
  const { ref, progress } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cracksRef = useRef<Crack[]>([]);
  const initRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!initRef.current) {
      initRef.current = true;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      // Generate cracks radiating from an impact point slightly off-center
      const impactX = cx + (Math.random() - 0.5) * w * 0.2;
      const impactY = cy + (Math.random() - 0.5) * h * 0.15;

      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const length = Math.min(w, h) * (0.3 + Math.random() * 0.4);
        const segs = Math.floor(Math.random() * 10) + 8;
        const segments: { x: number; y: number }[] = [{ x: impactX, y: impactY }];

        let curAngle = angle;
        for (let s = 1; s <= segs; s++) {
          const t = s / segs;
          curAngle += (Math.random() - 0.5) * 0.6;
          const dist = length * t;
          segments.push({
            x: impactX + Math.cos(curAngle) * dist + (Math.random() - 0.5) * 25,
            y: impactY + Math.sin(curAngle) * dist + (Math.random() - 0.5) * 20,
          });
        }

        cracksRef.current.push({
          segments,
          width: Math.random() * 4 + 2,
          delay: i * 0.02 + Math.random() * 0.05,
          glowIntensity: Math.random() * 0.5 + 0.5,
        });

        // Sub-cracks branching off
        if (Math.random() > 0.3) {
          const branchIdx = Math.floor(segs * 0.3 + Math.random() * segs * 0.4);
          const branchPt = segments[Math.min(branchIdx, segments.length - 1)];
          const branchAngle = curAngle + (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 1);
          const branchLen = length * (0.15 + Math.random() * 0.25);
          const branchSegs: { x: number; y: number }[] = [{ x: branchPt.x, y: branchPt.y }];

          let bAngle = branchAngle;
          for (let s = 1; s <= 5; s++) {
            const t = s / 5;
            bAngle += (Math.random() - 0.5) * 0.5;
            branchSegs.push({
              x: branchPt.x + Math.cos(bAngle) * branchLen * t + (Math.random() - 0.5) * 15,
              y: branchPt.y + Math.sin(bAngle) * branchLen * t + (Math.random() - 0.5) * 10,
            });
          }

          cracksRef.current.push({
            segments: branchSegs,
            width: Math.random() * 2 + 1,
            delay: 0.1 + i * 0.02 + Math.random() * 0.08,
            glowIntensity: Math.random() * 0.3 + 0.3,
          });
        }
      }
    }

    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { r, g, b } = getGoldColors();

    ctx.clearRect(0, 0, w, h);
    frameRef.current++;
    const frame = frameRef.current;

    const p = progress;
    const pulse = Math.sin(frame * 0.025) * 0.15 + 0.85;

    // Obsidian background
    ctx.fillStyle = "#060608";
    ctx.fillRect(0, 0, w, h);

    // Overall gold luminance bleeding through — increases with scroll
    const bleedIntensity = easeInOut(Math.min(1, p / 0.7));
    if (bleedIntensity > 0.01) {
      const cx = w * 0.48;
      const cy = h * 0.48;
      const bleedGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
      bleedGrad.addColorStop(0, `rgba(${r},${g},${b},${bleedIntensity * 0.12 * pulse})`);
      bleedGrad.addColorStop(0.4, `rgba(${r},${g},${b},${bleedIntensity * 0.04 * pulse})`);
      bleedGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bleedGrad;
      ctx.fillRect(0, 0, w, h);
    }

    // Draw cracks
    for (const crack of cracksRef.current) {
      const crackProgress = easeOut(Math.max(0, Math.min(1, (p - crack.delay) / 0.4)));
      if (crackProgress < 0.01) continue;

      const segs = crack.segments;
      const revealCount = Math.floor(segs.length * crackProgress);
      if (revealCount < 2) continue;

      // Wide glow (gold light bleeding through)
      ctx.save();
      ctx.shadowColor = `rgba(${Math.min(r + 30, 255)},${Math.min(g + 20, 255)},${b},${crack.glowIntensity * crackProgress * pulse})`;
      ctx.shadowBlur = 25 + crackProgress * 20;

      ctx.strokeStyle = `rgba(${Math.min(r + 40, 255)},${Math.min(g + 30, 255)},${Math.min(b + 10, 255)},${crackProgress * 0.7 * pulse})`;
      ctx.lineWidth = crack.width * (0.3 + crackProgress * 0.7);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(segs[0].x, segs[0].y);
      for (let i = 1; i < revealCount; i++) {
        ctx.lineTo(segs[i].x, segs[i].y);
      }
      if (revealCount < segs.length) {
        const frac = segs.length * crackProgress - revealCount;
        const prev = segs[revealCount - 1];
        const next = segs[revealCount];
        ctx.lineTo(prev.x + (next.x - prev.x) * frac, prev.y + (next.y - prev.y) * frac);
      }
      ctx.stroke();
      ctx.restore();

      // Hot bright core
      ctx.strokeStyle = `rgba(${Math.min(r + 80, 255)},${Math.min(g + 70, 255)},${Math.min(b + 50, 255)},${crackProgress * 0.5 * pulse})`;
      ctx.lineWidth = Math.max(0.5, crack.width * 0.2);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(segs[0].x, segs[0].y);
      for (let i = 1; i < revealCount; i++) {
        ctx.lineTo(segs[i].x, segs[i].y);
      }
      ctx.stroke();
    }

    // Impact point glow
    if (p > 0.05) {
      const impactGlow = easeOut(Math.min(1, p / 0.3));
      const impactR = 30 + impactGlow * 40;
      const firstCrack = cracksRef.current[0];
      if (firstCrack) {
        const ip = firstCrack.segments[0];
        const grad = ctx.createRadialGradient(ip.x, ip.y, 0, ip.x, ip.y, impactR);
        grad.addColorStop(0, `rgba(${Math.min(r + 70, 255)},${Math.min(g + 60, 255)},${Math.min(b + 40, 255)},${impactGlow * 0.6 * pulse})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${impactGlow * 0.2})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(ip.x, ip.y, impactR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

  }, [progress, ref]);

  useEffect(() => {
    let raf: number;
    const tick = () => { frameRef.current++; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. AURORA — Survey → Contact
//
// Golden aurora borealis waves sweep across the viewport. Multiple layers
// of undulating curtains of gold light, shimmering and dancing. Ethereal,
// majestic, a fitting crescendo before the final section.
// ═══════════════════════════════════════════════════════════════════════════

interface AuroraWave {
  yCenter: number;
  amplitude: number;
  frequency: number;
  speed: number;
  opacity: number;
  height: number;
  phase: number;
}

function Aurora() {
  const { ref, progress } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wavesRef = useRef<AuroraWave[]>([]);
  const initRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!initRef.current) {
      initRef.current = true;

      for (let i = 0; i < 6; i++) {
        wavesRef.current.push({
          yCenter: 0.25 + i * 0.1,
          amplitude: 30 + Math.random() * 50,
          frequency: 0.003 + Math.random() * 0.004,
          speed: 0.01 + Math.random() * 0.015,
          opacity: 0.1 + Math.random() * 0.15,
          height: 60 + Math.random() * 80,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { r, g, b } = getGoldColors();

    ctx.clearRect(0, 0, w, h);
    frameRef.current++;
    const frame = frameRef.current;

    const p = progress;

    // Deep background
    ctx.fillStyle = "#050507";
    ctx.fillRect(0, 0, w, h);

    const intensity = easeInOut(Math.min(1, p / 0.4));
    const fade = p > 0.8 ? (1 - p) / 0.2 : 1;

    // Draw aurora waves
    for (const wave of wavesRef.current) {
      const waveAlpha = wave.opacity * intensity * fade;
      if (waveAlpha < 0.005) continue;

      const yBase = h * wave.yCenter;
      const time = frame * wave.speed + wave.phase;

      // Draw the wave as a filled curve
      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x <= w; x += 3) {
        const y = yBase +
          Math.sin(x * wave.frequency + time) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.7 + time * 1.3) * wave.amplitude * 0.5 +
          Math.sin(x * wave.frequency * 2 + time * 0.5) * wave.amplitude * 0.2;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      // Gradient fill — bright at the wave crest, fading down
      const waveGrad = ctx.createLinearGradient(0, yBase - wave.height, 0, yBase + wave.height * 2);
      waveGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      waveGrad.addColorStop(0.2, `rgba(${Math.min(r + 30, 255)},${Math.min(g + 25, 255)},${Math.min(b + 15, 255)},${waveAlpha * 0.8})`);
      waveGrad.addColorStop(0.4, `rgba(${r},${g},${b},${waveAlpha * 0.4})`);
      waveGrad.addColorStop(0.7, `rgba(${r},${g},${b},${waveAlpha * 0.1})`);
      waveGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx.fillStyle = waveGrad;
      ctx.fill();
    }

    // Vertical shimmer columns — aurora pillars
    if (intensity > 0.3) {
      for (let i = 0; i < 12; i++) {
        const pillarX = w * (0.08 + (i / 11) * 0.84);
        const pillarW = 20 + Math.sin(frame * 0.02 + i * 1.5) * 10;
        const pillarAlpha = (Math.sin(frame * 0.015 + i * 2.1) + 1) / 2 * intensity * fade * 0.12;

        if (pillarAlpha < 0.01) continue;

        const pGrad = ctx.createLinearGradient(0, 0, 0, h);
        pGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        pGrad.addColorStop(0.2, `rgba(${r},${g},${b},${pillarAlpha})`);
        pGrad.addColorStop(0.5, `rgba(${Math.min(r + 20, 255)},${Math.min(g + 15, 255)},${b},${pillarAlpha * 1.5})`);
        pGrad.addColorStop(0.8, `rgba(${r},${g},${b},${pillarAlpha * 0.5})`);
        pGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = pGrad;
        ctx.fillRect(pillarX - pillarW / 2, 0, pillarW, h);
      }
    }

    // Soft overall glow
    if (intensity > 0.1) {
      const overGrad = ctx.createRadialGradient(w / 2, h * 0.35, 0, w / 2, h * 0.35, Math.max(w, h) * 0.6);
      overGrad.addColorStop(0, `rgba(${r},${g},${b},${intensity * 0.06 * fade})`);
      overGrad.addColorStop(0.5, `rgba(${r},${g},${b},${intensity * 0.02 * fade})`);
      overGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = overGrad;
      ctx.fillRect(0, 0, w, h);
    }

  }, [progress, ref]);

  useEffect(() => {
    let raf: number;
    const tick = () => { frameRef.current++; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
