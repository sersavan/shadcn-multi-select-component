"use client";

import { useState, useRef, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	Area,
	AreaChart,
	RadarChart,
	Radar,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Treemap,
} from "recharts";
import { Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header";
import { MultiSelect, MultiSelectRef } from "@/components/multi-select";
import { fa } from "zod/v4/locales";

// Sample data sets for different examples
const frameworksList = [
	{ value: "next.js", label: "Next.js", icon: Icons.code },
	{ value: "react", label: "React", icon: Icons.zap },
	{ value: "vue", label: "Vue.js", icon: Icons.globe },
	{ value: "angular", label: "Angular", icon: Icons.target },
	{ value: "svelte", label: "Svelte", icon: Icons.star },
	{ value: "nuxt.js", label: "Nuxt.js", icon: Icons.turtle },
	{ value: "remix", label: "Remix", icon: Icons.rabbit },
	{ value: "astro", label: "Astro", icon: Icons.fish },
	{ value: "gatsby", label: "Gatsby", icon: Icons.dog },
	{ value: "solid", label: "SolidJS", icon: Icons.cpu },
];

const techStackOptions = [
	{ value: "typescript", label: "TypeScript", icon: Icons.code },
	{ value: "javascript", label: "JavaScript", icon: Icons.zap },
	{ value: "python", label: "Python", icon: Icons.cpu },
	{ value: "java", label: "Java", icon: Icons.database },
	{ value: "csharp", label: "C#", icon: Icons.shield },
	{ value: "golang", label: "Go", icon: Icons.activity },
	{ value: "rust", label: "Rust", icon: Icons.harddrive },
	{ value: "php", label: "PHP", icon: Icons.globe },
];

const categorizedOptions = [
	{
		heading: "Frontend Frameworks",
		options: [
			{ value: "react", label: "React", icon: Icons.zap },
			{ value: "vue", label: "Vue.js", icon: Icons.globe },
			{ value: "angular", label: "Angular", icon: Icons.target },
			{ value: "svelte", label: "Svelte", icon: Icons.star },
		],
	},
	{
		heading: "Backend Technologies",
		options: [
			{ value: "nodejs", label: "Node.js", icon: Icons.cpu },
			{ value: "django", label: "Django", icon: Icons.database },
			{ value: "rails", label: "Ruby on Rails", icon: Icons.harddrive },
			{ value: "spring", label: "Spring Boot", icon: Icons.shield },
		],
	},
	{
		heading: "Databases",
		options: [
			{ value: "postgresql", label: "PostgreSQL", icon: Icons.database },
			{ value: "mongodb", label: "MongoDB", icon: Icons.database },
			{ value: "redis", label: "Redis", icon: Icons.activity },
			{ value: "mysql", label: "MySQL", icon: Icons.database },
		],
	},
];

const projectTypesWithStyle = [
	{
		value: "web-app",
		label: "Web Application",
		icon: Icons.globe,
		style: { badgeColor: "#3b82f6", gradient: "from-blue-500 to-purple-600" },
	},
	{
		value: "mobile-app",
		label: "Mobile App",
		icon: Icons.smartphone,
		style: { badgeColor: "#10b981", gradient: "from-green-500 to-teal-600" },
	},
	{
		value: "desktop-app",
		label: "Desktop Application",
		icon: Icons.monitor,
		style: { badgeColor: "#f59e0b", gradient: "from-yellow-500 to-orange-600" },
	},
	{
		value: "api-service",
		label: "API Service",
		icon: Icons.database,
		style: { badgeColor: "#ef4444", gradient: "from-red-500 to-pink-600" },
	},
	{
		value: "data-analytics",
		label: "Data Analytics",
		icon: Icons.pieChart,
		style: { badgeColor: "#8b5cf6", gradient: "from-purple-500 to-indigo-600" },
	},
];

const skillsWithDisabled = [
	{ value: "html", label: "HTML", icon: Icons.code },
	{ value: "css", label: "CSS", icon: Icons.wand },
	{ value: "javascript", label: "JavaScript", icon: Icons.zap },
	{
		value: "typescript",
		label: "TypeScript",
		icon: Icons.code,
		disabled: true,
	},
	{ value: "react", label: "React", icon: Icons.heart },
	{ value: "vue", label: "Vue.js", icon: Icons.globe, disabled: true },
	{ value: "angular", label: "Angular", icon: Icons.target },
];

const companyDepartments = [
	{ value: "engineering", label: "Engineering", icon: Icons.code },
	{ value: "design", label: "Design", icon: Icons.wand },
	{ value: "product", label: "Product Management", icon: Icons.target },
	{ value: "marketing", label: "Marketing", icon: Icons.trendingUp },
	{ value: "sales", label: "Sales", icon: Icons.dollarSign },
	{ value: "hr", label: "Human Resources", icon: Icons.users },
	{ value: "finance", label: "Finance", icon: Icons.pieChart },
	{ value: "operations", label: "Operations", icon: Icons.activity },
	{ value: "support", label: "Customer Support", icon: Icons.mail },
	{ value: "security", label: "Security", icon: Icons.shield },
];

// Chart data for different visualizations
const salesData = [
	{
		name: "Jan",
		engineering: 4000,
		design: 2400,
		product: 2400,
		marketing: 3200,
		sales: 5000,
	},
	{
		name: "Feb",
		engineering: 3000,
		design: 1398,
		product: 2210,
		marketing: 2800,
		sales: 4500,
	},
	{
		name: "Mar",
		engineering: 2000,
		design: 9800,
		product: 2290,
		marketing: 3900,
		sales: 6000,
	},
	{
		name: "Apr",
		engineering: 2780,
		design: 3908,
		product: 2000,
		marketing: 4100,
		sales: 5500,
	},
	{
		name: "May",
		engineering: 1890,
		design: 4800,
		product: 2181,
		marketing: 3700,
		sales: 7000,
	},
	{
		name: "Jun",
		engineering: 2390,
		design: 3800,
		product: 2500,
		marketing: 4200,
		sales: 6500,
	},
];

// Custom Tooltip Component with Portal-like behavior
const CustomTooltip = ({ active, payload, label, type = "default" }: any) => {
	if (active && payload && payload.length) {
		return (
			<div
				className="chart-tooltip bg-background/99 backdrop-blur-md border border-border/60 rounded-lg shadow-2xl p-4 max-w-xs animate-in fade-in-0 zoom-in-95 duration-200"
				style={{
					zIndex: 999999,
					pointerEvents: "none",
					boxShadow:
						"0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
				}}>
				<div className="flex items-center gap-2 mb-3">
					<div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
					<p className="font-semibold text-foreground text-sm">{label}</p>
				</div>
				<div className="space-y-2">
					{payload.map((entry: any, index: number) => (
						<div
							key={index}
							className="flex items-center justify-between gap-4 group">
							<div className="flex items-center gap-2">
								<div
									className="w-3 h-3 rounded-sm border border-white/20 transition-all duration-200 group-hover:scale-110"
									style={{ backgroundColor: entry.color }}></div>
								<span className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
									{type === "department"
										? companyDepartments.find((d) => d.value === entry.dataKey)
												?.label || entry.dataKey
										: entry.name || entry.dataKey}
								</span>
							</div>
							<span className="font-medium text-foreground text-sm transition-colors duration-200 group-hover:text-primary">
								{type === "currency"
									? new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
											minimumFractionDigits: 0,
									  }).format(Number(entry.value))
									: type === "percentage"
									? `${Number(entry.value).toFixed(1)}%`
									: type === "number"
									? new Intl.NumberFormat().format(Number(entry.value))
									: entry.value}
							</span>
						</div>
					))}
				</div>
				{type === "pie" && (
					<div className="mt-3 pt-2 border-t border-border/30">
						<div className="text-xs text-muted-foreground">
							Total:{" "}
							{new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
								minimumFractionDigits: 0,
							}).format(
								payload.reduce(
									(sum: number, entry: any) => sum + Number(entry.value),
									0
								)
							)}
						</div>
					</div>
				)}
			</div>
		);
	}
	return null;
};

// Custom Pie Chart Tooltip
const PieTooltip = ({ active, payload }: any) => {
	if (active && payload && payload.length) {
		const data = payload[0];
		const total =
			data.payload.total ||
			payload.reduce((sum: number, p: any) => sum + p.value, 0);
		return (
			<div
				className="chart-tooltip bg-background/98 backdrop-blur-md border border-border/60 rounded-lg shadow-2xl p-4 animate-in fade-in-0 zoom-in-95 duration-200"
				style={{
					zIndex: 999999,
					pointerEvents: "none",
					boxShadow:
						"0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
				}}>
				<div className="flex items-center gap-3 mb-3">
					<div
						className="w-4 h-4 rounded-full border-2 border-white/30 transition-all duration-200 hover:scale-110"
						style={{ backgroundColor: data.payload.color }}></div>
					<span className="font-semibold text-foreground">
						{data.payload.name}
					</span>
				</div>
				<div className="space-y-2">
					<div className="flex justify-between items-center gap-4 group">
						<span className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
							Revenue:
						</span>
						<span className="font-medium transition-colors duration-200 group-hover:text-primary">
							{new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
								minimumFractionDigits: 0,
							}).format(Number(data.value))}
						</span>
					</div>
					<div className="flex justify-between items-center gap-4 group">
						<span className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
							Share:
						</span>
						<span className="font-medium text-primary transition-colors duration-200">
							{((data.value / total) * 100).toFixed(1)}%
						</span>
					</div>
				</div>
				<div className="mt-3 pt-2 border-t border-border/30">
					<div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
							style={{ width: `${(data.value / total) * 100}%` }}></div>
					</div>
				</div>
			</div>
		);
	}
	return null;
};

const revenueData = [
	{
		quarter: "Q1",
		engineering: 85000,
		design: 45000,
		product: 55000,
		marketing: 35000,
		sales: 95000,
		hr: 25000,
		finance: 40000,
		operations: 50000,
		support: 30000,
		security: 35000,
	},
	{
		quarter: "Q2",
		engineering: 92000,
		design: 52000,
		product: 61000,
		marketing: 42000,
		sales: 103000,
		hr: 28000,
		finance: 45000,
		operations: 55000,
		support: 35000,
		security: 40000,
	},
	{
		quarter: "Q3",
		engineering: 98000,
		design: 58000,
		product: 67000,
		marketing: 48000,
		sales: 110000,
		hr: 32000,
		finance: 50000,
		operations: 62000,
		support: 40000,
		security: 45000,
	},
	{
		quarter: "Q4",
		engineering: 105000,
		design: 65000,
		product: 74000,
		marketing: 55000,
		sales: 125000,
		hr: 38000,
		finance: 58000,
		operations: 70000,
		support: 48000,
		security: 52000,
	},
];

const productMetrics = [
	{
		metric: "User Engagement",
		engineering: 85,
		design: 92,
		product: 78,
		marketing: 88,
	},
	{
		metric: "Feature Adoption",
		engineering: 72,
		design: 85,
		product: 90,
		marketing: 65,
	},
	{
		metric: "Customer Satisfaction",
		engineering: 88,
		design: 94,
		product: 92,
		marketing: 89,
	},
	{
		metric: "Performance Score",
		engineering: 95,
		design: 78,
		product: 85,
		marketing: 82,
	},
	{
		metric: "Innovation Index",
		engineering: 90,
		design: 88,
		product: 85,
		marketing: 75,
	},
];

// Color palette for charts
const chartColors = {
	engineering: "#3b82f6",
	design: "#10b981",
	product: "#f59e0b",
	marketing: "#ef4444",
	sales: "#8b5cf6",
	hr: "#06b6d4",
	finance: "#84cc16",
	operations: "#f97316",
	support: "#ec4899",
	security: "#6366f1",
};

// Gradient definitions for charts
const GradientDefs = () => (
	<defs>
		<linearGradient id="colorEngineering" x1="0" y1="0" x2="0" y2="1">
			<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
			<stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
		</linearGradient>
		<linearGradient id="colorDesign" x1="0" y1="0" x2="0" y2="1">
			<stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
			<stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
		</linearGradient>
		<linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
			<stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
			<stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
		</linearGradient>
		<linearGradient id="colorMarketing" x1="0" y1="0" x2="0" y2="1">
			<stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
			<stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
		</linearGradient>
		<linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
			<stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
			<stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
		</linearGradient>
		<linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
			<stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
			<stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
		</linearGradient>
	</defs>
);

const getGradientId = (dept: string) =>
	`color${dept.charAt(0).toUpperCase() + dept.slice(1)}`;

const metricsOptions = [
	{ value: "revenue", label: "Revenue", icon: Icons.dollarSign },
	{ value: "users", label: "Active Users", icon: Icons.users },
	{ value: "performance", label: "Performance", icon: Icons.activity },
	{ value: "satisfaction", label: "Satisfaction", icon: Icons.heart },
	{ value: "growth", label: "Growth Rate", icon: Icons.trendingUp },
];

const timePeriodsOptions = [
	{ value: "daily", label: "Daily", icon: Icons.calendar },
	{ value: "weekly", label: "Weekly", icon: Icons.calendar },
	{ value: "monthly", label: "Monthly", icon: Icons.calendar },
	{ value: "quarterly", label: "Quarterly", icon: Icons.calendar },
	{ value: "yearly", label: "Yearly", icon: Icons.calendar },
];

const FormSchema = z.object({
	frameworks: z
		.array(z.string())
		.min(1, "Please select at least one framework."),
	techStack: z.array(z.string()).optional(),
	skills: z.array(z.string()).optional(),
	departments: z.array(z.string()).optional(),
});

export default function Home() {
	// State for standalone examples
	const [basicSelection, setBasicSelection] = useState<string[]>([
		"react",
		"next.js",
	]);
	const [variantSelection, setVariantSelection] = useState<string[]>([
		"typescript",
	]);
	const [animatedSelection, setAnimatedSelection] = useState<string[]>([
		"web-app",
	]);
	const [responsiveSelection, setResponsiveSelection] = useState<string[]>([
		"engineering",
		"design",
	]);
	const [groupedSelection, setGroupedSelection] = useState<string[]>([
		"react",
		"nodejs",
	]);
	const [styledSelection, setStyledSelection] = useState<string[]>([
		"web-app",
		"mobile-app",
	]);
	const [disabledSelection, setDisabledSelection] = useState<string[]>([
		"html",
		"css",
	]);
	const [imperativeSelection, setImperativeSelection] = useState<string[]>([
		"javascript",
	]);

	// Chart selections
	const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
		"engineering",
		"design",
		"product",
	]);
	const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
		"revenue",
		"users",
		"performance",
	]);
	const [selectedTimePeriods, setSelectedTimePeriods] = useState<string[]>([
		"monthly",
		"quarterly",
	]);

	// Refs for imperative methods example
	const multiSelectRef = useRef<MultiSelectRef>(null);

	// Computed chart data based on selections
	const filteredSalesData = useMemo(() => {
		// Filter by time periods - if monthly is selected, show monthly data
		if (!selectedTimePeriods.includes("monthly")) {
			return [];
		}
		return salesData.map((item) => {
			const filtered: any = { name: item.name };
			selectedDepartments.forEach((dept) => {
				if (item[dept as keyof typeof item] !== undefined) {
					filtered[dept] = item[dept as keyof typeof item];
				}
			});
			return filtered;
		});
	}, [selectedDepartments, selectedTimePeriods]);

	const pieChartData = useMemo(() => {
		// Only show pie chart if revenue metric is selected
		if (!selectedMetrics.includes("revenue")) {
			return [];
		}
		const q4Data = revenueData[3]; // Q4 data
		return selectedDepartments.map((dept) => ({
			name: companyDepartments.find((d) => d.value === dept)?.label || dept,
			value: q4Data[dept as keyof typeof q4Data] || 0,
			color: chartColors[dept as keyof typeof chartColors] || "#8884d8",
		}));
	}, [selectedDepartments, selectedMetrics]);

	const areaChartData = useMemo(() => {
		// Filter by time periods - if quarterly is selected, show quarterly data
		if (!selectedTimePeriods.includes("quarterly")) {
			return [];
		}
		return revenueData.map((item) => {
			const filtered: any = { quarter: item.quarter };
			selectedDepartments.forEach((dept) => {
				if (item[dept as keyof typeof item] !== undefined) {
					filtered[dept] = item[dept as keyof typeof item];
				}
			});
			return filtered;
		});
	}, [selectedDepartments, selectedTimePeriods]);

	const lineChartData = useMemo(() => {
		// Filter metrics based on selected metrics
		const metricsToShow = selectedMetrics.includes("performance")
			? productMetrics
			: [];
		return metricsToShow;
	}, [selectedMetrics]);

	// Radar Chart Data
	const radarChartData = useMemo(() => {
		if (!selectedMetrics.includes("performance")) return [];

		return [
			{
				subject: "Quality",
				engineering: 85,
				design: 90,
				product: 75,
				marketing: 70,
				fullMark: 100,
			},
			{
				subject: "Speed",
				engineering: 95,
				design: 70,
				product: 80,
				marketing: 85,
				fullMark: 100,
			},
			{
				subject: "Innovation",
				engineering: 80,
				design: 95,
				product: 90,
				marketing: 75,
				fullMark: 100,
			},
			{
				subject: "Collaboration",
				engineering: 75,
				design: 85,
				product: 95,
				marketing: 90,
				fullMark: 100,
			},
			{
				subject: "Efficiency",
				engineering: 90,
				design: 80,
				product: 85,
				marketing: 80,
				fullMark: 100,
			},
			{
				subject: "Customer Focus",
				engineering: 70,
				design: 75,
				product: 90,
				marketing: 95,
				fullMark: 100,
			},
		];
	}, [selectedMetrics]);

	// Treemap Data
	const treemapData = useMemo(() => {
		if (!selectedMetrics.includes("revenue")) return [];

		return [
			{ name: "Frontend", size: 1200, fill: "#8884d8" },
			{ name: "Backend", size: 800, fill: "#82ca9d" },
			{ name: "DevOps", size: 400, fill: "#ffc658" },
			{ name: "UI/UX", size: 1000, fill: "#ff7c7c" },
			{ name: "Graphics", size: 400, fill: "#8dd1e1" },
			{ name: "Research", size: 200, fill: "#d084d0" },
			{ name: "Strategy", size: 800, fill: "#ffb347" },
			{ name: "Analytics", size: 600, fill: "#87ceeb" },
			{ name: "Management", size: 400, fill: "#dda0dd" },
			{ name: "Digital", size: 600, fill: "#98fb98" },
			{ name: "Content", size: 400, fill: "#f0e68c" },
			{ name: "Social", size: 200, fill: "#ffa07a" },
		];
	}, [selectedMetrics]);

	const generateMetricData = useMemo(() => {
		const baseData = [
			{ period: "Week 1", value: 100 },
			{ period: "Week 2", value: 120 },
			{ period: "Week 3", value: 110 },
			{ period: "Week 4", value: 140 },
		];

		const monthlyData = [
			{ period: "Jan", value: 450 },
			{ period: "Feb", value: 520 },
			{ period: "Mar", value: 480 },
			{ period: "Apr", value: 600 },
		];

		const result: any = {};

		if (selectedMetrics.includes("users")) {
			result.users = selectedTimePeriods.includes("weekly")
				? baseData.map((d) => ({ ...d, users: d.value * 100 }))
				: monthlyData.map((d) => ({ ...d, users: d.value * 80 }));
		}

		if (selectedMetrics.includes("growth")) {
			result.growth = selectedTimePeriods.includes("weekly")
				? baseData.map((d) => ({ ...d, growth: d.value * 0.1 }))
				: monthlyData.map((d) => ({ ...d, growth: d.value * 0.15 }));
		}

		if (selectedMetrics.includes("satisfaction")) {
			result.satisfaction = selectedTimePeriods.includes("weekly")
				? baseData.map((d) => ({
						...d,
						satisfaction: Math.min(95, d.value * 0.7 + 20),
				  }))
				: monthlyData.map((d) => ({
						...d,
						satisfaction: Math.min(98, d.value * 0.12 + 60),
				  }));
		}

		return result;
	}, [selectedMetrics, selectedTimePeriods]);

	// Form for comprehensive example
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			frameworks: ["next.js", "react"],
			techStack: ["typescript"],
			skills: ["html", "css", "javascript"],
			departments: ["engineering"],
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		toast(
			`Form submitted with: Frameworks: ${data.frameworks?.join(
				", "
			)}, Tech Stack: ${data.techStack?.join(
				", "
			)}, Skills: ${data.skills?.join(
				", "
			)}, Departments: ${data.departments?.join(", ")}`
		);
	}

	// Imperative methods handlers
	const handleReset = () => {
		multiSelectRef.current?.reset();
		toast("MultiSelect reset to default values");
	};

	const handleClear = () => {
		multiSelectRef.current?.clear();
		toast("MultiSelect cleared");
	};

	const handleFocus = () => {
		multiSelectRef.current?.focus();
		toast("MultiSelect focused");
	};

	const handleGetValues = () => {
		const values = multiSelectRef.current?.getSelectedValues();
		toast(`Current values: ${values?.join(", ") || "None"}`);
	};

	const handleSetValues = () => {
		multiSelectRef.current?.setSelectedValues(["react", "vue", "angular"]);
		toast("Set values to: React, Vue.js, Angular");
	};

	return (
		<main className="min-h-screen bg-background">
			{/* Header */}
			<div className="container mx-auto px-4 py-8">
				<PageHeader className="text-center">
					<PageHeaderHeading>Multi Select Component</PageHeaderHeading>
					<PageHeaderDescription>
						assembled with shadcn/ui and Radix UI primitives
					</PageHeaderDescription>
					<PageActions>
						<Link
							target="_blank"
							rel="noreferrer"
							href="https://github.com/sersavan/shadcn-multi-select-component"
							className={cn(buttonVariants({ variant: "outline" }))}>
							<Icons.gitHub className="mr-2 h-4 w-4" />
							GitHub
						</Link>
					</PageActions>
				</PageHeader>

				{/* Examples Grid */}
				<div className="grid gap-6 mt-12">
					{/* Form Integration */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							1. Form Integration with Validation
						</h3>
						<p className="text-muted-foreground mb-4">
							React Hook Form integration with Zod validation
						</p>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6">
								<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
									<FormField
										control={form.control}
										name="frameworks"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Required Frameworks *</FormLabel>
												<FormControl>
													<MultiSelect
														options={frameworksList}
														onValueChange={field.onChange}
														defaultValue={field.value}
														placeholder="Select frameworks"
														autoSize={false}
													/>
												</FormControl>
												<FormDescription>
													Choose your preferred frameworks (required)
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="techStack"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tech Stack</FormLabel>
												<FormControl>
													<MultiSelect
														options={techStackOptions}
														onValueChange={field.onChange}
														defaultValue={field.value || []}
														placeholder="Select technologies"
														variant="secondary"
														maxCount={4}
														autoSize={false}
													/>
												</FormControl>
												<FormDescription>
													Additional technologies you use
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="skills"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Skills</FormLabel>
												<FormControl>
													<MultiSelect
														options={skillsWithDisabled}
														onValueChange={field.onChange}
														defaultValue={field.value || []}
														placeholder="Select your skills"
														variant="inverted"
														maxCount={5}
														animationConfig={{ badgeAnimation: "pulse" }}
														autoSize={false}
													/>
												</FormControl>
												<FormDescription>
													Your technical skills (some may be disabled)
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="departments"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Departments</FormLabel>
												<FormControl>
													<MultiSelect
														options={companyDepartments}
														onValueChange={field.onChange}
														defaultValue={field.value || []}
														placeholder="Select departments"
														autoSize={false}
													/>
												</FormControl>
												<FormDescription>
													Departments you work with
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<Button type="submit" className="w-full">
									Submit Form
								</Button>
							</form>
						</Form>
					</Card>

					{/* Variants Example */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							2. Component Variants
						</h3>
						<p className="text-muted-foreground mb-4">
							Different visual styles: default, secondary, destructive, and
							inverted
						</p>
						<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
							<div className="space-y-2">
								<label className="text-sm font-medium">Default</label>
								<MultiSelect
									options={techStackOptions.slice(0, 4)}
									onValueChange={() => {}}
									defaultValue={["typescript"]}
									placeholder="Default variant"
									maxCount={2}
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Secondary</label>
								<MultiSelect
									options={techStackOptions.slice(0, 4)}
									onValueChange={() => {}}
									defaultValue={["javascript"]}
									variant="secondary"
									placeholder="Secondary variant"
									maxCount={2}
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Destructive</label>
								<MultiSelect
									options={techStackOptions.slice(0, 4)}
									onValueChange={() => {}}
									defaultValue={["python"]}
									variant="destructive"
									placeholder="Destructive variant"
									maxCount={2}
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Inverted</label>
								<MultiSelect
									options={techStackOptions.slice(0, 4)}
									onValueChange={setVariantSelection}
									defaultValue={["typescript"]}
									variant="inverted"
									placeholder="Inverted variant"
									maxCount={2}
									autoSize={false}
								/>
							</div>
						</div>
					</Card>

					{/* Animation Example */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							3. Animation Configurations
						</h3>
						<p className="text-muted-foreground mb-4">
							Different animation effects for badges and interactions
						</p>
						<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							<div className="space-y-2">
								<label className="text-sm font-medium">Pulse Animation</label>
								<MultiSelect
									options={projectTypesWithStyle.slice(0, 3)}
									onValueChange={() => {}}
									defaultValue={["web-app"]}
									animationConfig={{
										badgeAnimation: "pulse",
										duration: 0.4,
									}}
									placeholder="Smooth pulse effect"
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Fade Animation</label>
								<MultiSelect
									options={projectTypesWithStyle.slice(0, 3)}
									onValueChange={() => {}}
									defaultValue={["mobile-app"]}
									animationConfig={{
										badgeAnimation: "fade",
										duration: 0.3,
									}}
									placeholder="Fade effect"
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Wiggle Animation</label>
								<MultiSelect
									options={projectTypesWithStyle.slice(0, 3)}
									onValueChange={setAnimatedSelection}
									defaultValue={["web-app"]}
									animationConfig={{
										badgeAnimation: "wiggle",
										duration: 0.4,
									}}
									placeholder="Wiggle effect"
									autoSize={false}
								/>
							</div>
						</div>
					</Card>

					{/* Responsive Example */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							4. Responsive Behavior
						</h3>
						<p className="text-muted-foreground mb-4">
							Adaptive maxCount and layout based on screen size
						</p>
						<div className="space-y-4">
							<MultiSelect
								options={companyDepartments}
								onValueChange={setResponsiveSelection}
								defaultValue={["engineering", "design"]}
								placeholder="Select departments"
								responsive={{
									mobile: { maxCount: 1, compactMode: true },
									tablet: { maxCount: 2, compactMode: false },
									desktop: { maxCount: 4, compactMode: false },
								}}
								className="w-full"
							/>
							<p className="text-sm text-muted-foreground">
								Resize your window to see different maxCount values: Mobile (1),
								Tablet (2), Desktop (4)
							</p>
						</div>
					</Card>

					{/* Grouped Options */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">5. Grouped Options</h3>
						<p className="text-muted-foreground mb-4">
							Options organized into categories with separators
						</p>
						<div className="space-y-4">
							<MultiSelect
								options={categorizedOptions}
								onValueChange={setGroupedSelection}
								defaultValue={["react", "nodejs"]}
								placeholder="Select technologies"
								className="w-full max-w-lg"
								maxCount={5}
							/>
							<p className="text-sm text-muted-foreground">
								Selected: {groupedSelection.join(", ") || "None"}
							</p>
						</div>
					</Card>

					{/* Search and Configuration */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							6. Search and UI Configuration
						</h3>
						<p className="text-muted-foreground mb-4">
							Search functionality, select all, and empty state customization
						</p>
						<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
							<div className="space-y-2">
								<label className="text-sm font-medium">
									With Search (Default)
								</label>
								<MultiSelect
									options={frameworksList}
									onValueChange={() => {}}
									defaultValue={["react"]}
									searchable={true}
									hideSelectAll={false}
									placeholder="Search frameworks"
									emptyIndicator={
										<div className="text-center p-4 text-muted-foreground">
											No frameworks found matching your search
										</div>
									}
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">
									No Search + No Select All
								</label>
								<MultiSelect
									options={techStackOptions.slice(0, 6)}
									onValueChange={() => {}}
									defaultValue={["typescript"]}
									searchable={false}
									hideSelectAll={true}
									placeholder="Select without search"
									autoSize={false}
								/>
							</div>
						</div>
					</Card>

					{/* Layout Options */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							7. Layout and Sizing Options
						</h3>
						<p className="text-muted-foreground mb-4">
							Different layout modes: single line, auto-sizing, and width
							constraints
						</p>
						<div className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm font-medium">Single Line Mode</label>
								<MultiSelect
									options={companyDepartments.slice(0, 6)}
									onValueChange={() => {}}
									defaultValue={[
										"engineering",
										"design",
										"product",
										"marketing",
									]}
									singleLine={true}
									maxCount={8}
									placeholder="Single line layout"
									className="w-full"
								/>
							</div>
							<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Fixed Width (autoSize=false)
									</label>
									<MultiSelect
										options={skillsWithDisabled.slice(0, 4)}
										onValueChange={() => {}}
										defaultValue={["html", "css"]}
										autoSize={false}
										minWidth="300px"
										placeholder="Fixed width"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Auto Width (autoSize=true)
									</label>
									<MultiSelect
										options={skillsWithDisabled.slice(0, 4)}
										onValueChange={() => {}}
										defaultValue={["javascript"]}
										autoSize={true}
										placeholder="Auto width"
									/>
								</div>
							</div>
						</div>
					</Card>

					{/* Custom Styling */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							8. Custom Styling and Colors
						</h3>
						<p className="text-muted-foreground mb-4">
							Options with custom badge colors and gradient backgrounds
						</p>
						<div className="space-y-4">
							<MultiSelect
								options={projectTypesWithStyle}
								onValueChange={setStyledSelection}
								defaultValue={["web-app", "mobile-app"]}
								placeholder="Select project types"
								className="w-full max-w-lg"
								maxCount={5}
							/>
							<p className="text-sm text-muted-foreground">
								Each option has custom colors and gradients defined in the style
								property
							</p>
						</div>
					</Card>

					{/* Disabled States */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">9. Disabled States</h3>
						<p className="text-muted-foreground mb-4">
							Component-level and option-level disabled states
						</p>
						<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Individual Disabled Options
								</label>
								<MultiSelect
									options={skillsWithDisabled}
									onValueChange={setDisabledSelection}
									defaultValue={["html", "css"]}
									placeholder="Some options disabled"
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Entirely Disabled Component
								</label>
								<MultiSelect
									options={techStackOptions.slice(0, 4)}
									onValueChange={() => {}}
									defaultValue={["typescript", "javascript"]}
									disabled={true}
									placeholder="Disabled component"
									autoSize={false}
								/>
							</div>
						</div>
					</Card>

					{/* Advanced Features */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							10. Advanced Features
						</h3>
						<p className="text-muted-foreground mb-4">
							Close on select, modal popover, and duplicate handling
						</p>
						<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
							<div className="space-y-2">
								<label className="text-sm font-medium">Close on Select</label>
								<MultiSelect
									options={frameworksList.slice(0, 5)}
									onValueChange={() => {}}
									defaultValue={["react"]}
									closeOnSelect={true}
									placeholder="Closes after selection"
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Modal Popover</label>
								<MultiSelect
									options={techStackOptions.slice(0, 5)}
									onValueChange={() => {}}
									defaultValue={["typescript"]}
									modalPopover={true}
									placeholder="Modal behavior"
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Duplicate Labels Example
								</label>
								<MultiSelect
									options={[
										{ value: "ts1", label: "TypeScript", icon: Icons.code },
										{ value: "js1", label: "JavaScript", icon: Icons.zap },
										{ value: "py1", label: "Python", icon: Icons.cpu },
										{
											value: "ts2",
											label: "TypeScript (Backend)",
											icon: Icons.code,
										},
										{
											value: "js2",
											label: "JavaScript (Node)",
											icon: Icons.zap,
										},
									]}
									onValueChange={() => {}}
									defaultValue={["ts1"]}
									deduplicateOptions={false}
									placeholder="Similar labels allowed"
									autoSize={false}
								/>
							</div>
						</div>
					</Card>

					{/* Imperative Methods */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							11. Imperative Methods (useRef)
						</h3>
						<p className="text-muted-foreground mb-4">
							Programmatic control using ref methods
						</p>
						<div className="space-y-4">
							<MultiSelect
								ref={multiSelectRef}
								options={frameworksList}
								onValueChange={setImperativeSelection}
								defaultValue={["react", "next.js"]}
								placeholder="Controlled via ref"
								className="w-full max-w-md"
							/>
							<div className="flex flex-wrap gap-2">
								<Button size="sm" variant="outline" onClick={handleReset}>
									Reset
								</Button>
								<Button size="sm" variant="outline" onClick={handleClear}>
									Clear
								</Button>
								<Button size="sm" variant="outline" onClick={handleFocus}>
									Focus
								</Button>
								<Button size="sm" variant="outline" onClick={handleGetValues}>
									Get Values
								</Button>
								<Button size="sm" variant="outline" onClick={handleSetValues}>
									Set Values
								</Button>
							</div>
							<p className="text-sm text-muted-foreground">
								Current selection: {imperativeSelection.join(", ") || "None"}
							</p>
						</div>
					</Card>

					{/* Charts and Data Visualization */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							12. Charts and Data Visualization
						</h3>
						<p className="text-muted-foreground mb-6">
							Interactive charts that update based on MultiSelect selections
						</p>

						{/* Chart Controls */}
						<div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-8">
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Select Departments
								</label>
								<MultiSelect
									options={companyDepartments}
									onValueChange={setSelectedDepartments}
									defaultValue={["engineering", "design", "product"]}
									placeholder="Choose departments"
									variant="default"
									maxCount={4}
									className="w-full"
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Select Metrics</label>
								<MultiSelect
									options={metricsOptions}
									onValueChange={setSelectedMetrics}
									defaultValue={["revenue", "users", "performance"]}
									placeholder="Choose metrics"
									variant="secondary"
									maxCount={3}
									className="w-full"
									autoSize={false}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Time Periods</label>
								<MultiSelect
									options={timePeriodsOptions}
									onValueChange={setSelectedTimePeriods}
									defaultValue={["monthly", "quarterly"]}
									placeholder="Select periods"
									variant="inverted"
									maxCount={2}
									className="w-full"
									autoSize={false}
								/>
							</div>
						</div>

						{/* Charts Grid */}
						<div className="grid gap-6 lg:grid-cols-2">
							{/* Bar Chart */}
							<Card className="p-4">
								<h4 className="text-lg font-medium mb-4">
									Monthly Sales by Department
									{!selectedTimePeriods.includes("monthly") && (
										<span className="text-sm text-muted-foreground ml-2">
											(Select &ldquo;Monthly&rdquo; to view)
										</span>
									)}
								</h4>
								<div className="h-80">
									{selectedTimePeriods.includes("monthly") &&
									filteredSalesData.length > 0 ? (
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={filteredSalesData}>
												<XAxis
													dataKey="name"
													className="text-sm"
													tick={{ fontSize: 12 }}
													axisLine={{ stroke: "hsl(var(--border))" }}
													tickLine={{ stroke: "hsl(var(--border))" }}
												/>
												<YAxis
													className="text-sm"
													tick={{ fontSize: 12 }}
													axisLine={{ stroke: "hsl(var(--border))" }}
													tickLine={{ stroke: "hsl(var(--border))" }}
													tickFormatter={(value) =>
														new Intl.NumberFormat("en-US", {
															notation: "compact",
															compactDisplay: "short",
														}).format(value)
													}
												/>
												<Tooltip content={<CustomTooltip type="currency" />} />
												<Legend
													wrapperStyle={{ fontSize: "14px" }}
													iconType="rect"
													formatter={(value: string) => (
														<span className="text-sm font-medium">
															{companyDepartments.find((d) => d.value === value)
																?.label || value}
														</span>
													)}
												/>
												{selectedDepartments.map((dept, index) => (
													<Bar
														key={dept}
														dataKey={dept}
														fill={chartColors[dept as keyof typeof chartColors]}
														name={dept}
														radius={[2, 2, 0, 0]}
														className="transition-all duration-200 hover:opacity-80"
														isAnimationActive={false}
													/>
												))}
											</BarChart>
										</ResponsiveContainer>
									) : (
										<div className="flex items-center justify-center h-full text-muted-foreground">
											<div className="text-center">
												<Icons.calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
												<p>
													Select &ldquo;Monthly&rdquo; period to view sales data
												</p>
											</div>
										</div>
									)}
								</div>
							</Card>

							{/* Pie Chart */}
							<Card className="p-4">
								<h4 className="text-lg font-medium mb-4">
									Q4 Revenue Distribution
									{!selectedMetrics.includes("revenue") && (
										<span className="text-sm text-muted-foreground ml-2">
											(Select &ldquo;Revenue&rdquo; metric to view)
										</span>
									)}
								</h4>
								<div className="h-80">
									{selectedMetrics.includes("revenue") &&
									pieChartData.length > 0 ? (
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={pieChartData}
													cx="50%"
													cy="50%"
													outerRadius={100}
													fill="#8884d8"
													dataKey="value"
													label={({ name, percent }: any) =>
														`${name} ${((percent || 0) * 100).toFixed(0)}%`
													}
													labelLine={false}
													className="outline-none">
													{pieChartData.map((entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={entry.color}
															stroke="rgba(255,255,255,0.1)"
															strokeWidth={2}
															className="transition-all duration-200 hover:opacity-80"
														/>
													))}
												</Pie>
												<Tooltip content={<PieTooltip />} />
												<Legend
													wrapperStyle={{ fontSize: "14px" }}
													iconType="circle"
													formatter={(value: string, entry: any) => (
														<span
															className="text-sm font-medium"
															style={{ color: entry.color }}>
															{value}
														</span>
													)}
												/>
											</PieChart>
										</ResponsiveContainer>
									) : (
										<div className="flex items-center justify-center h-full text-muted-foreground">
											<div className="text-center">
												<Icons.dollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
												<p>
													Select &ldquo;Revenue&rdquo; metric to view
													distribution
												</p>
											</div>
										</div>
									)}
								</div>
							</Card>

							{/* Area Chart */}
							<Card className="p-4">
								<h4 className="text-lg font-medium mb-4">
									Quarterly Revenue Trends
									{!selectedTimePeriods.includes("quarterly") && (
										<span className="text-sm text-muted-foreground ml-2">
											(Select &ldquo;Quarterly&rdquo; to view)
										</span>
									)}
								</h4>
								<div
									className="h-80 relative overflow-visible"
									style={{ zIndex: 1 }}>
									{selectedTimePeriods.includes("quarterly") &&
									areaChartData.length > 0 ? (
										<ResponsiveContainer width="100%" height="100%">
											<AreaChart data={areaChartData}>
												<GradientDefs />
												<XAxis
													dataKey="quarter"
													className="text-sm"
													tick={{ fontSize: 12 }}
													axisLine={{ stroke: "hsl(var(--border))" }}
													tickLine={{ stroke: "hsl(var(--border))" }}
												/>
												<YAxis
													className="text-sm"
													tick={{ fontSize: 12 }}
													axisLine={{ stroke: "hsl(var(--border))" }}
													tickLine={{ stroke: "hsl(var(--border))" }}
													tickFormatter={(value) =>
														new Intl.NumberFormat("en-US", {
															notation: "compact",
															compactDisplay: "short",
														}).format(value)
													}
												/>
												<Tooltip content={<CustomTooltip type="currency" />} />
												<Legend
													wrapperStyle={{ fontSize: "14px", zIndex: 1 }}
													iconType="rect"
													formatter={(value: string) => (
														<span className="text-sm font-medium">
															{companyDepartments.find((d) => d.value === value)
																?.label || value}
														</span>
													)}
												/>
												{selectedDepartments.map((dept, index) => (
													<Area
														key={dept}
														type="monotone"
														dataKey={dept}
														stackId="1"
														stroke={
															chartColors[dept as keyof typeof chartColors]
														}
														fill={`url(#${getGradientId(dept)})`}
														strokeWidth={2}
														className="transition-all duration-200"
													/>
												))}
											</AreaChart>
										</ResponsiveContainer>
									) : (
										<div className="flex items-center justify-center h-full text-muted-foreground">
											<div className="text-center">
												<Icons.calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
												<p>
													Select &ldquo;Quarterly&rdquo; period to view trends
												</p>
											</div>
										</div>
									)}
								</div>
							</Card>

							{/* Line Chart */}
							<Card className="p-4">
								<h4 className="text-lg font-medium mb-4">
									Performance Metrics Comparison
									{!selectedMetrics.includes("performance") && (
										<span className="text-sm text-muted-foreground ml-2">
											(Select &ldquo;Performance&rdquo; metric to view)
										</span>
									)}
								</h4>
								<div className="h-80">
									{selectedMetrics.includes("performance") &&
									lineChartData.length > 0 ? (
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={lineChartData}>
												<YAxis
													className="text-sm"
													tick={{ fontSize: 12 }}
													axisLine={{ stroke: "hsl(var(--border))" }}
													tickLine={{ stroke: "hsl(var(--border))" }}
													tickFormatter={(value) => `${value}%`}
												/>
												<Tooltip
													content={<CustomTooltip type="percentage" />}
												/>
												<Legend
													wrapperStyle={{ fontSize: "14px" }}
													iconType="line"
													formatter={(value: string) => (
														<span className="text-sm font-medium">
															{companyDepartments.find((d) => d.value === value)
																?.label || value}
														</span>
													)}
												/>
												{selectedDepartments
													.filter((dept) =>
														[
															"engineering",
															"design",
															"product",
															"marketing",
														].includes(dept)
													)
													.map((dept, index) => (
														<Line
															key={dept}
															type="monotone"
															dataKey={dept}
															stroke={
																chartColors[dept as keyof typeof chartColors]
															}
															strokeWidth={3}
															dot={{
																fill: chartColors[
																	dept as keyof typeof chartColors
																],
																strokeWidth: 2,
																r: 5,
																className:
																	"transition-all duration-200 hover:r-7",
															}}
															activeDot={{
																r: 8,
																stroke:
																	chartColors[dept as keyof typeof chartColors],
																strokeWidth: 2,
																fill: chartColors[
																	dept as keyof typeof chartColors
																],
															}}
															name={
																companyDepartments.find((d) => d.value === dept)
																	?.label || dept
															}
															className="transition-all duration-200"
														/>
													))}
											</LineChart>
										</ResponsiveContainer>
									) : (
										<div className="flex items-center justify-center h-full text-muted-foreground">
											<div className="text-center">
												<Icons.activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
												<p>
													Select &ldquo;Performance&rdquo; metric to view
													comparison
												</p>
											</div>
										</div>
									)}
								</div>
							</Card>

							{/* Radar Chart */}
							<Card className="p-4">
								<h4 className="text-lg font-medium mb-4">
									Team Skills Radar
									{!selectedMetrics.includes("performance") && (
										<span className="text-sm text-muted-foreground ml-2">
											(Select &ldquo;Performance&rdquo; metric to view)
										</span>
									)}
								</h4>
								<div className="h-80">
									{selectedMetrics.includes("performance") &&
									radarChartData.length > 0 ? (
										<ResponsiveContainer width="100%" height="100%">
											<RadarChart data={radarChartData}>
												<PolarGrid gridType="polygon" className="opacity-30" />
												<PolarAngleAxis
													dataKey="subject"
													className="text-sm"
													tick={{ fontSize: 12 }}
												/>
												<PolarRadiusAxis
													angle={90}
													domain={[0, 100]}
													className="text-sm"
													tick={{ fontSize: 10 }}
													tickCount={6}
												/>
												<Tooltip
													content={<CustomTooltip type="percentage" />}
												/>
												<Legend
													wrapperStyle={{ fontSize: "14px" }}
													iconType="line"
													formatter={(value: string) => (
														<span className="text-sm font-medium">
															{companyDepartments.find((d) => d.value === value)
																?.label || value}
														</span>
													)}
												/>
												{selectedDepartments
													.filter((dept) =>
														[
															"engineering",
															"design",
															"product",
															"marketing",
														].includes(dept)
													)
													.map((dept, index) => (
														<Radar
															key={dept}
															name={
																companyDepartments.find((d) => d.value === dept)
																	?.label || dept
															}
															dataKey={dept}
															stroke={
																chartColors[dept as keyof typeof chartColors]
															}
															fill={
																chartColors[dept as keyof typeof chartColors]
															}
															fillOpacity={0.1}
															strokeWidth={2}
															dot={{
																fill: chartColors[
																	dept as keyof typeof chartColors
																],
																strokeWidth: 2,
																r: 4,
															}}
														/>
													))}
											</RadarChart>
										</ResponsiveContainer>
									) : (
										<div className="flex items-center justify-center h-full text-muted-foreground">
											<div className="text-center">
												<Icons.target className="h-12 w-12 mx-auto mb-2 opacity-50" />
												<p>
													Select &ldquo;Performance&rdquo; metric to view skills
													radar
												</p>
											</div>
										</div>
									)}
								</div>
							</Card>

							{/* Treemap Chart */}
							<Card className="p-4">
								<h4 className="text-lg font-medium mb-4">
									Revenue Distribution by Teams
									{!selectedMetrics.includes("revenue") && (
										<span className="text-sm text-muted-foreground ml-2">
											(Select &ldquo;Revenue&rdquo; metric to view)
										</span>
									)}
								</h4>
								<div className="h-80">
									{selectedMetrics.includes("revenue") &&
									treemapData.length > 0 ? (
										<ResponsiveContainer width="100%" height="100%">
											<Treemap
												data={treemapData}
												dataKey="size"
												stroke="#fff"
												fill="#8884d8"
											/>
										</ResponsiveContainer>
									) : (
										<div className="flex items-center justify-center h-full text-muted-foreground">
											<div className="text-center">
												<Icons.pieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
												<p>
													Select &ldquo;Revenue&rdquo; metric to view team
													distribution
												</p>
											</div>
										</div>
									)}
								</div>
							</Card>
						</div>

						{/* Chart Info */}
						<div className="mt-6 p-4 bg-muted rounded-lg">
							<h5 className="font-medium mb-2">Interactive Features:</h5>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>
									• Select different departments to filter chart data across all
									visualizations
								</li>
								<li>
									• Choose specific metrics (Revenue, Users, Performance, etc.)
									to control which charts are displayed
								</li>
								<li>
									• Select time periods (Monthly, Quarterly, Weekly) to change
									chart timeframes
								</li>
								<li>
									• Charts automatically update and show/hide based on your
									selections
								</li>
								<li>
									• Hover over chart elements for detailed tooltips with
									formatted values
								</li>
								<li>
									• Each department has a unique color for easy identification
									across charts
								</li>
							</ul>
							<div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded border-l-4 border-blue-400">
								<p className="text-sm font-medium text-blue-800 dark:text-blue-200">
									💡 Try different combinations: Select &ldquo;Revenue&rdquo; +
									&ldquo;Quarterly&rdquo; for revenue trends, or
									&ldquo;Performance&rdquo; + specific departments for
									performance comparison!
								</p>
							</div>
						</div>
					</Card>

					{/* Props Reference */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">13. Props Reference</h3>
						<div className="prose prose-sm max-w-none">
							<div className="grid gap-4 text-sm">
								<div className="space-y-2">
									<h4 className="font-medium">Core Props</h4>
									<ul className="space-y-1 text-muted-foreground">
										<li>
											<code>options</code>: Array of options or grouped options
										</li>
										<li>
											<code>onValueChange</code>: Callback for value changes
										</li>
										<li>
											<code>defaultValue</code>: Initial selected values
											(default: [])
										</li>
										<li>
											<code>placeholder</code>: Placeholder text (default:
											&ldquo;Select options&rdquo;)
										</li>
									</ul>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium">Appearance</h4>
									<ul className="space-y-1 text-muted-foreground">
										<li>
											<code>variant</code>: &ldquo;default&rdquo; |
											&ldquo;secondary&rdquo; | &ldquo;destructive&rdquo; |
											&ldquo;inverted&rdquo;
										</li>
										<li>
											<code>maxCount</code>: Max badges to show (default: 3)
										</li>
										<li>
											<code>autoSize</code>: Auto width behavior (default: true)
										</li>
										<li>
											<code>singleLine</code>: Single line layout (default:
											false)
										</li>
									</ul>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium">Behavior</h4>
									<ul className="space-y-1 text-muted-foreground">
										<li>
											<code>searchable</code>: Enable search (default: true)
										</li>
										<li>
											<code>hideSelectAll</code>: Hide select all button
											(default: false)
										</li>
										<li>
											<code>closeOnSelect</code>: Close after selection
											(default: false)
										</li>
										<li>
											<code>disabled</code>: Disable component (default: false)
										</li>
									</ul>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium">Advanced</h4>
									<ul className="space-y-1 text-muted-foreground">
										<li>
											<code>responsive</code>: Responsive configuration
										</li>
										<li>
											<code>animationConfig</code>: Animation settings
										</li>
										<li>
											<code>modalPopover</code>: Modal behavior (default: false)
										</li>
										<li>
											<code>deduplicateOptions</code>: Remove duplicates
											(default: false)
										</li>
									</ul>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Code Example Section */}
				<div className="mt-12">
					<Card className="p-6">
						<div className="space-y-4">
							<div className="space-y-2">
								<h3 className="text-xl font-semibold">14. Example Usage</h3>
								<p className="text-muted-foreground">
									Copy and paste this code to get started with the MultiSelect
									component
								</p>
							</div>
							<div className="relative">
								<pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
									<code>{`import { MultiSelect } from "@/components/multi-select";
import { useState } from "react";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

export function MyComponent() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <MultiSelect
      options={options}
      onValueChange={setSelectedValues}
      defaultValue={selectedValues}
      placeholder="Select frameworks"
      variant="default"
      animation={0.2}
      maxCount={3}
    />
  );
}`}</code>
								</pre>
								<Button
									size="sm"
									variant="outline"
									className="absolute top-2 right-2"
									onClick={() => {
										navigator.clipboard
											.writeText(`import { MultiSelect } from "@/components/multi-select";
import { useState } from "react";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

export function MyComponent() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <MultiSelect
      options={options}
      onValueChange={setSelectedValues}
      defaultValue={selectedValues}
      placeholder="Select frameworks"
      variant="default"
      animation={0.2}
      maxCount={3}
    />
  );
}`);
										toast.success("Code copied to clipboard!");
									}}>
									<Copy className="h-4 w-4" />
									Copy
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</main>
	);
}
