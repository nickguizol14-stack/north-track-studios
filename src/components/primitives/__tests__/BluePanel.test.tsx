import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { BluePanel } from "../BluePanel";

describe("BluePanel", () => {
  it("renders a panel element", () => {
    const { container } = render(<BluePanel />);
    expect(container.querySelector(".blue-panel")).toBeInTheDocument();
  });

  it("applies position absolute by default", () => {
    const { container } = render(<BluePanel />);
    const panel = container.querySelector(".blue-panel") as HTMLElement;
    expect(panel.style.position).toBe("absolute");
  });
});
