// src/components/chapters/capabilities/__tests__/CapabilitiesChapter.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { CapabilitiesChapter } from "../CapabilitiesChapter";

describe("CapabilitiesChapter", () => {
  it("renders chapter number and default title", () => {
    render(<CapabilitiesChapter />);
    expect(screen.getByText(/02 \/ Capabilities/i)).toBeInTheDocument();
    expect(screen.getByText(/What we make/i)).toBeInTheDocument();
  });

  it("renders all four capability rows", () => {
    render(<CapabilitiesChapter />);
    ["Intelligence", "Surface", "Throughput", "Direction"].forEach((concept) => {
      // appears at least once (in row title); morphing aside also surfaces it
      expect(screen.getAllByText(concept).length).toBeGreaterThan(0);
    });
  });
});
