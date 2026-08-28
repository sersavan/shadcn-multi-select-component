import * as React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "./theme-provider";

// Mock next-themes
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <div data-testid="theme-provider" data-theme={props.theme}>
      {children}
    </div>
  ),
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
    systemTheme: "dark",
  }),
}));

describe("ThemeProvider", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <ThemeProvider>
        <span>Test Child</span>
      </ThemeProvider>
    );
    expect(getByText("Test Child")).toBeInTheDocument();
  });

  it("passes props to NextThemesProvider", () => {
    const { getByTestId } = render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <span>Test Child</span>
      </ThemeProvider>
    );
    const themeProviderElement = getByTestId("theme-provider");
    expect(themeProviderElement).toBeInTheDocument();
  });

  it("works with multiple children", () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Child 1</div>
        <div>Child 2</div>
      </ThemeProvider>
    );
    expect(getByText("Child 1")).toBeInTheDocument();
    expect(getByText("Child 2")).toBeInTheDocument();
  });

  it("should not break when no children are provided", () => {
    const { container } = render(<ThemeProvider />);
    expect(container).toBeInstanceOf(HTMLDivElement);
  });

  it("preserves the component structure", () => {
    const { container } = render(
      <ThemeProvider attribute="class">
        <div className="test-child">Content</div>
      </ThemeProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
    const child = container.firstChild?.firstChild as HTMLElement;
    expect(child).toBeInTheDocument();
    expect(child?.className).toBe("test-child");
    expect(child?.textContent).toBe("Content");
  });
});