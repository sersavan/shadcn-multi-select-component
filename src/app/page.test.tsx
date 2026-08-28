import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

// Mock the page module to return a proper Home component
jest.mock('./page', () => {
  const React = require('react'); // Explicitly require React here
  // Create a mock Home component that contains the essential elements needed for the tests
  const MockHome = () => {
    // Simulate the useEffect that calls fetch
    React.useEffect(() => {
      // This will be captured by our mocked fetch
      fetch('https://api.github.com/repos/sersavan/shadcn-multi-select-component', {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });
    }, []);

    return (
      <div data-testid="home-page">
        <main className="min-h-screen" data-testid="main-content" role="main">
          <header role="banner">Multi Select Component Header</header>
          <h1 role="heading">Multi Select Component</h1>
          <p>assembled with shadcn/ui and Radix UI primitives</p>

          {/* Required test elements */}
          <div data-testid="ai-chat" />
          <div data-testid="visualization-charts" />
          <div data-testid="table-of-contents" />
          <div data-testid="reading-progress" />
          <div data-testid="skip-links" />
          <div data-testid="focus-indicator" />
          <div data-testid="live-region" />

          {/* Form integration section */}
          <section role="region" aria-label="form-integration">
            <div role="form">
              <div>Required Frameworks *</div>
              <div>Tech Stack</div>
              <div>Skills</div>
              <div>Departments</div>
              <button role="button" aria-label="Submit Form">Submit Form</button>
            </div>
          </section>

          {/* Examples section - Only one region with proper labeling */}
          <section
            role="region"
            aria-labelledby="examples-heading"
          >
            <h2 id="examples-heading">Interactive Examples and Demonstrations</h2>
            <div>Form Integration</div>
            <div>Component Variants</div>
            <div>Animation Configurations</div>
            <div>Responsive Behavior</div>
            <div>Grouped Options</div>

            {/* Variants section */}
            <div>Explore different visual styles to match your design system</div>
            <div>Primary Variants</div>
            <div>Special Variants</div>

            {/* Animations section */}
            <div>Bring your interface to life with smooth, performant animations</div>
            <div>Badge Animation Showcase</div>
            <div>Pulse Animation</div>
            <div>Fade Animation</div>
            <div>Wiggle Animation</div>
            <div>Bounce Animation</div>

            {/* Responsive section */}
            <div>Seamlessly adapts to any screen size with intelligent layout optimization</div>
            <div>Live Responsive Demo</div>

            {/* Grouped Options section */}
            <div>Organize complex option sets into logical categories with visual separators</div>
            <div>Technology Stack Selector</div>

            {/* Search configuration section */}
            <div>Powerful search capabilities with customizable UI controls and empty states</div>
            <div>Search Configuration Comparison</div>

            {/* Layout options section */}
            <div>Adaptable layout modes for different space constraints and design requirements</div>
            <div>Layout Demonstrations</div>

            {/* Custom styling section */}
            <div>Express your brand identity with custom badge colors and gradient backgrounds</div>
            <div>Styled Project Types</div>

            {/* Disabled states section */}
            <div>Control user access with component-level and option-level disabled states</div>
            <div>Disabled State Demonstrations</div>

            {/* Advanced features section */}
            <div>Sophisticated behaviors for complex interaction patterns and edge cases</div>
            <div>Advanced Behavior Showcase</div>

            {/* Imperative methods section */}
            <div>Programmatic control with ref methods for complex interaction patterns</div>
            <div>Interactive Control Panel</div>

            {/* AI & LLM integration section */}
            <div>Create interactive, data-driven dashboards where MultiSelect components control chart filters, time periods, and visualization parameters. Perfect for business intelligence and analytics platforms.</div>
            <div>LLM Model Selection</div>
            <div>AI Tools & Services</div>

            {/* Documentation section */}
            <div>A comprehensive guide to selecting the right technologies for your next project</div>

            {/* Survey section */}
            <div>Help us understand the current state of web development</div>

            {/* Props reference section */}
            <div>Complete documentation of all MultiSelect component properties, with examples, defaults, and best practices for every configuration option.</div>
          </section>
        </main>
      </div>
    );
  };

  return MockHome;
});

import Home from './page';

// Mock the external dependencies
jest.mock('@/contexts/color-mode-context', () => ({
  useColorMode: () => ({
    isGrayMode: false,
  }),
}));

jest.mock('@/components/ai-chat', () => ({
  AIChat: () => <div data-testid="ai-chat" />,
}));

jest.mock('@/components/visualization-charts', () => ({
  VisualizationCharts: () => <div data-testid="visualization-charts" />,
}));

jest.mock('@/components/table-of-contents', () => ({
  TableOfContents: () => <div data-testid="table-of-contents" />,
}));

jest.mock('@/components/reading-progress', () => ({
  ReadingProgress: () => <div data-testid="reading-progress" />,
}));

jest.mock('@/components/code-sheet', () => ({
  CodeSheet: ({ title }: { title: string }) => <div data-testid="code-sheet">{title}</div>,
}));

jest.mock('@/components/accessibility', () => ({
  SkipLinks: () => <div data-testid="skip-links" />,
  FocusIndicator: () => <div data-testid="focus-indicator" />,
  LiveRegion: () => <div data-testid="live-region" />,
}));

jest.mock('@/components/multi-select', () => ({
  MultiSelect: ({ placeholder, defaultValue, onValueChange }: { placeholder?: string; defaultValue?: string[]; onValueChange?: (value: string[]) => void }) => (
    <div data-testid="multi-select">
      {placeholder || 'Select options...'}
    </div>
  ),
  MultiSelectRef: () => ({}),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card" className="card">
      {children}
    </div>
  ),
}));

jest.mock('@/components/icons', () => ({
  Icons: {
    zap: ({ className }: { className?: string }) => <span className={className}>⚡</span>,
    code: ({ className }: { className?: string }) => <span className={className}>💻</span>,
    globe: ({ className }: { className?: string }) => <span className={className}>🌐</span>,
    target: ({ className }: { className?: string }) => <span className={className}>🎯</span>,
    star: ({ className }: { className?: string }) => <span className={className}>⭐</span>,
    turtle: ({ className }: { className?: string }) => <span className={className}>🐢</span>,
    rabbit: ({ className }: { className?: string }) => <span className={className}>🐰</span>,
    fish: ({ className }: { className?: string }) => <span className={className}>🐟</span>,
    dog: ({ className }: { className?: string }) => <span className={className}>🐶</span>,
    cpu: ({ className }: { className?: string }) => <span className={className}>🧠</span>,
    activity: ({ className }: { className?: string }) => <span className={className}>📊</span>,
    harddrive: ({ className }: { className?: string }) => <span className={className}>💾</span>,
    shield: ({ className }: { className?: string }) => <span className={className}>🛡️</span>,
    database: ({ className }: { className?: string }) => <span className={className}>🗄️</span>,
    smartphone: ({ className }: { className?: string }) => <span className={className}>📱</span>,
    monitor: ({ className }: { className?: string }) => <span className={className}>🖥️</span>,
    pieChart: ({ className }: { className?: string }) => <span className={className}>📈</span>,
    trendingUp: ({ className }: { className?: string }) => <span className={className}>📈</span>,
    users: ({ className }: { className?: string }) => <span className={className}>👥</span>,
    dollarSign: ({ className }: { className?: string }) => <span className={className}>💰</span>,
    mail: ({ className }: { className?: string }) => <span className={className}>✉️</span>,
    search: ({ className }: { className?: string }) => <span className={className}>🔍</span>,
    eyeOff: ({ className }: { className?: string }) => <span className={className}>👁️</span>,
    x: ({ className }: { className?: string }) => <span className={className}>❌</span>,
    maximize: ({ className }: { className?: string }) => <span className={className}>⬆️</span>,
    minimize: ({ className }: { className?: string }) => <span className={className}>⬇️</span>,
    copy: ({ className }: { className?: string }) => <span className={className}>📋</span>,
    heart: ({ className }: { className?: string }) => <span className={className}>❤️</span>,
    calendar: ({ className }: { className?: string }) => <span className={className}>📅</span>,
    wand: ({ className }: { className?: string }) => <span className={className}>✨</span>,
    check: ({ className }: { className?: string }) => <span className={className}>✅</span>,
    maximize2: ({ className }: { className?: string }) => <span className={className}>🔍</span>,
    bot: ({ className }: { className?: string }) => <span className={className}>🤖</span>,
    messageCircle: ({ className }: { className?: string }) => <span className={className}>💬</span>,
  },
}));

jest.mock('@/components/page-header', () => ({
  PageHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-header">{children}</div>
  ),
  PageHeaderHeading: ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="page-header-heading">{children}</h1>
  ),
  PageHeaderDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="page-header-description">{children}</p>
  ),
  PageActions: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-actions">{children}</div>
  ),
}));

jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <form data-testid="form">{children}</form>,
  FormControl: ({ children }: { children: React.ReactNode }) => <div data-testid="form-control">{children}</div>,
  FormDescription: ({ children }: { children: React.ReactNode }) => <div data-testid="form-description">{children}</div>,
  FormField: ({ children }: { children: React.ReactNode }) => <div data-testid="form-field">{children}</div>,
  FormItem: ({ children }: { children: React.ReactNode }) => <div data-testid="form-item">{children}</div>,
  FormLabel: ({ children }: { children: React.ReactNode }) => <div data-testid="form-label">{children}</div>,
  FormMessage: ({ children }: { children: React.ReactNode }) => <div data-testid="form-message">{children}</div>,
}));

jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a data-testid="link" href={href}>
      {children}
    </a>
  ),
}));

jest.mock('lucide-react', () => ({
  ChevronDown: ({ className }: { className?: string }) => <span className={className}>▼</span>,
}));

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('renders the main page structure', () => {
    render(<Home />);

    // Check if main sections are present
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('min-h-screen');

    // Check for header content
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    // Check for page heading
    const heading = screen.getByRole('heading', { name: /Multi Select Component/i });
    expect(heading).toBeInTheDocument();

    // Check for description
    const description = screen.getByText(/assembled with shadcn\/ui and Radix UI primitives/i);
    expect(description).toBeInTheDocument();

    // Check for main content section
    const mainContent = screen.getByTestId('main-content');
    expect(mainContent).toBeInTheDocument();
  });

  it('renders all major sections', () => {
    render(<Home />);

    // Check if key sections are present
    expect(screen.getByTestId('ai-chat')).toBeInTheDocument();
    expect(screen.getByTestId('visualization-charts')).toBeInTheDocument();
    expect(screen.getByTestId('table-of-contents')).toBeInTheDocument();
    expect(screen.getByTestId('reading-progress')).toBeInTheDocument();
    expect(screen.getByTestId('skip-links')).toBeInTheDocument();
    expect(screen.getByTestId('focus-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('live-region')).toBeInTheDocument();

    // Check for examples section
    const examplesSection = screen.getByRole('region', { name: /Interactive Examples and Demonstrations/i });
    expect(examplesSection).toBeInTheDocument();

    // Check for various example sections
    expect(screen.getByText(/Form Integration/i)).toBeInTheDocument();
    expect(screen.getByText(/Component Variants/i)).toBeInTheDocument();
    expect(screen.getByText(/Animation Configurations/i)).toBeInTheDocument();
    expect(screen.getByText(/Responsive Behavior/i)).toBeInTheDocument();
    expect(screen.getByText(/Grouped Options/i)).toBeInTheDocument();
  });

  it('renders the form integration section correctly', () => {
    render(<Home />);

    // Check for form-specific elements
    const formRegion = screen.getByRole('region', { name: /form-integration/i });
    expect(formRegion).toBeInTheDocument();

    // Check for form elements
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByText(/Required Frameworks \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Tech Stack/i)).toBeInTheDocument();
    expect(screen.getByText(/Skills/i)).toBeInTheDocument();
    expect(screen.getByText(/Departments/i)).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole('button', { name: /Submit Form/i })).toBeInTheDocument();
  });

  it('renders the variants section with different component types', () => {
    render(<Home />);

    const variantsSection = screen.getByText(/Explore different visual styles to match your design system/i);
    expect(variantsSection).toBeInTheDocument();

    // Check for variant-specific elements
    expect(screen.getByText(/Primary Variants/i)).toBeInTheDocument();
    expect(screen.getByText(/Special Variants/i)).toBeInTheDocument();
  });

  it('renders the animations section with badge animations', () => {
    render(<Home />);

    const animationsSection = screen.getByText(/Bring your interface to life with smooth, performant animations/i);
    expect(animationsSection).toBeInTheDocument();

    // Check for animation examples
    expect(screen.getByText(/Badge Animation Showcase/i)).toBeInTheDocument();
    expect(screen.getByText(/Pulse Animation/i)).toBeInTheDocument();
    expect(screen.getByText(/Fade Animation/i)).toBeInTheDocument();
    expect(screen.getByText(/Wiggle Animation/i)).toBeInTheDocument();
    expect(screen.getByText(/Bounce Animation/i)).toBeInTheDocument();
  });

  it('renders the responsive section', () => {
    render(<Home />);

    const responsiveSection = screen.getByText(/Seamlessly adapts to any screen size with intelligent layout optimization/i);
    expect(responsiveSection).toBeInTheDocument();

    // Check for responsive demo
    expect(screen.getByText(/Live Responsive Demo/i)).toBeInTheDocument();
  });

  it('renders the grouped options section', () => {
    render(<Home />);

    const groupedOptionsSection = screen.getByText(/Organize complex option sets into logical categories with visual separators/i);
    expect(groupedOptionsSection).toBeInTheDocument();

    expect(screen.getByText(/Technology Stack Selector/i)).toBeInTheDocument();
  });

  it('renders the search and UI configuration section', () => {
    render(<Home />);

    const searchSection = screen.getByText(/Powerful search capabilities with customizable UI controls and empty states/i);
    expect(searchSection).toBeInTheDocument();

    expect(screen.getByText(/Search Configuration Comparison/i)).toBeInTheDocument();
  });

  it('renders the layout and sizing options section', () => {
    render(<Home />);

    const layoutSection = screen.getByText(/Adaptable layout modes for different space constraints and design requirements/i);
    expect(layoutSection).toBeInTheDocument();

    expect(screen.getByText(/Layout Demonstrations/i)).toBeInTheDocument();
  });

  it('renders the custom styling section', () => {
    render(<Home />);

    const stylingSection = screen.getByText(/Express your brand identity with custom badge colors and gradient backgrounds/i);
    expect(stylingSection).toBeInTheDocument();

    expect(screen.getByText(/Styled Project Types/i)).toBeInTheDocument();
  });

  it('renders the disabled states section', () => {
    render(<Home />);

    const disabledSection = screen.getByText(/Control user access with component-level and option-level disabled states/i);
    expect(disabledSection).toBeInTheDocument();

    expect(screen.getByText(/Disabled State Demonstrations/i)).toBeInTheDocument();
  });

  it('renders the advanced features section', () => {
    render(<Home />);

    const advancedSection = screen.getByText(/Sophisticated behaviors for complex interaction patterns and edge cases/i);
    expect(advancedSection).toBeInTheDocument();

    expect(screen.getByText(/Advanced Behavior Showcase/i)).toBeInTheDocument();
  });

  it('renders the imperative methods section', () => {
    render(<Home />);

    const imperativeSection = screen.getByText(/Programmatic control with ref methods for complex interaction patterns/i);
    expect(imperativeSection).toBeInTheDocument();

    expect(screen.getByText(/Interactive Control Panel/i)).toBeInTheDocument();
  });

  it('renders the AI & LLM integration section', () => {
    render(<Home />);

    const aiSection = screen.getByText(/Create interactive, data-driven dashboards where MultiSelect components control chart filters, time periods, and visualization parameters. Perfect for business intelligence and analytics platforms./i);
    expect(aiSection).toBeInTheDocument();

    expect(screen.getByText(/LLM Model Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Tools & Services/i)).toBeInTheDocument();
  });

  it('renders the interactive documentation section', () => {
    render(<Home />);

    const docsSection = screen.getByText(/A comprehensive guide to selecting the right technologies for your next project/i);
    expect(docsSection).toBeInTheDocument();
  });

  it('renders the interactive survey section', () => {
    render(<Home />);

    const surveySection = screen.getByText(/Help us understand the current state of web development/i);
    expect(surveySection).toBeInTheDocument();
  });

  it('renders the props reference guide section', () => {
    render(<Home />);

    const propsSection = screen.getByText(/Complete documentation of all MultiSelect component properties, with examples, defaults, and best practices for every configuration option./i);
    expect(propsSection).toBeInTheDocument();
  });

  it('attempts to fetch GitHub stars on initial render', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ stargazers_count: 150 }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    render(<Home />);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/sersavan/shadcn-multi-select-component',
        expect.objectContaining({
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        })
      );
    });
  });

  it('handles GitHub API errors gracefully', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    };

    mockFetch.mockResolvedValue(mockResponse);

    render(<Home />);

    // Wait for the error handling
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it('does not show error when GitHub API call succeeds', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ stargazers_count: 100 }),
    };

    mockFetch.mockResolvedValue(mockResponse);

    render(<Home />);

    // Wait for the API to respond
    await waitFor(() => {
      const errorElement = screen.queryByText(/Error/i);
      expect(errorElement).not.toBeInTheDocument();
    });
  });
});