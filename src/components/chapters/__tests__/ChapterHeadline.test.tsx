// src/components/chapters/__tests__/ChapterHeadline.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ChapterHeadline } from "../ChapterHeadline";

describe("ChapterHeadline", () => {
  it("renders provided children", () => {
    render(
      <ChapterHeadline>
        We build <em>intelligent</em> systems
      </ChapterHeadline>,
    );
    expect(screen.getByText(/We build/i)).toBeInTheDocument();
    expect(screen.getByText("intelligent")).toBeInTheDocument();
  });
});
