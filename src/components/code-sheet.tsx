"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	oneDark,
	oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

interface CodeSheetProps {
	title: string;
	description?: string;
	code: string;
	language?: string;
	triggerText?: string;
	triggerVariant?: "default" | "outline" | "secondary" | "ghost";
	fileName?: string;
	children?: React.ReactNode;
}

export function CodeSheet({
	title,
	description,
	code,
	language = "tsx",
	triggerText = "Code",
	triggerVariant = "ghost",
	fileName,
	children,
}: CodeSheetProps) {
	const [isCopied, setIsCopied] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { theme } = useTheme();

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setIsCopied(true);
			toast.success("Code copied to clipboard!", {
				description: "Ready to paste in your project",
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
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				{children || (
					<Button
						variant={triggerVariant}
						size="sm"
						className="transition-all duration-200 hover:scale-105 hover:bg-transparent">
						<Icons.code className="w-4 h-4 mr-2" />
						<p className="text-xs">{triggerText}</p>
					</Button>
				)}
			</SheetTrigger>
			<SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
				<SheetHeader className="space-y-3">
					<div className="flex items-center justify-between">
						<SheetTitle className="text-xl font-semibold flex items-center gap-2">
							<Icons.code className="w-5 h-5 text-primary" />
							{title}
						</SheetTitle>
						<div className="flex items-center gap-2">
							<Badge variant="secondary" className="text-xs">
								{language.toUpperCase()}
							</Badge>
							{fileName && (
								<Badge variant="outline" className="text-xs">
									{fileName}
								</Badge>
							)}
						</div>
					</div>
					{description && (
						<SheetDescription className="text-muted-foreground">
							{description}
						</SheetDescription>
					)}
				</SheetHeader>

				<div className="mt-6">
					{/* Header with copy button */}
					<div className="flex items-center justify-between bg-muted/50 px-4 py-3 rounded-t-lg border">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Icons.harddrive className="w-4 h-4" />
							<span>Code Example</span>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={copyToClipboard}
							className={cn(
								"transition-all duration-200",
								isCopied &&
									"bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
							)}>
							{isCopied ? (
								<Icons.check className="w-4 h-4 mr-2" />
							) : (
								<Icons.copy className="w-4 h-4 mr-2" />
							)}
							<span className="text-xs">
								{isCopied ? "Copied!" : "Copy Code"}
							</span>
						</Button>
					</div>

					{/* Code block */}
					<div className="relative">
						<div className="bg-muted/30 rounded-b-lg border border-t-0 overflow-auto [&_pre]:!text-sm [&_code]:!text-sm pt-2">
							<SyntaxHighlighter
								language={language}
								style={theme === "dark" ? oneDark : oneLight}
								customStyle={{
									margin: 0,
									padding: "1rem",
									background: "transparent",
									fontSize: "0.75rem !important",
									lineHeight: "1.5",
									fontFamily:
										'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
									whiteSpace: "pre",
									wordBreak: "normal",
									overflowWrap: "normal",
								}}
								codeTagProps={{
									style: {
										fontFamily: "inherit",
										whiteSpace: "pre",
										fontSize: "0.75rem !important",
									},
								}}
								showLineNumbers={true}
								lineNumberStyle={{
									minWidth: "3rem",
									paddingRight: "1rem",
									color:
										theme === "dark" ? "rgb(156 163 175)" : "rgb(107 114 128)",
									borderRight: `1px solid ${
										theme === "dark" ? "rgb(55 65 81)" : "rgb(229 231 235)"
									}`,
									marginRight: "1rem",
									textAlign: "right",
									userSelect: "none",
								}}
								wrapLines={false}
								wrapLongLines={false}
								PreTag={({ children, ...props }) => (
									<pre
										{...props}
										style={{ margin: 0, background: "transparent" }}>
										{children}
									</pre>
								)}>
								{code}
							</SyntaxHighlighter>
						</div>
					</div>

					{/* Additional info */}
					<div className="mt-4 p-4 bg-muted/20 rounded-lg border">
						<div className="flex items-start gap-3">
							<Icons.activity className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
							<div>
								<h4 className="font-medium text-sm mb-1">Integration Tips</h4>
								<ul className="text-xs text-muted-foreground space-y-1">
									<li>• Copy the code and paste it into your component</li>
									<li>• Make sure to import the MultiSelect component</li>
									<li>• Adjust the options array for your use case</li>
									<li>• Add proper TypeScript types if needed</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
