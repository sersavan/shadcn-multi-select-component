import React from "react";
import { render, screen, act } from "@testing-library/react";
import { ColorModeProvider, useColorMode } from "./color-mode-context";

// Test component to access the context values
const TestComponent = () => {
	const { isGrayMode, setIsGrayMode, toggleGrayMode } = useColorMode();
	return (
		<div>
			<span data-testid="gray-mode-status">{isGrayMode.toString()}</span>
			<button data-testid="set-gray-mode-btn" onClick={() => setIsGrayMode(true)}>
				Set Gray Mode
			</button>
			<button data-testid="set-normal-mode-btn" onClick={() => setIsGrayMode(false)}>
				Set Normal Mode
			</button>
			<button data-testid="toggle-gray-mode-btn" onClick={toggleGrayMode}>
				Toggle Gray Mode
			</button>
		</div>
	);
};

// Component to test error when hook is used outside provider
const TestHookOutsideProvider = () => {
	const context = useColorMode(); // This should throw an error
	return <div>{context.isGrayMode.toString()}</div>;
};

describe("ColorModeContext", () => {
	// Test 1: Provider functionality
	it("should provide context value to child components", () => {
		render(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		// Check if the component renders without error
		expect(screen.getByTestId("gray-mode-status")).toBeInTheDocument();
	});

	// Test 2: Initial state
	it("should initialize with isGrayMode as true", () => {
		render(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		// Check if initial value is true
		expect(screen.getByTestId("gray-mode-status")).toHaveTextContent("true");
	});

	// Test 3: setIsGrayMode function
	it("should update isGrayMode to true when setIsGrayMode(true) is called", () => {
		render(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		const grayModeBtn = screen.getByTestId("set-gray-mode-btn");
		const statusElement = screen.getByTestId("gray-mode-status");

		// Initially should be true, let's set it to false first
		const normalModeBtn = screen.getByTestId("set-normal-mode-btn");
		act(() => {
			normalModeBtn.click();
		});
		expect(statusElement).toHaveTextContent("false");

		// Now set it back to true
		act(() => {
			grayModeBtn.click();
		});
		expect(statusElement).toHaveTextContent("true");
	});

	// Test 4: setIsGrayMode function to set false
	it("should update isGrayMode to false when setIsGrayMode(false) is called", () => {
		render(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		const normalModeBtn = screen.getByTestId("set-normal-mode-btn");
		const statusElement = screen.getByTestId("gray-mode-status");

		// Initially should be true, let's set it to false
		act(() => {
			normalModeBtn.click();
		});
		expect(statusElement).toHaveTextContent("false");
	});

	// Test 5: toggleGrayMode function
	it("should toggle isGrayMode from true to false", () => {
		render(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		const toggleBtn = screen.getByTestId("toggle-gray-mode-btn");
		const statusElement = screen.getByTestId("gray-mode-status");

		// Initially true, should become false after toggle
		expect(statusElement).toHaveTextContent("true");
		act(() => {
			toggleBtn.click();
		});
		expect(statusElement).toHaveTextContent("false");
	});

	// Test 6: toggleGrayMode function when called multiple times
	it("should toggle isGrayMode correctly when called multiple times", () => {
		render(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		const toggleBtn = screen.getByTestId("toggle-gray-mode-btn");
		const statusElement = screen.getByTestId("gray-mode-status");

		// Initially: true
		expect(statusElement).toHaveTextContent("true");

		// After 1st toggle: false
		act(() => {
			toggleBtn.click();
		});
		expect(statusElement).toHaveTextContent("false");

		// After 2nd toggle: true
		act(() => {
			toggleBtn.click();
		});
		expect(statusElement).toHaveTextContent("true");

		// After 3rd toggle: false
		act(() => {
			toggleBtn.click();
		});
		expect(statusElement).toHaveTextContent("false");
	});

	// Test 7: Error when hook used outside provider
	it("should throw an error when useColorMode is used outside of ColorModeProvider", () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

		expect(() => {
			render(<TestHookOutsideProvider />);
		}).toThrow("useColorMode must be used within a ColorModeProvider");

		consoleSpy.mockRestore();
	});

	// Test 8: All context properties should be available
	it("should provide all required context properties", () => {
		let context: any = null;

		const TestConsumer = () => {
			context = useColorMode();
			return <div>Test</div>;
		};

		render(
			<ColorModeProvider>
				<TestConsumer />
			</ColorModeProvider>
		);

		expect(context).toBeDefined();
		expect(context.isGrayMode).toBeDefined();
		expect(typeof context.setIsGrayMode).toBe("function");
		expect(typeof context.toggleGrayMode).toBe("function");
	});
});