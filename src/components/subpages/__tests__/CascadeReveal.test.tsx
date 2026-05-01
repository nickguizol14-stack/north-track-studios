// src/components/subpages/__tests__/CascadeReveal.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { CascadeReveal } from "../CascadeReveal";

describe("CascadeReveal", () => {
  it("renders children", () => {
    const { getByText } = render(
      <CascadeReveal index={0}>
        <span>hello</span>
      </CascadeReveal>,
    );
    expect(getByText("hello")).toBeInTheDocument();
  });
});
