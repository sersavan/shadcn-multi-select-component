# Multi-Select Component Knowledge Base

## Component Overview

The MultiSelect component is a powerful and flexible React component built with
TypeScript, Tailwind CSS, and shadcn/ui components. It provides advanced
multi-selection functionality with extensive customization options.

## Key Features

- Multiple variants (default, secondary, destructive, inverted)
- Custom styling with badge colors and gradient backgrounds
- Grouped options with headings and separators
- Disabled options support
- Advanced animations (bounce, pulse, wiggle, fade, slide)
- Search and filter functionality
- Responsive design with mobile, tablet, and desktop configurations
- Form integration with React Hook Form and Zod validation
- Imperative methods via ref
- Accessibility support

## API Reference

### Core Props

- `options`: Array of options or grouped options
- `onValueChange`: Callback function for value changes
- `defaultValue`: Initial selected values (default: [])
- `placeholder`: Placeholder text (default: "Select options")

### Appearance Props

- `variant`: "default" | "secondary" | "destructive" | "inverted"
- `maxCount`: Maximum badges to show (default: 3)
- `autoSize`: Auto width behavior (default: false)
- `singleLine`: Single line layout (default: false)

### Behavior Props

- `searchable`: Enable search functionality (default: true)
- `hideSelectAll`: Hide select all button (default: false)
- `closeOnSelect`: Close popover after selection (default: false)
- `disabled`: Disable component (default: false)

### Advanced Props

- `responsive`: Responsive configuration object
- `animationConfig`: Animation settings object
- `modalPopover`: Modal behavior (default: false)
- `deduplicateOptions`: Remove duplicate options (default: false)

## Animation Configuration

```typescript
interface AnimationConfig {
	badgeAnimation?: "bounce" | "pulse" | "wiggle" | "fade" | "slide" | "none";
	popoverAnimation?: "scale" | "slide" | "fade" | "flip" | "none";
	optionHoverAnimation?: "highlight" | "scale" | "glow" | "none";
	duration?: number;
	delay?: number;
}
```

## Option Interface

```typescript
interface MultiSelectOption {
	label: string;
	value: string;
	icon?: React.ComponentType<{ className?: string }>;
	disabled?: boolean;
	style?: {
		badgeColor?: string;
		iconColor?: string;
		gradient?: string;
	};
}
```

## Usage Examples

### Basic Usage

```tsx
const [selectedValues, setSelectedValues] = useState<string[]>([]);

<MultiSelect
	options={options}
	onValueChange={setSelectedValues}
	defaultValue={selectedValues}
	placeholder="Select options"
/>;
```

### With Form Integration

```tsx
<FormField
	control={form.control}
	name="frameworks"
	render={({ field }) => (
		<FormItem>
			<FormLabel>Frameworks</FormLabel>
			<FormControl>
				<MultiSelect
					options={frameworksList}
					onValueChange={field.onChange}
					defaultValue={field.value}
					placeholder="Select frameworks"
				/>
			</FormControl>
			<FormMessage />
		</FormItem>
	)}
/>
```

### With Custom Styling

```tsx
const styledOptions = [
	{
		value: "web-app",
		label: "Web Application",
		icon: Icons.globe,
		style: {
			badgeColor: "#3b82f6",
			gradient: "from-blue-500 to-purple-600",
		},
	},
];

<MultiSelect
	options={styledOptions}
	onValueChange={setValues}
	animationConfig={{ badgeAnimation: "pulse" }}
	variant="secondary"
/>;
```

### Responsive Configuration

```tsx
<MultiSelect
	options={options}
	onValueChange={setValues}
	responsive={{
		mobile: { maxCount: 1, compactMode: true },
		tablet: { maxCount: 2, compactMode: false },
		desktop: { maxCount: 4, compactMode: false },
	}}
/>
```

## AI/LLM Use Cases

### LLM Model Selection

Perfect for selecting multiple AI models for comparison, A/B testing, or
ensemble predictions.

### AI Tools Configuration

Organize AI services by categories like Language Models, AI Agents, and Vector
Databases.

### Prompt Engineering

Select different prompt template types with custom styling for various
conversation patterns.

### RAG System Configuration

Choose multiple data sources for Retrieval-Augmented Generation systems.

### Model Parameters

Fine-tune AI model behavior by selecting generation and response control
parameters.

### AI Agent Capabilities

Define agent capabilities across content creation, analysis, and communication.

### Multimodal AI Features

Enable cross-modal capabilities like text-to-image, speech-to-text, etc.

## Common Patterns

### Imperative Control

```tsx
const multiSelectRef = useRef<MultiSelectRef>(null);

// Reset to default values
multiSelectRef.current?.reset();

// Clear all selections
multiSelectRef.current?.clear();

// Focus the component
multiSelectRef.current?.focus();

// Get current values
const values = multiSelectRef.current?.getSelectedValues();

// Set specific values
multiSelectRef.current?.setSelectedValues(["react", "vue"]);
```

### Chart Integration

Use with data visualization libraries for interactive filtering:

```tsx
const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

<MultiSelect
	options={departmentOptions}
	onValueChange={setSelectedDepartments}
	placeholder="Filter departments"
/>;

// Use selectedDepartments to filter chart data
const filteredData = chartData.filter((item) =>
	selectedDepartments.includes(item.department)
);
```

## Troubleshooting

### Animation Issues

- Use `animationConfig` object instead of `badgeAnimation` prop directly
- Correct: `animationConfig={{ badgeAnimation: "pulse" }}`
- Incorrect: `badgeAnimation="pulse"`

### Form Validation

- Ensure `onValueChange` is connected to form field
- Use proper default values to avoid controlled/uncontrolled warnings
- Handle empty arrays appropriately in validation schemas

### Performance

- For large option lists, consider implementing virtualization
- Use `React.memo` for option components if needed
- Debounce search functionality for better UX

### Accessibility

- Component includes proper ARIA labels and keyboard navigation
- Screen reader support is built-in
- Focus management is handled automatically

## Best Practices

1. **Option Design**: Use clear, descriptive labels and appropriate icons
2. **Grouping**: Organize related options into logical groups
3. **Responsive**: Configure appropriate maxCount for different screen sizes
4. **Validation**: Implement proper form validation with clear error messages
5. **Performance**: Use React.memo and useMemo for expensive operations
6. **Accessibility**: Test with screen readers and keyboard navigation
7. **Animation**: Use subtle animations that enhance UX without distraction

## Integration Tips

### With State Management

```tsx
// Redux/Zustand
const selectedValues = useSelector((state) => state.multiSelect.values);
const dispatch = useDispatch();

<MultiSelect
	options={options}
	onValueChange={(values) => dispatch(setMultiSelectValues(values))}
	defaultValue={selectedValues}
/>;
```

### With URL State

```tsx
// Next.js router
const router = useRouter();
const { values } = router.query;

<MultiSelect
	options={options}
	onValueChange={(newValues) => {
		router.push({
			pathname: router.pathname,
			query: { ...router.query, values: newValues.join(",") },
		});
	}}
	defaultValue={typeof values === "string" ? values.split(",") : []}
/>;
```
