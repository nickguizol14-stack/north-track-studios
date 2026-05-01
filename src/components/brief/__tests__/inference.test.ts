import { describe, it, expect } from "vitest";
import { inferProject, inferStage, inferScope } from "../inference";

describe("inference", () => {
  it("maps project IDs", () => {
    expect(inferProject("agent")).toEqual({
      title: "Agent system",
      detail: expect.stringContaining("Multi-agent"),
    });
    expect(inferProject("search").title).toBe("Knowledge experience");
    expect(inferProject("tool").title).toBe("Internal workbench");
    expect(inferProject("unclear").title).toBe("Discovery engagement");
  });

  it("maps stage IDs", () => {
    expect(inferStage("thinking").title).toBe("Begin with a brief");
    expect(inferStage("spec").title).toBe("Move into Define + Build");
    expect(inferStage("wall").title).toBe("Audit + intervene");
    expect(inferStage("shipped").title).toBe("Optimization audit");
  });

  it("maps scope IDs", () => {
    expect(inferScope("brief").title).toMatch(/2 weeks/);
    expect(inferScope("prototype").title).toMatch(/4–6 weeks/);
    expect(inferScope("build").title).toMatch(/8–12 weeks/);
    expect(inferScope("partner").title).toMatch(/Ongoing/);
  });

  it("returns a fallback for unknown IDs", () => {
    expect(inferProject("nonsense").title).toBe("—");
  });
});
