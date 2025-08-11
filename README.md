# MultiSelect Component

A powerful and flexible multi-select component built with **React**,
**TypeScript**, **Tailwind CSS**, and **shadcn/ui** components.

**Compatible with:** Next.js, Vite, Create React App, and any React environment
that supports path aliases and shadcn/ui components.

![Multi Select Demo](https://img.shields.io/badge/React-19+-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sersavan/shadcn-multi-select-component&type=Date)](https://star-history.com/#sersavan/shadcn-multi-select-component&Date)

## 🚀 Features

- ✨ **Multiple Variants**: Default, secondary, destructive, and inverted styles
- 🌈 **Custom Styling**: Custom badge colors, icon colors, and gradient
  backgrounds
- 📁 **Grouped Options**: Organize options in groups with headings and
  separators
- 🚫 **Disabled Options**: Mark specific options as disabled and non-selectable
- 🎨 **Advanced Animations**: Multiple animation types (bounce, pulse, wiggle,
  fade, slide) for badges and popovers
- 🔍 **Search & Filter**: Built-in search functionality with keyboard navigation
- 📊 **Dashboard Integration**: Perfect for analytics dashboards and data
  visualization
- 📈 **Chart Filtering**: Real-time filtering for bar, pie, area, and line
  charts
- 🎯 **Multi-level Filtering**: Primary and secondary filter combinations
- 📱 **Responsive Design**: Automatic adaptation to mobile, tablet, and desktop
  screens
- 📐 **Width Constraints**: Support for minimum and maximum width settings
- 📲 **Mobile-Optimized**: Compact mode with touch-friendly interactions
- 💻 **Desktop-Enhanced**: Full feature set with large displays
- ♿ **Accessibility**: Full keyboard support, screen reader compatibility, and
  ARIA live regions
- ⌨️ **Keyboard Shortcuts**: Global hotkeys for navigation and quick actions
- 🔧 **Imperative Methods**: Programmatic control via ref (reset, clear, focus,
  get/set values)
- 🔄 **Duplicate Handling**: Automatic detection and removal of duplicate
  options
- 📝 **Form Integration**: Seamless integration with React Hook Form and
  validation
- 🎛️ **Customizable Behavior**: Auto-close on select, width constraints, empty
  indicators
- 🎯 **TypeScript Support**: Fully typed with comprehensive TypeScript support
- 📦 **Self-Contained**: All accessibility features built-in, no external
  dependencies required

## 📦 Installation

### Prerequisites

This component is compatible with any React project but requires proper setup:

- **React environment**: Next.js, Vite, Create React App, or any React setup
- **Path aliases**: Configure `@/` imports in your bundler
- **shadcn/ui**: Install and configure shadcn/ui components
- **Tailwind CSS**: Setup and configure Tailwind CSS

### 1. Copy the Component

```bash
cp src/components/multi-select.tsx your-project/components/
```

### 2. Install Dependencies

```bash
npm install react react-dom
npm install @radix-ui/react-popover @radix-ui/react-separator
npm install lucide-react class-variance-authority clsx tailwind-merge cmdk
```

### 3. Setup shadcn/ui Components

Install the required shadcn/ui components:

```bash
npx shadcn@latest add button badge popover command separator
```

### 4. Configure Path Aliases

#### For Next.js

Add to your `tsconfig.json` or `jsconfig.json`:

```json
{
	"compilerOptions": {
		"baseUrl": ".",
		"paths": {
			"@/*": ["./src/*"]
		}
	}
}
```

#### For Vite

Add to your `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
```

#### For Webpack/Create React App

You may need to eject or use CRACO to configure path aliases.

### 5. Setup Utility Function

Ensure you have the `cn` utility function in `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

## 🎯 Quick Start

### Basic Usage

```tsx
import { MultiSelect } from "@/components/multi-select";
import { useState } from "react";

const options = [
	{ value: "react", label: "React" },
	{ value: "vue", label: "Vue.js" },
	{ value: "angular", label: "Angular" },
];

function App() {
	const [selectedValues, setSelectedValues] = useState<string[]>([]);

	return (
		<MultiSelect
			options={options}
			onValueChange={setSelectedValues}
			defaultValue={selectedValues}
		/>
	);
}
```

### Custom Styling

```tsx
const styledOptions = [
	{
		value: "react",
		label: "React",
		icon: ReactIcon,
		style: {
			badgeColor: "#61DAFB",
			iconColor: "#282C34",
		},
	},
	{
		value: "vue",
		label: "Vue.js",
		icon: VueIcon,
		style: {
			gradient: "linear-gradient(135deg, #4FC08D 0%, #42B883 100%)",
		},
	},
];

<MultiSelect
	options={styledOptions}
	onValueChange={setSelected}
	placeholder="Select with custom styles..."
/>;
```

### Next.js Usage

For Next.js projects, you can use the component in client components with the
"use client" directive:

```tsx
"use client";

import { MultiSelect } from "@/components/multi-select";
import { useState } from "react";

const options = [
	{ value: "next", label: "Next.js" },
	{ value: "react", label: "React" },
	{ value: "typescript", label: "TypeScript" },
];

export default function MyPage() {
	const [selected, setSelected] = useState<string[]>([]);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Select Technologies</h1>
			<MultiSelect
				options={options}
				onValueChange={setSelected}
				placeholder="Select technologies..."
				variant="secondary"
			/>
		</div>
	);
}
```

### Grouped Options

```tsx
const groupedOptions = [
	{
		heading: "Frontend Frameworks",
		options: [
			{ value: "react", label: "React" },
			{ value: "vue", label: "Vue.js" },
			{ value: "angular", label: "Angular", disabled: true },
		],
	},
	{
		heading: "Backend Technologies",
		options: [
			{ value: "node", label: "Node.js" },
			{ value: "python", label: "Python" },
		],
	},
];

<MultiSelect
	options={groupedOptions}
	onValueChange={setSelected}
	placeholder="Select from groups..."
/>;
```

## 📱 Responsive Design

The Multi-Select component includes comprehensive responsive design capabilities
that automatically adapt to different screen sizes.

### Automatic Responsive Behavior

Enable responsive design with default settings:

```tsx
<MultiSelect
	options={options}
	onValueChange={setSelected}
	responsive={true} // Enable automatic responsive behavior
	placeholder="Responsive component"
/>
```

**Default responsive settings:**

- **Mobile** (< 640px): 2 badges max, compact mode
- **Tablet** (640px - 1024px): 4 badges max, normal mode
- **Desktop** (> 1024px): 6 badges max, full features

### Width Constraints

Control component width with responsive adaptation:

```tsx
<MultiSelect
	options={options}
	onValueChange={setSelected}
	responsive={true}
	minWidth="200px"
	maxWidth="400px"
	placeholder="Constrained width"
/>
```

## 📊 Dashboard Integration

The Multi-Select component provides powerful integration with analytics
dashboards and data visualization libraries.

### Basic Dashboard Filtering

```tsx
import { MultiSelect } from "@/components/multi-select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Dashboard = () => {
	const [selectedCategories, setSelectedCategories] = useState(["2024"]);

	const filteredData = data.filter((item) =>
		selectedCategories.includes(item.category)
	);

	return (
		<div className="space-y-4">
			<MultiSelect
				options={[
					{ value: "2024", label: "2024", icon: CalendarIcon },
					{ value: "2023", label: "2023", icon: CalendarIcon },
				]}
				onValueChange={setSelectedCategories}
				defaultValue={selectedCategories}
				placeholder="Select time period"
				responsive={true}
			/>

			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={filteredData}>
					<XAxis dataKey="name" />
					<YAxis />
					<Bar dataKey="value" fill="#8884d8" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
```

### Multi-level Filtering

```tsx
const AdvancedDashboard = () => {
	const [primaryFilters, setPrimaryFilters] = useState(["Performance"]);
	const [secondaryFilters, setSecondaryFilters] = useState(["Speed"]);

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<MultiSelect
					options={primaryCategories}
					onValueChange={setPrimaryFilters}
					placeholder="Primary category"
				/>

				<MultiSelect
					options={secondaryCategories}
					onValueChange={setSecondaryFilters}
					placeholder="Secondary filters"
					variant="secondary"
				/>
			</div>

			<ComposedChart data={filteredData}>
				{/* Multiple chart types combined */}
			</ComposedChart>
		</div>
	);
};
```

## 📖 Examples

### Basic Multi-Select

```tsx
const [selectedValues, setSelectedValues] = useState<string[]>([]);

<MultiSelect
	options={frameworks}
	onValueChange={setSelectedValues}
	defaultValue={selectedValues}
	placeholder="Select frameworks"
/>;
```

### With Icons and Custom Styling

```tsx
const [selectedValues, setSelectedValues] = useState<string[]>([]);

<MultiSelect
	options={frameworksWithIcons}
	onValueChange={setSelectedValues}
	defaultValue={selectedValues}
	placeholder="Select technologies"
	variant="inverted"
	maxCount={3}
	modalPopover={true}
/>;
```

### Async Data Loading

```tsx
const [options, setOptions] = useState<Option[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
	loadData().then((data) => {
		setOptions(data);
		setLoading(false);
	});
}, []);

<MultiSelect
	options={options}
	onValueChange={setSelectedValues}
	defaultValue={selectedValues}
	placeholder={loading ? "Loading..." : "Select items"}
	disabled={loading}
/>;
```

## 📚 API Reference

## 🎯 Best Practices

1. **Always provide meaningful labels**: Use descriptive placeholders and
   aria-labels
2. **Handle loading states**: Show loading indicators when fetching async data
3. **Limit display count**: Use `maxCount` for large selections to maintain UI
   clarity
4. **Use modal on mobile**: Set `modalPopover={true}` for better mobile
   experience
5. **Implement search**: For large option lists, consider adding search
   functionality
6. **Provide clear feedback**: Use the built-in announcements for screen readers

## �📚 API Reference

### Props

| Prop                        | Type                                                      | Default            | Description                                 |
| --------------------------- | --------------------------------------------------------- | ------------------ | ------------------------------------------- |
| `options`                   | `MultiSelectOption[] \| MultiSelectGroup[]`               | -                  | Array of selectable options or groups       |
| `onValueChange`             | `(value: string[]) => void`                               | -                  | Callback when selection changes             |
| `defaultValue`              | `string[]`                                                | `[]`               | Initially selected values                   |
| `placeholder`               | `string`                                                  | `"Select options"` | Placeholder text                            |
| `variant`                   | `"default" \| "secondary" \| "destructive" \| "inverted"` | `"default"`        | Visual variant                              |
| `animation`                 | `number`                                                  | `0`                | Legacy animation duration in seconds        |
| `animationConfig`           | `AnimationConfig`                                         | -                  | Advanced animation configuration            |
| `maxCount`                  | `number`                                                  | `3`                | Maximum visible selected items              |
| `modalPopover`              | `boolean`                                                 | `false`            | Modal behavior for popover                  |
| `asChild`                   | `boolean`                                                 | `false`            | Render as child component                   |
| `className`                 | `string`                                                  | -                  | Additional CSS classes                      |
| `hideSelectAll`             | `boolean`                                                 | `false`            | Hide "Select All" option                    |
| `searchable`                | `boolean`                                                 | `true`             | Enable search functionality                 |
| `emptyIndicator`            | `ReactNode`                                               | -                  | Custom empty state component                |
| `autoSize`                  | `boolean`                                                 | `false`            | Allow component to grow/shrink with content |
| `singleLine`                | `boolean`                                                 | `false`            | Show badges in single line with scroll      |
| `popoverClassName`          | `string`                                                  | -                  | Custom CSS class for popover content        |
| `disabled`                  | `boolean`                                                 | `false`            | Disable the entire component                |
| `responsive`                | `boolean \| ResponsiveConfig`                             | `false`            | Enable responsive behavior                  |
| `minWidth`                  | `string`                                                  | -                  | Minimum component width                     |
| `maxWidth`                  | `string`                                                  | -                  | Maximum component width                     |
| `deduplicateOptions`        | `boolean`                                                 | `false`            | Automatically remove duplicate options      |
| `resetOnDefaultValueChange` | `boolean`                                                 | `true`             | Reset state when defaultValue changes       |
| `closeOnSelect`             | `boolean`                                                 | `false`            | Close popover after selecting an option     |

### Types

#### AnimationConfig

```tsx
interface AnimationConfig {
	badgeAnimation?: "bounce" | "pulse" | "wiggle" | "fade" | "slide" | "none";
	popoverAnimation?: "scale" | "slide" | "fade" | "flip" | "none";
	optionHoverAnimation?: "highlight" | "scale" | "glow" | "none";
	duration?: number; // Animation duration in seconds
	delay?: number; // Animation delay in seconds
}
```

#### MultiSelectRef

```tsx
interface MultiSelectRef {
	reset: () => void; // Reset to default value
	getSelectedValues: () => string[]; // Get current selection
	setSelectedValues: (values: string[]) => void; // Set selection programmatically
	clear: () => void; // Clear all selections
	focus: () => void; // Focus the component
}
```

#### MultiSelectOption

```tsx
interface MultiSelectOption {
	label: string; // Display text
	value: string; // Unique identifier
	icon?: React.ComponentType<{
		// Optional icon component
		className?: string;
	}>;
	disabled?: boolean; // Whether option is disabled
	style?: {
		// Custom styling
		badgeColor?: string; // Custom badge background color
		iconColor?: string; // Custom icon color
		gradient?: string; // Gradient background (CSS gradient)
	};
}
```

#### MultiSelectGroup

```tsx
interface MultiSelectGroup {
	heading: string; // Group heading text
	options: MultiSelectOption[]; // Options in this group
}
```

## ♿ Accessibility

The MultiSelect component includes comprehensive accessibility features
built-in:

### ARIA Support

- **ARIA Live Regions**: Automatic announcements for screen readers when
  selections change
- **Role Attributes**: Proper `combobox`, `listbox`, and `option` roles
- **ARIA Labels**: Descriptive labels for all interactive elements
- **ARIA States**: `aria-expanded`, `aria-selected`, `aria-disabled` states

### Keyboard Navigation

- **Tab**: Focus component and navigate between elements
- **Enter/Space**: Open dropdown and select options
- **Arrow Keys**: Navigate through options
- **Escape**: Close dropdown
- **Backspace**: Remove last selected item when search is empty

### Screen Reader Announcements

The component automatically announces:

- Number of options selected
- When dropdown opens/closes
- Search results count
- Individual option selection/deselection

### Example with Enhanced Accessibility

```tsx
<MultiSelect
	options={options}
	onValueChange={setSelected}
	placeholder="Choose frameworks (accessible)"
	// Accessibility features are built-in and automatic
	searchable={true}
	aria-label="Framework selection"
/>
```

### Manual Accessibility Testing

```tsx
// The component provides imperative methods for testing
const multiSelectRef = useRef<MultiSelectRef>(null);

// Programmatic focus for testing
multiSelectRef.current?.focus();

// Check current selection
const currentValues = multiSelectRef.current?.getSelectedValues();
```

## 🎨 Styling Examples

### Custom Colors

```tsx
// Single color badge with custom icon color
{
  value: "react",
  label: "React",
  style: {
    badgeColor: "#61DAFB",
    iconColor: "#282C34"
  }
}

// Gradient badge (icon will be white by default)
{
  value: "vue",
  label: "Vue.js",
  style: {
    gradient: "linear-gradient(135deg, #4FC08D 0%, #42B883 100%)"
  }
}

// Multiple gradients
{
  value: "angular",
  label: "Angular",
  style: {
    gradient: "linear-gradient(45deg, #DD0031 0%, #C3002F 50%, #FF6B6B 100%)"
  }
}
```

### Brand Colors

```tsx
const brandColors = {
	react: { badgeColor: "#61DAFB", iconColor: "#282C34" },
	vue: { gradient: "linear-gradient(135deg, #4FC08D 0%, #42B883 100%)" },
	angular: { badgeColor: "#DD0031", iconColor: "#ffffff" },
	svelte: { gradient: "linear-gradient(135deg, #FF3E00 0%, #FF8A00 100%)" },
	node: { badgeColor: "#339933", iconColor: "#ffffff" },
};
```

### Animation Examples

```tsx
// Wiggle animation with custom timing
<MultiSelect
  options={options}
  onValueChange={setSelected}
  animationConfig={{
    badgeAnimation: "wiggle",
    duration: 0.5,
  }}
/>

// Pulse animation with delay
<MultiSelect
  options={options}
  onValueChange={setSelected}
  animationConfig={{
    badgeAnimation: "pulse",
    popoverAnimation: "fade",
    duration: 0.3,
    delay: 0.1,
  }}
/>

// Scale animation for popover
<MultiSelect
  options={options}
  onValueChange={setSelected}
  animationConfig={{
    badgeAnimation: "slide",
    popoverAnimation: "scale",
    duration: 0.4,
  }}
/>
```

## 🎯 Advanced Examples

### Advanced Animations

```tsx
<MultiSelect
	options={options}
	onValueChange={setSelected}
	animationConfig={{
		badgeAnimation: "wiggle",
		popoverAnimation: "scale",
		duration: 0.3,
		delay: 0.1,
	}}
	placeholder="Animated component"
/>
```

### Programmatic Control via Ref

```tsx
import { useRef } from "react";
import type { MultiSelectRef } from "@/components/multi-select";

function ControlledExample() {
	const multiSelectRef = useRef<MultiSelectRef>(null);

	const handleReset = () => {
		multiSelectRef.current?.reset();
	};

	const handleClear = () => {
		multiSelectRef.current?.clear();
	};

	const handleSelectAll = () => {
		const allValues = options.map((option) => option.value);
		multiSelectRef.current?.setSelectedValues(allValues);
	};

	const handleFocus = () => {
		multiSelectRef.current?.focus();
	};

	return (
		<div className="space-y-4">
			<MultiSelect
				ref={multiSelectRef}
				options={options}
				onValueChange={setSelected}
				placeholder="Controlled component"
			/>
			<div className="flex gap-2">
				<button onClick={handleReset}>Reset</button>
				<button onClick={handleClear}>Clear</button>
				<button onClick={handleSelectAll}>Select All</button>
				<button onClick={handleFocus}>Focus</button>
			</div>
		</div>
	);
}
```

### Auto-close on Select

```tsx
<MultiSelect
	options={options}
	onValueChange={setSelected}
	closeOnSelect={true}
	placeholder="Closes after each selection"
/>
```

### Duplicate Handling

```tsx
const optionsWithDuplicates = [
	{ value: "react", label: "React" },
	{ value: "react", label: "React Duplicate" }, // Will be handled
	{ value: "vue", label: "Vue.js" },
];

<MultiSelect
	options={optionsWithDuplicates}
	onValueChange={setSelected}
	deduplicateOptions={true} // Automatically removes duplicates
	placeholder="Handles duplicates"
/>;
```

### With Form Integration (React Hook Form)

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
	technologies: z.array(z.string()).min(1, "Select at least one technology"),
});

function MyForm() {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { technologies: [] },
	});

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<Controller
				control={form.control}
				name="technologies"
				render={({ field }) => (
					<MultiSelect
						options={techOptions}
						onValueChange={field.onChange}
						defaultValue={field.value}
						placeholder="Select technologies..."
					/>
				)}
			/>
		</form>
	);
}
```

### Programmatic Control

```tsx
function ControlledExample() {
	const [selected, setSelected] = useState<string[]>([]);

	const selectRandom = () => {
		const randomItems = options
			.filter((item) => !item.disabled)
			.sort(() => 0.5 - Math.random())
			.slice(0, 3)
			.map((item) => item.value);
		setSelected(randomItems);
	};

	return (
		<div>
			<MultiSelect
				options={options}
				onValueChange={setSelected}
				defaultValue={selected}
			/>
			<button onClick={selectRandom}>Random Selection</button>
			<button onClick={() => setSelected([])}>Clear All</button>
		</div>
	);
}
```

### Custom Empty State

```tsx
<MultiSelect
	options={options}
	onValueChange={setSelected}
	searchable={true}
	emptyIndicator={
		<div className="flex flex-col items-center p-4">
			<SearchIcon className="h-8 w-8 text-muted-foreground mb-2" />
			<p className="text-muted-foreground">No items found</p>
			<p className="text-xs text-muted-foreground">
				Try a different search term
			</p>
		</div>
	}
/>
```

### Complex Grouped Structure

```tsx
const complexStructure = [
	{
		heading: "Frontend Frameworks",
		options: [
			{
				value: "react",
				label: "React",
				icon: ReactIcon,
				style: { badgeColor: "#61DAFB", iconColor: "#282C34" },
			},
			{
				value: "vue",
				label: "Vue.js",
				icon: VueIcon,
				style: {
					gradient: "linear-gradient(135deg, #4FC08D 0%, #42B883 100%)",
				},
			},
			{
				value: "angular",
				label: "Angular",
				icon: AngularIcon,
				disabled: true,
				style: { badgeColor: "#DD0031", iconColor: "#ffffff" },
			},
		],
	},
	{
		heading: "State Management",
		options: [
			{ value: "redux", label: "Redux" },
			{ value: "zustand", label: "Zustand" },
			{ value: "recoil", label: "Recoil", disabled: true },
		],
	},
];
```

## 🎯 Use Cases

- **Technology Stack Selection**: Choose programming languages, frameworks,
  libraries
- **Skill Assessment**: Multi-skill selection for profiles or job applications
- **Category Filtering**: Filter content by multiple categories
- **Tag Management**: Select multiple tags for articles or products
- **Permission Management**: Assign multiple roles or permissions
- **Geographic Selection**: Choose multiple countries, regions, or locations
- **Product Configuration**: Select features, variants, or add-ons
- **Team Assignment**: Assign multiple team members to projects

## 🛠️ Customization

### Style Customization

The component uses CSS classes that can be customized via Tailwind CSS. You can
override styles by passing custom classes:

```tsx
<MultiSelect
	className="my-custom-class"
	options={options}
	onValueChange={setSelected}
/>
```

### Custom Variants

Create your own variants by extending the `multiSelectVariants`:

```tsx
const customVariants = cva("base-classes", {
	variants: {
		variant: {
			// ... existing variants
			premium: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
			minimal: "bg-transparent border-dashed",
		},
	},
});
```

### Theme Integration

The component automatically adapts to your theme (light/dark mode) when using
the shadcn/ui theme provider.

## 📝 TypeScript Support

The component is fully typed and provides excellent TypeScript support:

```tsx
// All types are exported for use
import type {
	MultiSelectOption,
	MultiSelectGroup,
	MultiSelectProps,
	MultiSelectRef,
	AnimationConfig,
} from "@/components/multi-select";

// Type-safe option creation
const createOption = (
	value: string,
	label: string,
	options?: Partial<MultiSelectOption>
): MultiSelectOption => ({
	value,
	label,
	...options,
});

// Type-safe event handlers
const handleChange = (values: string[]) => {
	// values is automatically typed as string[]
	console.log("Selected:", values);
};
```

## 🚀 Getting Started

### Clone and Run

```bash
# Clone the repository
git clone https://github.com/sersavan/shadcn-multi-select-component.git

# Navigate to the project
cd shadcn-multi-select-component

# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser to http://localhost:3000
```

### Project Structure

```text
├── src/
│   ├── app/
│   │   ├── page.tsx           # Demo page with examples
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── multi-select.tsx   # Main component
│   │   ├── icons.tsx          # Icon components
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       └── utils.ts           # Utility functions
├── components.json            # shadcn/ui config
├── tailwind.config.ts         # Tailwind configuration
└── package.json              # Dependencies and scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Powered by [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Live Demo

Check out the live demo:
[Multi-Select Component Demo](https://shadcn-multi-select-component.vercel.app)

---

Made with ❤️ by [sersavan](https://github.com/sersavan)
