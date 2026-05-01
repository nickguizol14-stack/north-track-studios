import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { useRef } from "react";
import { BurstParticles, BurstParticlesHandle } from "../BurstParticles";

function Wrapper() {
  const ref = useRef<BurstParticlesHandle>(null);
  return (
    <div>
      <BurstParticles ref={ref} count={10} />
      <button onClick={() => ref.current?.fire()}>fire</button>
    </div>
  );
}

describe("BurstParticles", () => {
  it("renders the configured count of particles", () => {
    const { container } = render(<Wrapper />);
    expect(container.querySelectorAll(".burst-p")).toHaveLength(10);
  });

  it("does not have the .fire class initially", () => {
    const { container } = render(<Wrapper />);
    const host = container.querySelector(".burst-host") as HTMLElement;
    expect(host.classList.contains("fire")).toBe(false);
  });
});
