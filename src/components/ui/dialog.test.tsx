import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogPortal, DialogOverlay } from "./dialog";

// Mock the Radix UI components since they're external dependencies
jest.mock("@radix-ui/react-dialog", () => {
  const RadixDialog = jest.requireActual("@radix-ui/react-dialog");
  
  return {
    ...RadixDialog,
    Root: ({ children, ...props }: any) => <RadixDialog.Root data-testid="dialog-root" {...props}>{children}</RadixDialog.Root>,
    Trigger: ({ children, ...props }: any) => <RadixDialog.Trigger data-testid="dialog-trigger" {...props}>{children}</RadixDialog.Trigger>,
    Portal: ({ children, ...props }: any) => <RadixDialog.Portal {...props}>{children}</RadixDialog.Portal>,
    Overlay: ({ children, ...props }: any) => <RadixDialog.Overlay data-testid="dialog-overlay" {...props}>{children}</RadixDialog.Overlay>,
    Content: ({ children, ...props }: any) => <RadixDialog.Content data-testid="dialog-content" {...props}>{children}</RadixDialog.Content>,
    Title: ({ children, ...props }: any) => <RadixDialog.Title data-testid="dialog-title" {...props}>{children}</RadixDialog.Title>,
    Description: ({ children, ...props }: any) => <RadixDialog.Description data-testid="dialog-description" {...props}>{children}</RadixDialog.Description>,
    Close: ({ children, ...props }: any) => <RadixDialog.Close data-testid="dialog-close" {...props}>{children}</RadixDialog.Close>,
  };
});

// Mock the lucide-react icon
jest.mock("lucide-react", () => ({
  X: ({ className }: { className?: string }) => (
    <svg data-testid="x-icon" className={className}>
      X Icon
    </svg>
  ),
}));

// Mock cn function
jest.mock("@/lib/utils", () => ({
  cn: (...inputs: unknown[]) => inputs.filter(Boolean).join(" ").trim(),
}));

describe("Dialog Component", () => {
  const mockOpenChange = jest.fn();

  beforeEach(() => {
    mockOpenChange.mockClear();
  });

  describe("Dialog", () => {
    it("renders children correctly", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog Content
          </DialogContent>
        </Dialog>
      );

      // Since DialogRoot is the wrapper, we can verify the dialog is rendered by checking for its children
      expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
      expect(screen.getByText("Open Dialog")).toBeInTheDocument();
      // The dialog content should also be rendered
      expect(screen.getByText("Dialog Content")).toBeInTheDocument();
    });
  });

  describe("DialogTrigger", () => {
    it("renders children correctly", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogTrigger>Trigger Button</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Content
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
      expect(screen.getByText("Trigger Button")).toBeInTheDocument();
    });
  });

  describe("DialogPortal", () => {
    it("renders children correctly", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Portal Content
          </DialogContent>
        </Dialog>
      );

      // DialogPortal doesn't have a specific testId in our mock setup, so we'll check for the content
      expect(screen.getByText("Portal Content")).toBeInTheDocument();
      // The overlay should also be rendered by the portal
      expect(screen.getByTestId("dialog-overlay")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    });
  });

  describe("DialogOverlay", () => {
    it("renders with default class names", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog Content
          </DialogContent>
        </Dialog>
      );

      const overlayElement = screen.getByTestId("dialog-overlay");
      expect(overlayElement).toBeInTheDocument();
      expect(overlayElement).toHaveClass("fixed");
      expect(overlayElement).toHaveClass("inset-0");
      expect(overlayElement).toHaveClass("z-50");
      expect(overlayElement).toHaveClass("bg-black/80");
    });

    it("applies custom class names when provided", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogOverlay className="custom-overlay" />
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog Content
          </DialogContent>
        </Dialog>
      );

      // Get the first overlay which should have the custom class
      const overlayElements = screen.getAllByTestId("dialog-overlay");
      const overlayWithCustomClass = overlayElements.find(el => el.classList.contains("custom-overlay"));
      expect(overlayWithCustomClass).toBeInTheDocument();
      expect(overlayWithCustomClass).toHaveClass("custom-overlay");
    });
  });

  describe("DialogContent", () => {
    it("renders content and close button", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog Content
          </DialogContent>
        </Dialog>
      );

      // DialogPortal is rendered internally, so we directly check for the overlay and content
      expect(screen.getByTestId("dialog-overlay")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
      expect(screen.getByText("Dialog Content")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-close")).toBeInTheDocument();
    });

    it("renders with default class names", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog Content
          </DialogContent>
        </Dialog>
      );

      const contentElement = screen.getByTestId("dialog-content");
      expect(contentElement).toHaveClass("fixed");
      expect(contentElement).toHaveClass("left-[50%]");
      expect(contentElement).toHaveClass("top-[50%]");
      expect(contentElement).toHaveClass("z-50");
      expect(contentElement).toHaveClass("grid");
      expect(contentElement).toHaveClass("w-full");
      expect(contentElement).toHaveClass("max-w-lg");
      expect(contentElement).toHaveClass("translate-x-[-50%]");
      expect(contentElement).toHaveClass("translate-y-[-50%]");
      expect(contentElement).toHaveClass("gap-4");
      expect(contentElement).toHaveClass("border");
      expect(contentElement).toHaveClass("bg-background");
      expect(contentElement).toHaveClass("p-6");
      expect(contentElement).toHaveClass("shadow-lg");
      expect(contentElement).toHaveClass("duration-200");
    });

    it("applies custom class names when provided", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent className="custom-content">
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog Content
          </DialogContent>
        </Dialog>
      );

      const contentElement = screen.getByTestId("dialog-content");
      expect(contentElement).toHaveClass("custom-content");
    });

    it("renders the close button with X icon", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog Content
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByTestId("dialog-close");
      expect(closeButton).toBeInTheDocument();
      expect(screen.getByTestId("x-icon")).toBeInTheDocument();
      expect(screen.getByText("X Icon")).toBeInTheDocument();

      // Check if the X icon has correct size classes
      const xIcon = screen.getByTestId("x-icon");
      expect(xIcon).toHaveClass("h-4");
      expect(xIcon).toHaveClass("w-4");
    });

    it("renders close button with correct accessibility attributes", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog Content
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByTestId("dialog-close");
      expect(closeButton).toHaveClass("absolute");
      expect(closeButton).toHaveClass("right-4");
      expect(closeButton).toHaveClass("top-4");
      expect(closeButton).toHaveClass("rounded-sm");
      expect(closeButton).toHaveClass("opacity-70");
      expect(closeButton).toHaveClass("ring-offset-background");
      expect(closeButton).toHaveClass("transition-opacity");
      expect(closeButton).toHaveClass("hover:opacity-100");
      expect(closeButton).toHaveClass("focus:outline-none");
      expect(closeButton).toHaveClass("focus:ring-2");
      expect(closeButton).toHaveClass("focus:ring-ring");
      expect(closeButton).toHaveClass("focus:ring-offset-2");
      expect(closeButton).toHaveClass("disabled:pointer-events-none");

      // Check for screen reader text
      expect(screen.getByText("Close")).toBeInTheDocument();
      const srOnlyText = screen.getByText("Close");
      expect(srOnlyText).toHaveClass("sr-only");
    });
  });

  describe("DialogHeader", () => {
    it("renders children correctly", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            <DialogHeader>Header Content</DialogHeader>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("renders with default class names", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            <DialogHeader>Header Content</DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const headerElement = screen.getByText("Header Content").closest('div');
      expect(headerElement).toHaveClass("flex");
      expect(headerElement).toHaveClass("flex-col");
      expect(headerElement).toHaveClass("space-y-1.5");
      expect(headerElement).toHaveClass("text-center");
      expect(headerElement).toHaveClass("sm:text-left");
    });

    it("applies custom class names when provided", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            <DialogHeader className="custom-header">Header Content</DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const headerElement = screen.getByText("Header Content").closest('div');
      expect(headerElement).toHaveClass("custom-header");
    });
  });

  describe("DialogFooter", () => {
    it("renders children correctly", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            <DialogFooter>Footer Content</DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });

    it("renders with default class names", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            <DialogFooter>Footer Content</DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const footerElement = screen.getByText("Footer Content").closest('div');
      expect(footerElement).toHaveClass("flex");
      expect(footerElement).toHaveClass("flex-col-reverse");
      expect(footerElement).toHaveClass("sm:flex-row");
      expect(footerElement).toHaveClass("sm:justify-end");
      expect(footerElement).toHaveClass("sm:space-x-2");
    });

    it("applies custom class names when provided", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            <DialogFooter className="custom-footer">Footer Content</DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const footerElement = screen.getByText("Footer Content").closest('div');
      expect(footerElement).toHaveClass("custom-footer");
    });
  });

  describe("DialogTitle", () => {
    it("renders children correctly", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Title Content</DialogTitle>
            <DialogDescription>Description Content</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      // Use the testId if available, otherwise find by text
      expect(screen.getByTestId("dialog-title")).toBeInTheDocument();
      expect(screen.getByText("Title Content")).toBeInTheDocument();
    });

    it("renders with default class names", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Title Content</DialogTitle>
            <DialogDescription>Description Content</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const titleElement = screen.getByTestId("dialog-title");
      expect(titleElement).toHaveClass("text-lg");
      expect(titleElement).toHaveClass("font-semibold");
      expect(titleElement).toHaveClass("leading-none");
      expect(titleElement).toHaveClass("tracking-tight");
    });

    it("applies custom class names when provided", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle className="custom-title">Title Content</DialogTitle>
            <DialogDescription>Description Content</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const titleElement = screen.getByTestId("dialog-title");
      expect(titleElement).toHaveClass("custom-title");
    });
  });

  describe("DialogDescription", () => {
    it("renders children correctly", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Description Content</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("dialog-description")).toBeInTheDocument();
      expect(screen.getByText("Description Content")).toBeInTheDocument();
    });

    it("renders with default class names", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Description Content</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const descriptionElement = screen.getByTestId("dialog-description");
      expect(descriptionElement).toHaveClass("text-sm");
      expect(descriptionElement).toHaveClass("text-muted-foreground");
    });

    it("applies custom class names when provided", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription className="custom-description">Description Content</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const descriptionElement = screen.getByTestId("dialog-description");
      expect(descriptionElement).toHaveClass("custom-description");
    });
  });

  describe("DialogClose", () => {
    it("renders children correctly", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            <div>Other Content</div>
            <DialogClose data-testid="custom-dialog-close">Close Button</DialogClose>
          </DialogContent>
        </Dialog>
      );

      // Find the specific custom close button by the added test ID
      const customCloseButton = screen.getByTestId("custom-dialog-close");
      expect(customCloseButton).toBeInTheDocument();
      expect(customCloseButton).toHaveTextContent("Close Button");
    });
  });

  describe("Integration", () => {
    it("renders a complete dialog with all parts", () => {
      render(
        <Dialog open onOpenChange={mockOpenChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            <DialogHeader>
              <DialogTitle>Header Title</DialogTitle>
              <DialogDescription>Header Description</DialogDescription>
            </DialogHeader>
            <div>Dialog Body Content</div>
            <DialogFooter>
              <button>Action Button</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Open Dialog")).toBeInTheDocument();
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      expect(screen.getByText("Header Title")).toBeInTheDocument();
      expect(screen.getByText("Dialog Description")).toBeInTheDocument();
      expect(screen.getByText("Header Description")).toBeInTheDocument();
      expect(screen.getByText("Dialog Body Content")).toBeInTheDocument();
      expect(screen.getByText("Action Button")).toBeInTheDocument();
    });
  });
});