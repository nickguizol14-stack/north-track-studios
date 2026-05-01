import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { TimelineGutter } from "../TimelineGutter";

describe("TimelineGutter", () => {
  it("renders all years", () => {
    render(<TimelineGutter years={["2024", "2025", "now"]} />);
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("now")).toBeInTheDocument();
  });
});
