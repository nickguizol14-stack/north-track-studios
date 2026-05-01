import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ProcessChapter } from "../ProcessChapter";

describe("ProcessChapter", () => {
  it("renders the chapter aside", () => {
    render(<ProcessChapter />);
    expect(screen.getByText(/04 \/ Process/i)).toBeInTheDocument();
    expect(screen.getByText(/How we work/i)).toBeInTheDocument();
  });

  it("renders all four phase numbers", () => {
    render(<ProcessChapter />);
    ["Phase 01", "Phase 02", "Phase 03", "Phase 04"].forEach((p) => {
      expect(screen.getByText(p)).toBeInTheDocument();
    });
  });
});
