"use client";

import { cn } from "@/lib/utils";

interface SkipLinksProps {
	className?: string;
}

export function SkipLinks({ className }: SkipLinksProps) {
	return (
		<div className={cn("sr-only focus-within:not-sr-only", className)}>
			<a
				href="#main-content"
				className="absolute left-4 top-4 z-50 -translate-y-full transform bg-background px-4 py-2 text-foreground shadow-lg transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md border">
				Skip to main content
			</a>
			<a
				href="#navigation"
				className="absolute left-4 top-16 z-50 -translate-y-full transform bg-background px-4 py-2 text-foreground shadow-lg transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md border">
				Skip to navigation
			</a>
			<a
				href="#examples"
				className="absolute left-4 top-28 z-50 -translate-y-full transform bg-background px-4 py-2 text-foreground shadow-lg transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md border">
				Skip to examples
			</a>
		</div>
	);
}
