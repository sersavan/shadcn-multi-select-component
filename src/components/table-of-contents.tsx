"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Section {
	id: string;
	title: string;
	icon: React.ComponentType<{ className?: string }>;
}

const sections: Section[] = [
	{
		id: "form-integration",
		title: "Form Integration",
		icon: Icons.wand,
	},
	{
		id: "variants-section",
		title: "Component Variants",
		icon: Icons.star,
	},
	{
		id: "animations-section",
		title: "Animations & Effects",
		icon: Icons.activity,
	},
	{
		id: "responsive-behavior",
		title: "Responsive Behavior",
		icon: Icons.smartphone,
	},
	{
		id: "grouped-options",
		title: "Grouped Options",
		icon: Icons.users,
	},
	{
		id: "search-ui-configuration",
		title: "Search & UI Config",
		icon: Icons.search,
	},
	{
		id: "layout-sizing-options",
		title: "Layout & Sizing",
		icon: Icons.monitor,
	},
	{
		id: "custom-styling-colors",
		title: "Custom Styling",
		icon: Icons.wand,
	},
	{
		id: "disabled-states",
		title: "Disabled States",
		icon: Icons.shield,
	},
	{
		id: "advanced-features",
		title: "Advanced Features",
		icon: Icons.cpu,
	},
	{
		id: "imperative-methods",
		title: "Imperative Methods",
		icon: Icons.target,
	},
	{
		id: "data-visualization",
		title: "Charts Visualization",
		icon: Icons.pieChart,
	},
	{
		id: "ai-configuration",
		title: "AI Integration",
		icon: Icons.bot,
	},
	{
		id: "interactive-documentation",
		title: "Built in Content",
		icon: Icons.monitor,
	},
	{
		id: "interactive-form-survey",
		title: "Interactive Survey",
		icon: Icons.heart,
	},
	{
		id: "props-reference",
		title: "Props Reference",
		icon: Icons.code,
	},
];

export function TableOfContents() {
	const [activeSection, setActiveSection] = useState<string>("");
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			setIsVisible(scrollY > 400);
			const sectionElements = sections.map((section) => ({
				id: section.id,
				element: document.getElementById(section.id),
			}));
			for (let i = sectionElements.length - 1; i >= 0; i--) {
				const section = sectionElements[i];
				if (section.element) {
					const rect = section.element.getBoundingClientRect();
					if (rect.top <= 100) {
						setActiveSection(section.id);
						break;
					}
				}
			}
		};
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	if (!isVisible) return null;

	return (
		<div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden 2xl:block">
			<Card className="p-2 bg-background/90 backdrop-blur-sm border shadow-lg max-w-[280px] max-h-[70vh] overflow-y-auto table-of-contents-scroll">
				<div className="space-y-0.5">
					<div className="text-xs font-medium text-muted-foreground mb-2 px-2 sticky top-0 bg-background/90">
						Quick Navigation ({sections.length})
					</div>
					{sections.map((section) => {
						const isActive = activeSection === section.id;
						const IconComponent = section.icon;
						return (
							<Button
								key={section.id}
								variant="ghost"
								size="sm"
								onClick={() => scrollToSection(section.id)}
								className={cn(
									"w-full justify-start h-7 px-2 text-xs transition-all duration-200",
									isActive
										? "bg-primary/10 text-primary border-l-2 border-primary"
										: "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
								)}>
								<IconComponent className="w-3 h-3 mr-2 flex-shrink-0" />
								<span className="truncate text-xs">{section.title}</span>
							</Button>
						);
					})}
				</div>
			</Card>
		</div>
	);
}
