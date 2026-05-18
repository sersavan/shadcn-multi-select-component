import React from "react";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";

describe("Card Components", () => {
  describe("Card", () => {
    it("should render correctly", () => {
      render(<Card>Card content</Card>);
      
      const cardElement = screen.getByText("Card content");
      expect(cardElement).toBeInTheDocument();
      expect(cardElement.tagName).toBe("DIV");
      expect(cardElement).toHaveClass("rounded-lg", "border", "bg-card", "text-card-foreground", "shadow-sm");
    });

    it("should apply custom className", () => {
      render(<Card className="custom-class">Card content</Card>);
      
      const cardElement = screen.getByText("Card content");
      expect(cardElement).toHaveClass("custom-class");
    });

    it("should accept and pass additional props", () => {
      render(
        <Card data-testid="test-card" id="my-card">
          Card content
        </Card>
      );
      
      const cardElement = screen.getByTestId("test-card");
      expect(cardElement).toBeInTheDocument();
      expect(cardElement.id).toBe("my-card");
    });
  });

  describe("CardHeader", () => {
    it("should render correctly", () => {
      render(<CardHeader>Header content</CardHeader>);
      
      const headerElement = screen.getByText("Header content");
      expect(headerElement).toBeInTheDocument();
      expect(headerElement.tagName).toBe("DIV");
      expect(headerElement).toHaveClass("flex", "flex-col", "space-y-1.5", "p-6");
    });

    it("should apply custom className", () => {
      render(<CardHeader className="custom-header">Header content</CardHeader>);
      
      const headerElement = screen.getByText("Header content");
      expect(headerElement).toHaveClass("custom-header");
    });

    it("should accept and pass additional props", () => {
      render(
        <CardHeader data-testid="test-header" id="my-header">
          Header content
        </CardHeader>
      );
      
      const headerElement = screen.getByTestId("test-header");
      expect(headerElement).toBeInTheDocument();
      expect(headerElement.id).toBe("my-header");
    });
  });

  describe("CardTitle", () => {
    it("should render correctly", () => {
      render(<CardTitle>Title content</CardTitle>);
      
      const titleElement = screen.getByText("Title content");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.tagName).toBe("DIV");
      expect(titleElement).toHaveClass("text-2xl", "font-semibold", "leading-none", "tracking-tight");
    });

    it("should apply custom className", () => {
      render(<CardTitle className="custom-title">Title content</CardTitle>);
      
      const titleElement = screen.getByText("Title content");
      expect(titleElement).toHaveClass("custom-title");
    });

    it("should accept and pass additional props", () => {
      render(
        <CardTitle data-testid="test-title" id="my-title">
          Title content
        </CardTitle>
      );
      
      const titleElement = screen.getByTestId("test-title");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.id).toBe("my-title");
    });
  });

  describe("CardDescription", () => {
    it("should render correctly", () => {
      render(<CardDescription>Description content</CardDescription>);
      
      const descriptionElement = screen.getByText("Description content");
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement.tagName).toBe("DIV");
      expect(descriptionElement).toHaveClass("text-sm", "text-muted-foreground");
    });

    it("should apply custom className", () => {
      render(<CardDescription className="custom-desc">Description content</CardDescription>);
      
      const descriptionElement = screen.getByText("Description content");
      expect(descriptionElement).toHaveClass("custom-desc");
    });

    it("should accept and pass additional props", () => {
      render(
        <CardDescription data-testid="test-description" id="my-description">
          Description content
        </CardDescription>
      );
      
      const descriptionElement = screen.getByTestId("test-description");
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement.id).toBe("my-description");
    });
  });

  describe("CardContent", () => {
    it("should render correctly", () => {
      render(<CardContent>Content here</CardContent>);
      
      const contentElement = screen.getByText("Content here");
      expect(contentElement).toBeInTheDocument();
      expect(contentElement.tagName).toBe("DIV");
      expect(contentElement).toHaveClass("p-6", "pt-0");
    });

    it("should apply custom className", () => {
      render(<CardContent className="custom-content">Content here</CardContent>);
      
      const contentElement = screen.getByText("Content here");
      expect(contentElement).toHaveClass("custom-content");
    });

    it("should accept and pass additional props", () => {
      render(
        <CardContent data-testid="test-content" id="my-content">
          Content here
        </CardContent>
      );
      
      const contentElement = screen.getByTestId("test-content");
      expect(contentElement).toBeInTheDocument();
      expect(contentElement.id).toBe("my-content");
    });
  });

  describe("CardFooter", () => {
    it("should render correctly", () => {
      render(<CardFooter>Footer content</CardFooter>);
      
      const footerElement = screen.getByText("Footer content");
      expect(footerElement).toBeInTheDocument();
      expect(footerElement.tagName).toBe("DIV");
      expect(footerElement).toHaveClass("flex", "items-center", "p-6", "pt-0");
    });

    it("should apply custom className", () => {
      render(<CardFooter className="custom-footer">Footer content</CardFooter>);
      
      const footerElement = screen.getByText("Footer content");
      expect(footerElement).toHaveClass("custom-footer");
    });

    it("should accept and pass additional props", () => {
      render(
        <CardFooter data-testid="test-footer" id="my-footer">
          Footer content
        </CardFooter>
      );
      
      const footerElement = screen.getByTestId("test-footer");
      expect(footerElement).toBeInTheDocument();
      expect(footerElement.id).toBe("my-footer");
    });
  });

  describe("Integration", () => {
    it("should render a complete card with all subcomponents", () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            Card Content
          </CardContent>
          <CardFooter>
            <div>Card Footer</div>
          </CardFooter>
        </Card>
      );

      const card = screen.getByTestId("complete-card");
      expect(card).toBeInTheDocument();
      
      const title = screen.getByText("Card Title");
      expect(title).toBeInTheDocument();
      
      const description = screen.getByText("Card Description");
      expect(description).toBeInTheDocument();
      
      const content = screen.getByText("Card Content");
      expect(content).toBeInTheDocument();
      
      const footer = screen.getByText("Card Footer");
      expect(footer).toBeInTheDocument();
    });
  });
});