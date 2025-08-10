"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
	className?: string;
	showPercentage?: boolean;
}

export function ReadingProgress({
	className,
	showPercentage = false,
}: ReadingProgressProps) {
	const [progress, setProgress] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const updateProgress = () => {
			const scrollTop = window.scrollY;
			const docHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const scrollPercent = (scrollTop / docHeight) * 100;

			setProgress(Math.min(100, Math.max(0, scrollPercent)));
			setIsVisible(scrollTop > 100);
		};

		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					updateProgress();
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		updateProgress();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (!isVisible) return null;

	return (
		<>
			{/* Progress bar */}
			<div
				className={cn(
					"fixed top-0 left-0 right-0 z-50 h-1 bg-background/20 transition-opacity duration-300",
					className
				)}>
				{/* Background track */}
				<div className="absolute inset-0 bg-border/20" />

				{/* Progress bar with gradient */}
				<div
					className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 transition-all duration-150 ease-out shadow-sm"
					style={{ width: `${progress}%` }}
				/>

				{/* Subtle glow effect */}
				<div
					className="absolute top-0 h-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-600/30 blur-[1px] transition-all duration-150 ease-out"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Optional percentage indicator */}
			{showPercentage && (
				<div className="fixed top-2 right-4 z-50 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border transition-opacity duration-300">
					{Math.round(progress)}%
				</div>
			)}
		</>
	);
}
