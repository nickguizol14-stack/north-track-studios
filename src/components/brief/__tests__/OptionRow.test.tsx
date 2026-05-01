import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils/render";
import { OptionRow } from "../OptionRow";

describe("OptionRow", () => {
  it("renders index, title, and detail", () => {
    render(
      <OptionRow
        index="01"
        title="An AI assistant or agent"
        detail="Conversational systems."
        selected={false}
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("An AI assistant or agent")).toBeInTheDocument();
    expect(screen.getByText("Conversational systems.")).toBeInTheDocument();
  });

  it("shows + when not selected, ✓ when selected", () => {
    const { rerender } = render(
      <OptionRow index="01" title="t" detail="d" selected={false} onSelect={() => {}} />,
    );
    expect(screen.getByText("+")).toBeInTheDocument();
    rerender(<OptionRow index="01" title="t" detail="d" selected onSelect={() => {}} />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("invokes onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(<OptionRow index="01" title="t" detail="d" selected={false} onSelect={onSelect} />);
    screen.getByText("t").click();
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
