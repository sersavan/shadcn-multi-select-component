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
import { Copy, ChevronDown } from "lucide-react";

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
import { AIChat } from "@/components/ai-chat";

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

const llmModelsOptions = [
	{ value: "gpt-4o", label: "GPT-4o", icon: Icons.zap },
	{ value: "gpt-4-turbo", label: "GPT-4 Turbo", icon: Icons.zap },
	{ value: "claude-3-opus", label: "Claude 3 Opus", icon: Icons.cpu },
	{ value: "claude-3-sonnet", label: "Claude 3 Sonnet", icon: Icons.cpu },
	{ value: "gemini-pro", label: "Gemini Pro", icon: Icons.star },
	{ value: "llama-3-70b", label: "Llama 3 70B", icon: Icons.cpu },
	{ value: "mistral-large", label: "Mistral Large", icon: Icons.activity },
	{ value: "cohere-command", label: "Cohere Command", icon: Icons.globe },
];

const aiToolsCategories = [
	{
		heading: "Language Models",
		options: [
			{ value: "openai-gpt", label: "OpenAI GPT", icon: Icons.zap },
			{ value: "anthropic-claude", label: "Anthropic Claude", icon: Icons.cpu },
			{ value: "google-gemini", label: "Google Gemini", icon: Icons.star },
			{ value: "meta-llama", label: "Meta Llama", icon: Icons.cpu },
		],
	},
	{
		heading: "AI Agents",
		options: [
			{ value: "code-assistant", label: "Code Assistant", icon: Icons.code },
			{ value: "research-agent", label: "Research Agent", icon: Icons.search },
			{
				value: "writing-assistant",
				label: "Writing Assistant",
				icon: Icons.wand,
			},
			{ value: "data-analyst", label: "Data Analyst", icon: Icons.pieChart },
		],
	},
	{
		heading: "Vector Databases",
		options: [
			{ value: "pinecone", label: "Pinecone", icon: Icons.database },
			{ value: "weaviate", label: "Weaviate", icon: Icons.database },
			{ value: "chroma", label: "Chroma", icon: Icons.database },
			{ value: "qdrant", label: "Qdrant", icon: Icons.database },
		],
	},
];

const promptTemplateTypes = [
	{
		value: "system-prompt",
		label: "System Prompt",
		icon: Icons.shield,
		style: { badgeColor: "#8b5cf6", gradient: "from-purple-500 to-indigo-600" },
	},
	{
		value: "few-shot",
		label: "Few-shot Learning",
		icon: Icons.target,
		style: { badgeColor: "#06b6d4", gradient: "from-cyan-500 to-blue-600" },
	},
	{
		value: "chain-of-thought",
		label: "Chain of Thought",
		icon: Icons.activity,
		style: { badgeColor: "#10b981", gradient: "from-emerald-500 to-teal-600" },
	},
	{
		value: "role-playing",
		label: "Role Playing",
		icon: Icons.users,
		style: { badgeColor: "#f59e0b", gradient: "from-amber-500 to-orange-600" },
	},
	{
		value: "code-generation",
		label: "Code Generation",
		icon: Icons.code,
		style: { badgeColor: "#ef4444", gradient: "from-red-500 to-pink-600" },
	},
	{
		value: "data-analysis",
		label: "Data Analysis",
		icon: Icons.pieChart,
		style: { badgeColor: "#3b82f6", gradient: "from-blue-500 to-purple-600" },
	},
];

const ragDataSources = [
	{ value: "pdf-documents", label: "PDF Documents", icon: Icons.harddrive },
	{ value: "web-pages", label: "Web Pages", icon: Icons.globe },
	{ value: "knowledge-base", label: "Knowledge Base", icon: Icons.database },
	{ value: "api-endpoints", label: "API Endpoints", icon: Icons.activity },
	{ value: "code-repositories", label: "Code Repositories", icon: Icons.code },
	{ value: "chat-history", label: "Chat History", icon: Icons.mail },
	{ value: "documentation", label: "Documentation", icon: Icons.monitor },
	{ value: "spreadsheets", label: "Spreadsheets", icon: Icons.database },
];

const aiModelParameters = [
	{
		heading: "Generation Settings",
		options: [
			{ value: "temperature", label: "Temperature", icon: Icons.activity },
			{ value: "top-p", label: "Top-p (Nucleus)", icon: Icons.target },
			{ value: "max-tokens", label: "Max Tokens", icon: Icons.cpu },
			{
				value: "frequency-penalty",
				label: "Frequency Penalty",
				icon: Icons.trendingUp,
			},
		],
	},
	{
		heading: "Response Control",
		options: [
			{ value: "stop-sequences", label: "Stop Sequences", icon: Icons.shield },
			{
				value: "presence-penalty",
				label: "Presence Penalty",
				icon: Icons.dollarSign,
			},
			{ value: "response-format", label: "Response Format", icon: Icons.code },
			{ value: "seed", label: "Seed", icon: Icons.star },
		],
	},
];

const aiAgentCapabilities = [
	{
		heading: "Content Creation",
		options: [
			{ value: "text-generation", label: "Text Generation", icon: Icons.wand },
			{ value: "code-writing", label: "Code Writing", icon: Icons.code },
			{
				value: "image-generation",
				label: "Image Generation",
				icon: Icons.star,
			},
			{
				value: "document-editing",
				label: "Document Editing",
				icon: Icons.harddrive,
			},
		],
	},
	{
		heading: "Analysis & Research",
		options: [
			{ value: "data-analysis", label: "Data Analysis", icon: Icons.pieChart },
			{ value: "web-research", label: "Web Research", icon: Icons.search },
			{ value: "code-review", label: "Code Review", icon: Icons.shield },
			{
				value: "sentiment-analysis",
				label: "Sentiment Analysis",
				icon: Icons.heart,
			},
		],
	},
	{
		heading: "Communication",
		options: [
			{ value: "translation", label: "Translation", icon: Icons.globe },
			{ value: "summarization", label: "Summarization", icon: Icons.target },
			{ value: "email-writing", label: "Email Writing", icon: Icons.mail },
			{
				value: "chatbot-responses",
				label: "Chatbot Responses",
				icon: Icons.users,
			},
		],
	},
];

const multimodalOptions = [
	{
		value: "text-to-image",
		label: "Text to Image",
		icon: Icons.star,
		style: { badgeColor: "#8b5cf6", gradient: "from-purple-500 to-pink-600" },
	},
	{
		value: "image-to-text",
		label: "Image to Text",
		icon: Icons.monitor,
		style: { badgeColor: "#06b6d4", gradient: "from-cyan-500 to-blue-600" },
	},
	{
		value: "text-to-speech",
		label: "Text to Speech",
		icon: Icons.activity,
		style: { badgeColor: "#10b981", gradient: "from-emerald-500 to-teal-600" },
	},
	{
		value: "speech-to-text",
		label: "Speech to Text",
		icon: Icons.cpu,
		style: { badgeColor: "#f59e0b", gradient: "from-amber-500 to-orange-600" },
	},
	{
		value: "video-analysis",
		label: "Video Analysis",
		icon: Icons.calendar,
		style: { badgeColor: "#ef4444", gradient: "from-red-500 to-pink-600" },
	},
	{
		value: "audio-generation",
		label: "Audio Generation",
		icon: Icons.zap,
		style: { badgeColor: "#3b82f6", gradient: "from-blue-500 to-purple-600" },
	},
];

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
	const [isInfoExpanded, setIsInfoExpanded] = useState(false);

	const [groupedSelection, setGroupedSelection] = useState<string[]>([
		"react",
		"nodejs",
	]);
	const [imperativeSelection, setImperativeSelection] = useState<string[]>([
		"javascript",
	]);

	const [variantDemo, setVariantDemo] = useState<string[]>(["typescript"]);
	const [animatedDemo, setAnimatedDemo] = useState<string[]>(["web-app"]);
	const [responsiveDemo, setResponsiveDemo] = useState<string[]>([
		"engineering",
		"design",
	]);
	const [styledDemo, setStyledDemo] = useState<string[]>([
		"web-app",
		"mobile-app",
	]);
	const [disabledDemo, setDisabledDemo] = useState<string[]>(["html", "css"]);

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

	const [selectedLLMs, setSelectedLLMs] = useState<string[]>([]);
	const [selectedAITools, setSelectedAITools] = useState<string[]>([]);
	const [selectedPromptTypes, setSelectedPromptTypes] = useState<string[]>([]);
	const [selectedRAGSources, setSelectedRAGSources] = useState<string[]>([]);
	const [selectedAIParameters, setSelectedAIParameters] = useState<string[]>(
		[]
	);
	const [selectedAgentCapabilities, setSelectedAgentCapabilities] = useState<
		string[]
	>([]);
	const [selectedMultimodal, setSelectedMultimodal] = useState<string[]>([]);

	const multiSelectRef = useRef<MultiSelectRef>(null);

	const filteredSalesData = useMemo(() => {
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
		if (!selectedMetrics.includes("revenue")) {
			return [];
		}
		const q4Data = revenueData[3];
		return selectedDepartments.map((dept) => ({
			name: companyDepartments.find((d) => d.value === dept)?.label || dept,
			value: q4Data[dept as keyof typeof q4Data] || 0,
			color: chartColors[dept as keyof typeof chartColors] || "#8884d8",
		}));
	}, [selectedDepartments, selectedMetrics]);

	const areaChartData = useMemo(() => {
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
		const metricsToShow = selectedMetrics.includes("performance")
			? productMetrics
			: [];
		return metricsToShow;
	}, [selectedMetrics]);

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
		<main className="min-h-screen bg-background overflow-x-hidden">
			{/* Header */}
			<div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 w-full min-w-0">
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

				{/* Interactive Examples Introduction */}
				<div className="mt-4 mb-4">
					<Card className="p-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 overflow-hidden">
						{/* Header - Always Visible */}
						<div
							className="p-6 cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
							onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
										<Icons.zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
									</div>
									<div>
										<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
											Interactive Examples & Live Demos
										</h3>
										<p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
											{isInfoExpanded
												? "Click to collapse detailed information"
												: "Click to learn more about examples and AI assistant"}
										</p>
									</div>
								</div>
								<ChevronDown
									className={cn(
										"w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-200",
										isInfoExpanded && "rotate-180"
									)}
								/>
							</div>
						</div>

						{/* Expandable Content */}
						<div
							className={cn(
								"overflow-hidden transition-all duration-300 ease-in-out",
								isInfoExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
							)}>
							<div className="px-6 pb-6">
								<p className="text-blue-700 dark:text-blue-300 mb-4 leading-relaxed">
									Explore comprehensive examples showcasing all MultiSelect
									features including form integration, animations, responsive
									design, AI/LLM configurations, and data visualization. Each
									example is fully interactive and demonstrates real-world use
									cases.
								</p>
								<div className="flex flex-col sm:flex-row gap-3 mb-4">
									<div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
										<Icons.messageCircle className="w-4 h-4" />
										<span className="font-medium">Need help?</span>
										<span>Ask our AI assistant in the chat widget</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
										<Icons.bot className="w-4 h-4" />
										<span className="font-medium">AI Expert:</span>
										<span>Get instant answers about MultiSelect usage</span>
									</div>
								</div>
								<div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-700">
									<div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
										<Icons.activity className="w-4 h-4" />
										<span className="font-medium">💡 Pro Tip:</span>
									</div>
									<p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
										Click the chat button in the bottom-right corner to ask
										questions about props, styling, integration patterns, or
										troubleshooting. The AI assistant specializes in MultiSelect
										usage!
									</p>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Examples Grid */}
				<div className="grid gap-3 sm:gap-6 mt-12 w-full min-w-0">
					{/* Form Integration */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
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
								<div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2 w-full min-w-0">
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
														animationConfig={{ badgeAnimation: "pulse" }}
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
					<Card className="p-3 sm:p-6 w-full min-w-0">
						<h3 className="text-xl font-semibold mb-4">
							2. Component Variants
						</h3>
						<p className="text-muted-foreground mb-4">
							Different visual styles: default, secondary, destructive, and
							inverted
						</p>
						<div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-2 w-full min-w-0">
							<div className="space-y-2 min-w-0">
								<label className="text-sm font-medium">Default</label>
								<MultiSelect
									options={techStackOptions.slice(0, 4)}
									onValueChange={() => {}}
									defaultValue={["typescript"]}
									placeholder="Default variant"
									maxCount={2}
								/>
							</div>
							<div className="space-y-2 min-w-0">
								<label className="text-sm font-medium">Secondary</label>
								<MultiSelect
									options={techStackOptions.slice(0, 4)}
									onValueChange={() => {}}
									defaultValue={["javascript"]}
									variant="secondary"
									placeholder="Secondary variant"
									maxCount={2}
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
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Inverted</label>
								<MultiSelect
									options={techStackOptions.slice(0, 4)}
									onValueChange={setVariantDemo}
									defaultValue={["typescript"]}
									variant="inverted"
									placeholder="Inverted variant"
									maxCount={2}
								/>
							</div>
						</div>
					</Card>

					{/* Animation Example */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
						<h3 className="text-xl font-semibold mb-4">
							3. Animation Configurations
						</h3>
						<p className="text-muted-foreground mb-4">
							Different animation effects for badges and interactions
						</p>
						<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Wiggle Animation</label>
								<MultiSelect
									options={projectTypesWithStyle.slice(0, 3)}
									onValueChange={setAnimatedDemo}
									defaultValue={["web-app"]}
									animationConfig={{
										badgeAnimation: "wiggle",
										duration: 0.4,
									}}
									placeholder="Wiggle effect"
								/>
							</div>
						</div>
					</Card>

					{/* Responsive Example */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
						<h3 className="text-xl font-semibold mb-4">
							4. Responsive Behavior
						</h3>
						<p className="text-muted-foreground mb-4">
							Adaptive maxCount and layout based on screen size - try resizing
							your browser window
						</p>
						<div className="space-y-4">
							<MultiSelect
								options={companyDepartments}
								onValueChange={setResponsiveDemo}
								defaultValue={["engineering", "design"]}
								placeholder="Select departments"
								responsive={{
									mobile: { maxCount: 1, compactMode: true },
									tablet: { maxCount: 2, compactMode: false },
									desktop: { maxCount: 4, compactMode: false },
								}}
								className="w-full"
								autoSize={true}
							/>
							<p className="text-sm text-muted-foreground">
								Resize your window to see different maxCount values: Mobile (1),
								Tablet (2), Desktop (4)
							</p>
							<p className="text-xs text-muted-foreground">
								Selected: {responsiveDemo.join(", ") || "None"}
							</p>
						</div>
					</Card>

					{/* Grouped Options */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
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
								className="w-full max-w-full sm:max-w-lg"
								maxCount={5}
								autoSize={true}
							/>
							<p className="text-xs text-muted-foreground">
								Selected: {groupedSelection.join(", ") || "None"}
							</p>
						</div>
					</Card>

					{/* Search and Configuration */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
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
								/>
							</div>
						</div>
					</Card>

					{/* Layout Options */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
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
										"sales",
									]}
									singleLine={true}
									maxCount={8}
									placeholder="Single line layout with scrolling"
									className="w-full"
									autoSize={true}
								/>
								<p className="text-xs text-muted-foreground">
									Select more options to see the thin scroll bar
								</p>
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
										className="w-full min-w-0"
										placeholder="Fixed width"
										autoSize={true}
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Auto Width (autoSize=true)
									</label>
									<MultiSelect
										options={skillsWithDisabled.slice(0, 4)}
										onValueChange={() => {}}
										defaultValue={["html"]}
										autoSize={true}
										placeholder="Auto width"
									/>
								</div>
							</div>
						</div>
					</Card>

					{/* Custom Styling */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
						<h3 className="text-xl font-semibold mb-4">
							8. Custom Styling and Colors
						</h3>
						<p className="text-muted-foreground mb-4">
							Options with custom badge colors and gradient backgrounds
						</p>
						<div className="space-y-4">
							<MultiSelect
								options={projectTypesWithStyle}
								onValueChange={setStyledDemo}
								defaultValue={["web-app", "mobile-app"]}
								placeholder="Select project types"
								className="w-full max-w-full sm:max-w-lg"
								maxCount={5}
								autoSize={true}
							/>
							<p className="text-sm text-muted-foreground">
								Each option has custom colors and gradients defined in the style
								property
							</p>
							<p className="text-xs text-muted-foreground">
								Selected: {styledDemo.join(", ") || "None"}
							</p>
						</div>
					</Card>

					{/* Disabled States */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
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
									onValueChange={setDisabledDemo}
									defaultValue={["html", "css"]}
									placeholder="Some options disabled"
								/>
								<p className="text-xs text-muted-foreground">
									Selected: {disabledDemo.join(", ") || "None"}
								</p>
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
								/>
							</div>
						</div>
					</Card>

					{/* Advanced Features */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
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
								/>
							</div>
						</div>
					</Card>

					{/* Imperative Methods */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
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
								className="w-full max-w-full sm:max-w-md"
								autoSize={true}
							/>
							<div className="flex flex-wrap gap-1 sm:gap-2">
								<Button size="sm" variant="outline" onClick={handleReset}>
									<Icons.activity className="mr-1 h-3 w-3" />
									Reset
								</Button>
								<Button size="sm" variant="outline" onClick={handleClear}>
									<Icons.zap className="mr-1 h-3 w-3" />
									Clear
								</Button>
								<Button size="sm" variant="outline" onClick={handleFocus}>
									<Icons.target className="mr-1 h-3 w-3" />
									Focus
								</Button>
								<Button size="sm" variant="outline" onClick={handleGetValues}>
									<Icons.search className="mr-1 h-3 w-3" />
									Get Values
								</Button>
								<Button size="sm" variant="outline" onClick={handleSetValues}>
									<Icons.wand className="mr-1 h-3 w-3" />
									Set Values
								</Button>
							</div>
							<p className="text-xs text-muted-foreground">
								Current selection: {imperativeSelection.join(", ") || "None"}
							</p>
						</div>
					</Card>

					{/* Charts and Data Visualization */}
					<Card className="p-3 sm:p-6 w-full min-w-0">
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
								/>
							</div>
						</div>

						{/* Charts Grid */}
						<div className="grid gap-3 sm:gap-6 grid-cols-1 lg:grid-cols-2 w-full min-w-0">
							{/* Bar Chart */}
							<Card className="p-2 sm:p-4 w-full min-w-0">
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
							<Card className="p-4 w-full min-w-0">
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
													innerRadius={50}
													outerRadius={80}
													fill="#8884d8"
													dataKey="value"
													label={({ name, percent }: any) =>
														`${name} ${((percent || 0) * 100).toFixed(0)}%`
													}
													labelLine={true}
													className="outline-none text-xs">
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
							<Card className="p-4 w-full min-w-0">
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
							<Card className="p-4 w-full min-w-0">
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
							<Card className="p-4 w-full min-w-0">
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
							<Card className="p-4 w-full min-w-0">
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
								<p className="text-sm font-medium text-blue-800 dark:text-blue-200 break-words">
									💡 Try different combinations: Select &ldquo;Revenue&rdquo; +
									&ldquo;Quarterly&rdquo; for revenue trends, or
									&ldquo;Performance&rdquo; + specific departments for
									performance comparison!
								</p>
							</div>
						</div>
					</Card>

					{/* AI/LLM Examples Section */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							13. AI & LLM Integration Examples
						</h3>
						<p className="text-muted-foreground mb-6">
							Perfect for AI applications, chatbots, prompt engineering, and
							machine learning workflows.
						</p>

						<div className="grid gap-6">
							{/* LLM Model Selection */}
							<Card className="p-4 w-full min-w-0">
								<h4 className="text-lg font-medium mb-4">
									LLM Model Selection
								</h4>
								<MultiSelect
									options={llmModelsOptions}
									onValueChange={(value) => setSelectedLLMs(value)}
									defaultValue={["gpt-4o", "claude-3-opus"]}
									placeholder="Select AI models"
									variant="default"
									animationConfig={{ badgeAnimation: "pulse" }}
									className="w-full"
								/>
								<p className="text-sm text-muted-foreground mt-2">
									Choose multiple language models for comparison, A/B testing,
									or ensemble predictions.
								</p>
							</Card>

							{/* AI Tools Categories */}
							<Card className="p-4 w-full min-w-0">
								<h4 className="text-lg font-medium mb-4">
									AI Tools & Services
								</h4>
								<MultiSelect
									options={aiToolsCategories}
									onValueChange={(value) => setSelectedAITools(value)}
									defaultValue={["openai-gpt", "code-assistant", "pinecone"]}
									placeholder="Select AI tools"
									variant="secondary"
									animationConfig={{ badgeAnimation: "wiggle" }}
									className="w-full"
									searchable={true}
								/>
								<p className="text-sm text-muted-foreground mt-2">
									Organize AI services by category for better workflow
									management and tool selection.
								</p>
							</Card>

							{/* Prompt Template Types */}
							<Card className="p-4 w-full min-w-0">
								<h4 className="text-lg font-medium mb-4">
									Prompt Engineering Templates
								</h4>
								<MultiSelect
									options={promptTemplateTypes}
									onValueChange={(value) => setSelectedPromptTypes(value)}
									defaultValue={["system-prompt", "few-shot"]}
									placeholder="Select prompt types"
									variant="default"
									animationConfig={{ badgeAnimation: "bounce" }}
									className="w-full"
									maxCount={4}
								/>
								<p className="text-sm text-muted-foreground mt-2">
									Select prompt engineering patterns with custom styling for
									different template types.
								</p>
							</Card>

							{/* RAG Data Sources */}
							<Card className="p-4 w-full min-w-0">
								<h4 className="text-lg font-medium mb-4">RAG Data Sources</h4>
								<MultiSelect
									options={ragDataSources}
									onValueChange={(value) => setSelectedRAGSources(value)}
									defaultValue={[
										"pdf-documents",
										"knowledge-base",
										"web-pages",
									]}
									placeholder="Select data sources"
									variant="secondary"
									animationConfig={{ badgeAnimation: "slide" }}
									className="w-full"
									hideSelectAll={false}
								/>
								<p className="text-sm text-muted-foreground mt-2">
									Configure Retrieval-Augmented Generation with multiple data
									sources for enhanced AI responses.
								</p>
							</Card>

							{/* AI Model Parameters */}
							<Card className="p-4 w-full min-w-0">
								<h4 className="text-lg font-medium mb-4">
									Model Parameters Configuration
								</h4>
								<MultiSelect
									options={aiModelParameters}
									onValueChange={(value) => setSelectedAIParameters(value)}
									defaultValue={["temperature", "max-tokens", "top-p"]}
									placeholder="Select parameters"
									variant="default"
									animationConfig={{ badgeAnimation: "fade" }}
									className="w-full"
									responsive={true}
								/>
								<p className="text-sm text-muted-foreground mt-2">
									Fine-tune AI model behavior by selecting generation and
									response control parameters.
								</p>
							</Card>

							{/* AI Agent Capabilities */}
							<Card className="p-4 w-full min-w-0">
								<h4 className="text-lg font-medium mb-4">
									AI Agent Capabilities
								</h4>
								<MultiSelect
									options={aiAgentCapabilities}
									onValueChange={(value) => setSelectedAgentCapabilities(value)}
									defaultValue={[
										"text-generation",
										"data-analysis",
										"translation",
									]}
									placeholder="Select capabilities"
									variant="secondary"
									animationConfig={{ badgeAnimation: "bounce" }}
									className="w-full"
									maxCount={5}
								/>
								<p className="text-sm text-muted-foreground mt-2">
									Define what your AI agent can do by selecting from content
									creation, analysis, and communication capabilities.
								</p>
							</Card>

							{/* Multimodal AI Features */}
							<Card className="p-4 w-full min-w-0">
								<h4 className="text-lg font-medium mb-4">
									Multimodal AI Features
								</h4>
								<MultiSelect
									options={multimodalOptions}
									onValueChange={(value) => setSelectedMultimodal(value)}
									defaultValue={["text-to-image", "speech-to-text"]}
									placeholder="Select modalities"
									variant="default"
									animationConfig={{ badgeAnimation: "wiggle" }}
									className="w-full"
									singleLine={false}
								/>
								<p className="text-sm text-muted-foreground mt-2">
									Enable cross-modal AI capabilities with custom-styled badges
									for different input/output types.
								</p>
							</Card>
						</div>

						{/* AI Use Cases Info */}
						<div className="mt-6 p-4 bg-muted rounded-lg">
							<h5 className="font-medium mb-2">AI/LLM Use Cases:</h5>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>
									• Configure multiple AI models for ensemble predictions and
									A/B testing
								</li>
								<li>
									• Select prompt templates for different conversation patterns
									and workflows
								</li>
								<li>
									• Choose data sources for RAG-enhanced responses and knowledge
									integration
								</li>
								<li>
									• Fine-tune model parameters for specific use cases and
									performance optimization
								</li>
								<li>
									• Organize AI tools by categories and specialized workflows
								</li>
								<li>
									• Build AI agent configurations with multiple capabilities and
									skills
								</li>
								<li>
									• Enable multimodal AI features for cross-format content
									processing
								</li>
								<li>
									• Create custom AI pipelines with modular component selection
								</li>
							</ul>
							<div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950 rounded border-l-4 border-purple-400">
								<p className="text-sm font-medium text-purple-800 dark:text-purple-200 break-words">
									🤖 Perfect for AI dashboards, chatbot configuration, prompt
									engineering tools, MLOps workflows, and multimodal AI
									applications!
								</p>
							</div>
						</div>
					</Card>

					{/* Props Reference */}
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">14. Props Reference</h3>
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
							<div className="relative overflow-hidden">
								<pre className="bg-muted p-2 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm max-w-full">
									<code className="block whitespace-pre-wrap break-words sm:whitespace-pre">{`import { MultiSelect } from "@/components/multi-select";
import { useState } from "react";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

export function MyComponent() {
  const [selectedValues, setSelectedValues] = 
    useState<string[]>([]);

  return (
    <MultiSelect
      options={options}
      onValueChange={setSelectedValues}
      defaultValue={selectedValues}
    />
  );
}`}</code>
								</pre>
								<Button
									size="sm"
									variant="outline"
									className="absolute top-1 right-1 sm:top-2 sm:right-2 h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2"
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
    />
  );
}`);
										toast.success("Code copied to clipboard!", {
											description: "You can now paste it into your project",
										});
									}}>
									<Copy className="h-3 w-3 sm:h-4 sm:w-4" />
									<span className="hidden sm:inline ml-1">Copy</span>
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</div>

			{/* AI Chat Widget */}
			<AIChat />
		</main>
	);
}
