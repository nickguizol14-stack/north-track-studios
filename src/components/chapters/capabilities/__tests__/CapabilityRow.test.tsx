// src/components/chapters/capabilities/__tests__/CapabilityRow.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { CapabilityRow } from "../CapabilityRow";

describe("CapabilityRow", () => {
  it("renders the index, concept word, and formal label", () => {
    render(
      <CapabilityRow
        index="01"
        concept="Intelligence"
        formal="AI Systems"
        body="We design and ship reasoning."
        kit="Claude · OpenAI"
      />,
    );
    expect(screen.getByText(/01 \/ Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText("Intelligence")).toBeInTheDocument();
    expect(screen.getByText("AI Systems")).toBeInTheDocument();
    expect(screen.getByText(/We design and ship/i)).toBeInTheDocument();
    expect(screen.getByText(/Claude · OpenAI/i)).toBeInTheDocument();
  });
});
