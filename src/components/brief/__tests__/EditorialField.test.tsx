import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test-utils/render";
import { EditorialField } from "../EditorialField";

describe("EditorialField", () => {
  it("renders the label and the placeholder", () => {
    render(
      <EditorialField
        label="Your name"
        placeholder="Jane Smith"
        value=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jane Smith")).toBeInTheDocument();
  });

  it("invokes onChange when typed", () => {
    const onChange = vi.fn();
    render(
      <EditorialField
        label="Name"
        placeholder=""
        value=""
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith("abc");
  });

  it("renders a multiline textarea when multiline=true", () => {
    render(
      <EditorialField
        label="Question"
        placeholder=""
        value=""
        onChange={() => {}}
        multiline
      />,
    );
    const ta = screen.getByRole("textbox");
    expect(ta.tagName.toLowerCase()).toBe("textarea");
  });
});
