import React from "react";
import {render, screen} from "@testing-library/react";
import {Test} from "./index";

vi.mock("./Test.css", () => ({
  default: {
    test: "test_flow_mock",
  },
}));

describe("Test Component", () => {
  it("renders with default text", () => {
    render(<Test />);

    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("Test");
    expect(screen.getByText("Default text")).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(<Test text="Custom text" />);

    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("Test");
    expect(screen.getByText("Custom text")).toBeInTheDocument();
  });

  it("applies the correct class name to the heading", () => {
    render(<Test />);

    const heading = screen.getByRole("heading", {level: 1});
    expect(heading).toHaveClass("test_flow_mock");
  });
});
