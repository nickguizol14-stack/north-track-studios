import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { DriftParticles } from "../DriftParticles";

describe("DriftParticles", () => {
  it("renders the configured count of particles", () => {
    const { container } = render(<DriftParticles count={20} />);
    expect(container.querySelectorAll(".drift-p")).toHaveLength(20);
  });

  it("defaults to 30 particles", () => {
    const { container } = render(<DriftParticles />);
    expect(container.querySelectorAll(".drift-p")).toHaveLength(30);
  });

  it("renders nothing when count is 0", () => {
    const { container } = render(<DriftParticles count={0} />);
    expect(container.querySelectorAll(".drift-p")).toHaveLength(0);
  });
});
