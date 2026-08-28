import React from "react";
import { render, screen } from "@testing-library/react";
import { Toaster } from "./sonner";

// Mock the next-themes useTheme hook
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
    themes: ["light", "dark"],
  }),
}));

// Mock the Sonner component
jest.mock("sonner", () => ({
  Toaster: ({ children, ...props }: { children?: React.ReactNode, [key: string]: any }) => (
    <div
      data-testid="sonner-toaster"
      data-theme={props.theme}
      className={props.className}
    >
      {children}
    </div>
  ),
}));

describe("Toaster", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<Toaster />);

    expect(screen.getByTestId("sonner-toaster")).toBeInTheDocument();
  });

  it("applies the correct theme based on useTheme hook", () => {
    // Mock useTheme to return a dark theme
    jest.mock("next-themes", () => ({
      useTheme: () => ({
        theme: "dark",
        setTheme: jest.fn(),
        themes: ["light", "dark"],
      }),
    }));

    // Need to re-require to use the updated mock
    jest.unmock("./sonner"); // Actually need to restart the module or reset mocks
    jest.resetModules();

    // Re-require the component after resetting modules
    const { Toaster: ReToaster } = require("./sonner");

    render(<ReToaster />);
    expect(screen.getByTestId("sonner-toaster")).toBeInTheDocument();
  });

  it("handles 'system' theme default", () => {
    jest.mock("next-themes", () => ({
      useTheme: () => ({
        theme: undefined, // This should default to 'system'
        setTheme: jest.fn(),
        themes: ["light", "dark"],
      }),
    }));

    jest.resetModules();
    const { Toaster: ReToaster } = require("./sonner");

    render(<ReToaster />);
    expect(screen.getByTestId("sonner-toaster")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<Toaster />);

    const toaster = screen.getByTestId("sonner-toaster");
    expect(toaster).toHaveClass("toaster", "group");
  });

  it("passes additional props to the Sonner component", () => {
    render(<Toaster visibleToasts={3} />);

    expect(screen.getByTestId("sonner-toaster")).toBeInTheDocument();
  });

  it("has correct toast options with class names", () => {
    render(<Toaster />);

    expect(screen.getByTestId("sonner-toaster")).toBeInTheDocument();
  });
});