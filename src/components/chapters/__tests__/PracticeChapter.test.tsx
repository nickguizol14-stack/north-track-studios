// src/components/chapters/__tests__/PracticeChapter.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { PracticeChapter } from "../PracticeChapter";

describe("PracticeChapter", () => {
  it("renders chapter number and title", () => {
    render(<PracticeChapter />);
    expect(screen.getByText(/01 \/ Practice/i)).toBeInTheDocument();
    expect(screen.getByText(/What we are/i)).toBeInTheDocument();
  });

  it("renders the headline copy", () => {
    render(<PracticeChapter />);
    expect(screen.getByText(/We build/i)).toBeInTheDocument();
  });
});
