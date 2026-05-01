import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WorkStackRow } from "../WorkStackRow";

describe("WorkStackRow", () => {
  it("renders the project name, meta, body, tags", () => {
    render(
      <WorkStackRow
        name="Lumen"
        meta="Project 02 · 2024"
        client="The New Atlas · Lead"
        body="A public-facing AI search experience."
        tags="Editorial UX · Hybrid retrieval"
      />,
    );
    expect(screen.getByText("Lumen")).toBeInTheDocument();
    expect(screen.getByText("Project 02 · 2024")).toBeInTheDocument();
    expect(screen.getByText("The New Atlas · Lead")).toBeInTheDocument();
    expect(screen.getByText(/AI search/)).toBeInTheDocument();
    expect(screen.getByText(/Editorial UX/)).toBeInTheDocument();
  });
});
