import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WordmarkAnimated } from "../WordmarkAnimated";

describe("WordmarkAnimated", () => {
  it("renders the wordmark text", () => {
    render(<WordmarkAnimated />);
    expect(screen.getByText(/northtrack\s+studios/i)).toBeInTheDocument();
  });

  it("renders the esp line with italic emphasis on intelligence", () => {
    render(<WordmarkAnimated />);
    expect(screen.getByText(/A studio for applied/i)).toBeInTheDocument();
    expect(screen.getByText(/intelligence/i)).toBeInTheDocument();
  });
});
