import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WorkChapter } from "../WorkChapter";

describe("WorkChapter", () => {
  it("renders the chapter aside title", () => {
    render(<WorkChapter />);
    expect(screen.getByText(/03 \/ Work/i)).toBeInTheDocument();
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("renders all three project names", () => {
    render(<WorkChapter />);
    ["Synapse", "Lumen", "Threshold"].forEach((n) => {
      expect(screen.getByText(n)).toBeInTheDocument();
    });
  });
});
