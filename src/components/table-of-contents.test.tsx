import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TableOfContents } from "./table-of-contents";

// Mock the modules used in the component
jest.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

// Mock the icons module
jest.mock("@/components/icons", () => ({
  Icons: {
    wand: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-wand" />
    ),
    star: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-star" />
    ),
    activity: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-activity" />
    ),
    smartphone: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-smartphone" />
    ),
    users: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-users" />
    ),
    search: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-search" />
    ),
    monitor: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-monitor" />
    ),
    shield: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-shield" />
    ),
    cpu: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-cpu" />
    ),
    target: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-target" />
    ),
    pieChart: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-piechart" />
    ),
    bot: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-bot" />
    ),
    heart: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-heart" />
    ),
    code: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="icon-code" />
    ),
  },
}));

// Mock the UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, variant, size }: any) => (
    <button
      data-testid="mock-button"
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="mock-card" className={className}>
      {children}
    </div>
  ),
}));

describe("TableOfContents", () => {
  // Create mock scroll event
  const createMockScrollEvent = (scrollY: number) => {
    Object.defineProperty(window, "scrollY", {
      value: scrollY,
      writable: true,
    });

    // Mock getBoundingClientRect for DOM elements
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  };

  // Create mock elements for the sections
  const createMockSectionElements = () => {
    const sections = [
      "form-integration",
      "variants-section",
      "animations-section",
      "responsive-behavior",
      "grouped-options",
      "search-ui-configuration",
      "layout-sizing-options",
      "custom-styling-colors",
      "disabled-states",
      "advanced-features",
      "imperative-methods",
      "data-visualization",
      "ai-configuration",
      "interactive-documentation",
      "interactive-form-survey",
      "props-reference",
    ];

    sections.forEach((id) => {
      const element = document.createElement("div");
      element.id = id;
      document.body.appendChild(element);
    });
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    createMockScrollEvent(0);
    createMockSectionElements();
  });

  afterEach(() => {
    // Clean up mock elements
    const elements = document.querySelectorAll("[id]");
    elements.forEach((el) => el.remove());
  });

  it("should not render when scroll position is less than 400", () => {
    render(<TableOfContents />);
    
    expect(screen.queryByTestId("mock-card")).not.toBeInTheDocument();
  });

  it("should render when scroll position is greater than 400", () => {
    createMockScrollEvent(500);
    
    render(<TableOfContents />);
    
    expect(screen.getByTestId("mock-card")).toBeInTheDocument();
  });

  it("should render all section items correctly", () => {
    createMockScrollEvent(500);
    
    render(<TableOfContents />);
    
    // Check for the presence of the navigation title
    expect(screen.getByText(/Quick Navigation/)).toBeInTheDocument();
    
    // Check for the presence of some section links
    expect(screen.getByText("Form Integration")).toBeInTheDocument();
    expect(screen.getByText("Component Variants")).toBeInTheDocument();
    expect(screen.getByText("Animations & Effects")).toBeInTheDocument();
    expect(screen.getByText("Props Reference")).toBeInTheDocument();
  });

  it("should highlight the active section when scrolled to it", async () => {
    createMockScrollEvent(500);
    
    // Override getBoundingClientRect to simulate a section being at the top
    Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(function (this: Element) {
      if (this.id === "form-integration") {
        return {
          top: 50,
          bottom: 150,
          left: 0,
          right: 0,
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        };
      }
      return {
        top: 200,
        bottom: 300,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    });
    
    render(<TableOfContents />);
    
    // Wait for scroll effect to run
    await waitFor(() => {
      const activeButtons = screen.getAllByTestId("mock-button");
      const activeButton = activeButtons.find(btn => 
        btn.classList.contains("bg-primary/10") && 
        btn.classList.contains("text-primary") &&
        btn.classList.contains("border-l-2") &&
        btn.classList.contains("border-primary")
      );
      expect(activeButton).toBeInTheDocument();
    });
  });

  it("should scroll to section when a section button is clicked", () => {
    createMockScrollEvent(500);
    
    render(<TableOfContents />);
    
    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    
    const sectionButton = screen.getByText("Form Integration");
    fireEvent.click(sectionButton);
    
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("should handle click events on all section buttons", () => {
    createMockScrollEvent(500);
    
    render(<TableOfContents />);
    
    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    
    // Get all buttons
    const buttons = screen.getAllByTestId("mock-button");
    
    // Click on the first few buttons to test functionality
    fireEvent.click(buttons[1]); // Form Integration
    fireEvent.click(buttons[2]); // Component Variants
    fireEvent.click(buttons[3]); // Animations & Effects
    
    // Verify that scrollIntoView was called multiple times
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(3);
  });

  it("should show correct number of sections in navigation title", () => {
    createMockScrollEvent(500);
    
    render(<TableOfContents />);
    
    // The component shows 16 sections in the navigation title
    expect(screen.getByText(/Quick Navigation \(16\)/)).toBeInTheDocument();
  });

  it("should render icons for each section", () => {
    createMockScrollEvent(500);
    
    render(<TableOfContents />);
    
    // Check for presence of icons in the buttons
    const buttons = screen.getAllByTestId("mock-button");
    
    // Each button should have an icon (svg element)
    buttons.forEach(button => {
      expect(button.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("should apply correct classes for active and inactive sections", () => {
    createMockScrollEvent(500);
    
    // Override getBoundingClientRect to simulate active section
    Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(function (this: Element) {
      if (this.id === "form-integration") {
        return {
          top: 50,
          bottom: 150,
          left: 0,
          right: 0,
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        };
      }
      return {
        top: 200,
        bottom: 300,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    });
    
    render(<TableOfContents />);
    
    // Wait for scroll effect to run
    waitFor(() => {
      const buttons = screen.getAllByTestId("mock-button");
      buttons.forEach((button, index) => {
        if (index === 1) { // Form Integration should be active
          expect(button).toHaveClass("bg-primary/10", "text-primary", "border-l-2", "border-primary");
        } else {
          expect(button).toHaveClass("hover:bg-muted/50", "text-muted-foreground", "hover:text-foreground");
        }
      });
    });
  });
});