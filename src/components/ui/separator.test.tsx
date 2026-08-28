import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders a horizontal separator by default", () => {
    render(<Separator />);
    const separator = screen.getByRole("none");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass("h-[1px]", "w-full");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders a vertical separator when orientation is vertical", () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole("none");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass("h-full", "w-[1px]");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("applies custom className", () => {
    render(<Separator className="custom-class" />);
    const separator = screen.getByRole("none");
    expect(separator).toHaveClass("custom-class");
  });

  it("has proper ARIA attributes", () => {
    render(<Separator />);
    const separator = screen.getByRole("none");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("respects the decorative prop", () => {
    render(<Separator decorative={false} />);
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });

  it("forwards ref properly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInTheDocument();
  });
});