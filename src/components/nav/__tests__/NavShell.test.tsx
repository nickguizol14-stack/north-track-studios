import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { NavShell } from "../NavShell";

describe("NavShell", () => {
  it("renders all five nav links", () => {
    render(<NavShell show />);
    ["About", "Capabilities", "Work", "Process", "Contact"].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders hidden by default (opacity 0)", () => {
    const { container } = render(<NavShell show={false} />);
    const shell = container.querySelector(".nav-shell") as HTMLElement;
    expect(shell.style.opacity).toBe("0");
  });

  it("becomes visible when show=true", () => {
    const { container } = render(<NavShell show />);
    const shell = container.querySelector(".nav-shell") as HTMLElement;
    expect(shell.style.opacity).toBe("1");
  });
});
