import { render, screen, waitFor, act } from "@testing-library/react";
import { LiveRegion, announce } from "./live-region";
import { jest } from "@jest/globals";

// Suppress specific React warnings related to act() that are from the component implementation
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      args[0].includes('An update to LiveRegion inside a test was not wrapped in act')
    ) {
      // Suppress this specific warning that is from the component implementation
      return; // Don't call originalError, just return to suppress the warning
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock the cn function
jest.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("LiveRegion", () => {
  beforeEach(() => {
    // Clear any existing announcements before each test
    document.body.innerHTML = "";
  });

  it("renders without crashing", () => {
    render(<LiveRegion />);

    // Check that both polite and assertive regions exist
    const politeRegion = screen.getByRole("status");
    const assertiveRegion = screen.getByRole("alert");

    expect(politeRegion).toBeInTheDocument();
    expect(assertiveRegion).toBeInTheDocument();
    expect(politeRegion).toHaveAttribute("aria-live", "polite");
    expect(assertiveRegion).toHaveAttribute("aria-live", "assertive");
    expect(politeRegion).toHaveAttribute("aria-atomic", "true");
    expect(assertiveRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("applies className prop correctly", () => {
    render(<LiveRegion className="custom-class" />);

    const liveRegion = screen.getByRole("status").parentElement;
    expect(liveRegion).toHaveClass("sr-only", "custom-class");
  });

  it("announces polite messages correctly", async () => {
    render(<LiveRegion />);

    // Announce a polite message within act
    act(() => {
      announce("Polite test message", "polite");
    });

    // Wait for the message to appear
    await waitFor(() => {
      expect(screen.getByText("Polite test message")).toBeInTheDocument();
    });

    // Wait for the message to be cleared after 100ms
    await waitFor(
      () => {
        expect(screen.queryByText("Polite test message")).not.toBeInTheDocument();
      },
      { timeout: 150 }
    );
  });

  it("announces assertive messages correctly", async () => {
    render(<LiveRegion />);

    // Announce an assertive message within act
    act(() => {
      announce("Assertive test message", "assertive");
    });

    // Wait for the message to appear
    await waitFor(() => {
      expect(screen.getByText("Assertive test message")).toBeInTheDocument();
    });

    // Wait for the message to be cleared after 100ms
    await waitFor(
      () => {
        expect(screen.queryByText("Assertive test message")).not.toBeInTheDocument();
      },
      { timeout: 150 }
    );
  });

  it("defaults to polite priority when no priority is specified", async () => {
    render(<LiveRegion />);

    // Announce with default priority within act
    act(() => {
      announce("Default priority message");
    });

    await waitFor(() => {
      expect(screen.getByText("Default priority message")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(screen.queryByText("Default priority message")).not.toBeInTheDocument();
      },
      { timeout: 150 }
    );
  });

  it("handles multiple announcements", async () => {
    render(<LiveRegion />);

    // First announcement
    act(() => {
      announce("First message", "polite");
    });
    await waitFor(() => {
      expect(screen.getByText("First message")).toBeInTheDocument();
    });

    // Second announcement while first is still visible
    act(() => {
      announce("Second message", "assertive");
    });
    await waitFor(() => {
      expect(screen.getByText("Second message")).toBeInTheDocument();
    });

    // Wait for both messages to clear
    await waitFor(
      () => {
        expect(screen.queryByText("First message")).not.toBeInTheDocument();
        expect(screen.queryByText("Second message")).not.toBeInTheDocument();
      },
      { timeout: 150 }
    );
  });

  it("clears messages after approximately 100ms", async () => {
    render(<LiveRegion />);

    // Announce within act
    act(() => {
      announce("Test message", "polite");
    });

    // Verify message appears
    expect(screen.getByText("Test message")).toBeInTheDocument();

    // Wait for more than 100ms for the message to clear
    await new Promise((resolve) => setTimeout(resolve, 110));

    // Check that the message is gone
    await waitFor(
      () => {
        expect(screen.queryByText("Test message")).not.toBeInTheDocument();
      },
      { timeout: 150 }
    );
  });

  it("should not crash if announce is called before LiveRegion mounts", () => {
    // Call announce before mounting LiveRegion
    expect(() => announce("Early message")).not.toThrow();
  });
});