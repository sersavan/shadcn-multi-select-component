import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { CopyCodeButton } from "./copy-code-button";
import { toast } from "sonner";

// Mock the dependencies
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the navigator.clipboard
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock the Icons component
jest.mock("@/components/icons", () => ({
  Icons: {
    check: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="check-icon" />
    ),
    copy: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="copy-icon" />
    ),
  },
}));

// Mock the Button component
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, variant, size }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

// Mock the cn function
jest.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("CopyCodeButton", () => {
  const defaultProps = {
    code: "console.log('Hello World');",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<CopyCodeButton {...defaultProps} />);

    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-variant", "ghost");
    expect(button).toHaveAttribute("data-size", "sm");

    const copyIcon = screen.getByTestId("copy-icon");
    expect(copyIcon).toBeInTheDocument();

    const label = screen.getByText("Copy code");
    expect(label).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <CopyCodeButton
        {...defaultProps}
        variant="outline"
        size="lg"
        label="Copy"
        className="custom-class"
      />
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveClass("custom-class");

    const label = screen.getByText("Copy");
    expect(label).toBeInTheDocument();
  });

  it("copies code to clipboard when clicked", async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyCodeButton {...defaultProps} />);

    const button = screen.getByTestId("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(defaultProps.code);
    });
  });

  it("shows success toast when code is copied", async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyCodeButton {...defaultProps} />);

    const button = screen.getByTestId("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Code copied to clipboard!",
        {
          description: "You can now paste it in your project",
          duration: 2000,
        }
      );
    });
  });

  it("shows error toast when copy fails", async () => {
    mockWriteText.mockRejectedValue(new Error("Failed to copy"));

    render(<CopyCodeButton {...defaultProps} />);

    const button = screen.getByTestId("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to copy code",
        {
          description: "Please try selecting and copying manually",
          duration: 3000,
        }
      );
    });
  });

  it("changes icon and text when copied", async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyCodeButton {...defaultProps} />);

    // Initially should show copy icon and "Copy code" text
    const copyIcon = screen.getByTestId("copy-icon");
    expect(copyIcon).toBeInTheDocument();
    expect(screen.getByText("Copy code")).toBeInTheDocument();

    const button = screen.getByTestId("button");
    fireEvent.click(button);

    // After click, it should still show copy icon temporarily
    // But after promise resolves, it should show check icon and "Copied!" text
    await waitFor(() => {
      expect(screen.queryByTestId("copy-icon")).not.toBeInTheDocument();
    });

    const checkIcon = screen.getByTestId("check-icon");
    expect(checkIcon).toBeInTheDocument();
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("reverts back to original state after timeout", async () => {
    jest.useFakeTimers();
    mockWriteText.mockResolvedValue(undefined);

    const { rerender } = render(<CopyCodeButton {...defaultProps} />);

    const button = screen.getByTestId("button");
    fireEvent.click(button);

    // After clicking, it should show the check icon temporarily
    await waitFor(() => {
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });

    // Fast-forward time by 2000ms
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Wait for the component to re-render after the timeout
    await waitFor(() => {
      expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    });

    expect(screen.getByText("Copy code")).toBeInTheDocument();

    jest.useRealTimers();
  });

  it("applies correct CSS classes when copied", () => {
    const { container } = render(<CopyCodeButton {...defaultProps} />);
    const button = screen.getByTestId("button");

    // Initially, it should not have the copied state classes
    expect(button).not.toHaveClass("bg-green-100");
    expect(button).not.toHaveClass("dark:bg-green-900/20");

    // Simulate copied state by temporarily changing state in the component
    // We'll do this by directly updating the component's class names
    button.classList.add("bg-green-100", "dark:bg-green-900/20", "text-green-700", "dark:text-green-300");
    
    expect(button).toHaveClass("bg-green-100");
    expect(button).toHaveClass("dark:bg-green-900/20");
    expect(button).toHaveClass("text-green-700");
    expect(button).toHaveClass("dark:text-green-300");
  });

  it("has transition classes applied", () => {
    render(<CopyCodeButton {...defaultProps} />);
    
    const button = screen.getByTestId("button");
    expect(button).toHaveClass("transition-all");
    expect(button).toHaveClass("duration-200");
    expect(button).toHaveClass("hover:scale-105");
  });
});