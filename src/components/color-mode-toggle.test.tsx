import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ColorModeToggle } from "./color-mode-toggle";
import "@testing-library/jest-dom";

// Mock the icons
jest.mock("./icons", () => ({
  Icons: {
    eye: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="eye-icon" />
    ),
    eyeOff: ({ className }: { className?: string }) => (
      <svg className={className} data-testid="eye-off-icon" />
    ),
  },
}));

// Mock the button component
jest.mock("./ui/button", () => ({
  Button: ({ children, onClick, title, className }: any) => (
    <button onClick={onClick} title={title} className={className}>
      {children}
    </button>
  ),
}));

// Mock the useColorMode hook to control the state in tests
const mockUseColorMode = jest.fn();
jest.mock("@/contexts/color-mode-context", () => ({
  ...jest.requireActual("@/contexts/color-mode-context"),
  useColorMode: () => mockUseColorMode(),
}));

describe("ColorModeToggle", () => {
  beforeEach(() => {
    mockUseColorMode.mockClear();
  });

  it("renders the button", () => {
    mockUseColorMode.mockReturnValue({
      isGrayMode: true,
      toggleGrayMode: jest.fn(),
    });

    render(<ColorModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("shows eye-off icon when in gray mode", () => {
    mockUseColorMode.mockReturnValue({
      isGrayMode: true,
      toggleGrayMode: jest.fn(),
    });

    render(<ColorModeToggle />);

    const eyeOffIcon = screen.getByTestId("eye-off-icon");
    expect(eyeOffIcon).toBeInTheDocument();
    expect(screen.queryByTestId("eye-icon")).not.toBeInTheDocument();
  });

  it("shows eye icon when in color mode", () => {
    mockUseColorMode.mockReturnValue({
      isGrayMode: false,
      toggleGrayMode: jest.fn(),
    });

    render(<ColorModeToggle />);

    const eyeIcon = screen.getByTestId("eye-icon");
    expect(eyeIcon).toBeInTheDocument();
    expect(screen.queryByTestId("eye-off-icon")).not.toBeInTheDocument();
  });

  it("has correct title when in gray mode", () => {
    mockUseColorMode.mockReturnValue({
      isGrayMode: true,
      toggleGrayMode: jest.fn(),
    });

    render(<ColorModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Enable Colors");
  });

  it("has correct title when in color mode", () => {
    mockUseColorMode.mockReturnValue({
      isGrayMode: false,
      toggleGrayMode: jest.fn(),
    });

    render(<ColorModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Disable Colors");
  });

  it("has correct screen reader text when in gray mode", () => {
    mockUseColorMode.mockReturnValue({
      isGrayMode: true,
      toggleGrayMode: jest.fn(),
    });

    render(<ColorModeToggle />);

    const srText = screen.getByText("Enable Colors");
    expect(srText).toBeInTheDocument();
  });

  it("has correct screen reader text when in color mode", () => {
    mockUseColorMode.mockReturnValue({
      isGrayMode: false,
      toggleGrayMode: jest.fn(),
    });

    render(<ColorModeToggle />);

    const srText = screen.getByText("Disable Colors");
    expect(srText).toBeInTheDocument();
  });

  it("calls toggle function when clicked", () => {
    const toggleMock = jest.fn();
    mockUseColorMode.mockReturnValue({
      isGrayMode: true,
      toggleGrayMode: toggleMock,
    });

    render(<ColorModeToggle />);

    fireEvent.click(screen.getByRole("button"));
    expect(toggleMock).toHaveBeenCalledTimes(1);
  });
});