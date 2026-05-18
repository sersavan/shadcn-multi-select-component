import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkipLinks } from './skip-links';

describe('SkipLinks', () => {
	it('should render without crashing', () => {
		render(<SkipLinks />);
		expect(screen.getByText(/Skip to main content/i)).toBeInTheDocument();
	});

	it('should render skip links with correct href attributes', () => {
		render(<SkipLinks />);
		
		const skipToMain = screen.getByRole('link', { name: /Skip to main content/i });
		const skipToNavigation = screen.getByRole('link', { name: /Skip to navigation/i });
		const skipToExamples = screen.getByRole('link', { name: /Skip to examples/i });

		expect(skipToMain).toHaveAttribute('href', '#main-content');
		expect(skipToNavigation).toHaveAttribute('href', '#navigation');
		expect(skipToExamples).toHaveAttribute('href', '#examples');
	});

	it('should render skip links with correct text content', () => {
		render(<SkipLinks />);
		
		expect(screen.getByRole('link', { name: /Skip to main content/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /Skip to navigation/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /Skip to examples/i })).toBeInTheDocument();
	});

	it('should apply custom className when provided', () => {
		const customClassName = 'test-class';
		render(<SkipLinks className={customClassName} />);

		const skipLink = screen.getByText(/Skip to main content/i);
		const container = skipLink.parentElement;
		expect(container).toHaveClass(customClassName);
	});

	it('should render with correct structure', () => {
		render(<SkipLinks />);

		const skipLink = screen.getByText(/Skip to main content/i);
		const container = skipLink.parentElement;
		expect(container).toBeInTheDocument();
		expect(container).toHaveClass('sr-only');

		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(3);

		// Check that links are inside the container
		links.forEach(link => {
			expect(container!.contains(link)).toBe(true);
		});
	});

	it('should have appropriate styling classes for accessibility', () => {
		render(<SkipLinks />);
		
		const skipToMain = screen.getByRole('link', { name: /Skip to main content/i });
		const skipToNavigation = screen.getByRole('link', { name: /Skip to navigation/i });
		const skipToExamples = screen.getByRole('link', { name: /Skip to examples/i });

		// Check that links have the expected classes for accessibility
		expect(skipToMain).toHaveClass('absolute');
		expect(skipToNavigation).toHaveClass('absolute');
		expect(skipToExamples).toHaveClass('absolute');
		
		// Check focus-related classes
		expect(skipToMain).toHaveClass('focus:translate-y-0');
		expect(skipToNavigation).toHaveClass('focus:translate-y-0');
		expect(skipToExamples).toHaveClass('focus:translate-y-0');
	});

	it('should be focusable and accessible via keyboard', () => {
		render(<SkipLinks />);

		// Get the first skip link
		const skipToMain = screen.getByRole('link', { name: /Skip to main content/i });

		// Check that it's in the tab order (links are naturally focusable)
		expect(skipToMain.tabIndex).toBe(0);

		// Focus on the link (simulating pressing tab to reach it)
		skipToMain.focus();
		expect(skipToMain).toHaveFocus();
	});
});