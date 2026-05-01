// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Polyfill matchMedia for prefers-reduced-motion tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill IntersectionObserver for scroll-reveal tests
class IO {
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
  takeRecords = () => [];
  root = null;
  rootMargin = "";
  thresholds = [];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IntersectionObserver = IO;

// requestAnimationFrame fallback
if (!globalThis.requestAnimationFrame) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 16);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
}
