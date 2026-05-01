import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { FooterMini } from "../FooterMini";

describe("FooterMini", () => {
  it("renders the studio name and est year", () => {
    render(<FooterMini />);
    expect(screen.getByText(/NorthTrack Studios/i)).toBeInTheDocument();
    expect(screen.getByText(/est\. 2024/i)).toBeInTheDocument();
  });
});
