"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface CopyCodeButtonProps {
	code: string;
	className?: string;
	variant?: "default" | "ghost" | "outline";
	size?: "sm" | "default" | "lg";
	label?: string;
}

export function CopyCodeButton({
	code,
	className,
	variant = "ghost",
	size = "sm",
	label = "Copy code",
}: CopyCodeButtonProps) {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setIsCopied(true);
			toast.success("Code copied to clipboard!", {
				description: "You can now paste it in your project",
				duration: 2000,
			});
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			toast.error("Failed to copy code", {
				description: "Please try selecting and copying manually",
				duration: 3000,
			});
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			onClick={copyToClipboard}
			className={cn(
				"transition-all duration-200 hover:scale-105",
				isCopied &&
					"bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
				className
			)}>
			{isCopied ? (
				<Icons.check className="w-4 h-4 mr-1" />
			) : (
				<Icons.copy className="w-4 h-4 mr-1" />
			)}
			<span className="text-xs">{isCopied ? "Copied!" : label}</span>
		</Button>
	);
}

interface CodeBlockProps {
	code: string;
	language?: string;
	title?: string;
	className?: string;
	showCopyButton?: boolean;
}

export function CodeBlock({
	code,
	language = "tsx",
	title,
	className,
	showCopyButton = true,
}: CodeBlockProps) {
	return (
		<div className={cn("relative group", className)}>
			{title && (
				<div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border border-b-0">
					<span className="text-sm font-medium text-muted-foreground">
						{title}
					</span>
					{showCopyButton && (
						<CopyCodeButton
							code={code}
							variant="ghost"
							size="sm"
							className="opacity-70 group-hover:opacity-100"
						/>
					)}
				</div>
			)}
			<div className="relative">
				<pre
					className={cn(
						"bg-muted/30 p-4 rounded-lg overflow-x-auto text-sm",
						title && "rounded-t-none",
						"border font-mono"
					)}>
					<code className={`language-${language}`}>{code}</code>
				</pre>
				{!title && showCopyButton && (
					<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<CopyCodeButton
							code={code}
							variant="outline"
							size="sm"
							className="bg-background/80 backdrop-blur-sm"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
