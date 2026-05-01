import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { ChapterDivider } from "../ChapterDivider";

describe("ChapterDivider", () => {
  it("renders a divider element", () => {
    const { container } = render(<ChapterDivider />);
    expect(container.querySelector(".chapter-divider")).toBeInTheDocument();
  });

  it("renders 2 drift particles", () => {
    const { container } = render(<ChapterDivider />);
    expect(container.querySelectorAll(".chapter-divider-p")).toHaveLength(2);
  });
});
