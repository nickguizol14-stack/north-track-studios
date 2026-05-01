import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { useRef } from "react";
import { TypeParticles, TypeParticlesHandle } from "../TypeParticles";

function Wrapper() {
  const ref = useRef<TypeParticlesHandle>(null);
  return (
    <div style={{ position: "relative" }}>
      <TypeParticles ref={ref} />
      <button onClick={() => ref.current?.spawn(50, 50)}>spawn</button>
    </div>
  );
}

describe("TypeParticles", () => {
  it("renders an empty host initially", () => {
    const { container } = render(<Wrapper />);
    const host = container.querySelector(".type-particles-host") as HTMLElement;
    expect(host).toBeInTheDocument();
    expect(host.children).toHaveLength(0);
  });
});
