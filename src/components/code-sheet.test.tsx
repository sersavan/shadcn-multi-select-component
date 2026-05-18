import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CodeSheet } from "./code-sheet";
import { toast } from "sonner"; // Added import for toast

// Mock next-themes
jest.mock("next-themes", () => ({
	useTheme: () => ({ theme: "light", setTheme: jest.fn() }),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));

// Mock navigator.clipboard
const writeTextMock = jest.fn();
Object.defineProperty(navigator, "clipboard", {
	value: {
		writeText: writeTextMock,
	},
	writable: true,
});

// Mock react-syntax-highlighter to avoid actual rendering issues in tests
jest.mock("react-syntax-highlighter", () => ({
	Prism: ({ children, language, style, customStyle }: any) => (
		<pre data-testid="syntax-highlighter" data-language={language} style={style}>
			<code style={customStyle}>{children}</code>
		</pre>
	),
	oneDark: {},
	oneLight: {},
}));

// Mock @/lib/utils and @/components/icons
jest.mock("@/lib/utils", () => ({
	cn: jest.fn((...args) => args.join(" ")),
}));

jest.mock("@/components/icons", () => ({
	Icons: {
		code: () => <svg data-testid="icon-code" />,
		copy: () => <svg data-testid="icon-copy" />,
		check: () => <svg data-testid="icon-check" />,
		harddrive: () => <svg data-testid="icon-harddrive" />,
		activity: () => <svg data-testid="icon-activity" />,
	},
}));

// Mock @/components/ui/button, sheet, and badge to simplify testing
jest.mock("@/components/ui/button", () => ({
	Button: ({ children, onClick, ...props }: any) => (
		<button onClick={onClick} {...props}>
			{children}
		</button>
	),
}));

jest.mock("@/components/ui/sheet", () => {
	const React = require('react');

	// We need a way to control the Sheet's open state from the test.
	// This mock will expose a way to set the open state.
	let mockOpenState = false;
	let mockOnOpenChange = (open: boolean) => {}; // Placeholder

	const MockSheet = ({ children, open, onOpenChange }: any) => {
		mockOpenState = open; // Keep track of the open state
		mockOnOpenChange = onOpenChange; // Keep track of the onOpenChange handler

		const childrenArray = React.Children.toArray(children);
		const sheetContent = childrenArray.find(
			(child: any) => child.type && child.type.displayName === 'SheetContent'
		);

		return (
			<div data-testid="sheet-mock" data-open={open ? "true" : "false"}>
				{childrenArray.filter((child: any) => child.type && child.type.displayName !== 'SheetContent')}
				{open && sheetContent} {/* Conditionally render SheetContent */}
			</div>
		);
	};
	MockSheet.displayName = 'Sheet';

	const MockSheetTrigger = ({ children }: any) => {
		const triggerElement = React.Children.only(children);
		return React.cloneElement(triggerElement, {
			'data-testid': 'sheet-trigger',
			onClick: () => mockOnOpenChange(!mockOpenState), // Use the captured onOpenChange
		});
	};
	MockSheetTrigger.displayName = 'SheetTrigger';

	const MockSheetContent = ({ children }: any) => {
		const Content = ({ children }: any) => <div data-testid="sheet-content">{children}</div>;
		Content.displayName = 'SheetContent'; // Add displayName for identification
		return <Content>{children}</Content>;
	};
	MockSheetContent.displayName = 'SheetContent';

	const MockSheetHeader = ({ children }: any) => <div data-testid="sheet-header">{children}</div>;
	MockSheetHeader.displayName = 'SheetHeader';

	const MockSheetTitle = ({ children }: any) => <h2 data-testid="sheet-title">{children}</h2>;
	MockSheetTitle.displayName = 'SheetTitle';

	const MockSheetDescription = ({ children }: any) => <p data-testid="sheet-description">{children}</p>;
	MockSheetDescription.displayName = 'SheetDescription';

	return {
		Sheet: MockSheet,
		SheetTrigger: MockSheetTrigger,
		SheetContent: MockSheetContent,
		SheetHeader: MockSheetHeader,
		SheetTitle: MockSheetTitle,
		SheetDescription: MockSheetDescription,
	};
});

jest.mock("@/components/ui/badge", () => ({
	Badge: ({ children, variant }: any) => (
		<span data-testid="badge" data-variant={variant}>
			{children}
		</span>
	),
}));


describe("CodeSheet", () => {
	const defaultProps = {
		title: "Test Title",
		code: "console.log('Hello World');",
	};

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers(); // Enable fake timers for each test
	});

	afterEach(() => {
		jest.useRealTimers(); // Restore real timers after each test
	});

	it("renders the trigger button with default text", () => {
		render(<CodeSheet {...defaultProps} />);
		const triggerButton = screen.getByRole('button', { name: 'Code' });
		expect(triggerButton).toBeInTheDocument();
		expect(within(triggerButton).getByTestId("icon-code")).toBeInTheDocument();
	});

	it("renders the trigger button with custom text", () => {
		render(<CodeSheet {...defaultProps} triggerText="View Code" />);
		expect(screen.getByText("View Code")).toBeInTheDocument();
	});

	it("renders a custom trigger child", () => {
		render(
			<CodeSheet {...defaultProps}>
				<button>Custom Trigger</button>
			</CodeSheet>
		);
		expect(screen.getByText("Custom Trigger")).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Code' })).not.toBeInTheDocument(); // Default trigger should not be there
	});

	it("opens the sheet when the trigger is clicked", () => {
		render(<CodeSheet {...defaultProps} />);
		// Initially, the sheet content should not be in the document
		        expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
		
		        const trigger = screen.getByRole('button', { name: 'Code' });		fireEvent.click(trigger);

		// After clicking, the sheet-mock should have data-open="true"
		expect(screen.getByTestId("sheet-mock")).toHaveAttribute("data-open", "true");
		// And the sheet content should be visible
		expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
	});

	it("displays title, description, language, and file name inside the sheet", () => {
		render(
			<CodeSheet
				{...defaultProps}
				description="A test description"
				language="javascript"
				fileName="test.js"
			/>
		);

		// Open the sheet
		const trigger = screen.getByRole('button', { name: 'Code' });
		fireEvent.click(trigger);

		expect(screen.getByTestId("sheet-title")).toHaveTextContent("Test Title");
		expect(screen.getByTestId("sheet-description")).toHaveTextContent("A test description");
		expect(screen.getByText("JAVASCRIPT")).toBeInTheDocument();
				expect(screen.getByText("test.js")).toBeInTheDocument();		expect(screen.getByTestId("syntax-highlighter")).toHaveTextContent(
			"console.log('Hello World');"
		);
		expect(screen.getByTestId("syntax-highlighter")).toHaveAttribute("data-language", "javascript");
	});

		it("copies code to clipboard and shows success toast", async () => {
		render(<CodeSheet {...defaultProps} />);

		// Open the sheet
		const trigger = screen.getByRole('button', { name: 'Code' });
		fireEvent.click(trigger);

		const copyButton = screen.getByText("Copy Code");
		fireEvent.click(copyButton);

		await waitFor(() => {
			expect(writeTextMock).toHaveBeenCalledWith("console.log('Hello World');");
		});

		expect(jest.mocked(toast.success)).toHaveBeenCalledWith("Code copied to clipboard!", expect.any(Object));

		// After 2 seconds, it should revert to "Copy Code"
		jest.advanceTimersByTime(2000);
		await waitFor(() => {
			expect(screen.getByText("Copy Code")).toBeInTheDocument();
		});
	});

	it("shows error toast if clipboard write fails", async () => {
		writeTextMock.mockRejectedValueOnce(new Error("Failed to write"));
		render(<CodeSheet {...defaultProps} />);

		// Open the sheet
		const trigger = screen.getByRole('button', { name: 'Code' });
		fireEvent.click(trigger);

		const copyButton = screen.getByText("Copy Code");
		fireEvent.click(copyButton);

		await waitFor(() => {
			expect(writeTextMock).toHaveBeenCalledWith("console.log('Hello World');");
		});

		expect(jest.mocked(toast.error)).toHaveBeenCalledWith("Failed to copy code", expect.any(Object));
		expect(screen.getByText("Copy Code")).toBeInTheDocument(); // Should not change to "Copied!"
	});
});