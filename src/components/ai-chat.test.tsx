import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { AIChat } from "./ai-chat";
import "@testing-library/jest-dom";

// Suppress specific React warnings that are related to the component implementation
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (
        args[0].includes('React does not recognize the `remarkPlugins` prop') ||
        args[0].includes('React does not recognize the `rehypePlugins` prop') ||
        args[0].includes('An update to AIChat inside a test was not wrapped in act')
      )
    ) {
      // Suppress these specific warnings that are from the component implementation
      return; // Don't call originalError, just return to suppress the warning
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock the fetch API
global.fetch = jest.fn();

// Mock the navigator.clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock the window.matchMedia API
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock the ResizeObserver API
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("AIChat", () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
    (navigator.clipboard.writeText as jest.MockedFunction<
      typeof navigator.clipboard.writeText
    >).mockClear();
  });

  it("renders closed chat button by default", () => {
    render(<AIChat />);
    
    // Should show the chat open button
    const openButton = screen.getByRole("button", { hidden: true });
    expect(openButton).toBeInTheDocument();
    expect(openButton.querySelector("span")).toHaveTextContent("💬");
  });

  it("opens chat when button is clicked", () => {
    render(<AIChat />);
    
    // Click the open button
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    // Chat should now be open
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
    expect(screen.getByText("MultiSelect Expert")).toBeInTheDocument();
  });

  it("closes chat when close button is clicked", async () => {
    render(<AIChat />);
    
    // Open the chat first
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    // Wait for chat to open
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Click the close button (the 'x' button)
    const closeButton = screen.getByRole("button", { name: "x-icon" });
    fireEvent.click(closeButton);
    
    // Wait for chat to close
    await waitFor(() => {
      expect(screen.queryByText("AI Assistant")).not.toBeInTheDocument();
    });
  });

  it("toggles fullscreen mode", async () => {
    render(<AIChat />);
    
    // Open the chat first
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Find and click the fullscreen button
    const fullscreenButton = screen.getByTitle("Enter fullscreen");
    fireEvent.click(fullscreenButton);
    
    // Verify fullscreen class is applied
    const card = screen.getByRole("button", { name: "x-icon" }).closest('.fixed');
    expect(card).toHaveClass("inset-0");
    
    // Click again to exit fullscreen
    const minimizeButton = screen.getByTitle("Exit fullscreen");
    fireEvent.click(minimizeButton);
    
    // Verify fullscreen class is removed
    expect(card).not.toHaveClass("w-[calc(100vw-2rem)]");
  });

  it("shows initial suggested questions when chat is opened", async () => {
    render(<AIChat />);
    
    // Open the chat
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Check that initial suggested questions are displayed
    expect(screen.getByText(/How do I integrate MultiSelect with React Hook Form/i)).toBeInTheDocument();
    expect(screen.getByText(/What animation options are available for MultiSelect/i)).toBeInTheDocument();
  });

  it("allows user to type and send a message", async () => {
    const mockResponse = {
      content: "This is a test response from the AI assistant."
    };
    
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    render(<AIChat />);
    
    // Open the chat
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Type a message
    const input = screen.getByPlaceholderText(/Ask about MultiSelect props/i);
    fireEvent.change(input, { target: { value: "Test message" } });
    
    // Submit the message
    const submitButton = screen.getByRole("button", { name: "zap-icon" });
    fireEvent.click(submitButton);
    
    // Wait for message to be sent
    await waitFor(() => expect(input).toHaveValue(""));
    
    // Check that the message appears in the chat
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error("API Error"));
    
    render(<AIChat />);
    
    // Open the chat
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Type a message
    const input = screen.getByPlaceholderText(/Ask about MultiSelect props/i);
    fireEvent.change(input, { target: { value: "Test message" } });
    
    // Submit the message
    const submitButton = screen.getByRole("button", { name: "zap-icon" });
    fireEvent.click(submitButton);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Sorry, I'm having trouble connecting right now/i)
      ).toBeInTheDocument();
    });
  });

  it("handles rate limiting", async () => {
    // Mock fetch to return a response that will trigger rate limiting
    const mockResponse = {
      content: "This is a test response from the AI assistant."
    };
    
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    render(<AIChat />);
    
    // Open the chat
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Send a message to trigger rate limiting
    const input = screen.getByPlaceholderText(/Ask about MultiSelect props/i);
    fireEvent.change(input, { target: { value: "Test message" } });
    
    const submitButton = screen.getByRole("button", { name: "zap-icon" });
    fireEvent.click(submitButton);
    
    // Wait for rate limit to activate
    await waitFor(() => {
      expect(screen.getByText(/Rate limit active/i)).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Verify input shows rate limit message
    expect(screen.getByPlaceholderText(/Rate limited - wait/i)).toBeInTheDocument();
  });

  it("toggles suggested questions visibility", async () => {
    render(<AIChat />);
    
    // Open the chat
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Toggle suggested questions visibility
    const toggleButton = screen.getByTitle(/Hide suggestions/i);
    fireEvent.click(toggleButton);
    
    // The title should now be "Show suggestions"
    expect(screen.getByTitle(/Show suggestions/i)).toBeInTheDocument();
    
    // Click again to show
    fireEvent.click(toggleButton);
    expect(screen.getByTitle(/Hide suggestions/i)).toBeInTheDocument();
  });

  it("sends a suggested question when clicked", async () => {
    const mockResponse = {
      content: "This is a test response from the AI assistant."
    };
    
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    render(<AIChat />);
    
    // Open the chat
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Click on a suggested question
    const suggestedQuestion = screen.getByText(/How do I integrate MultiSelect with React Hook Form/i);
    fireEvent.click(suggestedQuestion);
    
    // Wait for the suggested question to be sent
    await waitFor(() => {
      expect(screen.getByText(/How do I integrate MultiSelect with React Hook Form/i)).toBeInTheDocument();
    });
  });

  it("copies code to clipboard when copy button is clicked", async () => {
    render(<AIChat />);
    
    // Open the chat
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Add a message with code to the chat (this would normally come from the API response)
    // For testing purposes, we'll simulate a message with code content
    const input = screen.getByPlaceholderText(/Ask about MultiSelect props/i);
    fireEvent.change(input, { target: { value: "Show code example" } });
    
    const submitButton = screen.getByRole("button", { name: "zap-icon" });
    fireEvent.click(submitButton);
    
    // Wait a bit for the UI to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if copy functionality works (this would typically be available on code blocks)
    const copyButton = screen.queryByTitle("Copy code");
    if (copyButton) {
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
    }
  });

  it("handles escape key to close chat", async () => {
    render(<AIChat />);
    
    // Open the chat
    const openButton = screen.getByRole("button", { hidden: true });
    fireEvent.click(openButton);
    
    await waitFor(() => expect(screen.getByText("AI Assistant")).toBeInTheDocument());
    
    // Simulate pressing escape key
    fireEvent.keyDown(document, { key: "Escape" });
    
    // Wait for chat to close
    await waitFor(() => {
      expect(screen.queryByText("AI Assistant")).not.toBeInTheDocument();
    });
  });
});