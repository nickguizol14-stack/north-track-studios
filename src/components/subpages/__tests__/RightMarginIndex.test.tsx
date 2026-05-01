// src/components/subpages/__tests__/RightMarginIndex.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { RightMarginIndex } from "../RightMarginIndex";

describe("RightMarginIndex", () => {
  it("renders all index items", () => {
    render(
      <RightMarginIndex
        items={[
          { id: "intelligence", label: "01 / Intelligence" },
          { id: "surface", label: "02 / Surface" },
        ]}
      />,
    );
    expect(screen.getByText(/01 \/ Intelligence/)).toBeInTheDocument();
    expect(screen.getByText(/02 \/ Surface/)).toBeInTheDocument();
  });
});
