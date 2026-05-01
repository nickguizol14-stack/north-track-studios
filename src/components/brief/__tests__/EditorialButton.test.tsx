import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils/render";
import { EditorialButton } from "../EditorialButton";

describe("EditorialButton", () => {
  it("renders the label and arrow", () => {
    render(<EditorialButton ready>Continue</EditorialButton>);
    expect(screen.getByText("Continue")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it("supports back direction (left arrow)", () => {
    render(
      <EditorialButton direction="back" ready>
        Back
      </EditorialButton>,
    );
    expect(screen.getByText("←")).toBeInTheDocument();
  });

  it("invokes onClick when ready and clicked", () => {
    const onClick = vi.fn();
    render(
      <EditorialButton ready onClick={onClick}>
        Continue
      </EditorialButton>,
    );
    screen.getByRole("button").click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not invoke onClick when not ready", () => {
    const onClick = vi.fn();
    render(
      <EditorialButton ready={false} onClick={onClick}>
        Continue
      </EditorialButton>,
    );
    screen.getByRole("button").click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
