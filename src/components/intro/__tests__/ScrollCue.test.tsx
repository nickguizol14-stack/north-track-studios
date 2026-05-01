import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ScrollCue } from "../ScrollCue";

describe("ScrollCue", () => {
  it("renders the begin label", () => {
    render(<ScrollCue />);
    expect(screen.getByText(/begin/i)).toBeInTheDocument();
  });
});
