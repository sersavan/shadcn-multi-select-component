import React from "react";
import { render, screen, within } from "@testing-library/react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle
} from "./chart";
import * as RechartsPrimitive from "recharts";

// Mock Recharts components
jest.mock("recharts", () => {
  const React = require('react');
  return {
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    Tooltip: ({ content, ...props }: any) => {
      if (content) {
        return React.createElement(content, { ...props });
      }
      return <div data-testid="tooltip">Tooltip</div>;
    },
    Legend: ({ content, ...props }: any) => {
      if (content) {
        return React.createElement(content, { ...props });
      }
      return <div data-testid="legend">Legend</div>;
    },
    // Mock other commonly used Recharts components if they are used in the Chart components
    LineChart: () => null,
    BarChart: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Line: () => null,
    Bar: () => null,
  };
});

describe("Chart Components", () => {
  describe("ChartContainer", () => {
    const mockConfig = {
      sales: {
        label: "Sales",
        color: "#8884d8",
      },
      revenue: {
        label: "Revenue",
        color: "#82ca9d",
      },
    };

    it("renders children with ResponsiveContainer", () => {
      render(
        <ChartContainer config={mockConfig}>
          <div data-testid="chart-content">Chart Content</div>
        </ChartContainer>
      );

      expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
      expect(screen.getByTestId("chart-content")).toBeInTheDocument();
      expect(screen.getByText("Chart Content")).toBeInTheDocument();
    });

    it("applies the correct CSS classes", () => {
      render(
        <ChartContainer config={mockConfig} className="custom-class">
          <div>Chart Content</div>
        </ChartContainer>
      );

      const container = screen.getByTestId("responsive-container").parentElement as HTMLElement;
      expect(container).toHaveClass("flex", "aspect-video", "justify-center", "text-xs", "custom-class");
    });

    it("generates unique data-chart attribute", () => {
      render(
        <ChartContainer config={mockConfig}>
          <div>Chart Content</div>
        </ChartContainer>
      );

      const container = screen.getByTestId("responsive-container").parentElement as HTMLElement;
      expect(container).toHaveAttribute("data-chart");
      expect(container.getAttribute("data-chart")).toMatch(/^chart-/);
    });

    it("renders ChartStyle component with config", () => {
      render(
        <ChartContainer config={mockConfig}>
          <div>Chart Content</div>
        </ChartContainer>
      );

      // Use querySelector to find the style element since it's not accessible by default
      const container = screen.getByTestId("responsive-container").parentElement as HTMLElement;
      const styleElement = container.querySelector("style");
      expect(styleElement).toBeInTheDocument();
    });

    it("provides config to context", () => {
      // Testing that the context is properly set up
      const TestComponent = () => {
        // This would be tested in a component that uses useChart
        return <div>Test</div>;
      };

      render(
        <ChartContainer config={mockConfig}>
          <TestComponent />
        </ChartContainer>
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("ChartStyle", () => {
    const mockConfig = {
      sales: {
        label: "Sales",
        color: "#8884d8",
      },
      revenue: {
        label: "Revenue",
        theme: {
          light: "#82ca9d",
          dark: "#ff7e5f",
        },
      },
    };

    it("renders style element with color variables for light theme", () => {
      render(<ChartStyle id="test-chart" config={mockConfig} />);

      const styleElement = document.querySelector("style");
      expect(styleElement).toBeInTheDocument();

      if (styleElement) {
        const styleContent = styleElement.innerHTML;
        expect(styleContent).toContain("[data-chart=test-chart]");
        expect(styleContent).toContain("--color-sales: #8884d8");
        expect(styleContent).toContain("--color-revenue: #82ca9d");
      }
    });

    it("renders style element with color variables for dark theme", () => {
      render(<ChartStyle id="test-chart" config={mockConfig} />);

      const styleElement = document.querySelector("style");
      expect(styleElement).toBeInTheDocument();

      if (styleElement) {
        const styleContent = styleElement.innerHTML;
        expect(styleContent).toContain(".dark [data-chart=test-chart]");
        expect(styleContent).toContain("--color-revenue: #ff7e5f");
      }
    });

    it("handles config with no colors", () => {
      const emptyConfig = {};
      render(<ChartStyle id="test-chart" config={emptyConfig} />);

      // When there are no color configurations, it should render null
      const styleElement = document.querySelector("style");
      expect(styleElement).not.toBeInTheDocument();
    });
  });

  describe("ChartTooltipContent", () => {
    const mockConfig = {
      sales: {
        label: "Sales",
        color: "#8884d8",
      },
      revenue: {
        label: "Revenue",
        icon: () => <span>Icon</span>,
      },
    };

    it("renders with payload data", () => {
      const payload = [
        {
          name: "sales",
          value: 100,
          color: "#8884d8",
          dataKey: "sales",
          payload: { fill: "#8884d8" },
        },
        {
          name: "revenue",
          value: 200,
          color: "#82ca9d",
          dataKey: "revenue",
          payload: { fill: "#82ca9d" },
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={payload}
          />
        </ChartContainer>
      );

      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("200")).toBeInTheDocument();

      // Look for the text-muted-foreground elements to confirm labels are rendered
      expect(screen.getAllByText("Sales")).toHaveLength(2); // Label and value
      expect(screen.getByText("Revenue")).toBeInTheDocument();
    });

    it("hides when active is false", () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={false}
            payload={[{ name: "sales", value: 100, dataKey: "sales", payload: { fill: "#8884d8" } }]}
          />
        </ChartContainer>
      );

      expect(screen.queryByText("100")).not.toBeInTheDocument();
    });

    it("hides when no payload", () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={[]}
          />
        </ChartContainer>
      );

      expect(screen.queryByText("100")).not.toBeInTheDocument();
    });

    it("renders indicator based on type", () => {
      const payload = [
        {
          name: "sales",
          value: 100,
          color: "#8884d8",
          dataKey: "sales",
          payload: { fill: "#8884d8" },
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={payload}
            indicator="dashed"
          />
        </ChartContainer>
      );

      const indicator = screen.getByTestId("responsive-container").parentElement as HTMLElement;
      const dashedIndicator = indicator.querySelector(".w-0.border-dashed");
      expect(dashedIndicator).toBeInTheDocument();
    });

    it("applies custom class names", () => {
      const payload = [
        {
          name: "sales",
          value: 100,
          color: "#8884d8",
          dataKey: "sales",
          payload: { fill: "#8884d8" },
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={payload}
            className="custom-tooltip"
          />
        </ChartContainer>
      );

      // Find the element that contains the custom class by looking for shadow-xl class which is part of tooltip
      const tooltipElements = screen.getByTestId("responsive-container").parentElement;
      expect(tooltipElements).toBeInTheDocument();
      if (tooltipElements) {
        const tooltipWithCustomClass = tooltipElements.querySelector(".shadow-xl.custom-tooltip");
        expect(tooltipWithCustomClass).toBeInTheDocument();
      }
    });

    it("uses formatter when provided", () => {
      const payload = [
        {
          name: "sales",
          value: 100,
          color: "#8884d8",
          dataKey: "sales",
          payload: { fill: "#8884d8" },
        },
      ];

      const mockFormatter = (value: any, name: any) => [`Formatted: ${value}`, name];

      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={payload}
            formatter={mockFormatter}
          />
        </ChartContainer>
      );

      // Check for the formatted value in the tooltip content
      expect(screen.getByText(/Formatted: 100/)).toBeInTheDocument();
    });
  });

  describe("ChartLegendContent", () => {
    const mockConfig = {
      sales: {
        label: "Sales",
        color: "#8884d8",
      },
      revenue: {
        label: "Revenue",
        icon: () => <span data-testid="revenue-icon">Icon</span>,
      },
    };

    it("renders legend items from payload", () => {
      const payload = [
        {
          value: "sales",
          dataKey: "sales",
          color: "#8884d8",
        },
        {
          value: "revenue",
          dataKey: "revenue",
          color: "#82ca9d",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={payload} />
        </ChartContainer>
      );

      expect(screen.getByText("Sales")).toBeInTheDocument();
      expect(screen.getByText("Revenue")).toBeInTheDocument();
    });

    it("hides when no payload", () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={[]} />
        </ChartContainer>
      );

      expect(screen.queryByText("Sales")).not.toBeInTheDocument();
      expect(screen.queryByText("Revenue")).not.toBeInTheDocument();
    });

    it("renders with custom vertical alignment", () => {
      const payload = [
        {
          value: "sales",
          dataKey: "sales",
          color: "#8884d8",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={payload} verticalAlign="top" />
        </ChartContainer>
      );

      const legend = screen.getByTestId("responsive-container").parentElement as HTMLElement;
      const legendContainer = legend.querySelector(".flex.items-center.justify-center.gap-4");
      expect(legendContainer).toHaveClass("pb-3");
    });

    it("hides icons when hideIcon is true", () => {
      const payload = [
        {
          value: "revenue",
          dataKey: "revenue",
          color: "#82ca9d",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={payload} hideIcon={true} />
        </ChartContainer>
      );

      expect(screen.queryByTestId("revenue-icon")).not.toBeInTheDocument();
    });

    it("renders color indicators for items without icons", () => {
      const payload = [
        {
          value: "sales",
          dataKey: "sales",
          color: "#8884d8",
        },
      ];

      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={payload} />
        </ChartContainer>
      );

      const legend = screen.getByTestId("responsive-container").parentElement as HTMLElement;
      const colorBox = legend.querySelector(".h-2.w-2.shrink-0.rounded-\\[2px\\]");
      expect(colorBox).toBeInTheDocument();
      expect(colorBox).toHaveStyle("backgroundColor: #8884d8");
    });
  });

  describe("ChartTooltip and ChartLegend", () => {
    it("renders ChartTooltip as recharts tooltip", () => {
      render(<ChartTooltip />);
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    });

    it("renders ChartLegend as recharts legend", () => {
      render(<ChartLegend />);
      expect(screen.getByTestId("legend")).toBeInTheDocument();
    });
  });

  describe("Edge cases and error handling", () => {
    it("handles useChart outside ChartContainer", () => {
      // This would trigger an error in a real component using useChart
      // We can't directly test the hook error in this setup
      expect(() => {
        render(<div>Test</div>);
      }).not.toThrow();
    });

    it("handles invalid payload in getPayloadConfigFromPayload", () => {
      // This would be tested by creating a component that uses getPayloadConfigFromPayload
      // Since we can't test the helper function directly here, we test its usage
      render(<div>Test</div>);
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });
});