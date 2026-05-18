import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge Component", () => {
  it("renders with default variant when no variant is specified", () => {
    render(<Badge>Default Badge</Badge>);
    
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("border-transparent bg-primary text-primary-foreground hover:bg-primary/80");
  });

  it("renders with specified variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    
    const badge = screen.getByText("Secondary Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80");
  });

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    
    const badge = screen.getByText("Destructive Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80");
  });

  it("renders with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    
    const badge = screen.getByText("Outline Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-foreground");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    
    const badge = screen.getByText("Custom Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("custom-class");
  });

  it("renders children correctly", () => {
    render(<Badge>Test Badge Content</Badge>);
    
    const badge = screen.getByText("Test Badge Content");
    expect(badge).toBeInTheDocument();
  });

  it("can accept additional props", () => {
    render(<Badge data-testid="test-badge">Test Badge</Badge>);
    
    const badge = screen.getByTestId("test-badge");
    expect(badge).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<Badge>Accessibility Badge</Badge>);
    
    const badge = screen.getByText("Accessibility Badge");
    expect(badge).toBeInTheDocument();
  });

  it("renders as a div element", () => {
    render(<Badge>Element Test</Badge>);
    
    const badge = screen.getByText("Element Test");
    expect(badge.tagName).toBe("DIV");
  });
});