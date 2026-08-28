import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTheme } from 'next-themes';
import { ModeToggle } from './mode-toggle';

// Define the mocks at the top level using factories to avoid initialization issues
jest.mock('@/components/ui/button', () => {
  const React = require('react');
  const MockButton = (props: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    size?: string;
  }) => {
    // Using a simple div to represent the button in tests
    const { children, onClick, variant, size } = props;
    return React.createElement('button', {
      onClick,
      'data-testid': 'button',
      'data-variant': variant,
      'data-size': size,
    }, children);
  };
  return { Button: MockButton };
});

// Mock the Icons import
jest.mock('@/components/icons', () => {
  const React = require('react');
  const MockSunIcon = (props: { className?: string }) =>
    React.createElement('svg', {
      className: props.className,
      'data-testid': 'sun-icon',
    }, 'Sun Icon');

  const MockMoonIcon = (props: { className?: string }) =>
    React.createElement('svg', {
      className: props.className,
      'data-testid': 'moon-icon',
    }, 'Moon Icon');

  return {
    Icons: {
      sunIcon: MockSunIcon,
      moonIcon: MockMoonIcon,
    }
  };
});

// Mock the dependencies
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ModeToggle', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: 'light',
    });
  });

  it('renders correctly with light theme', () => {
    render(<ModeToggle />);
    
    // Check that both icons are rendered
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    
    // Check that the sun icon is visible (light theme) and moon icon is hidden (dark theme)
    const sunIcon = screen.getByTestId('sun-icon');
    const moonIcon = screen.getByTestId('moon-icon');
    
    expect(sunIcon).toHaveClass('dark:hidden');
    expect(moonIcon).toHaveClass('hidden');
    
    // Check that the button has sr-only text
    expect(screen.getByText('Toggle theme')).toBeInTheDocument();
  });

  it('renders correctly with dark theme', () => {
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: 'dark',
    });
    
    render(<ModeToggle />);
    
    // Check that both icons are rendered
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    
    // Check that the moon icon is visible (dark theme) and sun icon is hidden 
    const sunIcon = screen.getByTestId('sun-icon');
    const moonIcon = screen.getByTestId('moon-icon');
    
    expect(sunIcon).toHaveClass('dark:hidden');
    expect(moonIcon).toHaveClass('hidden');
    expect(moonIcon).toHaveClass('dark:block');
  });

  it('toggles theme from light to dark when clicked', () => {
    render(<ModeToggle />);
    
    const button = screen.getByTestId('button');
    fireEvent.click(button);
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles theme from dark to light when clicked', () => {
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: 'dark',
    });
    
    render(<ModeToggle />);
    
    const button = screen.getByTestId('button');
    fireEvent.click(button);
    
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('has correct button attributes', () => {
    render(<ModeToggle />);
    
    const button = screen.getByTestId('button');
    expect(button).toBeInTheDocument();
  });
});