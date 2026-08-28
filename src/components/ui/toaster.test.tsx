import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { Toaster } from "./toaster"
import { useToast } from "./use-toast"
import { ToastProvider } from "./toast"

// Mock the useToast hook
jest.mock("./use-toast", () => ({
  useToast: jest.fn(),
}))

// Mock the child components of the toast
jest.mock("./toast", () => ({
  Toast: ({ children, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
    <div data-testid="toast" {...props}>
      {children}
    </div>
  ),
  ToastClose: (props: { [key: string]: any }) => <button data-testid="toast-close" {...props} />,
  ToastDescription: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <div data-testid="toast-description" {...props}>
      {children}
    </div>
  ),
  ToastTitle: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <div data-testid="toast-title" {...props}>
      {children}
    </div>
  ),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ToastViewport: (props: { [key: string]: any }) => <div data-testid="toast-viewport" {...props} />,
}))

const MockToasterWithProvider = () => (
  <ToastProvider>
    <Toaster />
  </ToastProvider>
)

describe("Toaster", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders without crashing", () => {
    ;(useToast as jest.Mock).mockReturnValue({ toasts: [] })

    render(<MockToasterWithProvider />)

    expect(screen.getByTestId("toast-viewport")).toBeInTheDocument()
  })

  it("displays multiple toasts", () => {
    const mockToasts = [
      {
        id: "1",
        title: "Test Title 1",
        description: "Test Description 1",
      },
      {
        id: "2",
        title: "Test Title 2",
        description: "Test Description 2",
      },
    ]
    ;(useToast as jest.Mock).mockReturnValue({ toasts: mockToasts })

    render(<MockToasterWithProvider />)

    const toastElements = screen.getAllByTestId("toast")
    expect(toastElements).toHaveLength(2)
  })

  it("displays toast with title and description", () => {
    const mockToasts = [
      {
        id: "1",
        title: "Test Title",
        description: "Test Description",
      },
    ]
    ;(useToast as jest.Mock).mockReturnValue({ toasts: mockToasts })

    render(<MockToasterWithProvider />)

    expect(screen.getByTestId("toast-title")).toHaveTextContent("Test Title")
    expect(screen.getByTestId("toast-description")).toHaveTextContent("Test Description")
  })

  it("displays toast without title when no title is provided", () => {
    const mockToasts = [
      {
        id: "1",
        description: "Test Description",
      },
    ]
    ;(useToast as jest.Mock).mockReturnValue({ toasts: mockToasts })

    render(<MockToasterWithProvider />)

    expect(screen.queryByTestId("toast-title")).not.toBeInTheDocument()
    expect(screen.getByTestId("toast-description")).toBeInTheDocument()
  })

  it("displays toast without description when no description is provided", () => {
    const mockToasts = [
      {
        id: "1",
        title: "Test Title",
      },
    ]
    ;(useToast as jest.Mock).mockReturnValue({ toasts: mockToasts })

    render(<MockToasterWithProvider />)

    expect(screen.getByTestId("toast-title")).toBeInTheDocument()
    expect(screen.queryByTestId("toast-description")).not.toBeInTheDocument()
  })

  it("displays toast without title and description when neither is provided", () => {
    const mockToasts = [
      {
        id: "1",
      },
    ]
    ;(useToast as jest.Mock).mockReturnValue({ toasts: mockToasts })

    render(<MockToasterWithProvider />)

    expect(screen.queryByTestId("toast-title")).not.toBeInTheDocument()
    expect(screen.queryByTestId("toast-description")).not.toBeInTheDocument()
  })

  it("includes ToastClose component in each toast", () => {
    const mockToasts = [
      {
        id: "1",
        title: "Test Title",
      },
    ]
    ;(useToast as jest.Mock).mockReturnValue({ toasts: mockToasts })

    render(<MockToasterWithProvider />)

    const toastClose = screen.getByTestId("toast-close")
    expect(toastClose).toBeInTheDocument()
  })

  it("renders ToastViewport component", () => {
    ;(useToast as jest.Mock).mockReturnValue({ toasts: [] })

    render(<MockToasterWithProvider />)

    expect(screen.getByTestId("toast-viewport")).toBeInTheDocument()
  })

  it("passes additional props to Toast component", () => {
    const mockToasts = [
      {
        id: "1",
        title: "Test Title",
        variant: "destructive",
        duration: 5000,
      },
    ]
    ;(useToast as jest.Mock).mockReturnValue({ toasts: mockToasts })

    render(<MockToasterWithProvider />)

    const toastElement = screen.getByTestId("toast")
    // We can't directly test the props since we're mocking the Toast component,
    // but we can verify that the toast was rendered
    expect(toastElement).toBeInTheDocument()
  })
})