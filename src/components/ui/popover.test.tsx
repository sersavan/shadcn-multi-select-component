import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

describe("Popover", () => {
  const mockTriggerText = "Open Popover";
  const mockContentText = "Popover Content";

  const TestPopover = () => {
    return (
      <Popover>
        <PopoverTrigger>{mockTriggerText}</PopoverTrigger>
        <PopoverContent>{mockContentText}</PopoverContent>
      </Popover>
    );
  };

  it("renders without crashing", () => {
    render(<TestPopover />);
    
    const triggerElement = screen.getByText(mockTriggerText);
    expect(triggerElement).toBeInTheDocument();
  });

  it("does not show content initially", () => {
    render(<TestPopover />);
    
    const contentElement = screen.queryByText(mockContentText);
    expect(contentElement).not.toBeInTheDocument();
  });

  it("shows content when trigger is clicked", () => {
    render(<TestPopover />);
    
    const triggerElement = screen.getByText(mockTriggerText);
    fireEvent.click(triggerElement);
    
    const contentElement = screen.getByText(mockContentText);
    expect(contentElement).toBeInTheDocument();
  });

  it("hides content when trigger is clicked again", async () => {
    render(<TestPopover />);
    
    const triggerElement = screen.getByText(mockTriggerText);
    
    // Click to open
    fireEvent.click(triggerElement);
    expect(screen.getByText(mockContentText)).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(triggerElement);
    await waitFor(() => {
      expect(screen.queryByText(mockContentText)).not.toBeInTheDocument();
    });
  });

  it("applies default alignment and offset props correctly", () => {
    render(
      <Popover>
        <PopoverTrigger>{mockTriggerText}</PopoverTrigger>
        <PopoverContent data-testid="popover-content">{mockContentText}</PopoverContent>
      </Popover>
    );
    
    const triggerElement = screen.getByText(mockTriggerText);
    fireEvent.click(triggerElement);
    
    const contentElement = screen.getByTestId("popover-content");
    // Default align is "center" and sideOffset is 4
    expect(contentElement).toHaveAttribute("data-align", "center");
  });

  it("applies custom className to content", () => {
    const customClass = "custom-popover-class";
    
    render(
      <Popover>
        <PopoverTrigger>{mockTriggerText}</PopoverTrigger>
        <PopoverContent className={customClass}>{mockContentText}</PopoverContent>
      </Popover>
    );
    
    const triggerElement = screen.getByText(mockTriggerText);
    fireEvent.click(triggerElement);
    
    const contentElement = screen.getByText(mockContentText);
    expect(contentElement).toHaveClass(customClass);
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    
    render(
      <Popover>
        <PopoverTrigger>{mockTriggerText}</PopoverTrigger>
        <PopoverContent ref={ref}>{mockContentText}</PopoverContent>
      </Popover>
    );
    
    const triggerElement = screen.getByText(mockTriggerText);
    fireEvent.click(triggerElement);
    
    const contentElement = screen.getByText(mockContentText);
    expect(ref.current).toBe(contentElement);
  });

  it("renders with default styling classes", () => {
    render(
      <Popover>
        <PopoverTrigger>{mockTriggerText}</PopoverTrigger>
        <PopoverContent data-testid="popover-content">{mockContentText}</PopoverContent>
      </Popover>
    );
    
    const triggerElement = screen.getByText(mockTriggerText);
    fireEvent.click(triggerElement);
    
    const contentElement = screen.getByTestId("popover-content");
    expect(contentElement).toHaveClass("z-50", "w-72", "rounded-md", "border", "bg-popover", "p-4", "text-popover-foreground", "shadow-md");
  });

  it("preserves additional props passed to content", () => {
    render(
      <Popover>
        <PopoverTrigger>{mockTriggerText}</PopoverTrigger>
        <PopoverContent data-testid="test-popover">{mockContentText}</PopoverContent>
      </Popover>
    );
    
    const triggerElement = screen.getByText(mockTriggerText);
    fireEvent.click(triggerElement);
    
    const contentElement = screen.getByTestId("test-popover");
    expect(contentElement).toBeInTheDocument();
  });
});