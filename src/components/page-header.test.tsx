import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageHeader, PageHeaderHeading, PageHeaderDescription, PageActions } from './page-header';

describe('PageHeader Components', () => {
  describe('PageHeader', () => {
    it('renders children correctly', () => {
      render(
        <PageHeader>
          <div>Test child content</div>
        </PageHeader>
      );

      expect(screen.getByText('Test child content')).toBeInTheDocument();
    });

    it('applies default class names', () => {
      render(
        <PageHeader data-testid="page-header">
          <div>Content</div>
        </PageHeader>
      );

      const header = screen.getByTestId('page-header');
      expect(header).toHaveClass('mx-auto');
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('max-w-[980px]');
      expect(header).toHaveClass('flex-col');
      expect(header).toHaveClass('items-center');
      expect(header).toHaveClass('gap-2');
      expect(header).toHaveClass('py-4');
      expect(header).toHaveClass('mt-4');
    });

    it('applies custom class names', () => {
      render(
        <PageHeader className="custom-class" data-testid="page-header">
          <div>Content</div>
        </PageHeader>
      );

      const header = screen.getByTestId('page-header');
      expect(header).toHaveClass('custom-class');
    });

    it('spreads additional props', () => {
      render(
        <PageHeader id="test-id" data-testid="page-header">
          <div>Content</div>
        </PageHeader>
      );

      const header = screen.getByTestId('page-header');
      expect(header).toHaveAttribute('id', 'test-id');
    });
  });

  describe('PageHeaderHeading', () => {
    it('renders heading content correctly', () => {
      render(<PageHeaderHeading>Page Title</PageHeaderHeading>);

      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });

    it('renders as an h1 element', () => {
      render(<PageHeaderHeading data-testid="heading">Title</PageHeaderHeading>);

      const heading = screen.getByTestId('heading');
      expect(heading.tagName).toBe('H1');
    });

    it('applies default class names', () => {
      render(<PageHeaderHeading data-testid="heading">Title</PageHeaderHeading>);

      const heading = screen.getByTestId('heading');
      expect(heading).toHaveClass('text-center');
      expect(heading).toHaveClass('text-4xl');
      expect(heading).toHaveClass('font-bold');
      expect(heading).toHaveClass('leading-tight');
      expect(heading).toHaveClass('tracking-tighter');
      expect(heading).toHaveClass('md:text-5xl');
      expect(heading).toHaveClass('lg:leading-[1.1]');
    });

    it('applies custom class names', () => {
      render(
        <PageHeaderHeading className="custom-heading-class" data-testid="heading">
          Title
        </PageHeaderHeading>
      );

      const heading = screen.getByTestId('heading');
      expect(heading).toHaveClass('custom-heading-class');
    });

    it('spreads additional props', () => {
      render(
        <PageHeaderHeading id="test-heading-id" data-testid="heading">
          Title
        </PageHeaderHeading>
      );

      const heading = screen.getByTestId('heading');
      expect(heading).toHaveAttribute('id', 'test-heading-id');
    });
  });

  describe('PageHeaderDescription', () => {
    it('renders description content correctly', () => {
      render(<PageHeaderDescription>Description text</PageHeaderDescription>);

      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('renders with Balance wrapper', () => {
      render(<PageHeaderDescription data-testid="description">Description text</PageHeaderDescription>);

      const description = screen.getByTestId('description');
      expect(description).toBeInTheDocument();
      // react-wrap-balancer typically renders as a span element to wrap the content
      expect(description.tagName).toBe('SPAN');
    });

    it('applies default class names', () => {
      render(
        <PageHeaderDescription data-testid="description">
          Description text
        </PageHeaderDescription>
      );

      const description = screen.getByTestId('description');
      expect(description).toHaveClass('max-w-[750px]');
      expect(description).toHaveClass('text-center');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('text-muted-foreground');
      expect(description).toHaveClass('sm:text-lg');
    });

    it('applies custom class names', () => {
      render(
        <PageHeaderDescription className="custom-desc-class" data-testid="description">
          Description text
        </PageHeaderDescription>
      );

      const description = screen.getByTestId('description');
      expect(description).toHaveClass('custom-desc-class');
    });

    it('spreads additional props', () => {
      render(
        <PageHeaderDescription id="test-desc-id" data-testid="description">
          Description text
        </PageHeaderDescription>
      );

      const description = screen.getByTestId('description');
      expect(description).toHaveAttribute('id', 'test-desc-id');
    });
  });

  describe('PageActions', () => {
    it('renders children correctly', () => {
      render(
        <PageActions>
          <button>Primary Action</button>
          <button>Secondary Action</button>
        </PageActions>
      );

      expect(screen.getByText('Primary Action')).toBeInTheDocument();
      expect(screen.getByText('Secondary Action')).toBeInTheDocument();
    });

    it('applies default class names', () => {
      render(
        <PageActions data-testid="page-actions">
          <button>Action</button>
        </PageActions>
      );

      const actions = screen.getByTestId('page-actions');
      expect(actions).toHaveClass('flex');
      expect(actions).toHaveClass('w-full');
      expect(actions).toHaveClass('items-center');
      expect(actions).toHaveClass('justify-center');
      expect(actions).toHaveClass('space-x-4');
      expect(actions).toHaveClass('py-4');
      expect(actions).toHaveClass('md:pb-10');
    });

    it('applies custom class names', () => {
      render(
        <PageActions className="custom-actions-class" data-testid="page-actions">
          <button>Action</button>
        </PageActions>
      );

      const actions = screen.getByTestId('page-actions');
      expect(actions).toHaveClass('custom-actions-class');
    });

    it('spreads additional props', () => {
      render(
        <PageActions id="test-actions-id" data-testid="page-actions">
          <button>Action</button>
        </PageActions>
      );

      const actions = screen.getByTestId('page-actions');
      expect(actions).toHaveAttribute('id', 'test-actions-id');
    });
  });

  describe('Integration', () => {
    it('renders all components together correctly', () => {
      render(
        <PageHeader>
          <PageHeaderHeading data-testid="header-heading">Main Title</PageHeaderHeading>
          <PageHeaderDescription data-testid="header-description">
            This is a description of the page header component.
          </PageHeaderDescription>
          <PageActions data-testid="header-actions">
            <button>Get Started</button>
            <button>Learn More</button>
          </PageActions>
        </PageHeader>
      );

      expect(screen.getByTestId('header-heading')).toHaveTextContent('Main Title');
      expect(screen.getByTestId('header-description')).toHaveTextContent(
        'This is a description of the page header component.'
      );
      expect(screen.getByTestId('header-actions')).toContainElement(
        screen.getByText('Get Started')
      );
      expect(screen.getByTestId('header-actions')).toContainElement(
        screen.getByText('Learn More')
      );
    });
  });
});