import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { CornerGlyphs } from "../CornerGlyphs";

describe("CornerGlyphs", () => {
  it("renders all four corner labels", () => {
    render(<CornerGlyphs />);
    expect(screen.getByText(/NTS · vol\. 02/i)).toBeInTheDocument();
    expect(screen.getByText(/est\. 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/Index · 00/i)).toBeInTheDocument();
    expect(screen.getByText(/Issue 01 · Spring/i)).toBeInTheDocument();
  });
});
