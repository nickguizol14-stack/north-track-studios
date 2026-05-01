// src/components/hooks/__tests__/useScrollReveal.test.tsx
import { describe, it, expect, vi } from "vitest";
import { renderHook, render, act } from "@testing-library/react";
import { useScrollReveal } from "../useScrollReveal";

describe("useScrollReveal", () => {
  it("returns isVisible=false initially", () => {
    const { result } = renderHook(() => useScrollReveal(0.15));
    expect(result.current.isVisible).toBe(false);
    expect(result.current.ref).toBeDefined();
  });

  it("is a no-op when ref is unattached", () => {
    let observerCallback: IntersectionObserverCallback | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = () => [];
      root = null;
      rootMargin = "";
      thresholds = [];
    };

    const { result } = renderHook(() => useScrollReveal(0.15));
    act(() => {
      // Without a mounted element, the effect early-returns and never registers
      // the observer. Firing the callback is a no-op for the hook's state.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      observerCallback?.([{ isIntersecting: true }] as any, {} as IntersectionObserver);
    });
    expect(result.current.isVisible).toBe(false);
  });

  it("flips to isVisible=true when the observed element intersects", () => {
    let observerCallback: IntersectionObserverCallback | null = null;
    const observeSpy = vi.fn();
    const unobserveSpy = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = observeSpy;
      unobserve = unobserveSpy;
      disconnect = vi.fn();
      takeRecords = () => [];
      root = null;
      rootMargin = "";
      thresholds = [];
    };

    function Probe() {
      const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.15);
      return <div ref={ref} data-visible={String(isVisible)} />;
    }

    const { container } = render(<Probe />);
    expect(observeSpy).toHaveBeenCalledTimes(1);

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      observerCallback?.([{ isIntersecting: true }] as any, {} as IntersectionObserver);
    });

    expect(container.querySelector("div")?.getAttribute("data-visible")).toBe("true");
    expect(unobserveSpy).toHaveBeenCalledTimes(1);
  });
});
