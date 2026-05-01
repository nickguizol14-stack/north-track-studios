import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WeekAxis } from "../WeekAxis";

describe("WeekAxis", () => {
  it("renders the week labels", () => {
    render(<WeekAxis weeks={["WK 01", "WK 02", "WK 12"]} activeRange={[0, 0]} />);
    expect(screen.getByText("WK 01")).toBeInTheDocument();
    expect(screen.getByText("WK 12")).toBeInTheDocument();
  });
});
