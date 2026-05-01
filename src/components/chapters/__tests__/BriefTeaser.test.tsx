import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { BriefTeaser } from "../BriefTeaser";

describe("BriefTeaser", () => {
  it("renders the chapter number and prompt", () => {
    render(<BriefTeaser />);
    expect(screen.getByText(/05 \/ Brief/i)).toBeInTheDocument();
    expect(screen.getByText(/coming back to/i)).toBeInTheDocument();
  });

  it("renders the continue CTA link to /brief", () => {
    render(<BriefTeaser />);
    const link = screen.getByRole("link", { name: /Continue the brief/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("/brief"));
  });
});
