import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Button, ButtonProps } from "./button"

describe("Button", () => {
  const defaultProps: ButtonProps = {
    children: "Test Button",
  }

  it("renders correctly with default props", () => {
    render(<Button {...defaultProps} />)
    const button = screen.getByRole("button", { name: /test button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-primary")
    expect(button).toHaveClass("text-primary-foreground")
    expect(button).toHaveClass("h-10")
    expect(button).toHaveClass("px-4")
    expect(button).toHaveClass("py-2")
  })

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="default" {...defaultProps} />)
    const button = screen.getByRole("button", { name: /test button/i })
    expect(button).toHaveClass("bg-primary")

    rerender(<Button variant="destructive" {...defaultProps} />)
    expect(button).toHaveClass("bg-destructive")

    rerender(<Button variant="outline" {...defaultProps} />)
    expect(button).toHaveClass("border")
    expect(button).toHaveClass("border-input")

    rerender(<Button variant="secondary" {...defaultProps} />)
    expect(button).toHaveClass("bg-secondary")

    rerender(<Button variant="ghost" {...defaultProps} />)
    expect(button).toHaveClass("hover:bg-accent")

    rerender(<Button variant="link" {...defaultProps} />)
    expect(button).toHaveClass("text-primary")
    expect(button).toHaveClass("underline-offset-4")
  })

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="default" {...defaultProps} />)
    const button = screen.getByRole("button", { name: /test button/i })
    expect(button).toHaveClass("h-10")
    expect(button).toHaveClass("px-4")
    expect(button).toHaveClass("py-2")

    rerender(<Button size="sm" {...defaultProps} />)
    expect(button).toHaveClass("h-9")
    expect(button).toHaveClass("rounded-md")
    expect(button).toHaveClass("px-3")

    rerender(<Button size="lg" {...defaultProps} />)
    expect(button).toHaveClass("h-11")
    expect(button).toHaveClass("rounded-md")
    expect(button).toHaveClass("px-8")

    rerender(<Button size="icon" {...defaultProps} />)
    expect(button).toHaveClass("h-10")
    expect(button).toHaveClass("w-10")
  })

  it("applies custom className", () => {
    render(<Button {...defaultProps} className="custom-class" />)
    const button = screen.getByRole("button", { name: /test button/i })
    expect(button).toHaveClass("custom-class")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button {...defaultProps} ref={ref} />)
    
    expect(ref.current).toBeInTheDocument()
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("handles click events", () => {
    const onClickMock = jest.fn()
    render(<Button {...defaultProps} onClick={onClickMock} />)
    const button = screen.getByRole("button", { name: /test button/i })
    
    fireEvent.click(button)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button {...defaultProps} disabled={true} />)
    const button = screen.getByRole("button", { name: /test button/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass("disabled:pointer-events-none")
    expect(button).toHaveClass("disabled:opacity-50")
  })

  it("uses asChild prop correctly with Slot", () => {
    // This test checks that when asChild is true, the button renders as the child component
    const { container } = render(
      <Button asChild={true}>
        <a href="/test">Test Link</a>
      </Button>
    )
    
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
    expect(link).toHaveTextContent("Test Link")
  })

  it("has proper accessibility attributes", () => {
    render(<Button {...defaultProps} />)
    const button = screen.getByRole("button", { name: /test button/i })
    expect(button).toBeInTheDocument()
    // Button has no explicit type attribute by default, which means it defaults to "submit" in forms
    // but functions as expected in most contexts
    expect(button).not.toHaveAttribute("type", "button") // No explicit type set
  })

  it("allows overriding type attribute", () => {
    render(<Button {...defaultProps} type="submit" />)
    const button = screen.getByRole("button", { name: /test button/i })
    expect(button).toHaveAttribute("type", "submit")
  })
})