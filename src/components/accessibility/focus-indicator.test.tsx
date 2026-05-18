import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FocusIndicator } from "./focus-indicator";

describe("FocusIndicator", () => {
  beforeEach(() => {
    // Clean up any existing using-keyboard class
    document.body.classList.remove("using-keyboard");
  });

  afterEach(() => {
    // Ensure cleanup
    document.body.classList.remove("using-keyboard");
  });

  test("renders with initial state showing keyboard navigation is not active", () => {
    render(<FocusIndicator />);

    // Query the element directly since it doesn't have an associated label
    const indicatorElement = document.querySelector('.sr-only[aria-live="polite"]');
    expect(indicatorElement).toBeInTheDocument();
    expect(indicatorElement).toHaveClass("sr-only");
    expect(indicatorElement).toHaveTextContent("");
  });

  test("does not show keyboard navigation text initially", () => {
    render(<FocusIndicator />);

    const indicatorElement = document.querySelector('.sr-only[aria-live="polite"]');
    expect(indicatorElement).not.toHaveTextContent("Keyboard navigation is active");
  });

  test("detects keyboard user when Tab key is pressed", async () => {
    render(<FocusIndicator />);

    // Simulate Tab key press
    fireEvent.keyDown(document, { key: "Tab" });

    // Check if the body class is added
    expect(document.body.classList.contains("using-keyboard")).toBe(true);

    // Wait for state update and check text content
    await waitFor(() => {
      const indicatorElement = document.querySelector('.sr-only[aria-live="polite"]');
      expect(indicatorElement).toHaveTextContent("Keyboard navigation is active");
    });
  });

  test("does not show keyboard text when other keys are pressed", () => {
    render(<FocusIndicator />);

    fireEvent.keyDown(document, { key: "Enter" });

    const indicatorElement = document.querySelector('.sr-only[aria-live="polite"]');
    expect(indicatorElement).not.toHaveTextContent("Keyboard navigation is active");
    expect(document.body.classList.contains("using-keyboard")).toBe(false);
  });

  test("removes keyboard user state when mouse is used after keyboard", async () => {
    render(<FocusIndicator />);

    // First use keyboard
    fireEvent.keyDown(document, { key: "Tab" });

    await waitFor(() => {
      const indicatorElement = document.querySelector('.sr-only[aria-live="polite"]');
      expect(indicatorElement).toHaveTextContent("Keyboard navigation is active");
      expect(document.body.classList.contains("using-keyboard")).toBe(true);
    });

    // Then use mouse
    fireEvent.mouseDown(document);

    await waitFor(() => {
      const indicatorElement = document.querySelector('.sr-only[aria-live="polite"]');
      expect(indicatorElement).not.toHaveTextContent("Keyboard navigation is active");
      expect(document.body.classList.contains("using-keyboard")).toBe(false);
    });
  });

  test("applies className prop correctly", () => {
    render(<FocusIndicator className="custom-class another-class" />);

    const indicatorElement = document.querySelector('.sr-only[aria-live="polite"]');
    expect(indicatorElement).toHaveClass("sr-only", "custom-class", "another-class");
  });

  test("adds and removes style element correctly", () => {
    const { unmount } = render(<FocusIndicator />);

    // Check that the style element with focus indicator styles is added
    const styleElements = document.head.querySelectorAll("style");
    const focusIndicatorStyle = Array.from(styleElements).find(style =>
      style.textContent?.includes(".using-keyboard *:focus")
    );
    expect(focusIndicatorStyle).toBeTruthy();

    // Unmount component and check cleanup
    unmount();

    // After unmounting, the specific style element should be removed
    const newStyleElements = document.head.querySelectorAll("style");
    const newFocusIndicatorStyle = Array.from(newStyleElements).find(style =>
      style.textContent?.includes(".using-keyboard *:focus")
    );
    expect(newFocusIndicatorStyle).toBeFalsy();
  });

  test("cleanup removes event listeners and body class", () => {
    const { unmount } = render(<FocusIndicator />);

    // Add keyboard class by pressing Tab
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.body.classList.contains("using-keyboard")).toBe(true);

    // Unmount component
    unmount();

    // Check that cleanup removed the class
    expect(document.body.classList.contains("using-keyboard")).toBe(false);
  });

  test("only removes using-keyboard class when it was previously added", () => {
    // Manually add the class
    document.body.classList.add("using-keyboard");
    expect(document.body.classList.contains("using-keyboard")).toBe(true);

    const { unmount } = render(<FocusIndicator />);
    unmount();

    // Class should still be removed even if it was manually added
    expect(document.body.classList.contains("using-keyboard")).toBe(false);
  });
});