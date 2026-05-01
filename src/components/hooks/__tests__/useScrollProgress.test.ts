import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollProgress } from "../useScrollProgress";

describe("useScrollProgress", () => {
  it("returns 0 when not scrolled", () => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
    Object.defineProperty(document.documentElement, "scrollHeight", { value: 2000, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });

    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it("returns ~0.5 at half scroll", () => {
    Object.defineProperty(window, "scrollY", { value: 500, writable: true, configurable: true });
    Object.defineProperty(document.documentElement, "scrollHeight", { value: 2000, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });

    const { result } = renderHook(() => useScrollProgress());
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBeCloseTo(0.5, 1);
  });

  it("clamps to 1 when fully scrolled", () => {
    Object.defineProperty(window, "scrollY", { value: 99999, writable: true, configurable: true });
    Object.defineProperty(document.documentElement, "scrollHeight", { value: 2000, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });

    const { result } = renderHook(() => useScrollProgress());
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(1);
  });
});
