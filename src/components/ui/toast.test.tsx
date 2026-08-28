import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction } from "./toast";

describe("Toast Component", () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
  });

  it("renders ToastProvider without crashing", () => {
    render(
      <ToastProvider>
        <div>Test Content</div>
      </ToastProvider>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders Toast with default props", () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Title</ToastTitle>
          <ToastDescription>Description</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("applies default variant class correctly", () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Title</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const toast = screen.getByText("Title").closest('[data-state]');
    expect(toast).toHaveClass("border");
    expect(toast).toHaveClass("bg-background");
    expect(toast).toHaveClass("text-foreground");
  });

  it("applies destructive variant class correctly", () => {
    render(
      <ToastProvider>
        <Toast variant="destructive">
          <ToastTitle>Error</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const toast = screen.getByText("Error").closest('[data-state]');
    expect(toast).toHaveClass("destructive");
    expect(toast).toHaveClass("group");
    expect(toast).toHaveClass("border-destructive");
    expect(toast).toHaveClass("bg-destructive");
    expect(toast).toHaveClass("text-destructive-foreground");
  });

  it("renders ToastViewport with correct classes", () => {
    render(
      <ToastProvider>
        <ToastViewport data-testid="toast-viewport" />
      </ToastProvider>
    );

    const viewport = screen.getByTestId("toast-viewport");
    expect(viewport).toHaveClass("fixed");
    expect(viewport).toHaveClass("top-0");
    expect(viewport).toHaveClass("z-[100]");
    expect(viewport).toHaveClass("flex");
    expect(viewport).toHaveClass("max-h-screen");
    expect(viewport).toHaveClass("w-full");
    expect(viewport).toHaveClass("flex-col-reverse");
    expect(viewport).toHaveClass("p-4");
  });

  it("renders ToastTitle with correct classes", () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Title</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const title = screen.getByText("Title");
    expect(title).toHaveClass("text-sm");
    expect(title).toHaveClass("font-semibold");
  });

  it("renders ToastDescription with correct classes", () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastDescription>Description</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const description = screen.getByText("Description");
    expect(description).toHaveClass("text-sm");
    expect(description).toHaveClass("opacity-90");
  });

  it("renders ToastClose button with X icon", () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastClose />
          <ToastTitle>Title</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const closeBtn = screen.getByRole("button");
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn).toHaveAttribute("toast-close", "");
    
    const xIcon = closeBtn.querySelector("svg");
    expect(xIcon).toBeInTheDocument();
  });

  it("calls onOpenChange when ToastClose is clicked", () => {
    render(
      <ToastProvider>
        <Toast onOpenChange={mockOnOpenChange}>
          <ToastClose data-testid="close-btn" />
          <ToastTitle>Title</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const closeBtn = screen.getByTestId("close-btn");
    fireEvent.click(closeBtn);
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders ToastAction with correct classes", () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Title</ToastTitle>
          <ToastAction altText="Action">Action</ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const actionBtn = screen.getByText("Action");
    expect(actionBtn).toBeInTheDocument();
    expect(actionBtn).toHaveClass("inline-flex");
    expect(actionBtn).toHaveClass("h-8");
    expect(actionBtn).toHaveClass("shrink-0");
  });

  it("applies custom className to Toast", () => {
    const customClass = "my-custom-class";
    render(
      <ToastProvider>
        <Toast className={customClass}>
          <ToastTitle>Title</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const toast = screen.getByText("Title").closest('[data-state]');
    expect(toast).toHaveClass(customClass);
  });

  it("applies custom className to ToastTitle", () => {
    const customClass = "custom-title-class";
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle className={customClass}>Title</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const title = screen.getByText("Title");
    expect(title).toHaveClass(customClass);
  });

  it("applies custom className to ToastDescription", () => {
    const customClass = "custom-desc-class";
    render(
      <ToastProvider>
        <Toast>
          <ToastDescription className={customClass}>Description</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const description = screen.getByText("Description");
    expect(description).toHaveClass(customClass);
  });

  it("applies custom className to ToastAction", () => {
    const customClass = "custom-action-class";
    render(
      <ToastProvider>
        <Toast>
          <ToastAction className={customClass} altText="Action">
            Action
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const action = screen.getByText("Action");
    expect(action).toHaveClass(customClass);
  });

  it("applies custom className to ToastClose", () => {
    const customClass = "custom-close-class";
    render(
      <ToastProvider>
        <Toast>
          <ToastClose className={customClass} />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const closeBtn = screen.getByRole("button");
    expect(closeBtn).toHaveClass(customClass);
  });

  it("applies custom className to ToastViewport", () => {
    const customClass = "custom-viewport-class";
    render(
      <ToastProvider>
        <ToastViewport className={customClass} data-testid="toast-viewport" />
      </ToastProvider>
    );

    const viewport = screen.getByTestId("toast-viewport");
    expect(viewport).toHaveClass(customClass);
  });
});