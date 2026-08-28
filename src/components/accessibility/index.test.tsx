import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import { SkipLinks, FocusIndicator, LiveRegion, announce } from "./index";

describe("Accessibility Components", () => {
  describe("SkipLinks", () => {
    it("renders skip links correctly", () => {
      render(<SkipLinks />);

      const skipToMain = screen.getByRole("link", { name: /skip to main content/i });
      const skipToNav = screen.getByRole("link", { name: /skip to navigation/i });
      const skipToExamples = screen.getByRole("link", { name: /skip to examples/i });

      expect(skipToMain).toBeInTheDocument();
      expect(skipToNav).toBeInTheDocument();
      expect(skipToExamples).toBeInTheDocument();

      expect(skipToMain).toHaveAttribute("href", "#main-content");
      expect(skipToNav).toHaveAttribute("href", "#navigation");
      expect(skipToExamples).toHaveAttribute("href", "#examples");
    });

    it("applies className prop correctly", () => {
      render(<SkipLinks className="custom-class" />);

      const skipLinksContainer = screen.getByText(/Skip to main content/i).closest('div');
      expect(skipLinksContainer).toHaveClass("custom-class");
    });

    it("has proper screen reader only styling by default", () => {
      render(<SkipLinks />);

      const skipLinksContainer = screen.getByText(/Skip to main content/i).closest('div');
      expect(skipLinksContainer).toHaveClass("sr-only");
    });
  });

  describe("FocusIndicator", () => {
    it("renders with hidden element", () => {
      render(<FocusIndicator />);

      // Get all elements with role "generic" and find the one with sr-only class
      const elements = screen.getAllByRole("generic");
      const hiddenElement = Array.from(elements).find(el => el.classList.contains('sr-only'));

      expect(hiddenElement).toBeInTheDocument();
      expect(hiddenElement).toHaveClass("sr-only");
    });

    it("changes document body class on tab key press", () => {
      render(<FocusIndicator />);

      // Initially, document body should not have the class
      expect(document.body).not.toHaveClass("using-keyboard");

      // Simulate pressing the tab key
      fireEvent.keyDown(document, { key: "Tab" });

      // Document body should now have the class
      expect(document.body).toHaveClass("using-keyboard");
    });

    it("removes document body class on mouse down", () => {
      render(<FocusIndicator />);

      // Add the class by simulating tab key press
      fireEvent.keyDown(document, { key: "Tab" });
      expect(document.body).toHaveClass("using-keyboard");

      // Simulate mouse down event
      fireEvent.mouseDown(document);

      // Document body should not have the class anymore
      expect(document.body).not.toHaveClass("using-keyboard");
    });

    it("shows appropriate message when keyboard user", async () => {
      render(<FocusIndicator />);

      // Simulate keyboard user
      fireEvent.keyDown(document, { key: "Tab" });

      // Wait for state update - the text will appear briefly then disappear
      // So we verify it appears rather than immediately being absent
      await waitFor(() => {
        expect(screen.queryByText(/Keyboard navigation is active/i)).toBeInTheDocument();
      });
    });

    it("applies className prop correctly", () => {
      render(<FocusIndicator className="custom-class" />);

      // The FocusIndicator renders a div with sr-only class and the provided className
      const elements = screen.getAllByRole("generic");
      const elementWithCustomClass = Array.from(elements).find(el => el.classList.contains('custom-class'));
      expect(elementWithCustomClass).toBeTruthy();
      expect(elementWithCustomClass).toHaveClass("sr-only");
      expect(elementWithCustomClass).toHaveClass("custom-class");
    });
  });

  describe("LiveRegion", () => {
    it("renders live region elements", () => {
      render(<LiveRegion />);

      const politeRegion = screen.getByRole("status");
      const assertiveRegion = screen.getByRole("alert");

      expect(politeRegion).toBeInTheDocument();
      expect(assertiveRegion).toBeInTheDocument();

      expect(politeRegion).toHaveAttribute("aria-live", "polite");
      expect(assertiveRegion).toHaveAttribute("aria-live", "assertive");
    });

    it("applies className prop correctly", () => {
      render(<LiveRegion className="custom-class" />);

      // Get all role="generic" elements and find the one with our custom class
      const elements = screen.getAllByRole("generic");
      const elementWithCustomClass = Array.from(elements).find(el => el.classList.contains('custom-class'));
      expect(elementWithCustomClass).toBeTruthy();
      expect(elementWithCustomClass).toHaveClass("custom-class");
    });

    it("has proper screen reader only styling", () => {
      render(<LiveRegion />);

      // Get all role="generic" elements and find the one with sr-only class
      const elements = screen.getAllByRole("generic");
      const elementWithSrOnly = Array.from(elements).find(el => el.classList.contains('sr-only'));
      expect(elementWithSrOnly).toBeTruthy();
      expect(elementWithSrOnly).toHaveClass("sr-only");
    });
  });

  describe("announce function", () => {
    beforeEach(() => {
      render(<LiveRegion />);
    });

    it("can announce polite messages", async () => {
      await act(async () => {
        announce("Polite test message", "polite");
      });

      // Wait for the announcement to be processed
      await waitFor(() => {
        const politeRegion = screen.getByRole("status");
        expect(politeRegion).toHaveTextContent("Polite test message");
      });

      // Message should disappear after a short time
      await waitFor(() => {
        const politeRegion = screen.getByRole("status");
        expect(politeRegion).toHaveTextContent("");
      }, { timeout: 200 });
    });

    it("can announce assertive messages", async () => {
      await act(async () => {
        announce("Assertive test message", "assertive");
      });

      // Wait for the announcement to be processed
      await waitFor(() => {
        const assertiveRegion = screen.getByRole("alert");
        expect(assertiveRegion).toHaveTextContent("Assertive test message");
      });

      // Message should disappear after a short time
      await waitFor(() => {
        const assertiveRegion = screen.getByRole("alert");
        expect(assertiveRegion).toHaveTextContent("");
      }, { timeout: 200 });
    });

    it("defaults to polite priority", async () => {
      await act(async () => {
        announce("Default priority message");
      });

      // Wait for the announcement to be processed
      await waitFor(() => {
        const politeRegion = screen.getByRole("status");
        expect(politeRegion).toHaveTextContent("Default priority message");
      });

      // Should appear in polite region, not assertive
      const assertiveRegion = screen.getByRole("alert");
      expect(assertiveRegion).not.toHaveTextContent("Default priority message");
    });
  });
});