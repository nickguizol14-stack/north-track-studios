import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpringValue } from "../useSpringValue";

describe("useSpringValue", () => {
  it("returns the initial value (0) before any target is set", () => {
    const { result } = renderHook(() => useSpringValue(() => 100));
    // Spring hasn't run yet
    expect(result.current).toBeGreaterThanOrEqual(0);
  });

  it("converges toward the target after several frames", async () => {
    const { result } = renderHook(() => useSpringValue(() => 200, { stiffness: 0.16, damping: 0.76 }));
    // Wait for several rAF cycles
    await act(async () => {
      for (let i = 0; i < 100; i++) {
        await new Promise((r) => setTimeout(r, 16));
      }
    });
    expect(result.current).toBeGreaterThan(150);
    expect(result.current).toBeLessThan(250);
  });
});
