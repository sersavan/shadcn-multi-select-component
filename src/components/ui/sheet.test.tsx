import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "./sheet";

describe("Sheet", () => {
  const mockOpenChange = jest.fn();

  beforeEach(() => {
    mockOpenChange.mockClear();
  });

  describe("Sheet component", () => {
    it("renders children correctly", () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
            Sheet Content
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Open Sheet")).toBeInTheDocument();
    });

    it("toggles sheet when trigger is clicked", async () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
            Sheet Content
          </SheetContent>
        </Sheet>
      );

      const triggerButton = screen.getByText("Open Sheet");
      fireEvent.click(triggerButton);

      // Wait for the animation to complete
      await waitFor(() => {
        expect(screen.getByText("Sheet Content")).toBeInTheDocument();
      });

      fireEvent.click(triggerButton); // Close the sheet
      await waitFor(() => {
        expect(screen.queryByText("Sheet Content")).not.toBeInTheDocument();
      });
    });
  });

  describe("SheetContent", () => {
    it("renders with correct default side variant (right)", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent data-testid="sheet-content">
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
            Content
          </SheetContent>
        </Sheet>
      );

      const contentElement = screen.getByTestId("sheet-content");
      expect(contentElement).toHaveClass("inset-y-0", "right-0", "h-full", "w-3/4");
    });

    it("renders with specified side variant", () => {
      const { rerender } = render(
        <Sheet defaultOpen>
          <SheetContent side="top" data-testid="sheet-content">
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
            Content
          </SheetContent>
        </Sheet>
      );

      let contentElement = screen.getByTestId("sheet-content");
      expect(contentElement).toHaveClass("inset-x-0", "top-0", "border-b");

      rerender(
        <Sheet defaultOpen>
          <SheetContent side="bottom" data-testid="sheet-content">
            <SheetTitle>Sheet Title</SheetTitle>
            <div>Description for accessibility</div>
            Content
          </SheetContent>
        </Sheet>
      );

      contentElement = screen.getByTestId("sheet-content");
      expect(contentElement).toHaveClass("inset-x-0", "bottom-0", "border-t");

      rerender(
        <Sheet defaultOpen>
          <SheetContent side="left" data-testid="sheet-content">
            <SheetTitle>Sheet Title</SheetTitle>
            <div>Description for accessibility</div>
            Content
          </SheetContent>
        </Sheet>
      );

      contentElement = screen.getByTestId("sheet-content");
      expect(contentElement).toHaveClass("inset-y-0", "left-0", "h-full", "w-3/4", "border-r");
    });

    it("includes close button", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
            Content
          </SheetContent>
        </Sheet>
      );

      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it("triggers close when close button is clicked", async () => {
      render(
        <Sheet onOpenChange={mockOpenChange} open={true}>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
            Content
          </SheetContent>
        </Sheet>
      );

      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(mockOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("SheetHeader", () => {
    it("renders with correct classes", () => {
      render(<SheetHeader data-testid="sheet-header">Header Content</SheetHeader>);

      const headerElement = screen.getByTestId("sheet-header");
      expect(headerElement).toHaveClass("flex", "flex-col", "space-y-2", "text-center");
    });

    it("applies additional classes when className prop is provided", () => {
      render(
        <SheetHeader className="custom-header" data-testid="sheet-header">
          Header Content
        </SheetHeader>
      );

      const headerElement = screen.getByTestId("sheet-header");
      expect(headerElement).toHaveClass("custom-header");
    });

    it("renders children correctly", () => {
      render(<SheetHeader>Header Content</SheetHeader>);

      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });
  });

  describe("SheetFooter", () => {
    it("renders with correct classes", () => {
      render(<SheetFooter data-testid="sheet-footer">Footer Content</SheetFooter>);

      const footerElement = screen.getByTestId("sheet-footer");
      expect(footerElement).toHaveClass("flex", "flex-col-reverse", "sm:flex-row", "sm:justify-end", "sm:space-x-2");
    });

    it("applies additional classes when className prop is provided", () => {
      render(
        <SheetFooter className="custom-footer" data-testid="sheet-footer">
          Footer Content
        </SheetFooter>
      );

      const footerElement = screen.getByTestId("sheet-footer");
      expect(footerElement).toHaveClass("custom-footer");
    });

    it("renders children correctly", () => {
      render(<SheetFooter>Footer Content</SheetFooter>);

      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });
  });

  describe("SheetTitle", () => {
    it("renders with correct classes", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle data-testid="sheet-title">Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
      );

      const titleElement = screen.getByTestId("sheet-title");
      expect(titleElement).toHaveClass("text-lg", "font-semibold", "text-foreground");
    });

    it("applies additional classes when className prop is provided", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle className="custom-title" data-testid="sheet-title">
              Sheet Title
            </SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
      );

      const titleElement = screen.getByTestId("sheet-title");
      expect(titleElement).toHaveClass("custom-title");
    });

    it("renders children correctly", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Sheet Title")).toBeInTheDocument();
    });
  });

  describe("SheetDescription", () => {
    it("renders with correct classes", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription data-testid="sheet-description">Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
      );

      const descriptionElement = screen.getByTestId("sheet-description");
      expect(descriptionElement).toHaveClass("text-sm", "text-muted-foreground");
    });

    it("applies additional classes when className prop is provided", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription className="custom-description" data-testid="sheet-description">
              Sheet Description
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );

      const descriptionElement = screen.getByTestId("sheet-description");
      expect(descriptionElement).toHaveClass("custom-description");
    });

    it("renders children correctly", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Sheet Description")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper aria attributes when open", async () => {
      render(
        <Sheet defaultOpen>
          <SheetContent data-testid="sheet-content">
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
            Content
          </SheetContent>
        </Sheet>
      );

      await waitFor(() => {
        const contentElement = screen.getByTestId("sheet-content");
        expect(contentElement).toHaveAttribute("data-state", "open");
      });
    });

    it("has proper aria attributes when closed", () => {
      const { container } = render(
        <Sheet open={false}>
          <SheetContent data-testid="sheet-content">
            <SheetTitle>Sheet Title</SheetTitle>
            <div>Description for accessibility</div>
            Content
          </SheetContent>
        </Sheet>
      );

      // Since the sheet is closed, the content should not be in the DOM
      // We'll check if it's not rendered when closed, which is expected
      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
    });
  });
});