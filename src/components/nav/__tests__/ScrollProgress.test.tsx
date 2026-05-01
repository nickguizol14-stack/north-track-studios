import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { ScrollProgress } from "../ScrollProgress";

describe("ScrollProgress", () => {
  it("renders a fill bar", () => {
    const { container } = render(<ScrollProgress />);
    expect(container.querySelector(".scroll-progress-fill")).toBeInTheDocument();
  });
});
