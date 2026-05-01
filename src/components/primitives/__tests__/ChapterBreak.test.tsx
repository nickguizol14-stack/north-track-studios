import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ChapterBreak } from "../ChapterBreak";

describe("ChapterBreak", () => {
  it("renders the chapter number tag", () => {
    render(<ChapterBreak n="01" />);
    expect(screen.getByText(/end .* 01/i)).toBeInTheDocument();
  });

  it("supports custom label", () => {
    render(<ChapterBreak n="03" label="finale" />);
    expect(screen.getByText(/finale .* 03/i)).toBeInTheDocument();
  });
});
