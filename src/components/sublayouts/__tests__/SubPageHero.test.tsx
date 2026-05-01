// src/components/sublayouts/__tests__/SubPageHero.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { SubPageHero } from "../SubPageHero";

describe("SubPageHero", () => {
  it("renders the wordmark and subtitle", () => {
    render(<SubPageHero slug="capabilities" wordmark="Capabilities" subtitle="Four practices, deepened." />);
    expect(screen.getByText("Capabilities")).toBeInTheDocument();
    expect(screen.getByText(/Four practices/)).toBeInTheDocument();
    expect(screen.getByText(/\/ Capabilities/i)).toBeInTheDocument();
  });
});
