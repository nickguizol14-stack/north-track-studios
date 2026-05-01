import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ContactClosing } from "../ContactClosing";

describe("ContactClosing", () => {
  it("renders the closing headline", () => {
    render(<ContactClosing />);
    expect(screen.getByText(/A short conversation/i)).toBeInTheDocument();
  });

  it("renders the begin-a-brief CTA", () => {
    render(<ContactClosing />);
    const link = screen.getByRole("link", { name: /Begin a brief/i });
    expect(link).toHaveAttribute("href", "/brief");
  });
});
