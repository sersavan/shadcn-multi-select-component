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
import { useColorMode } from "@/contexts/color-mode-context";

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
	const { isGrayMode } = useColorMode();

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

	const getCardClasses = (originalClasses: string) => {
		if (isGrayMode) {
			return "p-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/30 dark:via-gray-950/30 dark:to-zinc-950/30 border-slate-200 dark:border-slate-800 overflow-hidden";
		}
		return originalClasses;
	};

	const getHeaderTextClasses = (originalClasses: string) => {
		if (isGrayMode) {
			return "text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 via-gray-600 to-zinc-600 dark:from-slate-400 dark:via-gray-300 dark:to-zinc-300 bg-clip-text text-transparent mb-4";
		}
		return originalClasses;
	};

	const getBadgeClasses = (originalClasses: string) => {
		if (isGrayMode) {
			return "inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium mb-4";
		}
		return originalClasses;
	};

	const getDivClasses = (originalClasses: string) => {
		if (isGrayMode) {
			return "w-full min-w-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/30 dark:via-gray-950/30 dark:to-zinc-950/30 rounded-xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden";
		}
		return originalClasses;
	};

	const getDivHeaderClasses = (originalClasses: string) => {
		if (isGrayMode) {
			return "bg-gradient-to-r from-slate-500 via-gray-500 to-zinc-500 p-6 text-white";
		}
		return originalClasses;
	};

	const getSmallDivClasses = (originalClasses: string) => {
		if (isGrayMode) {
			const hasMyClass = originalClasses.includes("my-8");
			const hasMtClass =
				originalClasses.includes("mt-8") || originalClasses.includes("mt-12");
			const hasPadding = originalClasses.includes("p-6") ? "p-6" : "p-4";
			const hasRoundedLg = originalClasses.includes("rounded-lg");
			const rounded = hasRoundedLg ? "rounded-lg" : "rounded-xl";

			let baseClasses = `${hasPadding} bg-white/60 dark:bg-slate-900/60 ${rounded} border border-slate-200 dark:border-slate-700 shadow-sm`;

			if (hasMyClass) {
				baseClasses = `my-8 ${baseClasses}`;
			} else if (hasMtClass) {
				baseClasses = originalClasses.includes("mt-12")
					? `mt-12 ${baseClasses}`
					: `mt-8 ${baseClasses}`;
			}

			if (originalClasses.includes("inline-flex")) {
				baseClasses = `inline-flex items-center gap-2 px-4 py-2 ${baseClasses}`;
			}

			return baseClasses;
		}
		return originalClasses;
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
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 overflow-hidden"
						)}>
						{/* Header - Always Visible */}
						<div
							className={
								isGrayMode
									? "p-6 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors"
									: "p-6 cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
							}
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
				<div className="grid gap-6 mt-12 w-full min-w-0">
					{/* 1. Form Integration - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30 border-violet-200 dark:border-violet-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div
									className={getBadgeClasses(
										"inline-flex items-center gap-2 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4"
									)}>
									<Icons.wand className="h-4 w-4" />
									Professional Form Integration
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-300 dark:to-fuchsia-300 bg-clip-text text-transparent mb-4"
									)}>
									Advanced Form Validation
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Professional form handling with React Hook Form and Zod
									validation
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										Building robust forms is essential for professional
										applications. Our MultiSelect component seamlessly
										integrates with{" "}
										<span className="font-semibold text-foreground">
											React Hook Form
										</span>
										and{" "}
										<span className="font-semibold text-foreground">
											Zod validation
										</span>{" "}
										to provide type-safe, validated user inputs with excellent
										developer experience.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-xl border border-violet-200/50 dark:border-violet-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.check className="h-5 w-5 text-violet-500" />
											Complete Form Example
										</h4>
										<p className="text-sm text-muted-foreground mb-6">
											This form demonstrates validation, error handling, and
											successful submission workflows:
										</p>

										<Form {...form}>
											<form
												onSubmit={form.handleSubmit(onSubmit)}
												className="space-y-6">
												<div className="grid gap-4 grid-cols-1 md:grid-cols-2 w-full min-w-0">
													<FormField
														control={form.control}
														name="frameworks"
														render={({ field }) => (
															<FormItem>
																<FormLabel className="flex items-center gap-2">
																	<Icons.code className="h-4 w-4 text-violet-500" />
																	Required Frameworks *
																</FormLabel>
																<FormControl>
																	<MultiSelect
																		options={frameworksList}
																		onValueChange={field.onChange}
																		defaultValue={field.value}
																		placeholder="Select frameworks"
																		variant="default"
																		animationConfig={{
																			badgeAnimation: "bounce",
																			popoverAnimation: "scale",
																		}}
																	/>
																</FormControl>
																<FormDescription>
																	Choose your preferred frameworks (required
																	field)
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
																<FormLabel className="flex items-center gap-2">
																	<Icons.zap className="h-4 w-4 text-purple-500" />
																	Tech Stack
																</FormLabel>
																<FormControl>
																	<MultiSelect
																		options={techStackOptions}
																		onValueChange={field.onChange}
																		defaultValue={field.value || []}
																		placeholder="Select technologies"
																		variant="secondary"
																		animationConfig={{
																			badgeAnimation: "pulse",
																			popoverAnimation: "fade",
																		}}
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
																<FormLabel className="flex items-center gap-2">
																	<Icons.star className="h-4 w-4 text-fuchsia-500" />
																	Skills
																</FormLabel>
																<FormControl>
																	<MultiSelect
																		options={skillsWithDisabled}
																		onValueChange={field.onChange}
																		defaultValue={field.value || []}
																		placeholder="Select your skills"
																		variant="inverted"
																		animationConfig={{
																			badgeAnimation: "wiggle",
																			optionHoverAnimation: "glow",
																		}}
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
																<FormLabel className="flex items-center gap-2">
																	<Icons.users className="h-4 w-4 text-indigo-500" />
																	Departments
																</FormLabel>
																<FormControl>
																	<MultiSelect
																		options={companyDepartments}
																		onValueChange={field.onChange}
																		defaultValue={field.value || []}
																		placeholder="Select departments"
																		variant="default"
																		animationConfig={{
																			badgeAnimation: "fade",
																			popoverAnimation: "slide",
																		}}
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
												<div className="pt-4">
													<Button type="submit" className="w-full">
														<Icons.check className="mr-2 h-4 w-4" />
														Submit Form
													</Button>
												</div>
											</form>
										</Form>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-violet-100/50 to-purple-100/50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-xl border border-violet-200/50 dark:border-violet-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.code className="h-5 w-5 text-violet-500" />
											Integration Benefits
										</h4>
										<ul className="text-sm text-muted-foreground space-y-2">
											<li className="flex items-start gap-2">
												<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
												<span>
													<strong>Type Safety:</strong> Full TypeScript support
													with Zod schema validation
												</span>
											</li>
											<li className="flex items-start gap-2">
												<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
												<span>
													<strong>Error Handling:</strong> Automatic validation
													messages and error states
												</span>
											</li>
											<li className="flex items-start gap-2">
												<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
												<span>
													<strong>Performance:</strong> Optimized re-renders
													with React Hook Form
												</span>
											</li>
											<li className="flex items-start gap-2">
												<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
												<span>
													<strong>Accessibility:</strong> Built-in ARIA labels
													and keyboard navigation
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 2. Component Variants - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-red-950/30 border-rose-200 dark:border-rose-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div
									className={getBadgeClasses(
										"inline-flex items-center gap-2 px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium mb-4"
									)}>
									<Icons.wand className="h-4 w-4" />
									Visual Design System
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-700 via-pink-600 to-red-600 dark:from-rose-400 dark:via-pink-300 dark:to-red-300 bg-clip-text text-transparent mb-4"
									)}>
									Component Variants
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Explore different visual styles to match your design system
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										Our MultiSelect component comes with multiple{" "}
										<span className="font-semibold text-foreground">
											pre-built variants
										</span>
										that seamlessly integrate with your design system. Each
										variant serves different use cases and visual hierarchies in
										your application interface.
									</p>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-rose-200/50 dark:border-rose-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-rose-500" />
												Primary Variants
											</h4>
											<div className="space-y-4">
												<div className="space-y-2">
													<label className="text-sm font-medium flex items-center gap-2">
														<span className="w-3 h-3 bg-blue-500 rounded-full"></span>
														Default
													</label>
													<MultiSelect
														options={techStackOptions.slice(0, 4)}
														onValueChange={() => {}}
														defaultValue={["typescript"]}
														placeholder="Primary interaction style"
														maxCount={2}
														animationConfig={{
															badgeAnimation: "bounce",
															popoverAnimation: "scale",
														}}
													/>
													<p className="text-xs text-muted-foreground">
														Perfect for main actions and primary selections
													</p>
												</div>
												<div className="space-y-2">
													<label className="text-sm font-medium flex items-center gap-2">
														<span className="w-3 h-3 bg-gray-500 rounded-full"></span>
														Secondary
													</label>
													<MultiSelect
														options={techStackOptions.slice(0, 4)}
														onValueChange={() => {}}
														defaultValue={["javascript"]}
														variant="secondary"
														placeholder="Supporting interaction style"
														maxCount={2}
														animationConfig={{
															badgeAnimation: "pulse",
															popoverAnimation: "fade",
														}}
													/>
													<p className="text-xs text-muted-foreground">
														Great for secondary actions and supplementary data
													</p>
												</div>
											</div>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-rose-200/50 dark:border-rose-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.shield className="h-5 w-5 text-pink-500" />
												Special Variants
											</h4>
											<div className="space-y-4">
												<div className="space-y-2">
													<label className="text-sm font-medium flex items-center gap-2">
														<span className="w-3 h-3 bg-red-500 rounded-full"></span>
														Destructive
													</label>
													<MultiSelect
														options={techStackOptions.slice(0, 4)}
														onValueChange={() => {}}
														defaultValue={["python"]}
														variant="destructive"
														placeholder="Warning and danger states"
														maxCount={2}
														animationConfig={{
															badgeAnimation: "wiggle",
															popoverAnimation: "slide",
														}}
													/>
													<p className="text-xs text-muted-foreground">
														Use for critical actions and error states
													</p>
												</div>
												<div className="space-y-2">
													<label className="text-sm font-medium flex items-center gap-2">
														<span className="w-3 h-3 bg-slate-800 dark:bg-slate-200 rounded-full"></span>
														Inverted
													</label>
													<MultiSelect
														options={techStackOptions.slice(0, 4)}
														onValueChange={setVariantDemo}
														defaultValue={["typescript"]}
														variant="inverted"
														placeholder="High contrast style"
														maxCount={2}
														animationConfig={{
															badgeAnimation: "fade",
															popoverAnimation: "flip",
														}}
													/>
													<p className="text-xs text-muted-foreground">
														Perfect for dark backgrounds and emphasis
													</p>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-rose-100/50 to-pink-100/50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-xl border border-rose-200/50 dark:border-rose-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.star className="h-5 w-5 text-rose-500" />
											Design System Integration
										</h4>
										<div className="grid md:grid-cols-2 gap-4 text-sm">
											<div>
												<h5 className="font-medium text-foreground mb-2">
													When to Use Each Variant:
												</h5>
												<ul className="space-y-1 text-muted-foreground">
													<li>
														<strong>Default:</strong> Primary forms, main
														content areas
													</li>
													<li>
														<strong>Secondary:</strong> Sidebars, optional
														settings
													</li>
													<li>
														<strong>Destructive:</strong> Delete actions, error
														handling
													</li>
													<li>
														<strong>Inverted:</strong> Hero sections, dark
														themes
													</li>
												</ul>
											</div>
											<div>
												<h5 className="font-medium text-foreground mb-2">
													Customization Options:
												</h5>
												<ul className="space-y-1 text-muted-foreground">
													<li>• CSS variables for color overrides</li>
													<li>• Tailwind classes for spacing</li>
													<li>• Animation configurations</li>
													<li>• Custom badge styling</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 3. Animation Configurations - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium mb-4">
									<Icons.zap className="h-4 w-4" />
									Interactive Animations
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-600 dark:from-amber-400 dark:via-yellow-300 dark:to-orange-300 bg-clip-text text-transparent mb-4"
									)}>
									Animation Configurations
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Bring your interface to life with smooth, performant
									animations
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										Animations enhance user experience by providing{" "}
										<span className="font-semibold text-foreground">
											visual feedback
										</span>
										and creating{" "}
										<span className="font-semibold text-foreground">
											delightful interactions
										</span>
										. Our MultiSelect component offers a comprehensive animation
										system with customizable timing, easing, and effects.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
											<Icons.activity className="h-5 w-5 text-amber-500" />
											Badge Animation Showcase
										</h4>

										<div className="grid gap-6 md:grid-cols-2">
											<div className="space-y-4">
												<div className="space-y-2">
													<label className="text-sm font-medium flex items-center gap-2">
														<span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
														Pulse Animation
													</label>
													<MultiSelect
														options={projectTypesWithStyle.slice(0, 3)}
														onValueChange={() => {}}
														defaultValue={["web-app"]}
														animationConfig={{
															badgeAnimation: "pulse",
															duration: 0.4,
														}}
														placeholder="Rhythmic breathing effect"
													/>
													<p className="text-xs text-muted-foreground">
														Creates a gentle pulsing effect that draws attention
													</p>
												</div>

												<div className="space-y-2">
													<label className="text-sm font-medium flex items-center gap-2">
														<span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
														Fade Animation
													</label>
													<MultiSelect
														options={projectTypesWithStyle.slice(0, 3)}
														onValueChange={() => {}}
														defaultValue={["mobile-app"]}
														animationConfig={{
															badgeAnimation: "fade",
															duration: 0.3,
														}}
														placeholder="Smooth opacity transitions"
													/>
													<p className="text-xs text-muted-foreground">
														Elegant fade-in/fade-out for subtle interactions
													</p>
												</div>
											</div>

											<div className="space-y-4">
												<div className="space-y-2">
													<label className="text-sm font-medium flex items-center gap-2">
														<span className="w-2 h-2 bg-orange-500 rounded-full"></span>
														Wiggle Animation
													</label>
													<MultiSelect
														options={projectTypesWithStyle.slice(0, 3)}
														onValueChange={setAnimatedDemo}
														defaultValue={["desktop-app"]}
														animationConfig={{
															badgeAnimation: "wiggle",
															duration: 0.4,
														}}
														placeholder="Playful wiggle effect"
													/>
													<p className="text-xs text-muted-foreground">
														Fun shake animation for interactive feedback
													</p>
												</div>

												<div className="space-y-2">
													<label className="text-sm font-medium flex items-center gap-2">
														<span className="w-2 h-2 bg-red-500 rounded-full"></span>
														Bounce Animation
													</label>
													<MultiSelect
														options={projectTypesWithStyle.slice(0, 3)}
														onValueChange={() => {}}
														defaultValue={["web-app"]}
														animationConfig={{
															badgeAnimation: "bounce",
															duration: 0.5,
														}}
														placeholder="Energetic bounce effect"
													/>
													<p className="text-xs text-muted-foreground">
														Spring-like animation for dynamic interactions
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-6 border border-amber-200/50 dark:border-amber-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-amber-500" />
												Performance Features
											</h4>
											<ul className="text-sm text-muted-foreground space-y-2">
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Hardware Accelerated:</strong> Uses CSS
														transforms for smooth 60fps animations
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Reduced Motion:</strong> Respects
														user&apos;s accessibility preferences
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Memory Efficient:</strong> Minimal impact on
														application performance
													</span>
												</li>
											</ul>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-6 border border-amber-200/50 dark:border-amber-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.star className="h-5 w-5 text-orange-500" />
												Animation Types
											</h4>
											<div className="text-sm text-muted-foreground space-y-3">
												<div>
													<strong className="text-foreground">
														Badge Animations:
													</strong>
													<div className="ml-2 mt-1">
														pulse, fade, wiggle, bounce, slide
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Popover Animations:
													</strong>
													<div className="ml-2 mt-1">
														scale, slide, fade, flip
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Hover Effects:
													</strong>
													<div className="ml-2 mt-1">
														highlight, scale, glow
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-amber-100/50 to-yellow-100/50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
											<div>
												<h4 className="text-lg font-semibold text-foreground mb-2">
													Best Practices
												</h4>
												<p className="text-base text-muted-foreground mb-4">
													Use animations purposefully to enhance user
													experience, not distract from it. Consider your
													application&apos;s context and user needs when
													choosing animation styles.
												</p>
												<div className="grid md:grid-cols-2 gap-4 text-sm">
													<div>
														<strong className="text-foreground">Do:</strong>
														<ul className="ml-2 mt-1 text-muted-foreground">
															<li>• Use subtle animations for feedback</li>
															<li>• Maintain consistent timing</li>
															<li>• Test on slower devices</li>
														</ul>
													</div>
													<div>
														<strong className="text-foreground">Avoid:</strong>
														<ul className="ml-2 mt-1 text-muted-foreground">
															<li>• Excessive or distracting effects</li>
															<li>• Long animation durations</li>
															<li>• Ignoring accessibility settings</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 4. Responsive Behavior - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-green-200 dark:border-green-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">
									<Icons.smartphone className="h-4 w-4" />
									Adaptive Design
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent mb-4"
									)}>
									Responsive Behavior
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Seamlessly adapts to any screen size with intelligent layout
									optimization
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										In today&apos;s multi-device world,{" "}
										<span className="font-semibold text-foreground">
											responsive design
										</span>
										is crucial. Our MultiSelect component automatically adapts
										its behavior based on screen size, ensuring optimal user
										experience across{" "}
										<span className="font-semibold text-foreground">
											mobile phones
										</span>
										,
										<span className="font-semibold text-foreground">
											tablets
										</span>
										, and{" "}
										<span className="font-semibold text-foreground">
											desktop screens
										</span>
										.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/50 dark:border-green-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.monitor className="h-5 w-5 text-green-500" />
											Live Responsive Demo
										</h4>
										<p className="text-sm text-muted-foreground mb-6">
											Try resizing your browser window to see how the component
											adapts its maxCount and layout behavior:
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
												animationConfig={{
													badgeAnimation: "pulse",
													popoverAnimation: "scale",
												}}
											/>

											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
												<div className="bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-green-200/50 dark:border-green-700/50">
													<div className="flex items-center gap-2 mb-2">
														<Icons.smartphone className="h-4 w-4 text-green-500" />
														<span className="font-medium text-foreground">
															Mobile
														</span>
														<span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
															≤ 768px
														</span>
													</div>
													<p className="text-xs text-muted-foreground">
														maxCount: 1, Compact mode enabled
													</p>
												</div>
												<div className="bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-700/50">
													<div className="flex items-center gap-2 mb-2">
														<Icons.monitor className="h-4 w-4 text-emerald-500" />
														<span className="font-medium text-foreground">
															Tablet
														</span>
														<span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">
															769-1024px
														</span>
													</div>
													<p className="text-xs text-muted-foreground">
														maxCount: 2, Standard layout
													</p>
												</div>
												<div className="bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-teal-200/50 dark:border-teal-700/50">
													<div className="flex items-center gap-2 mb-2">
														<Icons.monitor className="h-4 w-4 text-teal-500" />
														<span className="font-medium text-foreground">
															Desktop
														</span>
														<span className="text-xs bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-2 py-1 rounded">
															≥ 1025px
														</span>
													</div>
													<p className="text-xs text-muted-foreground">
														maxCount: 4, Full layout
													</p>
												</div>
											</div>

											<div
												className={getSmallDivClasses(
													"mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-700/50"
												)}>
												<p className="text-sm font-medium text-green-800 dark:text-green-200">
													Current Selection:{" "}
													{responsiveDemo.join(", ") || "None selected"}
												</p>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-green-50/50 to-teal-50/50 dark:from-green-950/20 dark:to-teal-950/20 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-green-500" />
												Responsive Features
											</h4>
											<ul className="text-sm text-muted-foreground space-y-2">
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Dynamic maxCount:</strong> Automatically
														adjusts based on screen size
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Compact Mode:</strong> Optimized layout for
														mobile devices
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Touch Friendly:</strong> Larger touch
														targets on mobile
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>CSS Breakpoints:</strong> Standard
														responsive breakpoints
													</span>
												</li>
											</ul>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-green-50/50 to-teal-50/50 dark:from-green-950/20 dark:to-teal-950/20 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.star className="h-5 w-5 text-emerald-500" />
												Configuration Options
											</h4>
											<div className="text-sm text-muted-foreground space-y-3">
												<div>
													<strong className="text-foreground">
														Breakpoint Controls:
													</strong>
													<div className="ml-2 mt-1">
														mobile, tablet, desktop configurations
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Layout Modes:
													</strong>
													<div className="ml-2 mt-1">
														compact, standard, expanded
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Auto Sizing:
													</strong>
													<div className="ml-2 mt-1">
														Dynamic width based on content
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/50 dark:border-green-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
											<div>
												<h4 className="text-lg font-semibold text-foreground mb-2">
													Mobile-First Approach
												</h4>
												<p className="text-base text-muted-foreground mb-4">
													Our responsive system follows mobile-first principles,
													starting with optimized mobile experience and
													progressively enhancing for larger screens. This
													ensures excellent performance across all devices.
												</p>
												<div className="text-sm text-muted-foreground">
													<strong className="text-foreground">
														Key Benefits:
													</strong>{" "}
													Faster mobile loading, better touch interactions,
													improved accessibility, and consistent behavior across
													device types.
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 5. Grouped Options - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
									<Icons.star className="h-4 w-4" />
									Organized Structure
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent mb-4"
									)}>
									Grouped Options
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Organize complex option sets into logical categories with
									visual separators
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										When dealing with large option sets,{" "}
										<span className="font-semibold text-foreground">
											logical grouping
										</span>
										becomes essential for user experience. Our grouped options
										feature organizes related items into
										<span className="font-semibold text-foreground">
											categories
										</span>{" "}
										with clear visual separators, making it easier for users to
										find and select relevant options.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.code className="h-5 w-5 text-blue-500" />
											Technology Stack Selector
										</h4>
										<p className="text-sm text-muted-foreground mb-6">
											Choose from categorized technology options to build your
											stack:
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
												animationConfig={{
													badgeAnimation: "slide",
													popoverAnimation: "fade",
												}}
											/>

											<div
												className={getSmallDivClasses(
													"mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50"
												)}>
												<p className="text-sm font-medium text-blue-800 dark:text-blue-200">
													Selected Stack:{" "}
													{groupedSelection.join(", ") || "None selected"}
												</p>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-blue-500" />
												Grouping Benefits
											</h4>
											<ul className="text-sm text-muted-foreground space-y-2">
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Logical Organization:</strong> Related
														options grouped together
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Visual Separators:</strong> Clear
														distinction between categories
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Faster Navigation:</strong> Users find
														options more quickly
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Scalable Structure:</strong> Handles large
														option sets efficiently
													</span>
												</li>
											</ul>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.star className="h-5 w-5 text-indigo-500" />
												Category Structure
											</h4>
											<div className="text-sm text-muted-foreground space-y-3">
												<div>
													<strong className="text-foreground">Frontend:</strong>
													<div className="ml-2 mt-1 text-xs">
														React, Vue, Angular, Svelte
													</div>
												</div>
												<div>
													<strong className="text-foreground">Backend:</strong>
													<div className="ml-2 mt-1 text-xs">
														Node.js, Python, Java, Go
													</div>
												</div>
												<div>
													<strong className="text-foreground">Database:</strong>
													<div className="ml-2 mt-1 text-xs">
														PostgreSQL, MongoDB, Redis
													</div>
												</div>
												<div>
													<strong className="text-foreground">Cloud:</strong>
													<div className="ml-2 mt-1 text-xs">
														AWS, Azure, Google Cloud
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
											<div>
												<h4 className="text-lg font-semibold text-foreground mb-2">
													Implementation Strategy
												</h4>
												<p className="text-base text-muted-foreground mb-4">
													Groups are defined in the options data structure using
													separators or category labels. The component
													automatically renders visual dividers and maintains
													group integrity during search operations.
												</p>
												<div className="text-sm text-muted-foreground">
													<strong className="text-foreground">Pro Tip:</strong>{" "}
													Use consistent naming conventions for your groups and
													consider alphabetical ordering within each category
													for optimal user experience.
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 6. Search and UI Configuration - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/30 dark:via-sky-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-medium mb-4">
									<Icons.search className="h-4 w-4" />
									Search & Discovery
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-700 via-sky-600 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-300 bg-clip-text text-transparent mb-4"
									)}>
									Search and UI Configuration
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Powerful search capabilities with customizable UI controls and
									empty states
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										Efficient{" "}
										<span className="font-semibold text-foreground">
											search functionality
										</span>{" "}
										is crucial for user experience when dealing with extensive
										option lists. Our component provides
										<span className="font-semibold text-foreground">
											real-time filtering
										</span>
										,
										<span className="font-semibold text-foreground">
											select all controls
										</span>
										, and
										<span className="font-semibold text-foreground">
											customizable empty states
										</span>
										to create intuitive selection interfaces.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-cyan-50/50 to-sky-50/50 dark:from-cyan-950/20 dark:to-sky-950/20 rounded-xl border border-cyan-200/50 dark:border-cyan-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.search className="h-5 w-5 text-cyan-500" />
											Search Configuration Comparison
										</h4>
										<p className="text-sm text-muted-foreground mb-6">
											Compare different search and UI configurations side by
											side:
										</p>

										<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
											<div className="space-y-4">
												<div className="bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-cyan-200/50 dark:border-cyan-700/50">
													<div className="flex items-center gap-2 mb-3">
														<Icons.search className="h-4 w-4 text-cyan-500" />
														<span className="font-medium text-foreground text-sm">
															Full Search Experience
														</span>
													</div>
													<MultiSelect
														options={frameworksList}
														onValueChange={() => {}}
														defaultValue={["react"]}
														searchable={true}
														hideSelectAll={false}
														placeholder="Search frameworks"
														emptyIndicator={
															<div className="text-center p-4 text-muted-foreground">
																<Icons.search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
																<p className="text-sm">
																	No frameworks found matching your search
																</p>
															</div>
														}
														animationConfig={{
															badgeAnimation: "bounce",
															popoverAnimation: "slide",
														}}
													/>
													<div className="mt-2 text-xs text-muted-foreground">
														✅ Search enabled • ✅ Select all • ✅ Custom empty
														state
													</div>
												</div>
											</div>

											<div className="space-y-4">
												<div
													className={getSmallDivClasses(
														"bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-sky-200/50 dark:border-sky-700/50"
													)}>
													<div className="flex items-center gap-2 mb-3">
														<Icons.target className="h-4 w-4 text-sky-500" />
														<span className="font-medium text-foreground text-sm">
															Simplified Interface
														</span>
													</div>
													<MultiSelect
														options={techStackOptions.slice(0, 6)}
														onValueChange={() => {}}
														defaultValue={["typescript"]}
														searchable={false}
														hideSelectAll={true}
														placeholder="Select without search"
														animationConfig={{
															badgeAnimation: "fade",
															popoverAnimation: "scale",
														}}
													/>
													<div className="mt-2 text-xs text-muted-foreground">
														❌ No search • ❌ No select all • Clean interface
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl p-6 border border-cyan-200/50 dark:border-cyan-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-cyan-500" />
												Search Features
											</h4>
											<ul className="text-sm text-muted-foreground space-y-2">
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Real-time Filtering:</strong> Instant
														results as you type
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Case Insensitive:</strong> Matches
														regardless of case
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Substring Matching:</strong> Finds partial
														matches
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Keyboard Navigation:</strong> Arrow keys and
														Enter support
													</span>
												</li>
											</ul>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl p-6 border border-cyan-200/50 dark:border-cyan-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.zap className="h-5 w-5 text-sky-500" />
												UI Controls
											</h4>
											<div className="text-sm text-muted-foreground space-y-3">
												<div>
													<strong className="text-foreground">
														Search Toggle:
													</strong>
													<div className="ml-2 mt-1">
														Enable/disable search functionality
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Select All Control:
													</strong>
													<div className="ml-2 mt-1">
														Show/hide bulk selection options
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Empty States:
													</strong>
													<div className="ml-2 mt-1">
														Custom no-results messaging
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Placeholder Text:
													</strong>
													<div className="ml-2 mt-1">
														Contextual hints for users
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-cyan-100/50 to-sky-100/50 dark:from-cyan-950/20 dark:to-sky-950/20 rounded-xl border border-cyan-200/50 dark:border-cyan-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-cyan-500 mt-1 flex-shrink-0" />
											<div>
												<h4 className="text-lg font-semibold text-foreground mb-2">
													Search Performance
												</h4>
												<p className="text-base text-muted-foreground mb-4">
													Our search implementation is optimized for performance
													with debounced input handling, efficient filtering
													algorithms, and smooth animations that don&apos;t
													block user interactions.
												</p>
												<div className="text-sm text-muted-foreground">
													<strong className="text-foreground">
														Best Practices:
													</strong>{" "}
													Use descriptive placeholders, provide helpful empty
													states, and consider disabling search for small option
													sets (≤10 items) to simplify the interface.
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 7. Layout and Sizing Options - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border-orange-200 dark:border-orange-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium mb-4">
									<Icons.monitor className="h-4 w-4" />
									Flexible Layouts
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-300 dark:to-yellow-300 bg-clip-text text-transparent mb-4"
									)}>
									Layout and Sizing Options
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Adaptable layout modes for different space constraints and
									design requirements
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										Different interfaces require different{" "}
										<span className="font-semibold text-foreground">
											layout approaches
										</span>
										. Our component offers flexible sizing options including
										<span className="font-semibold text-foreground">
											single-line mode
										</span>{" "}
										for compact spaces,
										<span className="font-semibold text-foreground">
											auto-sizing
										</span>{" "}
										for dynamic content, and
										<span className="font-semibold text-foreground">
											width constraints
										</span>{" "}
										for consistent layouts.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.monitor className="h-5 w-5 text-orange-500" />
											Layout Demonstrations
										</h4>

										<div className="space-y-6">
											{/* Single Line Mode */}
											<div className="bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-orange-200/50 dark:border-orange-700/50">
												<div className="flex items-center gap-2 mb-3">
													<Icons.x className="h-4 w-4 text-orange-500" />
													<span className="font-medium text-foreground text-sm">
														Single Line Mode
													</span>
													<span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
														singleLine=true
													</span>
												</div>
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
													animationConfig={{
														badgeAnimation: "slide",
														popoverAnimation: "fade",
													}}
												/>
												<p className="text-xs text-muted-foreground mt-2">
													Horizontal scrolling when content exceeds container
													width
												</p>
											</div>

											{/* Width Comparison */}
											<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
												<div className="bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-amber-200/50 dark:border-amber-700/50">
													<div className="flex items-center gap-2 mb-3">
														<Icons.maximize className="h-4 w-4 text-amber-500" />
														<span className="font-medium text-foreground text-sm">
															Fixed Width
														</span>
														<span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-1 rounded">
															autoSize=false
														</span>
													</div>
													<MultiSelect
														options={skillsWithDisabled.slice(0, 4)}
														onValueChange={() => {}}
														defaultValue={["html", "css"]}
														className="w-full min-w-0"
														placeholder="Fixed width"
														autoSize={false}
														animationConfig={{
															badgeAnimation: "bounce",
															popoverAnimation: "scale",
														}}
													/>
													<p className="text-xs text-muted-foreground mt-2">
														Uses full container width
													</p>
												</div>

												<div className="bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-yellow-200/50 dark:border-yellow-700/50">
													<div className="flex items-center gap-2 mb-3">
														<Icons.minimize className="h-4 w-4 text-yellow-600" />
														<span className="font-medium text-foreground text-sm">
															Auto Width
														</span>
														<span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
															autoSize=true
														</span>
													</div>
													<MultiSelect
														options={skillsWithDisabled.slice(0, 4)}
														onValueChange={() => {}}
														defaultValue={["html"]}
														autoSize={true}
														placeholder="Auto width"
														animationConfig={{
															badgeAnimation: "pulse",
															popoverAnimation: "slide",
														}}
													/>
													<p className="text-xs text-muted-foreground mt-2">
														Adapts to content size
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-xl p-6 border border-orange-200/50 dark:border-orange-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-orange-500" />
												Layout Features
											</h4>
											<ul className="text-sm text-muted-foreground space-y-2">
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Single Line Mode:</strong> Horizontal
														scrolling for compact spaces
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Auto Sizing:</strong> Dynamic width based on
														content
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Width Constraints:</strong> Minimum and
														maximum width limits
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Responsive Behavior:</strong> Adapts to
														container changes
													</span>
												</li>
											</ul>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-xl p-6 border border-orange-200/50 dark:border-orange-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.activity className="h-5 w-5 text-amber-500" />
												Size Control Options
											</h4>
											<div className="text-sm text-muted-foreground space-y-3">
												<div>
													<strong className="text-foreground">
														singleLine:
													</strong>
													<div className="ml-2 mt-1">
														Forces horizontal layout with scroll
													</div>
												</div>
												<div>
													<strong className="text-foreground">autoSize:</strong>
													<div className="ml-2 mt-1">
														Dynamic width based on content
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														className:
													</strong>
													<div className="ml-2 mt-1">
														Custom CSS classes for styling
													</div>
												</div>
												<div>
													<strong className="text-foreground">maxCount:</strong>
													<div className="ml-2 mt-1">
														Controls badge overflow behavior
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-orange-100/50 to-amber-100/50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
											<div>
												<h4 className="text-lg font-semibold text-foreground mb-2">
													Layout Best Practices
												</h4>
												<p className="text-base text-muted-foreground mb-4">
													Choose the right layout mode based on your design
													constraints. Use single-line mode for toolbars and
													compact interfaces, auto-sizing for flexible content
													areas, and fixed width for consistent layouts.
												</p>
												<div className="text-sm text-muted-foreground">
													<strong className="text-foreground">Pro Tip:</strong>{" "}
													Combine layout options with responsive configurations
													to create interfaces that work beautifully across all
													screen sizes and use cases.
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 8. Custom Styling and Colors - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 dark:from-purple-950/30 dark:via-fuchsia-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-4">
									<Icons.wand className="h-4 w-4" />
									Creative Expression
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-300 dark:to-pink-300 bg-clip-text text-transparent mb-4"
									)}>
									Custom Styling and Colors
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Express your brand identity with custom badge colors and
									gradient backgrounds
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										Make your interface uniquely yours with{" "}
										<span className="font-semibold text-foreground">
											custom styling options
										</span>
										. Each option can have its own{" "}
										<span className="font-semibold text-foreground">
											badge colors
										</span>
										,
										<span className="font-semibold text-foreground">
											gradient backgrounds
										</span>
										, and
										<span className="font-semibold text-foreground">
											visual identity
										</span>{" "}
										that reflects your brand or categorizes content
										meaningfully.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 dark:from-purple-950/20 dark:to-fuchsia-950/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.wand className="h-5 w-5 text-purple-500" />
											Styled Project Types
										</h4>
										<p className="text-sm text-muted-foreground mb-6">
											Each project type has its own unique color scheme and
											styling:
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
												animationConfig={{
													badgeAnimation: "bounce",
													popoverAnimation: "scale",
												}}
											/>

											<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
												<div
													className={getSmallDivClasses(
														"bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-700/50"
													)}>
													<h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
														<Icons.target className="h-4 w-4 text-purple-500" />
														Style Categories
													</h5>
													<div className="space-y-2 text-sm">
														<div className="flex items-center gap-2">
															<div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
															<span className="text-muted-foreground">
																Web Applications
															</span>
														</div>
														<div className="flex items-center gap-2">
															<div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
															<span className="text-muted-foreground">
																Mobile Apps
															</span>
														</div>
														<div className="flex items-center gap-2">
															<div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
															<span className="text-muted-foreground">
																API Services
															</span>
														</div>
														<div className="flex items-center gap-2">
															<div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
															<span className="text-muted-foreground">
																Desktop Apps
															</span>
														</div>
													</div>
												</div>

												<div
													className={getSmallDivClasses(
														"bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-700/50"
													)}>
													<h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
														<Icons.star className="h-4 w-4 text-fuchsia-500" />
														Current Selection
													</h5>
													<div className="text-sm text-muted-foreground">
														{styledDemo.length > 0 ? (
															<div className="space-y-1">
																{styledDemo.map((item, index) => (
																	<div
																		key={index}
																		className="flex items-center gap-2">
																		<Icons.check className="h-3 w-3 text-green-500" />
																		<span>
																			{item
																				.replace("-", " ")
																				.replace(/\b\w/g, (l) =>
																					l.toUpperCase()
																				)}
																		</span>
																	</div>
																))}
															</div>
														) : (
															<p className="italic">No projects selected</p>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-purple-500" />
												Styling Features
											</h4>
											<ul className="text-sm text-muted-foreground space-y-2">
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Custom Badge Colors:</strong> Individual
														color schemes per option
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Gradient Backgrounds:</strong> Beautiful
														gradient effects
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>CSS Variables:</strong> Dynamic theming
														support
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Dark Mode:</strong> Automatic adaptation to
														themes
													</span>
												</li>
											</ul>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.wand className="h-5 w-5 text-fuchsia-500" />
												Implementation
											</h4>
											<div className="text-sm text-muted-foreground space-y-3">
												<div>
													<strong className="text-foreground">
														Style Property:
													</strong>
													<div className="ml-2 mt-1">
														Define colors in option objects
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														CSS Classes:
													</strong>
													<div className="ml-2 mt-1">
														Use Tailwind or custom CSS
													</div>
												</div>
												<div>
													<strong className="text-foreground">Theming:</strong>
													<div className="ml-2 mt-1">
														Support for light/dark modes
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Brand Colors:
													</strong>
													<div className="ml-2 mt-1">
														Match your design system
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-purple-100/50 to-fuchsia-100/50 dark:from-purple-950/20 dark:to-fuchsia-950/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
											<div>
												<h4 className="text-lg font-semibold text-foreground mb-2">
													Design System Integration
												</h4>
												<p className="text-base text-muted-foreground mb-4">
													Custom styling seamlessly integrates with your
													existing design system. Define colors that match your
													brand, use consistent spacing, and maintain visual
													hierarchy across your application.
												</p>
												<div className="text-sm text-muted-foreground">
													<strong className="text-foreground">Pro Tip:</strong>{" "}
													Use semantic color names and CSS custom properties to
													create a scalable theming system that adapts to
													different contexts and user preferences.
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 9. Disabled States - Markdown Style */}
					<Card className="p-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/30 dark:via-gray-950/30 dark:to-zinc-950/30 border-slate-200 dark:border-slate-800 overflow-hidden">
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium mb-4">
									<Icons.shield className="h-4 w-4" />
									Access Control
								</div>
								<h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 via-gray-600 to-zinc-600 dark:from-slate-400 dark:via-gray-300 dark:to-zinc-300 bg-clip-text text-transparent mb-4">
									Disabled States
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Control user access with component-level and option-level
									disabled states
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										Disabled states provide{" "}
										<span className="font-semibold text-foreground">
											access control
										</span>{" "}
										and
										<span className="font-semibold text-foreground">
											contextual restrictions
										</span>
										. You can disable
										<span className="font-semibold text-foreground">
											individual options
										</span>{" "}
										based on user permissions or
										<span className="font-semibold text-foreground">
											entire components
										</span>{" "}
										during loading states or form validation.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-950/20 dark:to-gray-950/20 rounded-xl border border-slate-200/50 dark:border-slate-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.shield className="h-5 w-5 text-slate-500" />
											Disabled State Demonstrations
										</h4>

										<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
											<div
												className={getSmallDivClasses(
													"bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50"
												)}>
												<div className="flex items-center gap-2 mb-3">
													<Icons.eyeOff className="h-4 w-4 text-slate-500" />
													<span className="font-medium text-foreground text-sm">
														Selective Disabled Options
													</span>
												</div>
												<p className="text-xs text-muted-foreground mb-3">
													Some skills are disabled based on availability or
													access level
												</p>
												<MultiSelect
													options={skillsWithDisabled}
													onValueChange={setDisabledDemo}
													defaultValue={["html", "css"]}
													placeholder="Some options disabled"
													animationConfig={{
														badgeAnimation: "fade",
														popoverAnimation: "scale",
													}}
												/>
												<div className="mt-3 p-2 bg-slate-50 dark:bg-slate-950/50 rounded text-xs">
													<span className="font-medium text-slate-700 dark:text-slate-300">
														Selected: {disabledDemo.join(", ") || "None"}
													</span>
												</div>
											</div>

											<div
												className={getSmallDivClasses(
													"bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50"
												)}>
												<div className="flex items-center gap-2 mb-3">
													<Icons.x className="h-4 w-4 text-slate-500" />
													<span className="font-medium text-foreground text-sm">
														Entirely Disabled Component
													</span>
												</div>
												<p className="text-xs text-muted-foreground mb-3">
													Complete component disabled for maintenance or
													restricted access
												</p>
												<MultiSelect
													options={techStackOptions.slice(0, 4)}
													onValueChange={() => {}}
													defaultValue={["typescript", "javascript"]}
													disabled={true}
													placeholder="Disabled component"
													animationConfig={{
														badgeAnimation: "fade",
														popoverAnimation: "scale",
													}}
												/>
												<div className="mt-3 p-2 bg-slate-50 dark:bg-slate-950/50 rounded text-xs">
													<span className="font-medium text-slate-700 dark:text-slate-300">
														Status: Component disabled
													</span>
												</div>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-slate-50/50 to-zinc-50/50 dark:from-slate-950/20 dark:to-zinc-950/20 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-slate-500" />
												Disabled Features
											</h4>
											<ul className="text-sm text-muted-foreground space-y-2">
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Option-Level:</strong> Disable specific
														choices individually
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Component-Level:</strong> Disable entire
														selection interface
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Visual Feedback:</strong> Clear disabled
														state indicators
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Accessibility:</strong> Screen reader
														compatible states
													</span>
												</li>
											</ul>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-slate-50/50 to-zinc-50/50 dark:from-slate-950/20 dark:to-zinc-950/20 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.shield className="h-5 w-5 text-gray-500" />
												Use Cases
											</h4>
											<div className="text-sm text-muted-foreground space-y-3">
												<div>
													<strong className="text-foreground">
														Permission Control:
													</strong>
													<div className="ml-2 mt-1">
														Restrict based on user roles
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Loading States:
													</strong>
													<div className="ml-2 mt-1">
														Disable during data fetching
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Form Validation:
													</strong>
													<div className="ml-2 mt-1">
														Conditional availability
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Maintenance Mode:
													</strong>
													<div className="ml-2 mt-1">
														Temporary service restrictions
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-slate-100/50 to-gray-100/50 dark:from-slate-950/20 dark:to-gray-950/20 rounded-xl border border-slate-200/50 dark:border-slate-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-slate-500 mt-1 flex-shrink-0" />
											<div>
												<h4 className="text-lg font-semibold text-foreground mb-2">
													Accessibility & UX
												</h4>
												<p className="text-base text-muted-foreground mb-4">
													Disabled states maintain excellent accessibility with
													proper ARIA attributes, keyboard navigation support,
													and clear visual indicators that help users understand
													why certain options are unavailable.
												</p>
												<div className="text-sm text-muted-foreground">
													<strong className="text-foreground">
														Best Practice:
													</strong>{" "}
													Always provide contextual information about why
													options are disabled, and consider offering
													alternative paths when possible.
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 10. Advanced Features - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-cyan-950/30 border-indigo-200 dark:border-indigo-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
									<Icons.zap className="h-4 w-4" />
									Power User Features
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-blue-300 dark:to-cyan-300 bg-clip-text text-transparent mb-4"
									)}>
									Advanced Features
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Sophisticated behaviors for complex interaction patterns and
									edge cases
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										For sophisticated applications, advanced features provide{" "}
										<span className="font-semibold text-foreground">
											fine-grained control
										</span>
										over interaction behaviors. These include{" "}
										<span className="font-semibold text-foreground">
											modal popovers
										</span>
										,
										<span className="font-semibold text-foreground">
											close-on-select
										</span>{" "}
										patterns, and
										<span className="font-semibold text-foreground">
											duplicate handling
										</span>{" "}
										for complex data scenarios.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.zap className="h-5 w-5 text-indigo-500" />
											Advanced Behavior Showcase
										</h4>

										<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
											<div
												className={getSmallDivClasses(
													"bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-indigo-200/50 dark:border-indigo-700/50"
												)}>
												<div className="flex items-center gap-2 mb-3">
													<Icons.x className="h-4 w-4 text-indigo-500" />
													<span className="font-medium text-foreground text-sm">
														Close on Select
													</span>
												</div>
												<p className="text-xs text-muted-foreground mb-3">
													Automatically closes popover after each selection
												</p>
												<MultiSelect
													options={frameworksList.slice(0, 5)}
													onValueChange={() => {}}
													defaultValue={["react"]}
													closeOnSelect={true}
													placeholder="Closes after selection"
													animationConfig={{
														badgeAnimation: "slide",
														popoverAnimation: "fade",
													}}
												/>
												<div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
													🎯 Perfect for single-focused selection flows
												</div>
											</div>

											<div
												className={getSmallDivClasses(
													"bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50"
												)}>
												<div className="flex items-center gap-2 mb-3">
													<Icons.maximize className="h-4 w-4 text-blue-500" />
													<span className="font-medium text-foreground text-sm">
														Modal Popover
													</span>
												</div>
												<p className="text-xs text-muted-foreground mb-3">
													Renders popover as modal overlay for focus control
												</p>
												<MultiSelect
													options={techStackOptions.slice(0, 5)}
													onValueChange={() => {}}
													defaultValue={["typescript"]}
													modalPopover={true}
													placeholder="Modal behavior"
													animationConfig={{
														badgeAnimation: "bounce",
														popoverAnimation: "scale",
													}}
												/>
												<div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
													📱 Great for mobile and accessibility
												</div>
											</div>

											<div
												className={getSmallDivClasses(
													"bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-cyan-200/50 dark:border-cyan-700/50 md:col-span-2 lg:col-span-1"
												)}>
												<div className="flex items-center gap-2 mb-3">
													<Icons.copy className="h-4 w-4 text-cyan-500" />
													<span className="font-medium text-foreground text-sm">
														Duplicate Handling
													</span>
												</div>
												<p className="text-xs text-muted-foreground mb-3">
													Allows similar labels with different values
												</p>
												<MultiSelect
													options={[
														{
															value: "ts1",
															label: "TypeScript",
															icon: Icons.code,
														},
														{
															value: "js1",
															label: "JavaScript",
															icon: Icons.zap,
														},
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
													animationConfig={{
														badgeAnimation: "pulse",
														popoverAnimation: "slide",
													}}
												/>
												<div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
													🔄 Handle complex data relationships
												</div>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 dark:from-indigo-950/20 dark:to-cyan-950/20 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-indigo-500" />
												Advanced Controls
											</h4>
											<ul className="text-sm text-muted-foreground space-y-2">
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>closeOnSelect:</strong> Auto-close after
														each selection
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>modalPopover:</strong> Modal overlay
														behavior
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>deduplicateOptions:</strong> Handle similar
														labels
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>Custom Positioning:</strong> Advanced
														popover placement
													</span>
												</li>
											</ul>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 dark:from-indigo-950/20 dark:to-cyan-950/20 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.star className="h-5 w-5 text-blue-500" />
												Implementation Notes
											</h4>
											<div className="text-sm text-muted-foreground space-y-3">
												<div>
													<strong className="text-foreground">
														Performance:
													</strong>
													<div className="ml-2 mt-1">
														Optimized for complex data sets
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Accessibility:
													</strong>
													<div className="ml-2 mt-1">
														ARIA compliance for all modes
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Mobile Support:
													</strong>
													<div className="ml-2 mt-1">
														Touch-optimized interactions
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Customization:
													</strong>
													<div className="ml-2 mt-1">
														Extensive theming options
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-indigo-100/50 to-blue-100/50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-indigo-500 mt-1 flex-shrink-0" />
											<div>
												<h4 className="text-lg font-semibold text-foreground mb-2">
													Enterprise-Ready Features
												</h4>
												<p className="text-base text-muted-foreground mb-4">
													These advanced features are designed for enterprise
													applications where user experience consistency,
													accessibility compliance, and edge case handling are
													critical requirements.
												</p>
												<div className="text-sm text-muted-foreground">
													<strong className="text-foreground">
														Use Cases:
													</strong>{" "}
													Complex forms, data dashboards, content management
													systems, and applications with sophisticated user
													interaction patterns.
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* 11. Imperative Methods (useRef) - Markdown Style */}
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800 overflow-hidden"
						)}>
						<div className="p-8 md:p-12">
							{/* Header */}
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-4">
									<Icons.code className="h-4 w-4" />
									Programmatic Control
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-300 dark:to-green-300 bg-clip-text text-transparent mb-4"
									)}>
									Imperative Methods (useRef)
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Programmatic control with ref methods for complex interaction
									patterns
								</p>
							</div>

							{/* Markdown Content */}
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<p className="text-base md:text-lg">
										For advanced use cases,{" "}
										<span className="font-semibold text-foreground">
											imperative methods
										</span>{" "}
										provide direct programmatic control over the component.
										Using React&apos;s{" "}
										<span className="font-semibold text-foreground">
											useRef
										</span>{" "}
										hook, you can trigger actions, manage state, and integrate
										with complex application workflows.
									</p>

									<div
										className={getSmallDivClasses(
											"my-8 p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.code className="h-5 w-5 text-emerald-500" />
											Interactive Control Panel
										</h4>
										<p className="text-sm text-muted-foreground mb-6">
											Try the buttons below to programmatically control the
											MultiSelect component:
										</p>

										<div className="space-y-6">
											<div
												className={getSmallDivClasses(
													"bg-white/70 dark:bg-slate-900/70 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-700/50"
												)}>
												<MultiSelect
													ref={multiSelectRef}
													options={frameworksList}
													onValueChange={setImperativeSelection}
													defaultValue={["react", "next.js"]}
													placeholder="Controlled via ref"
													className="w-full max-w-full sm:max-w-md"
													autoSize={true}
													animationConfig={{
														badgeAnimation: "bounce",
														popoverAnimation: "scale",
													}}
												/>
											</div>

											<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={handleReset}
													className="flex items-center gap-1">
													<Icons.activity className="h-3 w-3" />
													Reset
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={handleClear}
													className="flex items-center gap-1">
													<Icons.x className="h-3 w-3" />
													Clear
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={handleFocus}
													className="flex items-center gap-1">
													<Icons.target className="h-3 w-3" />
													Focus
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={handleGetValues}
													className="flex items-center gap-1">
													<Icons.search className="h-3 w-3" />
													Get Values
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={handleSetValues}
													className="flex items-center gap-1">
													<Icons.wand className="h-3 w-3" />
													Set Values
												</Button>
											</div>

											<div
												className={getSmallDivClasses(
													"bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-700/50"
												)}>
												<div className="flex items-center gap-2 mb-2">
													<Icons.check className="h-4 w-4 text-emerald-500" />
													<span className="font-medium text-emerald-800 dark:text-emerald-200">
														Current Selection
													</span>
												</div>
												<p className="text-sm text-emerald-700 dark:text-emerald-300">
													{imperativeSelection.length > 0
														? imperativeSelection.join(", ")
														: "No frameworks selected"}
												</p>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.target className="h-5 w-5 text-emerald-500" />
												Available Methods
											</h4>
											<ul className="text-sm text-muted-foreground space-y-2">
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>reset():</strong> Reset to default values
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>clear():</strong> Remove all selections
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>focus():</strong> Focus the input element
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>getValues():</strong> Get current selections
													</span>
												</li>
												<li className="flex items-start gap-2">
													<Icons.check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
													<span>
														<strong>setValues():</strong> Set selections
														programmatically
													</span>
												</li>
											</ul>
										</div>

										<div
											className={getSmallDivClasses(
												"bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/50"
											)}>
											<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
												<Icons.code className="h-5 w-5 text-teal-500" />
												Use Cases
											</h4>
											<div className="text-sm text-muted-foreground space-y-3">
												<div>
													<strong className="text-foreground">
														Form Integration:
													</strong>
													<div className="ml-2 mt-1">
														Reset forms after submission
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Wizard Steps:
													</strong>
													<div className="ml-2 mt-1">
														Auto-advance between steps
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Data Loading:
													</strong>
													<div className="ml-2 mt-1">
														Set values from API responses
													</div>
												</div>
												<div>
													<strong className="text-foreground">
														Shortcuts:
													</strong>
													<div className="ml-2 mt-1">
														Keyboard shortcuts for actions
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={getSmallDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
											<div>
												<h4 className="text-lg font-semibold text-foreground mb-2">
													Implementation Pattern
												</h4>
												<p className="text-base text-muted-foreground mb-4">
													Imperative methods bridge the gap between declarative
													React patterns and imperative interactions.
													They&apos;re particularly useful for complex user
													flows, integrations with third-party libraries, and
													advanced accessibility features.
												</p>
												<div className="text-sm text-muted-foreground">
													<strong className="text-foreground">
														Best Practice:
													</strong>{" "}
													Use imperative methods sparingly and prefer controlled
													components with props when possible for better React
													patterns.
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* Charts and Data Visualization */}
					<div
						className={getDivClasses(
							"w-full min-w-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 rounded-xl border border-orange-200/50 dark:border-orange-800/50 overflow-hidden"
						)}>
						{/* Header */}
						<div
							className={getDivHeaderClasses(
								"bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-600 p-6 text-white"
							)}>
							<div className="flex items-center gap-3 mb-3">
								<div className="p-2 bg-white/20 rounded-lg">
									<Icons.pieChart className="h-6 w-6" />
								</div>
								<h2 className="text-2xl font-bold">
									Charts & Data Visualization
								</h2>
							</div>
							<p className="text-orange-100 text-lg leading-relaxed">
								Create interactive, data-driven dashboards where MultiSelect
								components control chart filters, time periods, and
								visualization parameters. Perfect for business intelligence and
								analytics platforms.
							</p>
						</div>

						{/* Content */}
						<div className="p-6 space-y-8">
							{/* Introduction */}
							<div className="prose prose-orange max-w-none">
								<p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
									Transform static charts into{" "}
									<strong>interactive experiences</strong> where users can
									dynamically filter departments, select metrics, and adjust
									time periods. MultiSelect components serve as powerful control
									panels for complex data visualizations.
								</p>
							</div>

							{/* Interactive Demo Section */}
							<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-orange-800">
								<h3 className="text-xl font-semibold mb-4 text-orange-800 dark:text-orange-200">
									📊 Interactive Dashboard Demo
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
										<label className="text-sm font-medium">
											Select Metrics
										</label>
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
														<Tooltip
															content={<CustomTooltip type="currency" />}
														/>
														<Legend
															wrapperStyle={{ fontSize: "14px" }}
															iconType="rect"
															formatter={(value: string) => (
																<span className="text-sm font-medium">
																	{companyDepartments.find(
																		(d) => d.value === value
																	)?.label || value}
																</span>
															)}
														/>
														{selectedDepartments.map((dept, index) => (
															<Bar
																key={dept}
																dataKey={dept}
																fill={
																	chartColors[dept as keyof typeof chartColors]
																}
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
															Select &ldquo;Monthly&rdquo; period to view sales
															data
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
														<Tooltip
															content={<CustomTooltip type="currency" />}
														/>
														<Legend
															wrapperStyle={{ fontSize: "14px", zIndex: 1 }}
															iconType="rect"
															formatter={(value: string) => (
																<span className="text-sm font-medium">
																	{companyDepartments.find(
																		(d) => d.value === value
																	)?.label || value}
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
															Select &ldquo;Quarterly&rdquo; period to view
															trends
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
																	{companyDepartments.find(
																		(d) => d.value === value
																	)?.label || value}
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
																		chartColors[
																			dept as keyof typeof chartColors
																		]
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
																			chartColors[
																				dept as keyof typeof chartColors
																			],
																		strokeWidth: 2,
																		fill: chartColors[
																			dept as keyof typeof chartColors
																		],
																	}}
																	name={
																		companyDepartments.find(
																			(d) => d.value === dept
																		)?.label || dept
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
														<PolarGrid
															gridType="polygon"
															className="opacity-30"
														/>
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
																	{companyDepartments.find(
																		(d) => d.value === value
																	)?.label || value}
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
																		companyDepartments.find(
																			(d) => d.value === dept
																		)?.label || dept
																	}
																	dataKey={dept}
																	stroke={
																		chartColors[
																			dept as keyof typeof chartColors
																		]
																	}
																	fill={
																		chartColors[
																			dept as keyof typeof chartColors
																		]
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
															Select &ldquo;Performance&rdquo; metric to view
															skills radar
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
							</Card>

							{/* Chart Info */}
							<div className="mt-6 p-4 bg-muted rounded-lg">
								<h5 className="font-medium mb-2">Interactive Features:</h5>
								<ul className="text-sm text-muted-foreground space-y-1">
									<li>
										• Select different departments to filter chart data across
										all visualizations
									</li>
									<li>
										• Choose specific metrics (Revenue, Users, Performance,
										etc.) to control which charts are displayed
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
										💡 Try different combinations: Select &ldquo;Revenue&rdquo;
										+ &ldquo;Quarterly&rdquo; for revenue trends, or
										&ldquo;Performance&rdquo; + specific departments for
										performance comparison!
									</p>
								</div>
							</div>

							{/* Interactive Documentation Section - Example Usage in Content */}
							<div className="mt-12 mb-8">
								<Card className="p-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 border-slate-200 dark:border-slate-800 overflow-hidden">
									<div className="p-8 md:p-12">
										{/* Article Header */}
										<div className="mb-8 text-center">
											<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
												<Icons.code className="h-4 w-4" />
												Example Usage in Content
											</div>
											<h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent mb-4">
												Building Your Tech Stack
											</h2>
											<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
												A comprehensive guide to selecting the right
												technologies for your next project
											</p>
										</div>

										{/* Article Content with Embedded MultiSelect */}
										<div className="prose prose-lg dark:prose-invert max-w-none">
											<div className="space-y-6 text-muted-foreground leading-relaxed">
												<p className="text-base md:text-lg">
													Choosing the right technology stack is crucial for any
													successful project. Whether you&apos;re building a
													<span className="font-semibold text-foreground">
														{" "}
														web application
													</span>
													,
													<span className="font-semibold text-foreground">
														{" "}
														mobile app
													</span>
													, or
													<span className="font-semibold text-foreground">
														{" "}
														enterprise solution
													</span>
													, the technologies you select will impact your
													development speed, scalability, and long-term
													maintenance.
												</p>

												{/* Interactive Element Embedded in Content */}
												<div className="my-8 p-6 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
													<div className="mb-4">
														<h4 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
															<Icons.zap className="h-5 w-5 text-blue-500" />
															Select Your Preferred Technologies
														</h4>
														<p className="text-sm text-muted-foreground mb-4">
															Try our interactive multi-select component to
															choose technologies for your project:
														</p>
													</div>
													<MultiSelect
														options={techStackOptions}
														onValueChange={(values) => {
															// Optional: handle selection changes
														}}
														defaultValue={["typescript", "react"]}
														placeholder="Choose technologies..."
														variant="inverted"
														animationConfig={{
															badgeAnimation: "bounce",
															popoverAnimation: "scale",
															optionHoverAnimation: "highlight",
														}}
														maxCount={3}
														className="w-full"
													/>
												</div>

												<p className="text-base md:text-lg">
													Modern development teams often prefer
													<span className="font-semibold text-foreground">
														{" "}
														TypeScript
													</span>{" "}
													for its type safety,
													<span className="font-semibold text-foreground">
														{" "}
														React
													</span>{" "}
													for component-based architecture, and{" "}
													<span className="font-semibold text-foreground">
														{" "}
														Node.js
													</span>{" "}
													for full-stack JavaScript development.
												</p>

												{/* Another Interactive Section */}
												<div
													className={getSmallDivClasses(
														"my-8 p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50"
													)}>
													<div className="mb-4">
														<h4 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
															<Icons.target className="h-5 w-5 text-indigo-500" />
															Project Categories
														</h4>
														<p className="text-sm text-muted-foreground mb-4">
															What type of project are you planning to build?
														</p>
													</div>
													<MultiSelect
														options={projectTypesWithStyle}
														onValueChange={(values) => {
															// Optional: handle selection changes
														}}
														defaultValue={["web-app"]}
														placeholder="Select project type..."
														variant="default"
														animationConfig={{
															badgeAnimation: "pulse",
															popoverAnimation: "fade",
															optionHoverAnimation: "scale",
														}}
														maxCount={2}
														className="w-full"
													/>
												</div>

												<p className="text-base md:text-lg">
													The choice of technology stack should align with your
													project requirements, team expertise, and long-term
													goals. Consider factors such as
													<span className="font-semibold text-foreground">
														{" "}
														performance
													</span>
													,
													<span className="font-semibold text-foreground">
														{" "}
														scalability
													</span>
													,
													<span className="font-semibold text-foreground">
														{" "}
														maintainability
													</span>
													, and{" "}
													<span className="font-semibold text-foreground">
														{" "}
														community support
													</span>
													when making your decisions.
												</p>

												{/* Skills and Expertise Section */}
												<div className="my-8">
													<h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
														<Icons.star className="h-5 w-5 text-yellow-500" />
														Team Skills Assessment
													</h3>
													<p className="text-base md:text-lg mb-4">
														Before finalizing your tech stack, assess your
														team&apos;s current skills and expertise. This will
														help determine whether you need additional training
														or if you should consider alternative technologies.
													</p>

													<div
														className={getSmallDivClasses(
															"p-6 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50"
														)}>
														<div className="mb-4">
															<h4 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
																<Icons.cpu className="h-5 w-5 text-amber-500" />
																Current Skills
															</h4>
															<p className="text-sm text-muted-foreground mb-4">
																Select the technologies your team is already
																proficient in:
															</p>
														</div>
														<MultiSelect
															options={skillsWithDisabled}
															onValueChange={(values) => {
																// Optional: handle selection changes
															}}
															defaultValue={["html", "css", "javascript"]}
															placeholder="Select team skills..."
															variant="secondary"
															animationConfig={{
																badgeAnimation: "fade",
																popoverAnimation: "slide",
																optionHoverAnimation: "glow",
															}}
															maxCount={5}
															className="w-full"
														/>
													</div>
												</div>

												<div
													className={getSmallDivClasses(
														"mt-8 p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/50 dark:border-green-800/50"
													)}>
													<div className="flex items-start gap-4">
														<div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
															<Icons.check className="h-4 w-4 text-white" />
														</div>
														<div>
															<h4 className="text-lg font-semibold text-foreground mb-2">
																Pro Tip
															</h4>
															<p className="text-base text-muted-foreground">
																Start with technologies your team knows well,
																then gradually introduce new ones. This approach
																reduces risk and ensures project success while
																still allowing for innovation and growth.
															</p>
														</div>
													</div>
												</div>

												<p className="text-base md:text-lg">
													Remember, the best technology stack is the one that
													your team can effectively use to deliver value to your
													users. Don&apos;t choose technologies just because
													they&apos;re trendy – choose them because they solve
													real problems and fit your specific use case.
												</p>
											</div>
										</div>

										{/* Call to Action */}
										<div className="mt-12 text-center">
											<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full border border-blue-200/50 dark:border-blue-800/50">
												<Icons.wand className="h-4 w-4 text-blue-500" />
												<span className="text-sm font-medium text-blue-700 dark:text-blue-300">
													Interactive components powered by our MultiSelect
												</span>
											</div>
										</div>
									</div>
								</Card>
							</div>

							{/* Interactive Form/Survey Section - Markdown Style */}
							<div className="mt-8 mb-8">
								<Card
									className={getCardClasses(
										"p-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 border-emerald-200 dark:border-emerald-800 overflow-hidden"
									)}>
									<div className="p-8 md:p-12">
										{/* Survey Header */}
										<div className="mb-8 text-center">
											<div
												className={getBadgeClasses(
													"inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-4"
												)}>
												<Icons.users className="h-4 w-4" />
												Interactive Survey Example
											</div>
											<h2
												className={getHeaderTextClasses(
													"text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent mb-4"
												)}>
												Developer Survey 2025
											</h2>
											<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
												Help us understand the current state of web development
											</p>
										</div>

										{/* Survey Content in Markdown Style */}
										<div className="prose prose-lg dark:prose-invert max-w-none">
											<div className="space-y-8 text-muted-foreground leading-relaxed">
												{/* Question 1 */}
												<div className="markdown-section">
													<h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
														<span className="flex items-center justify-center w-8 h-8 bg-emerald-500 text-white rounded-full text-sm font-bold">
															1
														</span>
														What programming languages do you use regularly?
													</h3>
													<p className="text-base md:text-lg mb-6">
														Select all programming languages that you work with
														on a regular basis. This helps us understand the
														current landscape of developer preferences and
														industry trends.
													</p>

													<div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
														<MultiSelect
															options={[
																{
																	value: "javascript",
																	label: "JavaScript",
																	icon: Icons.zap,
																},
																{
																	value: "typescript",
																	label: "TypeScript",
																	icon: Icons.code,
																},
																{
																	value: "python",
																	label: "Python",
																	icon: Icons.cpu,
																},
																{
																	value: "java",
																	label: "Java",
																	icon: Icons.database,
																},
																{
																	value: "csharp",
																	label: "C#",
																	icon: Icons.shield,
																},
																{
																	value: "golang",
																	label: "Go",
																	icon: Icons.activity,
																},
																{
																	value: "rust",
																	label: "Rust",
																	icon: Icons.harddrive,
																},
																{
																	value: "php",
																	label: "PHP",
																	icon: Icons.globe,
																},
																{
																	value: "swift",
																	label: "Swift",
																	icon: Icons.smartphone,
																},
																{
																	value: "kotlin",
																	label: "Kotlin",
																	icon: Icons.smartphone,
																},
															]}
															onValueChange={(values) => {
																// Optional: handle selection changes
															}}
															defaultValue={["javascript", "typescript"]}
															placeholder="Select programming languages..."
															variant="default"
															animationConfig={{
																badgeAnimation: "bounce",
																popoverAnimation: "scale",
																optionHoverAnimation: "highlight",
															}}
															maxCount={5}
															className="w-full"
														/>
													</div>
												</div>

												{/* Question 2 */}
												<div className="markdown-section">
													<h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
														<span className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full text-sm font-bold">
															2
														</span>
														Which frameworks and libraries are you most
														interested in learning?
													</h3>
													<p className="text-base md:text-lg mb-6">
														The tech industry evolves rapidly. Tell us which
														technologies you&apos;re planning to learn next
														year. This could include frameworks you&apos;ve
														heard about but haven&apos;t had the chance to try
														yet.
													</p>

													<div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
														<MultiSelect
															options={categorizedOptions}
															onValueChange={(values) => {
																// Optional: handle selection changes
															}}
															defaultValue={["react", "nodejs"]}
															placeholder="Select technologies to learn..."
															variant="inverted"
															animationConfig={{
																badgeAnimation: "pulse",
																popoverAnimation: "fade",
																optionHoverAnimation: "scale",
															}}
															maxCount={4}
															className="w-full"
														/>
													</div>
												</div>

												{/* Question 3 */}
												<div className="markdown-section">
													<h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
														<span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full text-sm font-bold">
															3
														</span>
														What type of projects do you primarily work on?
													</h3>
													<p className="text-base md:text-lg mb-6">
														Understanding the types of projects developers work
														on helps us identify common patterns and challenges.
														Whether you&apos;re building{" "}
														<code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
															enterprise applications
														</code>
														,
														<code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
															mobile apps
														</code>
														, or
														<code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
															data pipelines
														</code>
														, your experience matters.
													</p>

													<div className="grid md:grid-cols-2 gap-4 mb-6">
														<div className="bg-cyan-50/50 dark:bg-cyan-950/20 rounded-lg p-4 border border-cyan-200/50 dark:border-cyan-700/50">
															<h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
																<Icons.globe className="h-5 w-5 text-cyan-500" />
																Web Development
															</h4>
															<p className="text-sm text-muted-foreground">
																Frontend, backend, and full-stack web
																applications
															</p>
														</div>
														<div className="bg-cyan-50/50 dark:bg-cyan-950/20 rounded-lg p-4 border border-cyan-200/50 dark:border-cyan-700/50">
															<h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
																<Icons.smartphone className="h-5 w-5 text-cyan-500" />
																Mobile Development
															</h4>
															<p className="text-sm text-muted-foreground">
																Native and cross-platform mobile applications
															</p>
														</div>
													</div>

													<div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
														<MultiSelect
															options={projectTypesWithStyle}
															onValueChange={(values) => {
																// Optional: handle selection changes
															}}
															defaultValue={["web-app"]}
															placeholder="Select project types..."
															variant="secondary"
															animationConfig={{
																badgeAnimation: "wiggle",
																popoverAnimation: "slide",
																optionHoverAnimation: "glow",
															}}
															maxCount={3}
															className="w-full"
														/>
													</div>
												</div>

												{/* Question 4 */}
												<div className="markdown-section">
													<h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
														<span className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full text-sm font-bold">
															4
														</span>
														How do you prefer to learn new technologies?
													</h3>
													<p className="text-base md:text-lg mb-6">
														Everyone has different learning styles. Some prefer
														hands-on coding, others like structured courses.
														Understanding how developers learn helps the
														community create better educational resources.
													</p>

													<div
														className={getSmallDivClasses(
															"bg-purple-50/50 dark:bg-purple-950/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50 mb-6"
														)}>
														<h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
															<Icons.star className="h-5 w-5 text-purple-500" />
															Learning Preferences
														</h4>
														<MultiSelect
															options={[
																{
																	value: "documentation",
																	label: "Official Documentation",
																	icon: Icons.code,
																},
																{
																	value: "tutorials",
																	label: "Video Tutorials",
																	icon: Icons.globe,
																},
																{
																	value: "courses",
																	label: "Online Courses",
																	icon: Icons.target,
																},
																{
																	value: "books",
																	label: "Technical Books",
																	icon: Icons.star,
																},
																{
																	value: "practice",
																	label: "Hands-on Practice",
																	icon: Icons.zap,
																},
																{
																	value: "mentorship",
																	label: "Mentorship",
																	icon: Icons.cpu,
																},
																{
																	value: "community",
																	label: "Community Forums",
																	icon: Icons.database,
																},
																{
																	value: "conferences",
																	label: "Conferences & Talks",
																	icon: Icons.shield,
																},
															]}
															onValueChange={(values) => {
																// Optional: handle selection changes
															}}
															defaultValue={["documentation", "practice"]}
															placeholder="How do you like to learn?"
															variant="default"
															animationConfig={{
																badgeAnimation: "fade",
																popoverAnimation: "flip",
																optionHoverAnimation: "highlight",
															}}
															maxCount={4}
															className="w-full"
														/>
													</div>

													<div
														className={getSmallDivClasses(
															"mt-8 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-700/50"
														)}>
														<div className="flex items-start gap-3">
															<Icons.star className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
															<div>
																<h4 className="font-semibold text-foreground mb-1">
																	Pro Tip
																</h4>
																<p className="text-sm text-muted-foreground">
																	Combining multiple learning methods often
																	leads to better retention and understanding.
																	Try pairing documentation reading with
																	hands-on practice!
																</p>
															</div>
														</div>
													</div>
												</div>

												{/* Survey Summary */}
												<div
													className={getSmallDivClasses(
														"mt-12 p-6 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50"
													)}>
													<h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
														<Icons.check className="h-6 w-6 text-emerald-500" />
														Thank You for Participating!
													</h3>
													<p className="text-base text-muted-foreground mb-4">
														Your responses help us understand the developer
														community better. This survey demonstrates how
														MultiSelect components can be seamlessly integrated
														into forms and surveys.
													</p>
													<div className="flex flex-wrap gap-2">
														<span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-full text-sm">
															<Icons.zap className="h-3 w-3" />
															Interactive
														</span>
														<span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 rounded-full text-sm">
															<Icons.target className="h-3 w-3" />
															Accessible
														</span>
														<span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 rounded-full text-sm">
															<Icons.star className="h-3 w-3" />
															Customizable
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Card>
							</div>

							{/* Features Grid */}
							<div className="p-6 pt-0">
								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
									<div
										className={getSmallDivClasses(
											"p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800"
										)}>
										<div className="flex items-center gap-2 mb-2">
											<Icons.activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
											<h4 className="font-semibold text-orange-900 dark:text-orange-100">
												Real-time Updates
											</h4>
										</div>
										<p className="text-sm text-orange-700 dark:text-orange-300">
											Charts instantly update when selections change
										</p>
									</div>
									<div
										className={getSmallDivClasses(
											"p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800"
										)}>
										<div className="flex items-center gap-2 mb-2">
											<Icons.search className="h-5 w-5 text-amber-600 dark:text-amber-400" />
											<h4 className="font-semibold text-amber-900 dark:text-amber-100">
												Smart Filtering
											</h4>
										</div>
										<p className="text-sm text-amber-700 dark:text-amber-300">
											Multiple filter dimensions working together
										</p>
									</div>
									<div
										className={getSmallDivClasses(
											"p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800"
										)}>
										<div className="flex items-center gap-2 mb-2">
											<Icons.target className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
											<h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
												Custom Visualizations
											</h4>
										</div>
										<p className="text-sm text-yellow-700 dark:text-yellow-300">
											Bar, pie, area, line, radar, and treemap charts
										</p>
									</div>
								</div>
							</div>

							{/* Implementation Notes */}
							<div className="p-6 pt-0">
								<div
									className={getSmallDivClasses(
										"bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800"
									)}>
									<h4 className="text-lg font-semibold mb-4 text-orange-900 dark:text-orange-100 flex items-center gap-2">
										<Icons.code className="h-5 w-5" />
										Implementation Highlights
									</h4>
									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<h5 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
												Data Binding Strategy
											</h5>
											<ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
												<li>• Reactive chart data based on selections</li>
												<li>• Conditional chart rendering</li>
												<li>• Optimized re-render performance</li>
												<li>• Smooth transition animations</li>
											</ul>
										</div>
										<div>
											<h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
												Best Practices
											</h5>
											<ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
												<li>• Consistent color schemes across charts</li>
												<li>• Responsive chart containers</li>
												<li>• Accessible tooltips and legends</li>
												<li>• Empty state handling</li>
											</ul>
										</div>
									</div>
								</div>
							</div>

							{/* Pro Tips */}
							<div className="p-6 pt-0">
								<div
									className={getSmallDivClasses(
										"bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-amber-400/10 border-l-4 border-orange-400 rounded-r-lg p-4"
									)}>
									<p className="text-orange-800 dark:text-orange-200 font-medium flex items-start gap-2">
										<Icons.star className="h-5 w-5 mt-0.5 flex-shrink-0" />
										<span>
											<strong>Pro Tip:</strong> Use MultiSelect variants to
											create visual hierarchy: primary selectors for main
											filters, secondary for sub-categories, and inverted for
											special options.
										</span>
									</p>
								</div>
							</div>
						</div>

						{/* AI/LLM Examples Section */}
						<div
							className={getDivClasses(
								"w-full min-w-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 rounded-xl border border-violet-200/50 dark:border-violet-800/50 overflow-hidden"
							)}>
							{/* Header */}
							<div
								className={getDivHeaderClasses(
									"bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-6 text-white"
								)}>
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 bg-white/20 rounded-lg">
										<Icons.zap className="h-6 w-6" />
									</div>
									<h2 className="text-2xl font-bold">AI & LLM Integration</h2>
								</div>
								<p className="text-violet-100 text-lg leading-relaxed">
									Power up your AI applications with intelligent MultiSelect
									controls for model selection, prompt engineering, data source
									configuration, and multimodal AI workflows.
								</p>
							</div>

							{/* Content */}
							<div className="p-6 space-y-8">
								{/* Introduction */}
								<div className="prose prose-violet max-w-none">
									<p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
										Transform your AI interfaces with{" "}
										<strong>smart selection controls</strong> that make complex
										configurations intuitive. From LLM model comparison to RAG
										data source management, MultiSelect components bring clarity
										to AI workflows.
									</p>
								</div>

								{/* Interactive Demo Grid */}
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
											Choose multiple language models for comparison, A/B
											testing, or ensemble predictions.
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
											defaultValue={[
												"openai-gpt",
												"code-assistant",
												"pinecone",
											]}
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
										<h4 className="text-lg font-medium mb-4">
											RAG Data Sources
										</h4>
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
											Configure Retrieval-Augmented Generation with multiple
											data sources for enhanced AI responses.
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
											onValueChange={(value) =>
												setSelectedAgentCapabilities(value)
											}
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
											Enable cross-modal AI capabilities with custom-styled
											badges for different input/output types.
										</p>
									</Card>
								</div>

								{/* Features Grid */}
								<div className="p-6 pt-0">
									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<div
											className={getSmallDivClasses(
												"p-4 bg-violet-100 dark:bg-violet-900/30 rounded-lg border border-violet-200 dark:border-violet-800"
											)}>
											<div className="flex items-center gap-2 mb-2">
												<Icons.cpu className="h-5 w-5 text-violet-600 dark:text-violet-400" />
												<h4 className="font-semibold text-violet-900 dark:text-violet-100">
													Model Selection
												</h4>
											</div>
											<p className="text-sm text-violet-700 dark:text-violet-300">
												Configure multiple AI models for A/B testing
											</p>
										</div>
										<div
											className={getSmallDivClasses(
												"p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800"
											)}>
											<div className="flex items-center gap-2 mb-2">
												<Icons.messageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
												<h4 className="font-semibold text-purple-900 dark:text-purple-100">
													Prompt Engineering
												</h4>
											</div>
											<p className="text-sm text-purple-700 dark:text-purple-300">
												Organize templates and conversation patterns
											</p>
										</div>
										<div
											className={getSmallDivClasses(
												"p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800"
											)}>
											<div className="flex items-center gap-2 mb-2">
												<Icons.database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
												<h4 className="font-semibold text-indigo-900 dark:text-indigo-100">
													RAG Integration
												</h4>
											</div>
											<p className="text-sm text-indigo-700 dark:text-indigo-300">
												Multi-source knowledge retrieval system
											</p>
										</div>
									</div>
								</div>

								{/* AI Use Cases */}
								<div className="p-6 pt-0">
									<div
										className={getSmallDivClasses(
											"bg-gradient-to-r from-violet-100 via-purple-100 to-indigo-100 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-violet-200 dark:border-violet-800"
										)}>
										<h4 className="text-lg font-semibold mb-4 text-violet-900 dark:text-violet-100 flex items-center gap-2">
											<Icons.star className="h-5 w-5" />
											AI Implementation Patterns
										</h4>
										<div className="grid gap-4 md:grid-cols-2">
											<div>
												<h5 className="font-medium text-violet-800 dark:text-violet-200 mb-2">
													Essential AI Workflows
												</h5>
												<ul className="text-sm text-violet-700 dark:text-violet-300 space-y-1">
													<li>• Model ensemble and comparison</li>
													<li>• Template-based prompt engineering</li>
													<li>• Multi-source RAG configuration</li>
													<li>• Parameter optimization controls</li>
												</ul>
											</div>
											<div>
												<h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
													Advanced Features
												</h5>
												<ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
													<li>• Multimodal AI capabilities</li>
													<li>• Agent skill configuration</li>
													<li>• Tool and service organization</li>
													<li>• Custom AI pipeline building</li>
												</ul>
											</div>
										</div>
									</div>
								</div>

								{/* Pro Tips */}
								<div className="p-6 pt-0">
									<div
										className={getSmallDivClasses(
											"bg-gradient-to-br from-indigo-400/10 via-purple-400/10 to-violet-400/10 border-l-4 border-violet-400 rounded-r-lg p-4"
										)}>
										<p className="text-violet-800 dark:text-violet-200 font-medium flex items-start gap-2">
											<Icons.zap className="h-5 w-5 mt-0.5 flex-shrink-0" />
											<span>
												<strong>AI Pro Tip:</strong> Use different animation
												styles to indicate AI status: &ldquo;pulse&rdquo; for
												active models, &ldquo;bounce&rdquo; for new features,
												&ldquo;slide&rdquo; for data sources.
											</span>
										</p>
									</div>
								</div>
							</div>

							{/* Props Reference */}
							<div
								className={getDivClasses(
									"w-full min-w-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-red-950/30 rounded-xl border border-rose-200/50 dark:border-rose-800/50 overflow-hidden"
								)}>
								{/* Header */}
								<div
									className={getDivHeaderClasses(
										"bg-gradient-to-r from-rose-500 via-fuchsia-500 to-red-500 p-6 text-white"
									)}>
									<div className="flex items-center gap-3 mb-3">
										<div className="p-2 bg-white/20 rounded-lg">
											<Icons.code className="h-6 w-6" />
										</div>
										<h2 className="text-2xl font-bold">
											Props Reference Guide
										</h2>
									</div>
									<p className="text-rose-100 text-lg leading-relaxed">
										Complete documentation of all MultiSelect component
										properties, with examples, defaults, and best practices for
										every configuration option.
									</p>
								</div>

								{/* Content */}
								<div className="p-6 space-y-8">
									{/* Introduction */}
									<div className="prose prose-rose max-w-none">
										<p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
											Master every aspect of the MultiSelect component with this{" "}
											<strong>comprehensive reference</strong>. From basic
											configuration to advanced customization, find all the
											props you need to create perfect multi-selection
											experiences.
										</p>
									</div>

									{/* Props Grid */}
									<div className="grid gap-6">
										{/* Core Props */}
										<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-rose-200 dark:border-rose-800">
											<h3 className="text-xl font-semibold mb-4 text-rose-800 dark:text-rose-200 flex items-center gap-2">
												<Icons.star className="h-5 w-5" />
												Core Properties
											</h3>
											<div className="space-y-3 text-sm">
												<div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded border-l-4 border-rose-300">
													<code className="font-semibold text-rose-700 dark:text-rose-300">
														options
													</code>
													<p className="text-rose-600 dark:text-rose-400 mt-1">
														Array of options or grouped options
													</p>
												</div>
												<div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded border-l-4 border-pink-300">
													<code className="font-semibold text-pink-700 dark:text-pink-300">
														onValueChange
													</code>
													<p className="text-pink-600 dark:text-pink-400 mt-1">
														Callback function for value changes
													</p>
												</div>
												<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300">
													<code className="font-semibold text-red-700 dark:text-red-300">
														defaultValue
													</code>
													<p className="text-red-600 dark:text-red-400 mt-1">
														Initial selected values (default: [])
													</p>
												</div>
												<div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded border-l-4 border-rose-300">
													<code className="font-semibold text-rose-700 dark:text-rose-300">
														placeholder
													</code>
													<p className="text-rose-600 dark:text-rose-400 mt-1">
														Placeholder text (default: &ldquo;Select
														options&rdquo;)
													</p>
												</div>
											</div>
										</Card>

										{/* Appearance Props */}
										<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-pink-200 dark:border-pink-800">
											<h3 className="text-xl font-semibold mb-4 text-pink-800 dark:text-pink-200 flex items-center gap-2">
												<Icons.heart className="h-5 w-5" />
												Appearance & Styling
											</h3>
											<div className="grid gap-3 md:grid-cols-2 text-sm">
												<div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded border-l-4 border-pink-300">
													<code className="font-semibold text-pink-700 dark:text-pink-300">
														variant
													</code>
													<p className="text-pink-600 dark:text-pink-400 mt-1">
														&ldquo;default&rdquo; | &ldquo;secondary&rdquo; |
														&ldquo;destructive&rdquo; | &ldquo;inverted&rdquo;
													</p>
												</div>
												<div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded border-l-4 border-rose-300">
													<code className="font-semibold text-rose-700 dark:text-rose-300">
														maxCount
													</code>
													<p className="text-rose-600 dark:text-rose-400 mt-1">
														Max badges to show (default: 3)
													</p>
												</div>
												<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300">
													<code className="font-semibold text-red-700 dark:text-red-300">
														autoSize
													</code>
													<p className="text-red-600 dark:text-red-400 mt-1">
														Auto width behavior (default: false)
													</p>
												</div>
												<div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded border-l-4 border-pink-300">
													<code className="font-semibold text-pink-700 dark:text-pink-300">
														singleLine
													</code>
													<p className="text-pink-600 dark:text-pink-400 mt-1">
														Single line layout (default: false)
													</p>
												</div>
											</div>
										</Card>

										{/* Behavior Props */}
										<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-red-200 dark:border-red-800">
											<h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-200 flex items-center gap-2">
												<Icons.target className="h-5 w-5" />
												Behavior & Interaction
											</h3>
											<div className="grid gap-3 md:grid-cols-2 text-sm">
												<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300">
													<code className="font-semibold text-red-700 dark:text-red-300">
														searchable
													</code>
													<p className="text-red-600 dark:text-red-400 mt-1">
														Enable search functionality (default: true)
													</p>
												</div>
												<div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded border-l-4 border-rose-300">
													<code className="font-semibold text-rose-700 dark:text-rose-300">
														hideSelectAll
													</code>
													<p className="text-rose-600 dark:text-rose-400 mt-1">
														Hide select all button (default: false)
													</p>
												</div>
												<div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded border-l-4 border-pink-300">
													<code className="font-semibold text-pink-700 dark:text-pink-300">
														closeOnSelect
													</code>
													<p className="text-pink-600 dark:text-pink-400 mt-1">
														Close after selection (default: false)
													</p>
												</div>
												<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300">
													<code className="font-semibold text-red-700 dark:text-red-300">
														disabled
													</code>
													<p className="text-red-600 dark:text-red-400 mt-1">
														Disable component (default: false)
													</p>
												</div>
											</div>
										</Card>

										{/* Advanced Props */}
										<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-rose-200 dark:border-rose-800">
											<h3 className="text-xl font-semibold mb-4 text-rose-800 dark:text-rose-200 flex items-center gap-2">
												<Icons.zap className="h-5 w-5" />
												Advanced Configuration
											</h3>
											<div className="grid gap-3 md:grid-cols-2 text-sm">
												<div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded border-l-4 border-rose-300">
													<code className="font-semibold text-rose-700 dark:text-rose-300">
														responsive
													</code>
													<p className="text-rose-600 dark:text-rose-400 mt-1">
														Responsive behavior configuration
													</p>
												</div>
												<div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded border-l-4 border-pink-300">
													<code className="font-semibold text-pink-700 dark:text-pink-300">
														animationConfig
													</code>
													<p className="text-pink-600 dark:text-pink-400 mt-1">
														Custom animation settings
													</p>
												</div>
												<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300">
													<code className="font-semibold text-red-700 dark:text-red-300">
														modalPopover
													</code>
													<p className="text-red-600 dark:text-red-400 mt-1">
														Modal behavior (default: false)
													</p>
												</div>
												<div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded border-l-4 border-rose-300">
													<code className="font-semibold text-rose-700 dark:text-rose-300">
														deduplicateOptions
													</code>
													<p className="text-rose-600 dark:text-rose-400 mt-1">
														Remove duplicates (default: false)
													</p>
												</div>
											</div>
										</Card>
									</div>
								</div>

								{/* Implementation Tips */}
								<div className="p-6 pt-0">
									<div
										className={getSmallDivClasses(
											"bg-gradient-to-r from-rose-100 via-pink-100 to-red-100 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-red-900/20 rounded-lg p-6 border border-rose-200 dark:border-rose-800"
										)}>
										<h4 className="text-lg font-semibold mb-4 text-rose-900 dark:text-rose-100 flex items-center gap-2">
											<Icons.code className="h-5 w-5" />
											Implementation Best Practices
										</h4>
										<div className="grid gap-4 md:grid-cols-2">
											<div>
												<h5 className="font-medium text-rose-800 dark:text-rose-200 mb-2">
													Essential Tips
												</h5>
												<ul className="text-sm text-rose-700 dark:text-rose-300 space-y-1">
													<li>• Always provide onValueChange callback</li>
													<li>• Use meaningful option labels</li>
													<li>• Set appropriate maxCount for UI</li>
													<li>• Test with different data sizes</li>
												</ul>
											</div>
											<div>
												<h5 className="font-medium text-pink-800 dark:text-pink-200 mb-2">
													Performance
												</h5>
												<ul className="text-sm text-pink-700 dark:text-pink-300 space-y-1">
													<li>
														• Enable deduplicateOptions for large datasets
													</li>
													<li>• Use responsive props for mobile</li>
													<li>• Optimize search with custom filtering</li>
													<li>• Memoize option arrays when possible</li>
												</ul>
											</div>
										</div>
									</div>
								</div>

								{/* Quick Reference */}
								<div className="p-6 pt-0">
									<div
										className={getSmallDivClasses(
											"bg-gradient-to-br from-red-400/10 via-pink-400/10 to-rose-400/10 border-l-4 border-rose-400 rounded-r-lg p-4"
										)}>
										<p className="text-rose-800 dark:text-rose-200 font-medium flex items-start gap-2">
											<Icons.code className="h-5 w-5 mt-0.5 flex-shrink-0" />
											<span>
												<strong>Quick Start:</strong> Most use cases only need
												options, onValueChange, and optionally defaultValue. All
												other props enhance the experience but have sensible
												defaults.
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* AI Chat Widget */}
				</div>
				<AIChat />
			</div>
		</main>
	);
}
