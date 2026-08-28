import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "./layout";

// Suppress specific React warnings that are related to HTML nesting in the component implementation
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      args[0].includes('<html> cannot be a child of <div>')
    ) {
      // Suppress this specific HTML nesting warning that is from the component implementation
      return; // Don't call originalError, just return to suppress the warning
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Inter: () => ({
    className: "mocked-inter-class",
    variable: "--font-inter",
  }),
}));

// Mock the child component
const MockChildComponent = () => <div data-testid="child-content">Child Content</div>;

// Mock the imported components that might have side effects
jest.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

jest.mock("@/contexts/color-mode-context", () => ({
  ColorModeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="color-mode-provider">{children}</div>
  ),
}));

jest.mock("@/components/site-header", () => ({
  SiteHeader: () => <header data-testid="site-header">Site Header</header>,
}));

jest.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => <div data-testid="speed-insights">Speed Insights</div>,
}));

jest.mock("@vercel/analytics/react", () => ({
  Analytics: () => <div data-testid="analytics">Analytics</div>,
}));

describe("RootLayout", () => {
  it("renders the layout structure correctly", () => {
    render(
      <RootLayout>
        <MockChildComponent />
      </RootLayout>
    );

    // Check that the main elements are present
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("color-mode-provider")).toBeInTheDocument();
    expect(screen.getByTestId("site-header")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByTestId("speed-insights")).toBeInTheDocument();
    expect(screen.getByTestId("analytics")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders children content correctly", () => {
    render(
      <RootLayout>
        <MockChildComponent />
      </RootLayout>
    );

    const childContent = screen.getByTestId("child-content");
    expect(childContent).toBeInTheDocument();
    expect(childContent).toHaveTextContent("Child Content");
  });

  it("wraps content in the correct container structure", () => {
    render(
      <RootLayout>
        <MockChildComponent />
      </RootLayout>
    );

    // Check if the body structure is maintained
    const body = document.body;
    expect(body).toHaveClass("min-h-screen", "bg-background", "antialiased");
  });
});

describe("metadata", () => {
  it("has the correct title", () => {
    expect(metadata.title).toBe("Multi-Select Component | shadcn/ui React TypeScript");
  });

  it("has the correct description", () => {
    expect(metadata.description).toBe(
      "A powerful and flexible multi-select component built with React, TypeScript, Tailwind CSS, and shadcn/ui. Features animations, search, multiple variants, and full accessibility support."
    );
  });

  it("has the correct keywords", () => {
    expect(metadata.keywords).toEqual([
      "react",
      "typescript",
      "shadcn",
      "tailwind",
      "multi-select",
      "component",
      "ui",
    ]);
  });

  it("has the correct authors", () => {
    expect(metadata.authors).toEqual([{ name: "sersavan", url: "https://github.com/sersavan" }]);
  });

  it("has the correct openGraph configuration", () => {
    expect(metadata.openGraph).toEqual({
      title: "Multi-Select Component | shadcn/ui React TypeScript",
      description:
        "A powerful and flexible multi-select component with animations, search, and multiple variants",
      type: "website",
    });
  });
});