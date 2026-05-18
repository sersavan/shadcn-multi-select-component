import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("Label", () => {
  it("renders correctly with default props", () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("text-sm", "font-medium", "leading-none", "peer-disabled:cursor-not-allowed", "peer-disabled:opacity-70");
  });

  it("renders with custom className", () => {
    render(<Label className="custom-class">Test Label</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("custom-class");
    expect(label).toHaveClass("text-sm", "font-medium", "leading-none", "peer-disabled:cursor-not-allowed", "peer-disabled:opacity-70");
  });

  it("applies htmlFor attribute correctly", () => {
    render(<Label htmlFor="test-input">Test Label</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("supports forwardRef", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Test Label</Label>);

    // Test that the component renders without error when using ref
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders with additional attributes", () => {
    render(
      <Label data-testid="test-label" id="test-id">
        Test Label
      </Label>
    );

    const label = screen.getByTestId("test-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("id", "test-id");
  });

  it("inherits radix label primitive properties", () => {
    render(
      <Label 
        htmlFor="test-input" 
        id="test-label"
        aria-label="Test Aria Label"
      >
        Test Label
      </Label>
    );

    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", "test-input");
    expect(label).toHaveAttribute("id", "test-label");
    expect(label).toHaveAttribute("aria-label", "Test Aria Label");
  });
});