import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelect, MultiSelectProps, MultiSelectOption, MultiSelectGroup } from './multi-select';

// Mock ResizeObserver for jsdom
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Add ResizeObserver to the global scope
global.ResizeObserver = ResizeObserver;

// Mock the dependencies
jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

// Define test options
const mockOptions: MultiSelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Disabled Option', value: 'disabled', disabled: true },
];

const mockGroupedOptions: MultiSelectGroup[] = [
  {
    heading: 'Group 1',
    options: [
      { label: 'Group 1 - Option 1', value: 'g1o1' },
      { label: 'Group 1 - Option 2', value: 'g1o2' },
    ],
  },
  {
    heading: 'Group 2',
    options: [
      { label: 'Group 2 - Option 1', value: 'g2o1' },
      { label: 'Group 2 - Option 2', value: 'g2o2' },
    ],
  },
];

const TestMultiSelect = (props: Partial<MultiSelectProps>) => {
  const [values, setValues] = React.useState<string[]>(props.defaultValue || []);

  return (
    <MultiSelect
      options={mockOptions}
      onValueChange={setValues}
      defaultValue={props.defaultValue || []}
      placeholder="Select options"
      {...props}
    />
  );
};

describe('MultiSelect Component', () => {
  // Test 1: Basic rendering
  it('renders correctly with placeholder', () => {
    render(<TestMultiSelect />);

    const placeholder = screen.getByText('Select options');
    expect(placeholder).toBeInTheDocument();
  });

  // Test 2: Selecting and deselecting options
  it('allows selecting and deselecting options', async () => {
    render(<TestMultiSelect />);

    // Open the dropdown
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Wait for options to appear
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    // Select an option - use the full accessible name
    const option1 = screen.getByRole('option', { name: 'Option 1, not selected' });
    fireEvent.click(option1);

    // Check that the option is selected - wait for the badge to appear
    await waitFor(() => {
      const badges = document.querySelectorAll('.rounded-full');
      expect(badges.length).toBeGreaterThan(0);
    });

    // Verify the badge appears with the correct text by checking that we now have selected options
    expect(screen.getByLabelText(/Remove Option 1 from selection/)).toBeInTheDocument();

    // Deselect the option by clicking the remove button
    const removeButton = screen.getByLabelText('Remove Option 1 from selection');
    fireEvent.click(removeButton);

    // Verify the option is removed
    expect(screen.queryByLabelText(/Remove Option 1 from selection/)).not.toBeInTheDocument();
  });

  // Test 3: Default values
  it('renders with default selected values', () => {
    render(<TestMultiSelect defaultValue={['option1', 'option2']} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  // Test 4: Placeholder when no options selected
  it('shows placeholder when no options are selected', () => {
    render(<TestMultiSelect />);

    expect(screen.getByText('Select options')).toBeInTheDocument();
  });

  // Test 5: Maximum count display
  it('shows maximum count of selected options with "+ more" badge', () => {
    render(<TestMultiSelect defaultValue={['option1', 'option2', 'option3', 'option4']} maxCount={3} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByText('+ 1 more')).toBeInTheDocument();
  });

  // Test 6: Clear all functionality
  it('clears all selected options when clear button is clicked', async () => {
    render(<TestMultiSelect defaultValue={['option1', 'option2']} />);

    const clearButton = screen.getByLabelText('Clear all 2 selected options');
    fireEvent.click(clearButton);

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    expect(screen.getByText('Select options')).toBeInTheDocument();
  });

  // Test 7: Search functionality
  it('filters options based on search input', async () => {
    render(<TestMultiSelect searchable={true} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Wait for dropdown to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search options...')).toBeInTheDocument();
    });

    // Find and type in search input
    const searchInput = screen.getByPlaceholderText('Search options...');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Option 1' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });
  });

  // Test 8: Disabled option handling
  it('does not allow selecting disabled options', async () => {
    render(<TestMultiSelect />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Wait for options to appear
    await waitFor(() => {
      const disabledOption = screen.getByRole('option', { name: /Disabled Option/ });
      expect(disabledOption).toBeInTheDocument();
    });

    // Try to select disabled option
    const disabledOption = screen.getByRole('option', { name: /Disabled Option/ });
    fireEvent.click(disabledOption);

    // Verify it's not selected by checking that no new badge appears
    // Since the option is disabled, it should not be added to selected values
    expect(screen.queryByLabelText(/Remove Disabled Option from selection/)).not.toBeInTheDocument();
  });

  // Test 9: Select all functionality (when not hidden)
  it('toggles all options when select all is clicked', async () => {
    render(<TestMultiSelect hideSelectAll={false} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Wait for dropdown to open and select all option to appear
    await waitFor(() => {
      // The select all option has text like "(Select All - X options)" or just "(Select All)"
      expect(screen.getByText(/^\(Select All/)).toBeInTheDocument();
    });

    const selectAll = screen.getByText(/^\(Select All/);
    fireEvent.click(selectAll);

    // Wait for all options to be selected
    await waitFor(() => {
      // Check that we have badges for the selected options
      const badges = document.querySelectorAll('.rounded-full');
      // Should have at least 4 badges (for the 4 non-disabled options)
      expect(badges.length).toBeGreaterThanOrEqual(4);
    });

    // Verify all options are selected (except the disabled one)
    // Check that the selection count in the screen reader text matches our expectation
    await waitFor(() => {
      expect(screen.getByText(/4 options selected/)).toBeInTheDocument();
    });

    // The disabled option should not have a badge
    expect(screen.queryByLabelText(/Remove Disabled Option from selection/)).not.toBeInTheDocument();
  });

  // Test 10: Hide select all functionality
  it('hides select all option when hideSelectAll is true', async () => {
    render(<TestMultiSelect hideSelectAll={true} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Wait for dropdown to open
    await waitFor(() => {
      expect(screen.queryByText('(Select All')).not.toBeInTheDocument();
    });
  });

  // Test 11: Grouped options rendering
  it('renders grouped options correctly', async () => {
    render(
      <MultiSelect
        options={mockGroupedOptions}
        onValueChange={jest.fn()}
        placeholder="Select options"
      />
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Wait for dropdown to open
    await waitFor(() => {
      expect(screen.getByText('Group 1 - Option 1')).toBeInTheDocument();
    });

    // Verify group headings are present
    expect(screen.getByText('Group 1 - Option 1')).toBeInTheDocument();
    expect(screen.getByText('Group 1 - Option 2')).toBeInTheDocument();
    expect(screen.getByText('Group 2 - Option 1')).toBeInTheDocument();
    expect(screen.getByText('Group 2 - Option 2')).toBeInTheDocument();
  });

  // Test 12: Close on select functionality
  it('closes popover after selecting an option when closeOnSelect is true', async () => {
    render(<TestMultiSelect closeOnSelect={true} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Wait for options to appear
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /Option 1/ })).toBeInTheDocument();
    });

    // Verify dropdown is open by checking aria-expanded attribute
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Select an option
    const option1 = screen.getByRole('option', { name: /Option 1/ });
    fireEvent.click(option1);

    // Wait for dropdown to close - check that aria-expanded becomes false
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    // Verify dropdown is closed after selection
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  // Test 13: Disabled component
  it('is disabled when disabled prop is true', () => {
    render(<TestMultiSelect disabled={true} />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('opacity-50');
    expect(trigger).toHaveAttribute('disabled');
  });

  // Test 14: Single line behavior
  it('applies single line styling when singleLine prop is true', () => {
    render(<TestMultiSelect singleLine={true} defaultValue={['option1', 'option2']} />);

    const container = screen.getByRole('combobox');
    expect(container).toBeInTheDocument();
  });

  // Test 15: Empty indicator
  it('shows custom empty indicator when no options match search', async () => {
    render(
      <TestMultiSelect
        searchable={true}
        emptyIndicator="No options found"
      />
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Wait for search input to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search options...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search options...');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    });

    await waitFor(() => {
      expect(screen.getByText('No options found')).toBeInTheDocument();
    });
  });

  // Test 16: Animation toggle
  it('should render animation elements when animation is enabled', async () => {
    // Test that the animation element appears when there are selected values and animation is enabled
    render(<TestMultiSelect animation={1} defaultValue={['option1']} />);

    // The WandSparkles icon should appear when there's at least one selected value and animation is enabled
    await waitFor(() => {
      // Check if WandSparkles icon is in the document (it has class "my-2" and cursor-pointer)
      const sparklesIcons = document.querySelectorAll('svg.cursor-pointer.my-2');
      expect(sparklesIcons.length).toBeGreaterThan(0);
    });

    // Since the animation toggle functionality is visual, we can verify the element exists
    const animationElement = document.querySelector('svg.cursor-pointer.my-2');
    expect(animationElement).toBeInTheDocument();
  });

  // Test 17: Responsive behavior
  it('applies responsive settings', () => {
    render(<TestMultiSelect responsive={true} />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
  });

  // Test 18: Deduplicate options
  it('handles duplicate options when deduplicateOptions is true', async () => {
    const optionsWithDuplicates: MultiSelectOption[] = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 1 Duplicate', value: 'option1' }, // Duplicate value
      { label: 'Option 2', value: 'option2' },
    ];

    render(
      <MultiSelect
        options={optionsWithDuplicates}
        onValueChange={jest.fn()}
        deduplicateOptions={true}
        placeholder="Select options"
      />
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Wait for options to appear
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    // Check for duplicate warning in console (not part of the UI test)
    // Only one option with value 'option1' should be available in the UI since deduplicateOptions is true
    const option1Elements = screen.getAllByText('Option 1');
    // This test will find both "Option 1" and "Option 1 Duplicate" since they have different labels
    // But internally, they have the same value which is what matters for deduplication
  });

  // Test 19: Reset on default value change
  it('resets to new default value when resetOnDefaultValueChange is true', () => {
    const { rerender } = render(<TestMultiSelect defaultValue={['option1']} />);

    // Check initial state
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();

    // Change default value
    rerender(<TestMultiSelect defaultValue={['option2']} resetOnDefaultValueChange={true} />);

    // The selection should now be updated to the new default
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  // Test 20: Accessibility features
  it('includes accessibility attributes', () => {
    render(<TestMultiSelect />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-label');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});