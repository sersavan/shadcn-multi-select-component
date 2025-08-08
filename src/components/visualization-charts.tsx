"use client";

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
	Area,
	AreaChart,
	RadarChart,
	Radar,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Treemap,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useColorMode } from "@/contexts/color-mode-context";
import { MultiSelect } from "@/components/multi-select";

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

interface VisualizationChartsProps {
	className?: string;
}

export function VisualizationCharts({ className }: VisualizationChartsProps) {
	const { isGrayMode } = useColorMode();

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
		if (
			!selectedMetrics.includes("revenue") ||
			selectedDepartments.length === 0
		)
			return [];
		const q4Data = revenueData[3];

		return selectedDepartments.map((dept) => ({
			name: companyDepartments.find((d) => d.value === dept)?.label || dept,
			size: q4Data[dept as keyof typeof q4Data] || 0,
			fill: chartColors[dept as keyof typeof chartColors] || "#8884d8",
		}));
	}, [selectedMetrics, selectedDepartments]);

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
		<Card
			className={getCardClasses(
				"p-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 rounded-xl border border-orange-200/50 dark:border-orange-800/50 overflow-hidden"
			)}>
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
						components control chart filters, time periods, and visualization
						parameters. Perfect for business intelligence and analytics
						platforms.
					</p>
				</div>
				<div className="p-0 space-y-8">
					<Card className="p-6 bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-orange-800">
						<div className="grid gap-4 grid-cols-1 mb-8">
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
													innerRadius={30}
													outerRadius={60}
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
					</Card>
					<div className="p-0 pt-0">
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
				</div>
			</div>
		</Card>
	);
}
