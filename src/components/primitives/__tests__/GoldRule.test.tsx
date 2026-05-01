import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { GoldRule } from "../GoldRule";

describe("GoldRule", () => {
  it("renders a rule element", () => {
    const { container } = render(<GoldRule />);
    expect(container.querySelector(".gold-rule")).toBeInTheDocument();
  });

  it("respects width prop", () => {
    const { container } = render(<GoldRule width="200px" />);
    const rule = container.querySelector(".gold-rule") as HTMLElement;
    expect(rule.style.width).toBe("200px");
  });

  it("renders 2 drift particle children when withParticles=true", () => {
    const { container } = render(<GoldRule withParticles />);
    expect(container.querySelectorAll(".gold-rule-particle")).toHaveLength(2);
  });

  it("renders no particles by default", () => {
    const { container } = render(<GoldRule />);
    expect(container.querySelectorAll(".gold-rule-particle")).toHaveLength(0);
  });
});
