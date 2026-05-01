import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { WordmarkMini } from "../WordmarkMini";

describe("WordmarkMini", () => {
  it("renders the abbreviated wordmark", () => {
    const { container } = render(<WordmarkMini />);
    expect(container.textContent?.replace(/\s+/g, "")).toContain("N·T/S");
  });
});
