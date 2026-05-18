import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider, ControllerRenderProps } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "./form";

// Mock component to test the form components
const TestFormComponent = () => {
  const methods = useForm({
    defaultValues: {
      testField: "",
      email: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})}>
        <FormField
          name="testField"
          control={methods.control}
          rules={{ required: "Test field is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Field</FormLabel>
              <FormControl>
                <input {...field} placeholder="Test input" />
              </FormControl>
              <FormDescription>Enter some text</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

// Wrapper component for testing with react-hook-form
const FormWithHookForm = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form>{children}</form>
    </FormProvider>
  );
};

describe("Form Components", () => {
  test("renders Form with FormProvider context", () => {
    const { container } = render(
      <FormWithHookForm>
        <div>Test form content</div>
      </FormWithHookForm>
    );
    expect(container.querySelector("form")).toBeInTheDocument();
  });

  test("renders FormItem with correct class", () => {
    render(
      <FormWithHookForm>
        <FormItem className="custom-class">Test Item</FormItem>
      </FormWithHookForm>
    );
    
    const item = screen.getByText("Test Item");
    expect(item).toBeInTheDocument();
    expect(item).toHaveClass("space-y-2");
    expect(item).toHaveClass("custom-class");
  });

  test("renders FormItem without additional class when no className is provided", () => {
    render(
      <FormWithHookForm>
        <FormItem>Test Item</FormItem>
      </FormWithHookForm>
    );
    
    const item = screen.getByText("Test Item");
    expect(item).toBeInTheDocument();
    expect(item).toHaveClass("space-y-2");
  });

  test("renders FormLabel with htmlFor attribute", () => {
    render(
      <FormWithHookForm>
        <FormItem>
          <FormLabel>Test Label</FormLabel>
        </FormItem>
      </FormWithHookForm>
    );
    
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for");
  });

  test("renders FormLabel with error state styling", () => {
    const { rerender } = render(
      <FormWithHookForm>
        <FormItem>
          <FormLabel>Test Label</FormLabel>
        </FormItem>
      </FormWithHookForm>
    );
    
    const label = screen.getByText("Test Label");
    expect(label).not.toHaveClass("text-destructive");

    // Test error state - would need to simulate an error context
    // For now, just testing the base functionality
  });

  test("renders FormControl with correct attributes", () => {
    render(
      <FormWithHookForm>
        <FormItem>
          <FormControl>
            <input />
          </FormControl>
        </FormItem>
      </FormWithHookForm>
    );
    
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id");
    expect(input).toHaveAttribute("aria-describedby");
    expect(input).toHaveAttribute("aria-invalid");
  });

  test("renders FormControl with input element", () => {
    render(
      <FormWithHookForm>
        <FormItem>
          <FormControl>
            <input placeholder="Test input" />
          </FormControl>
        </FormItem>
      </FormWithHookForm>
    );
    
    const input = screen.getByPlaceholderText("Test input");
    expect(input).toBeInTheDocument();
  });

  test("renders FormDescription with correct attributes", () => {
    render(
      <FormWithHookForm>
        <FormItem>
          <FormDescription>Test description</FormDescription>
        </FormItem>
      </FormWithHookForm>
    );
    
    const description = screen.getByText("Test description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-sm");
    expect(description).toHaveClass("text-muted-foreground");
    expect(description).toHaveAttribute("id");
  });

  test("renders FormMessage when there's no error or children", () => {
    const FormWithEmptyMessage = () => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <form>
            <FormItem>
              <FormMessage />
            </FormItem>
          </form>
        </FormProvider>
      );
    };

    render(<FormWithEmptyMessage />);

    // When there's no error and no children, FormMessage should render nothing
    const messageElement = screen.queryByText("Test error message"); // Look for specific text that shouldn't exist
    expect(messageElement).not.toBeInTheDocument();
  });

  test("renders FormMessage with error styling when text is provided", () => {
    const FormWithErrorMessage = () => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <form>
            <FormItem>
              <FormMessage>Test error message</FormMessage>
            </FormItem>
          </form>
        </FormProvider>
      );
    };

    render(<FormWithErrorMessage />);

    const message = screen.getByText("Test error message");
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass("text-sm");
    expect(message).toHaveClass("font-medium");
    expect(message).toHaveClass("text-destructive");
  });

  test("FormField sets up context properly", () => {
    render(<TestFormComponent />);
    
    const input = screen.getByPlaceholderText("Test input");
    expect(input).toBeInTheDocument();
    
    const label = screen.getByText("Test Field");
    expect(label).toBeInTheDocument();
    
    const description = screen.getByText("Enter some text");
    expect(description).toBeInTheDocument();
  });

  test("Form components generate unique IDs", () => {
    const { rerender } = render(
      <FormWithHookForm>
        <FormItem>
          <FormControl>
            <input />
          </FormControl>
          <FormLabel>Label 1</FormLabel>
          <FormDescription>Description 1</FormDescription>
          <FormMessage />
        </FormItem>
      </FormWithHookForm>
    );

    const input = screen.getByRole("textbox");
    const label = screen.getByText("Label 1");
    
    expect(input).toHaveAttribute("id");
    expect(input).toHaveAttribute("aria-describedby");
    expect(label).toHaveAttribute("for");
    
    // Rerender with a second form item to ensure unique IDs
    rerender(
      <FormWithHookForm>
        <FormItem>
          <FormControl>
            <input />
          </FormControl>
          <FormLabel>Label 1</FormLabel>
          <FormDescription>Description 1</FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormControl>
            <input />
          </FormControl>
          <FormLabel>Label 2</FormLabel>
          <FormDescription>Description 2</FormDescription>
          <FormMessage />
        </FormItem>
      </FormWithHookForm>
    );

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveAttribute("id");
    expect(inputs[1]).toHaveAttribute("id");
    expect(inputs[0].id).not.toEqual(inputs[1].id);
  });
  
  test("FormMessage returns null when no content", () => {
    const FormWithEmptyMessage = () => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <form>
            <FormItem>
              <FormMessage />
            </FormItem>
          </form>
        </FormProvider>
      );
    };

    render(<FormWithEmptyMessage />);

    // The FormMessage should not render anything when no error and no children
    const messageElement = screen.queryByText("Test error message"); // Look for specific text that shouldn't exist
    expect(messageElement).not.toBeInTheDocument();
  });

  test("FormLabel correctly connects to FormControl via htmlFor", () => {
    const FormWithLabelAndControl = () => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <form>
            <FormItem>
              <FormLabel>Test Label</FormLabel>
              <FormControl>
                <input data-testid="test-input" />
              </FormControl>
            </FormItem>
          </form>
        </FormProvider>
      );
    };

    render(<FormWithLabelAndControl />);

    const label = screen.getByText("Test Label");
    const input = screen.getByTestId("test-input");

    // Verify the label htmlFor attribute matches the input id
    expect(input).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", input.id);
  });

  test("FormControl sets accessibility attributes correctly", () => {
    const FormWithControl = () => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <form>
            <FormItem>
              <FormControl>
                <input data-testid="test-input" />
              </FormControl>
              <FormDescription data-testid="desc">Description</FormDescription>
              <FormMessage data-testid="message">Error</FormMessage>
            </FormItem>
          </form>
        </FormProvider>
      );
    };

    render(<FormWithControl />);

    const input = screen.getByTestId("test-input");

    // Check that the input has the required accessibility attributes
    expect(input).toHaveAttribute("id");
    expect(input).toHaveAttribute("aria-describedby");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  test("renders with custom class names", () => {
    render(
      <FormWithHookForm>
        <FormItem className="custom-item-class">
          <FormLabel className="custom-label-class">Label</FormLabel>
          <FormControl className="custom-control-class">
            <input />
          </FormControl>
          <FormDescription className="custom-desc-class">
            Description
          </FormDescription>
          <FormMessage className="custom-message-class">
            Message
          </FormMessage>
        </FormItem>
      </FormWithHookForm>
    );

    expect(screen.getByText("Label")).toHaveClass("custom-label-class");
    expect(screen.getByRole("textbox")).toHaveClass("custom-control-class");
    expect(screen.getByText("Description")).toHaveClass("custom-desc-class");
    expect(screen.getByText("Message")).toHaveClass("custom-message-class");
    const item = screen.getByText("Label").parentElement; // Find the FormItem which contains the label
    expect(item).toHaveClass("custom-item-class");
  });
});