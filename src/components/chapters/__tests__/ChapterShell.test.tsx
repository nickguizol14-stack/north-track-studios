// src/components/chapters/__tests__/ChapterShell.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ChapterShell } from "../ChapterShell";

describe("ChapterShell", () => {
  it("renders aside, body, and margin slots", () => {
    render(
      <ChapterShell
        aside={<div>aside-content</div>}
        body={<div>body-content</div>}
        margin={<div>margin-content</div>}
      />,
    );
    expect(screen.getByText("aside-content")).toBeInTheDocument();
    expect(screen.getByText("body-content")).toBeInTheDocument();
    expect(screen.getByText("margin-content")).toBeInTheDocument();
  });

  it("accepts custom grid template", () => {
    const { container } = render(
      <ChapterShell
        aside={<div>a</div>}
        body={<div>b</div>}
        gridTemplate="280px 1fr"
      />,
    );
    const inner = container.querySelector(".chapter-inner") as HTMLElement;
    expect(inner.style.gridTemplateColumns).toBe("280px 1fr");
  });
});
