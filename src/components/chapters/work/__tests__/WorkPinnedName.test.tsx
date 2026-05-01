import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WorkPinnedName } from "../WorkPinnedName";

describe("WorkPinnedName", () => {
  it("renders meta, name, and sub", () => {
    render(
      <WorkPinnedName
        meta="Project 01 · 2025 · Lead"
        name="Synapse"
        sub="An internal research workbench."
      />,
    );
    expect(screen.getByText("Project 01 · 2025 · Lead")).toBeInTheDocument();
    expect(screen.getByText("Synapse")).toBeInTheDocument();
    expect(screen.getByText(/An internal research/i)).toBeInTheDocument();
  });
});
