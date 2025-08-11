"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { AIChat } from "@/components/ai-chat";
import { useColorMode } from "@/contexts/color-mode-context";
import { VisualizationCharts } from "@/components/visualization-charts";
import { TableOfContents } from "@/components/table-of-contents";
import { ReadingProgress } from "@/components/reading-progress";
import { CodeSheet } from "@/components/code-sheet";
import {
	SkipLinks,
	FocusIndicator,
	LiveRegion,
} from "@/components/accessibility";
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
	{ value: "product", label: "Product", icon: Icons.target },
	{ value: "marketing", label: "Marketing", icon: Icons.trendingUp },
	{ value: "sales", label: "Sales", icon: Icons.dollarSign },
	{ value: "hr", label: "HR", icon: Icons.users },
	{ value: "finance", label: "Finance", icon: Icons.pieChart },
	{ value: "operations", label: "Operations", icon: Icons.activity },
	{ value: "support", label: "Support", icon: Icons.mail },
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
	const [githubStars, setGithubStars] = useState<number | null>(null);
	const [isLoadingStars, setIsLoadingStars] = useState(true);
	const [starsError, setStarsError] = useState(false);
	const { isGrayMode } = useColorMode();

	const [groupedSelection, setGroupedSelection] = useState<string[]>([
		"react",
		"nodejs",
	]);
	const [imperativeSelection, setImperativeSelection] = useState<string[]>([
		"react",
		"next.js",
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

	useEffect(() => {
		const fetchGitHubStars = async () => {
			try {
				setIsLoadingStars(true);
				setStarsError(false);
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000);
				const response = await fetch(
					"https://api.github.com/repos/sersavan/shadcn-multi-select-component",
					{
						headers: {
							Accept: "application/vnd.github.v3+json",
						},
						signal: controller.signal,
					}
				);
				clearTimeout(timeoutId);
				if (response.ok) {
					const data = await response.json();
					setGithubStars(data.stargazers_count || 0);
				} else {
					throw new Error(`HTTP ${response.status}`);
				}
			} catch (error) {
				console.error("Error fetching GitHub stars:", error);
				setStarsError(true);
				setGithubStars(0);
			} finally {
				setIsLoadingStars(false);
			}
		};

		fetchGitHubStars();
	}, []);

	const formatStars = (stars: number) => {
		if (stars >= 1000) {
			return `${(stars / 1000).toFixed(1)}k`;
		}
		return stars.toString();
	};

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			frameworks: ["next.js", "react"],
			techStack: ["typescript"],
			skills: ["html", "css"],
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
			return "relative p-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/30 dark:via-gray-950/30 dark:to-zinc-950/30 border-slate-200 dark:border-slate-800 overflow-hidden";
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
			{/* Accessibility Components */}
			<SkipLinks />
			<FocusIndicator />
			<LiveRegion />
			<ReadingProgress />
			<TableOfContents />

			<div
				className="max-w-4xl mx-auto px-2 sm:px-4 py-4 w-full min-w-0"
				id="main-content">
				{/* Header */}
				<header id="navigation">
					<PageHeader className="text-center">
						<PageHeaderHeading>Multi Select Component</PageHeaderHeading>
						<PageHeaderDescription>
							assembled with shadcn/ui and Radix UI primitives
						</PageHeaderDescription>
						<PageActions>
							<div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
								<button
									onClick={() => {
										const demoSection = document.getElementById("examples");
										demoSection?.scrollIntoView({ behavior: "smooth" });
									}}
									className={cn(
										"group relative overflow-hidden w-full sm:w-auto",
										"bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700",
										"hover:from-blue-700 hover:via-purple-700 hover:to-blue-800",
										"text-white border-0 shadow-lg hover:shadow-xl",
										"transition-all duration-300 ease-in-out",
										"transform hover:scale-105 hover:-translate-y-0.5",
										"px-6 py-3 rounded-lg font-medium",
										"flex items-center justify-center gap-2.5",
										"before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent",
										"before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100"
									)}>
									<div className="relative z-10 flex items-center gap-2.5">
										<Icons.zap className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
										<span>Try Live Demo</span>
									</div>
									<div className="absolute inset-0 border border-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</button>
								<Link
									target="_blank"
									rel="noreferrer"
									href="https://github.com/sersavan/shadcn-multi-select-component"
									className={cn(
										"group relative overflow-hidden w-full sm:w-auto",
										"bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900",
										"hover:from-gray-800 hover:via-gray-700 hover:to-gray-800",
										"text-white border-0 shadow-lg hover:shadow-xl",
										"transition-all duration-300 ease-in-out",
										"transform hover:scale-105 hover:-translate-y-0.5",
										"px-6 py-3 rounded-lg font-medium",
										"flex items-center justify-center gap-2.5",
										"before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/20 before:via-purple-500/20 before:to-pink-500/20",
										"before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100"
									)}>
									<div className="relative z-10 flex items-center gap-2.5">
										<Icons.gitHub className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
										<span>View Source</span>
										{!isLoadingStars && !starsError && githubStars !== null && (
											<div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full text-xs">
												<Icons.star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
												<span>{formatStars(githubStars)}</span>
											</div>
										)}
										<div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
									</div>
									<div className="absolute inset-0 border border-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</Link>
							</div>
						</PageActions>
					</PageHeader>
				</header>

				{/* Interactive Examples Introduction */}
				<div className="mt-6 mb-3">
					<Card
						className={getCardClasses(
							"p-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 overflow-hidden"
						)}>
						<div
							className={
								isGrayMode
									? "p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors"
									: "p-4 cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
							}
							onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
										<Icons.zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
									</div>
									<div>
										<h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
											Interactive Examples & Live Demos
										</h3>
										<p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">
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
				<section
					id="examples"
					className="grid gap-6 mt-6 w-full min-w-0"
					aria-labelledby="examples-heading">
					<h2 id="examples-heading" className="sr-only">
						Interactive Examples and Demonstrations
					</h2>

					{/* 1. Form Integration*/}
					<Card
						id="form-integration"
						role="region"
						aria-labelledby="form-integration-title"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30 border-violet-200 dark:border-violet-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Form Integration Example"
								description="Complete form example with React Hook Form and Zod validation"
								fileName="form-example.tsx"
								code={`import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  frameworks: z
    .array(z.string())
    .min(1, { message: "Please select at least one framework." }),
});

const frameworksList = [
  { value: "next.js", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
];

export default function FormExample() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      frameworks: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(\`Selected: \${data.frameworks.join(", ")}\`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="frameworks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Frameworks</FormLabel>
              <FormControl>
                <MultiSelect
                  options={frameworksList}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Choose frameworks..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
							<div className="text-center flex-1">
								<div
									className={getBadgeClasses(
										"inline-flex items-center gap-2 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4"
									)}>
									<Icons.wand className="h-4 w-4" />
									Professional Form Integration
								</div>
							</div>
							<div className="text-center">
								<h2
									id="form-integration-title"
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm border-violet-200/50 dark:border-violet-700/50"
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
										className={getDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-violet-100/50 to-purple-100/50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-xl border border-violet-200/50 dark:border-violet-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.star className="h-6 w-6 text-violet-500 flex-shrink-0" />
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

					{/* 2. Component Variants*/}
					<Card
						id="variants-section"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-red-950/30 border-rose-200 dark:border-rose-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Component Variants Example"
								description="Different visual styles and variants for various use cases"
								fileName="variants-example.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
];

export default function VariantsExample() {
  return (
    <div className="space-y-6">
      {/* Default variant */}
      <div>
        <label className="text-sm font-medium mb-2 block">Default</label>
        <MultiSelect
          options={options}
          placeholder="Select frameworks..."
          variant="default"
        />
      </div>

      {/* Secondary variant */}
      <div>
        <label className="text-sm font-medium mb-2 block">Secondary</label>
        <MultiSelect
          options={options}
          placeholder="Select frameworks..."
          variant="secondary"
        />
      </div>

      {/* Outline variant */}
      <div>
        <label className="text-sm font-medium mb-2 block">Outline</label>
        <MultiSelect
          options={options}
          placeholder="Select frameworks..."
          variant="outline"
        />
      </div>

      {/* Ghost variant */}
      <div>
        <label className="text-sm font-medium mb-2 block">Ghost</label>
        <MultiSelect
          options={options}
          placeholder="Select frameworks..."
          variant="ghost"
        />
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div className="grid md:grid-cols-2 gap-6 my-8">
										<div
											className={getDivClasses(
												"p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
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
											className={getDivClasses(
												"p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
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
										className={getDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-rose-100/50 to-pink-100/50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-xl border border-rose-200/50 dark:border-rose-700/50"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.star className="h-6 w-6 text-rose-500 flex-shrink-0" />
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

					{/* 3. Animation Configurations*/}
					<Card
						id="animations-section"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Animation Configurations Example"
								description="Configure animations for better user experience"
								fileName="animations-example.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
];

export default function AnimationsExample() {
  return (
    <div className="space-y-6">
      {/* Bounce Animation */}
      <div>
        <label className="text-sm font-medium mb-2 block">Bounce Animation</label>
        <MultiSelect
          options={options}
          placeholder="Bouncy interactions..."
          animationConfig={{
            badgeAnimation: "bounce",
            popoverAnimation: "scale",
            optionHoverAnimation: "glow",
          }}
        />
      </div>

      {/* Pulse Animation */}
      <div>
        <label className="text-sm font-medium mb-2 block">Pulse Animation</label>
        <MultiSelect
          options={options}
          placeholder="Pulsing effects..."
          animationConfig={{
            badgeAnimation: "pulse",
            popoverAnimation: "fade",
            optionHoverAnimation: "highlight",
          }}
        />
      </div>

      {/* No Animation - Performance Mode */}
      <div>
        <label className="text-sm font-medium mb-2 block">No Animations</label>
        <MultiSelect
          options={options}
          placeholder="Fast performance..."
          animationConfig={{
            badgeAnimation: "none",
            popoverAnimation: "none",
            optionHoverAnimation: "none",
          }}
        />
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
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
									<div
										className={getDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-amber-100/50 to-yellow-100/50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-amber-500 flex-shrink-0" />
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

					{/* 4. Responsive Behavior*/}
					<Card
						id="responsive-behavior"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-green-200 dark:border-green-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Responsive Behavior Example"
								description="Adaptive design patterns for different screen sizes"
								fileName="responsive-example.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

export default function ResponsiveExample() {
  return (
    <div className="space-y-6">
      {/* Mobile-first responsive */}
      <div>
        <label className="text-sm font-medium mb-2 block">Mobile Optimized</label>
        <MultiSelect
          options={options}
          placeholder="Select frameworks..."
          className="w-full sm:w-auto"
          maxCount={2} // Fewer items on small screens
        />
      </div>

      {/* Desktop full width */}
      <div>
        <label className="text-sm font-medium mb-2 block">Desktop Full Width</label>
        <MultiSelect
          options={options}
          placeholder="All frameworks available..."
          className="w-full"
          maxCount={5} // More items on larger screens
        />
      </div>

      {/* Responsive with breakpoints */}
      <div>
        <label className="text-sm font-medium mb-2 block">Breakpoint Aware</label>
        <MultiSelect
          options={options}
          placeholder="Adaptive layout..."
          className="w-full md:w-96 lg:w-full"
          // Different behavior per breakpoint
        />
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
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
												className={getDivClasses(
													"mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-700/50"
												)}>
												<p className="text-sm font-medium text-green-800 dark:text-green-200">
													Current Selection:{" "}
													{responsiveDemo.join(", ") || "None selected"}
												</p>
											</div>
										</div>
									</div>
									<div
										className={getDivClasses(
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

					{/* 5. Grouped Options*/}
					<Card
						id="grouped-options"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Grouped Options Example"
								description="Organize options into logical categories"
								fileName="grouped-options-example.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";

const groupedOptions = [
  {
    heading: "Frontend Frameworks",
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue.js" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
    ],
  },
  {
    heading: "Backend Technologies", 
    options: [
      { value: "nodejs", label: "Node.js" },
      { value: "django", label: "Django" },
      { value: "rails", label: "Ruby on Rails" },
      { value: "spring", label: "Spring Boot" },
    ],
  },
  {
    heading: "Databases",
    options: [
      { value: "postgresql", label: "PostgreSQL" },
      { value: "mongodb", label: "MongoDB" },
      { value: "redis", label: "Redis" },
      { value: "mysql", label: "MySQL" },
    ],
  },
];

export default function GroupedOptionsExample() {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Tech Stack Selection</label>
        <MultiSelect
          options={groupedOptions}
          placeholder="Choose your tech stack..."
          className="w-full"
        />
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
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
												className={getDivClasses(
													"mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50"
												)}>
												<p className="text-sm font-medium text-blue-800 dark:text-blue-200">
													Selected Stack:{" "}
													{groupedSelection.join(", ") || "None selected"}
												</p>
											</div>
										</div>
									</div>
									<div
										className={getDivClasses(
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

					{/* 6. Search and UI Configuration*/}
					<Card
						id="search-ui-configuration"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/30 dark:via-sky-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Search and UI Configuration"
								description="Implementation examples for different search and UI configurations"
								fileName="search-ui-config.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";
import { Icons } from "@/components/icons";

// Full search experience with custom empty state
const frameworks = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
];

function FullSearchExample() {
  return (
    <MultiSelect
      options={frameworks}
      onValueChange={(value) => console.log(value)}
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
  );
}

// Simplified interface without search
function SimplifiedExample() {
  return (
    <MultiSelect
      options={frameworks.slice(0, 6)}
      onValueChange={(value) => console.log(value)}
      defaultValue={["typescript"]}
      searchable={false}
      hideSelectAll={true}
      placeholder="Select without search"
      animationConfig={{
        badgeAnimation: "fade",
        popoverAnimation: "scale",
      }}
    />
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
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
													className={getDivClasses(
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
									<div
										className={getDivClasses(
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

					{/* 7. Layout and Sizing Options*/}
					<Card
						id="layout-sizing-options"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border-orange-200 dark:border-orange-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Layout and Sizing Options"
								description="Examples of different layout and sizing configurations"
								fileName="layout-sizing.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";

const options = [
  { label: "Small Option", value: "small" },
  { label: "Medium Option", value: "medium" },
  { label: "Large Option with Long Text", value: "large" },
];

// Different sizing options
function SizingExamples() {
  return (
    <div className="space-y-6">
      {/* Small size */}
      <div>
        <label className="text-sm font-medium mb-2 block">Small Size</label>
        <MultiSelect
          options={options}
          onValueChange={(value) => console.log(value)}
          placeholder="Small multi-select"
          className="w-64 text-sm"
          badgeClassName="text-xs"
        />
      </div>

      {/* Medium size (default) */}
      <div>
        <label className="text-sm font-medium mb-2 block">Medium Size</label>
        <MultiSelect
          options={options}
          onValueChange={(value) => console.log(value)}
          placeholder="Medium multi-select"
          className="w-80"
        />
      </div>

      {/* Large size */}
      <div>
        <label className="text-sm font-medium mb-2 block">Large Size</label>
        <MultiSelect
          options={options}
          onValueChange={(value) => console.log(value)}
          placeholder="Large multi-select"
          className="w-96 text-lg"
          badgeClassName="text-sm px-3 py-1"
        />
      </div>

      {/* Full width */}
      <div>
        <label className="text-sm font-medium mb-2 block">Full Width</label>
        <MultiSelect
          options={options}
          onValueChange={(value) => console.log(value)}
          placeholder="Full width multi-select"
          className="w-full"
        />
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.monitor className="h-5 w-5 text-orange-500" />
											Layout Demonstrations
										</h4>
										<div className="space-y-6">
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
									<div
										className={getDivClasses(
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

					{/* 8. Custom Styling and Colors*/}
					<Card
						id="custom-styling-colors"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 dark:from-purple-950/30 dark:via-fuchsia-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Custom Styling and Colors"
								description="Examples of custom badge colors and gradient styling"
								fileName="custom-styling.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";

const colorOptions = [
  { label: "Primary Color", value: "primary" },
  { label: "Secondary Color", value: "secondary" },
  { label: "Success Color", value: "success" },
  { label: "Warning Color", value: "warning" },
];

// Custom badge styling with different colors
function CustomStylingExamples() {
  return (
    <div className="space-y-6">
      {/* Purple theme */}
      <div>
        <label className="text-sm font-medium mb-2 block">Purple Theme</label>
        <MultiSelect
          options={colorOptions}
          onValueChange={(value) => console.log(value)}
          defaultValue={["primary"]}
          placeholder="Purple themed"
          badgeClassName="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300"
        />
      </div>

      {/* Green theme */}
      <div>
        <label className="text-sm font-medium mb-2 block">Green Theme</label>
        <MultiSelect
          options={colorOptions}
          onValueChange={(value) => console.log(value)}
          defaultValue={["success"]}
          placeholder="Green themed"
          badgeClassName="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
        />
      </div>

      {/* Gradient theme */}
      <div>
        <label className="text-sm font-medium mb-2 block">Gradient Theme</label>
        <MultiSelect
          options={colorOptions}
          onValueChange={(value) => console.log(value)}
          defaultValue={["warning"]}
          placeholder="Gradient themed"
          badgeClassName="bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600"
        />
      </div>

      {/* Custom border and shadow */}
      <div>
        <label className="text-sm font-medium mb-2 block">Custom Border</label>
        <MultiSelect
          options={colorOptions}
          onValueChange={(value) => console.log(value)}
          placeholder="Custom styled"
          className="border-2 border-blue-300 shadow-lg rounded-xl"
          badgeClassName="bg-blue-50 text-blue-700 border border-blue-200"
        />
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
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
													className={getDivClasses(
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
													className={getDivClasses(
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
									<div
										className={getDivClasses(
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

					{/* 9. Disabled States*/}
					<Card
						id="disabled-states"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/30 dark:via-gray-950/30 dark:to-zinc-950/30 border-slate-200 dark:border-slate-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Disabled States"
								description="Examples of component-level and option-level disabled states"
								fileName="disabled-states.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";

const options = [
  { label: "Available Option", value: "available" },
  { label: "Disabled Option", value: "disabled", disabled: true },
  { label: "Another Available", value: "available2" },
  { label: "Also Disabled", value: "disabled2", disabled: true },
];

// Disabled states examples
function DisabledStatesExamples() {
  return (
    <div className="space-y-6">
      {/* Fully disabled component */}
      <div>
        <label className="text-sm font-medium mb-2 block text-muted-foreground">
          Fully Disabled Component
        </label>
        <MultiSelect
          options={options}
          onValueChange={(value) => console.log(value)}
          defaultValue={["available"]}
          disabled={true}
          placeholder="This component is disabled"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Entire component is non-interactive
        </p>
      </div>

      {/* Mixed disabled options */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Mixed Disabled Options
        </label>
        <MultiSelect
          options={options}
          onValueChange={(value) => console.log(value)}
          defaultValue={["available"]}
          placeholder="Some options are disabled"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Only specific options are disabled
        </p>
      </div>

      {/* Loading state (simulated disabled) */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Loading State
        </label>
        <MultiSelect
          options={[]}
          onValueChange={(value) => console.log(value)}
          disabled={true}
          placeholder="Loading options..."
          emptyIndicator={
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading...</p>
            </div>
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Disabled while loading data
        </p>
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.shield className="h-5 w-5 text-slate-500" />
											Disabled State Demonstrations
										</h4>
										<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
											<div
												className={getDivClasses(
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
												className={getDivClasses(
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
									<div
										className={getDivClasses(
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

					{/* 10. Advanced Features*/}
					<Card
						id="advanced-features"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-cyan-950/30 border-indigo-200 dark:border-indigo-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Advanced Features Example"
								description="Complex interaction patterns and power user features"
								fileName="advanced-features-example.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";
import { useState } from "react";

const options = [
  { value: "react", label: "React", icon: Icons.zap },
  { value: "vue", label: "Vue.js", icon: Icons.globe },
  { value: "angular", label: "Angular", icon: Icons.target },
];

export default function AdvancedFeaturesExample() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      {/* Programmatic Control */}
      <div>
        <label className="text-sm font-medium mb-2 block">Programmatic Control</label>
        <div className="space-y-2">
          <MultiSelect
            options={options}
            value={selectedValues}
            onValueChange={setSelectedValues}
            placeholder="Controlled from outside..."
          />
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedValues(["react", "vue"])}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Select React & Vue
            </button>
            <button 
              onClick={() => setSelectedValues([])}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Custom Search Logic */}
      <div>
        <label className="text-sm font-medium mb-2 block">Custom Search</label>
        <MultiSelect
          options={options}
          placeholder="Smart search..."
          searchFunction={(query, option) => {
            // Custom search logic
            return option.label.toLowerCase().includes(query.toLowerCase()) ||
                   option.value.toLowerCase().includes(query.toLowerCase());
          }}
        />
      </div>

      {/* Async Loading */}
      <div>
        <label className="text-sm font-medium mb-2 block">Async Loading</label>
        <MultiSelect
          options={options}
          placeholder="Loading options..."
          isLoading={false} // Set to true when loading
          emptyMessage="No results found..."
        />
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
										)}>
										<h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.zap className="h-5 w-5 text-indigo-500" />
											Advanced Behavior Showcase
										</h4>
										<div className="grid gap-6 grid-cols-1">
											<div
												className={getDivClasses(
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
													defaultValue={["react", "vue"]}
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
												className={getDivClasses(
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
													defaultValue={["typescript", "javascript"]}
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
												className={getDivClasses(
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
													defaultValue={["js1", "py1"]}
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
									<div
										className={getDivClasses(
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

					{/* 11. Imperative Methods (useRef)*/}
					<Card
						id="imperative-methods"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Imperative Methods (useRef)"
								description="Examples of programmatic control using ref methods"
								fileName="imperative-methods.tsx"
								code={`import { useRef } from "react";
import { MultiSelect, MultiSelectRef } from "@/components/multi-select";
import { Button } from "@/components/ui/button";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
];

// Imperative methods example
function ImperativeMethodsExample() {
  const multiSelectRef = useRef<MultiSelectRef>(null);

  const selectAll = () => {
    if (multiSelectRef.current) {
      multiSelectRef.current.selectAll();
    }
  };

  const clearAll = () => {
    if (multiSelectRef.current) {
      multiSelectRef.current.clearAll();
    }
  };

  const focusInput = () => {
    if (multiSelectRef.current) {
      multiSelectRef.current.focus();
    }
  };

  const selectSpecific = () => {
    if (multiSelectRef.current) {
      multiSelectRef.current.setValue(["react", "vue"]);
    }
  };

  return (
    <div className="space-y-4">
      <MultiSelect
        ref={multiSelectRef}
        options={options}
        onValueChange={(value) => console.log("Value changed:", value)}
        placeholder="Controlled via ref methods"
      />
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={selectAll} size="sm">
          Select All
        </Button>
        <Button onClick={clearAll} size="sm" variant="outline">
          Clear All
        </Button>
        <Button onClick={focusInput} size="sm" variant="outline">
          Focus Input
        </Button>
        <Button onClick={selectSpecific} size="sm" variant="secondary">
          Select React & Vue
        </Button>
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-6 text-muted-foreground leading-relaxed">
									<div
										className={getDivClasses(
											"my-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
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
												className={getDivClasses(
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
												className={getDivClasses(
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
									<div
										className={getDivClasses(
											"mt-8 p-6 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50"
										)}>
										<div className="flex items-start gap-4">
											<Icons.star className="h-6 w-6 text-emerald-500 flex-shrink-0" />
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

					{/* Charts Examples*/}
					<Card
						id="data-visualization"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 rounded-xl border border-orange-200/50 dark:border-orange-800/50 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Charts & Data Visualization"
								description="Complete implementation of interactive charts with MultiSelect filters"
								fileName="visualization-charts.tsx"
								code={`"use client";
					
import { useState, useMemo } from "react";
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
	AreaChart,
	Area,
} from "recharts";
import { Card } from "@/components/ui/card";
import { MultiSelect } from "@/components/multi-select";

const salesData = [
	{
	name: "Jan",
	engineering: 4000,
	design: 2400,
	product: 2400,
	marketing: 3200,
	},
	{
	name: "Feb", 
	engineering: 3000,
	design: 1398,
	product: 2210,
	marketing: 2800,
	},
	// ... more data
];

const departmentOptions = [
	{ label: "Engineering", value: "engineering" },
	{ label: "Design", value: "design" },
	{ label: "Product", value: "product" },
	{ label: "Marketing", value: "marketing" },
];

function InteractiveChart() {
	const [selectedDepartments, setSelectedDepartments] = useState([
	"engineering",
	"design",
	"product",
	]);

	const filteredData = useMemo(() => {
	return salesData.map((item) => {
		const filtered = { name: item.name };
		selectedDepartments.forEach((dept) => {
		if (item[dept]) {
			filtered[dept] = item[dept];
		}
		});
		return filtered;
	});
	}, [selectedDepartments]);

	return (
	<Card className="p-6">
		<div className="mb-6">
		<h3 className="text-lg font-semibold mb-3">Department Filter</h3>
		<MultiSelect
			options={departmentOptions}
			onValueChange={setSelectedDepartments}
			defaultValue={selectedDepartments}
			placeholder="Select departments to display"
			badgeClassName="bg-orange-100 text-orange-700"
		/>
		</div>

		<div className="h-80">
		<ResponsiveContainer width="100%" height="100%">
			<BarChart data={filteredData}>
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Legend />
			{selectedDepartments.map((dept, index) => (
				<Bar
				key={dept}
				dataKey={dept}
				fill={\`hsl(\${index * 60}, 70%, 50%)\`}
				/>
			))}
			</BarChart>
		</ResponsiveContainer>
		</div>
	</Card>
	);
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium mb-4">
									<Icons.pieChart className="h-4 w-4" />
									Charts Examples
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-300 dark:to-yellow-300 bg-clip-text text-transparent mb-4"
									)}>
									Charts & Data Visualization
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Create interactive, data-driven dashboards where MultiSelect
									components control chart filters, time periods, and
									visualization parameters. Perfect for business intelligence
									and analytics platforms.
								</p>
							</div>
							<VisualizationCharts />
							<div className="p-0 pt-8">
								<div
									className={getDivClasses(
										"bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800"
									)}>
									<h4 className="text-lg font-semibold mb-4 text-orange-900 dark:text-orange-100 flex items-center gap-2">
										<Icons.star className="h-6 w-6 text-orange-500 flex-shrink-0" />
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
											<h5 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
												Best Practices
											</h5>
											<ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
												<li>• Consistent color schemes across charts</li>
												<li>• Responsive chart containers</li>
												<li>• Accessible tooltips and legends</li>
												<li>• Empty state handling</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* AI/LLM Examples*/}
					<Card
						id="ai-configuration"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 rounded-xl border border-violet-200/50 dark:border-violet-800/50 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="AI & LLM Integration"
								description="Examples of AI assistant and LLM model configuration"
								fileName="ai-configuration.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";

// AI/LLM model options
const aiModels = [
  { label: "GPT-4o", value: "gpt-4o" },
  { label: "GPT-4o Mini", value: "gpt-4o-mini" },
  { label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet" },
  { label: "Claude 3 Haiku", value: "claude-3-haiku" },
  { label: "Gemini Pro", value: "gemini-pro" },
  { label: "Llama 3.1 70B", value: "llama-3.1-70b" },
];

const capabilities = [
  { label: "Text Generation", value: "text-generation" },
  { label: "Code Analysis", value: "code-analysis" },
  { label: "Data Processing", value: "data-processing" },
  { label: "Image Understanding", value: "image-understanding" },
  { label: "Function Calling", value: "function-calling" },
];

// AI Configuration Example
function AIConfigurationExample() {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Select AI Models
        </label>
        <MultiSelect
          options={aiModels}
          onValueChange={(models) => console.log("Selected models:", models)}
          placeholder="Choose AI models for your project"
          searchable={true}
          badgeClassName="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Required Capabilities
        </label>
        <MultiSelect
          options={capabilities}
          onValueChange={(caps) => console.log("Selected capabilities:", caps)}
          placeholder="Select required AI capabilities"
          searchable={true}
          maxCount={3}
          badgeClassName="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Fallback Models
        </label>
        <MultiSelect
          options={aiModels.filter(m => m.value.includes('mini') || m.value.includes('haiku'))}
          onValueChange={(fallbacks) => console.log("Fallback models:", fallbacks)}
          placeholder="Select fallback models"
          badgeClassName="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
        />
      </div>
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
									<Icons.zap className="h-4 w-4" />
									AI & LLM Examples
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent mb-4"
									)}>
									AI & LLM Integration
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Create interactive, data-driven dashboards where MultiSelect
									components control chart filters, time periods, and
									visualization parameters. Perfect for business intelligence
									and analytics platforms.
								</p>
							</div>
							<div className="p-0 space-y-8">
								<div className="grid gap-6">
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
								<div className="p-0 pt-0">
									<div
										className={getDivClasses(
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
							</div>
						</div>
					</Card>

					{/* Interactive Documentation Example */}
					<Card
						id="interactive-documentation"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 border-slate-200 dark:border-slate-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Interactive Documentation"
								description="Example of embedding MultiSelect in interactive documentation"
								fileName="interactive-docs.tsx"
								code={`import { useState } from "react";
import { MultiSelect } from "@/components/multi-select";

const techCategories = [
  { label: "Frontend Frameworks", value: "frontend" },
  { label: "Backend Technologies", value: "backend" },
  { label: "Databases", value: "databases" },
  { label: "DevOps Tools", value: "devops" },
  { label: "Testing Frameworks", value: "testing" },
];

const techOptions = {
  frontend: [
    { label: "React", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ],
  backend: [
    { label: "Node.js", value: "nodejs" },
    { label: "Python", value: "python" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
  ],
  // ... more categories
};

// Interactive tech stack builder
function TechStackBuilder() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<Record<string, string[]>>({});

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Step 1: Choose Technology Categories
        </h3>
        <MultiSelect
          options={techCategories}
          onValueChange={setSelectedCategories}
          placeholder="Select technology categories"
          badgeClassName="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        />
      </div>

      {selectedCategories.map((category) => (
        <div key={category}>
          <h4 className="text-md font-medium mb-2 capitalize">
            {category} Technologies
          </h4>
          <MultiSelect
            options={techOptions[category] || []}
            onValueChange={(values) => 
              setSelectedTech(prev => ({ ...prev, [category]: values }))
            }
            placeholder={\`Select \${category} technologies\`}
            badgeClassName="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          />
        </div>
      ))}

      {Object.keys(selectedTech).length > 0 && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Your Tech Stack:</h4>
          <pre className="text-sm">
            {JSON.stringify(selectedTech, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
									<Icons.code className="h-4 w-4" />
									Example Usage in Content
								</div>
								<h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent mb-4">
									Building Your Tech Stack
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									A comprehensive guide to selecting the right technologies for
									your next project
								</p>
							</div>
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
										, the technologies you select will impact your development
										speed, scalability, and long-term maintenance.
									</p>
									<div className="my-8 p-6 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
										<div className="mb-4">
											<h4 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
												<Icons.zap className="h-5 w-5 text-blue-500" />
												Select Your Preferred Technologies
											</h4>
											<p className="text-sm text-muted-foreground mb-4">
												Try our interactive multi-select component to choose
												technologies for your project:
											</p>
										</div>
										<MultiSelect
											options={techStackOptions}
											onValueChange={(values) => {
												// Optional: handle selection changes
											}}
											defaultValue={["typescript", "javascript"]}
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
									<div
										className={getDivClasses(
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
										project requirements, team expertise, and long-term goals.
										Consider factors such as
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
									<div className="my-8">
										<h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
											<Icons.star className="h-5 w-5 text-yellow-500" />
											Team Skills Assessment
										</h3>
										<p className="text-base md:text-lg mb-4">
											Before finalizing your tech stack, assess your team&apos;s
											current skills and expertise. This will help determine
											whether you need additional training or if you should
											consider alternative technologies.
										</p>
										<div
											className={getDivClasses(
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
									<p className="text-base md:text-lg">
										Remember, the best technology stack is the one that your
										team can effectively use to deliver value to your users.
										Don&apos;t choose technologies just because they&apos;re
										trendy – choose them because they solve real problems and
										fit your specific use case.
									</p>
								</div>
							</div>
						</div>
					</Card>

					{/* Interactive Form/Survey Example */}
					<Card
						id="interactive-form-survey"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 border-emerald-200 dark:border-emerald-800 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Interactive Form/Survey"
								description="Example of building interactive surveys and forms with MultiSelect"
								fileName="survey-form.tsx"
								code={`import { useState } from "react";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const experienceLevels = [
  { label: "Beginner (0-1 years)", value: "beginner" },
  { label: "Intermediate (2-5 years)", value: "intermediate" },
  { label: "Senior (6-10 years)", value: "senior" },
  { label: "Expert (10+ years)", value: "expert" },
];

const technologies = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React", value: "react" },
  { label: "Vue.js", value: "vue" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
];

const interests = [
  { label: "Frontend Development", value: "frontend" },
  { label: "Backend Development", value: "backend" },
  { label: "Mobile Development", value: "mobile" },
  { label: "DevOps", value: "devops" },
  { label: "AI/ML", value: "ai-ml" },
  { label: "Blockchain", value: "blockchain" },
];

// Developer Survey Form
function DeveloperSurvey() {
  const [formData, setFormData] = useState({
    experience: [],
    technologies: [],
    interests: [],
  });

  const handleSubmit = () => {
    console.log("Survey submitted:", formData);
    // Handle form submission
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Experience Level</h3>
        <MultiSelect
          options={experienceLevels}
          onValueChange={(value) => 
            setFormData(prev => ({ ...prev, experience: value }))
          }
          placeholder="Select your experience level"
          maxCount={1}
          badgeClassName="bg-blue-100 text-blue-700"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Technologies You Use</h3>
        <MultiSelect
          options={technologies}
          onValueChange={(value) => 
            setFormData(prev => ({ ...prev, technologies: value }))
          }
          placeholder="Select technologies you work with"
          searchable={true}
          badgeClassName="bg-green-100 text-green-700"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Areas of Interest</h3>
        <MultiSelect
          options={interests}
          onValueChange={(value) => 
            setFormData(prev => ({ ...prev, interests: value }))
          }
          placeholder="Select your areas of interest"
          maxCount={3}
          badgeClassName="bg-purple-100 text-purple-700"
        />
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Submit Survey
      </Button>

      {/* Preview submitted data */}
      {Object.values(formData).some(arr => arr.length > 0) && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Survey Data:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
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
									Developer Survey
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Help us understand the current state of web development
								</p>
							</div>
							<div className="prose prose-lg dark:prose-invert max-w-none">
								<div className="space-y-8 text-muted-foreground leading-relaxed">
									<div className="markdown-section">
										<h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
											<span className="flex items-center justify-center w-8 h-8 bg-emerald-500 text-white rounded-full text-sm font-bold">
												1
											</span>
											What programming languages do you use regularly?
										</h3>
										<p className="text-base md:text-lg mb-6">
											Select all programming languages that you work with on a
											regular basis. This helps us understand the current
											landscape of developer preferences and industry trends.
										</p>
										<div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
											<h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
												<Icons.check className="h-5 w-5 text-emerald-500" />
												Programming Languages
											</h4>
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
									<div className="markdown-section">
										<h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
											<span className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full text-sm font-bold">
												2
											</span>
											Which frameworks and libraries are you most interested in
											learning?
										</h3>
										<p className="text-base md:text-lg mb-6">
											The tech industry evolves rapidly. Tell us which
											technologies you&apos;re planning to learn next year. This
											could include frameworks you&apos;ve heard about but
											haven&apos;t had the chance to try yet.
										</p>
										<div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
											<h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
												<Icons.check className="h-5 w-5 text-teal-500" />
												Frameworks & Libraries
											</h4>
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
									<div className="markdown-section">
										<h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
											<span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full text-sm font-bold">
												3
											</span>
											What type of projects do you primarily work on?
										</h3>
										<p className="text-base md:text-lg mb-6">
											Understanding the types of projects developers work on
											helps us identify common patterns and challenges. Whether
											you&apos;re building{" "}
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
										<div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
											<h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
												<Icons.check className="h-5 w-5 text-cyan-500" />
												Project Types
											</h4>
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
											Understanding how developers learn helps the community
											create better educational resources.
										</p>
										<div
											className={getDivClasses(
												"bg-purple-50/50 dark:bg-purple-950/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50 mb-6"
											)}>
											<h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
												<Icons.check className="h-5 w-5 text-purple-500" />
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
									</div>
									<div
										className={getDivClasses(
											"mt-12 p-6 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50"
										)}>
										<h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
											<Icons.check className="h-6 w-6 text-emerald-500" />
											Thank You for Participating!
										</h3>
										<p className="text-base text-muted-foreground mb-4">
											Your responses help us understand the developer community
											better. This survey demonstrates how MultiSelect
											components can be seamlessly integrated into forms and
											surveys.
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

					{/* Props Reference */}
					<Card
						id="props-reference"
						className={getCardClasses(
							"relative p-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-red-950/30 rounded-xl border border-rose-200/50 dark:border-rose-800/50 overflow-hidden"
						)}>
						<div className="absolute top-4 right-4 z-10">
							<CodeSheet
								title="Props Reference Example"
								description="Complete usage example with all available props"
								fileName="props-reference-example.tsx"
								code={`import { MultiSelect } from "@/components/multi-select";
import { useState } from "react";

const options = [
  { value: "react", label: "React", icon: Icons.zap },
  { value: "vue", label: "Vue.js", icon: Icons.globe },
  { value: "angular", label: "Angular", icon: Icons.target },
];

export default function PropsReferenceExample() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <MultiSelect
      // Core Props
      options={options}
      value={selectedValues}
      onValueChange={setSelectedValues}
      
      // UI Props
      placeholder="Select frameworks..."
      variant="default"
      size="default"
      
      // Behavior Props
      maxCount={3}
      disabled={false}
      clearable={true}
      searchable={true}
      
      // Animation Props
      animationConfig={{
        badgeAnimation: "bounce",
        popoverAnimation: "scale",
        optionHoverAnimation: "glow",
      }}
      
      // Styling Props
      className="w-full"
      
      // Event Props
      onSearch={(query) => console.log("Searching:", query)}
      onOpenChange={(open) => console.log("Popover:", open)}
      
      // Advanced Props
      emptyMessage="No options found"
      selectAllText="Select All"
      clearAllText="Clear All"
    />
  );
}`}
							/>
						</div>
						<div className="p-8 md:p-12">
							<div className="mb-8 text-center">
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium mb-4">
									<Icons.code className="h-4 w-4" />
									Props Guide
								</div>
								<h2
									className={getHeaderTextClasses(
										"text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-700 via-pink-600 to-red-600 dark:from-rose-400 dark:via-pink-300 dark:to-red-300 bg-clip-text text-transparent mb-4"
									)}>
									Props Reference Guide
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									Complete documentation of all MultiSelect component
									properties, with examples, defaults, and best practices for
									every configuration option.
								</p>
							</div>

							<div className="p-0 space-y-8">
								<div className="grid gap-6">
									<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-rose-200 dark:border-rose-800">
										<h3 className="text-xl font-semibold mb-4 text-rose-800 dark:text-rose-200 flex items-center gap-2">
											<Icons.star className="h-5 w-5" />
											Core Properties
										</h3>
										<div className="space-y-3 text-sm">
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">options</code>
												<p className="text-muted-foreground mt-1">
													Array of options or grouped options
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">onValueChange</code>
												<p className="text-muted-foreground mt-1">
													Callback function for value changes
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">defaultValue</code>
												<p className="text-muted-foreground mt-1">
													Initial selected values (default: [])
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">placeholder</code>
												<p className="text-muted-foreground mt-1">
													Placeholder text (default: &ldquo;Select
													options&rdquo;)
												</p>
											</div>
										</div>
									</Card>
									<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-pink-200 dark:border-pink-800">
										<h3 className="text-xl font-semibold mb-4 text-pink-800 dark:text-pink-200 flex items-center gap-2">
											<Icons.heart className="h-5 w-5" />
											Appearance & Styling
										</h3>
										<div className="grid gap-3 md:grid-cols-2 text-sm">
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">variant</code>
												<p className="text-muted-foreground mt-1">
													&ldquo;default&rdquo; | &ldquo;secondary&rdquo; |
													&ldquo;destructive&rdquo; | &ldquo;inverted&rdquo;
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">maxCount</code>
												<p className="text-muted-foreground mt-1">
													Max badges to show (default: 3)
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">autoSize</code>
												<p className="text-muted-foreground mt-1">
													Auto width behavior (default: false)
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">singleLine</code>
												<p className="text-muted-foreground mt-1">
													Single line layout (default: false)
												</p>
											</div>
										</div>
									</Card>
									<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-red-200 dark:border-red-800">
										<h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-200 flex items-center gap-2">
											<Icons.target className="h-5 w-5" />
											Behavior & Interaction
										</h3>
										<div className="grid gap-3 md:grid-cols-2 text-sm">
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">searchable</code>
												<p className="text-muted-foreground mt-1">
													Enable search functionality (default: true)
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">hideSelectAll</code>
												<p className="text-muted-foreground mt-1">
													Hide select all button (default: false)
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">closeOnSelect</code>
												<p className="text-muted-foreground mt-1">
													Close after selection (default: false)
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">disabled</code>
												<p className="text-muted-foreground mt-1">
													Disable component (default: false)
												</p>
											</div>
										</div>
									</Card>
									<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-rose-200 dark:border-rose-800">
										<h3 className="text-xl font-semibold mb-4 text-rose-800 dark:text-rose-200 flex items-center gap-2">
											<Icons.zap className="h-5 w-5" />
											Advanced Configuration
										</h3>
										<div className="grid gap-3 md:grid-cols-2 text-sm">
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">responsive</code>
												<p className="text-muted-foreground mt-1">
													Responsive behavior configuration
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">animationConfig</code>
												<p className="text-muted-foreground mt-1">
													Custom animation settings
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">modalPopover</code>
												<p className="text-muted-foreground mt-1">
													Modal behavior (default: false)
												</p>
											</div>
											<div
												className={getDivClasses(
													"p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-300"
												)}>
												<code className="font-semibold">
													deduplicateOptions
												</code>
												<p className="text-muted-foreground mt-1">
													Remove duplicates (default: false)
												</p>
											</div>
										</div>
									</Card>
								</div>
							</div>
							<div className="p-0 pt-6">
								<div
									className={getDivClasses(
										"bg-gradient-to-r from-rose-100 via-pink-100 to-red-100 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-red-900/20 rounded-lg p-6 border border-rose-200 dark:border-rose-800"
									)}>
									<h4 className="text-lg font-semibold mb-4 text-rose-900 dark:text-rose-100 flex items-center gap-2">
										<Icons.code className="h-5 w-5" />
										Implementation Best Practices
									</h4>
									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
												Essential Tips
											</h5>
											<ul className="text-sm space-y-1 text-muted-foreground">
												<li>• Always provide onValueChange callback</li>
												<li>• Use meaningful option labels</li>
												<li>• Set appropriate maxCount for UI</li>
												<li>• Test with different data sizes</li>
											</ul>
										</div>
										<div>
											<h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
												Performance
											</h5>
											<ul className="text-sm space-y-1 text-muted-foreground">
												<li>• Enable deduplicateOptions for large datasets</li>
												<li>• Use responsive props for mobile</li>
												<li>• Optimize search with custom filtering</li>
												<li>• Memoize option arrays when possible</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div className="p-0 pt-6">
								<div
									className={getDivClasses(
										"bg-gradient-to-br from-red-400/10 via-pink-400/10 to-rose-400/10 border-l-4 border-rose-400 rounded-r-lg p-4"
									)}>
									<p className="text-rose-800 dark:text-rose-200 font-medium flex items-start gap-2">
										<Icons.star className="h-5 w-5 mt-0.5 flex-shrink-0" />
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
					</Card>
				</section>

				{/* AI Chat Widget */}
				<AIChat />
			</div>
		</main>
	);
}
