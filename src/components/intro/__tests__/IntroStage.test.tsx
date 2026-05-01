import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { IntroStage } from "../IntroStage";

describe("IntroStage", () => {
  it("renders the stage", () => {
    const { container } = render(<IntroStage onHandoffChange={() => {}} />);
    expect(container.querySelector(".intro-zone")).toBeInTheDocument();
    expect(container.querySelector(".intro-stage")).toBeInTheDocument();
  });
});
