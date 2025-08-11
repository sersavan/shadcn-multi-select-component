"use client";

import React, { useState, useRef, useEffect } from "react";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import "../styles/markdown.css";

const extractTextFromNode = (node: any): string => {
	if (typeof node === "string") {
		return node;
	}
	if (typeof node === "number") {
		return node.toString();
	}
	if (Array.isArray(node)) {
		return node.map(extractTextFromNode).join("");
	}
	if (node && typeof node === "object" && node.props && node.props.children) {
		return extractTextFromNode(node.props.children);
	}
	return "";
};

function CopyButton({ text, children }: { text?: string; children?: any }) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			const textToCopy = text || extractTextFromNode(children);
			await navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<button
			onClick={copyToClipboard}
			className={cn(
				"absolute top-3 right-3 p-2 rounded-md transition-all duration-200 z-10",
				"bg-gray-700/80 hover:bg-gray-600 border border-gray-600/50",
				"opacity-0 group-hover:opacity-100",
				"hover:scale-105 active:scale-95",
				copied && "bg-green-700/80 border-green-600/50"
			)}
			title={copied ? "Copied!" : "Copy code"}>
			{copied ? (
				<Icons.check className="h-3.5 w-3.5 text-green-300" />
			) : (
				<Icons.copy className="h-3.5 w-3.5 text-gray-300" />
			)}
		</button>
	);
}

interface Message {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
	suggestedQuestions?: string[];
}

interface AIChatProps {
	className?: string;
}

const SYSTEM_PROMPT = `You are an expert AI assistant EXCLUSIVELY for the Multi-Select Component documentation and usage. Your role is STRICTLY limited to helping users understand how to use the MultiSelect component effectively.

IMPORTANT RESTRICTIONS:
- ONLY answer questions related to the MultiSelect component
- If a question is not about MultiSelect, politely decline and redirect to MultiSelect topics
- Do NOT provide general programming help, React advice, or unrelated technical support
- Do NOT answer questions about other components, libraries, or frameworks unless directly related to MultiSelect integration

Your knowledge includes ONLY:
- MultiSelect Component API and props
- MultiSelect usage examples and patterns
- MultiSelect AI/LLM integration examples
- MultiSelect form integration with React Hook Form
- MultiSelect animation configurations
- MultiSelect responsive design
- MultiSelect troubleshooting and common issues
- MultiSelect best practices

When responding:
1. **FIRST**: Check if the question is about MultiSelect component. If NOT, respond with: "I'm specialized in helping with the MultiSelect component only. Please ask me questions about MultiSelect usage, props, styling, integration, or troubleshooting. How can I help you with the MultiSelect component?"
2. Use **Markdown formatting** for better readability
3. Use \`code blocks\` for component names, props, and inline code
4. Use \`\`\`tsx for TypeScript/React code examples
5. Use **bold** for important terms
6. Use lists for multiple items
7. Be concise but thorough
8. Provide code examples when relevant
9. Reference specific props and their usage
10. **ALWAYS** end your response with exactly 5 relevant follow-up questions about MultiSelect
11. **MANDATORY**: Format follow-up questions ONLY as a JSON array at the end like this:
    QUESTIONS: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]
    - Use EXACTLY this format: QUESTIONS: followed by a valid JSON array
    - Each question MUST end with a question mark
    - Each question MUST be a complete string in double quotes
    - NO other format is accepted (no plain text, no numbered lists)
    - The JSON array MUST be valid and parseable
    - Example: QUESTIONS: ["How do I set default values?", "What props control styling?", "How to handle validation?", "Can I disable specific options?", "How to integrate with forms?"]
    - CRITICAL: This is the ONLY accepted format - any other format will be ignored
12. Make sure questions are specific to MultiSelect component and build on the current conversation context
13. **IMPORTANT**: The QUESTIONS section will be automatically hidden from users and used to update suggested questions

Focus EXCLUSIVELY on practical, actionable advice that helps users implement the MultiSelect component successfully.`;

const INITIAL_QUESTIONS = [
	"How do I integrate MultiSelect with React Hook Form?",
	"What animation options are available for MultiSelect?",
	"How can I customize MultiSelect styling and badges?",
	"What are the key props for MultiSelect configuration?",
	"How do I handle MultiSelect data and onChange events?",
];

export function AIChat({ className }: AIChatProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [hideScrollbar, setHideScrollbar] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [suggestedQuestions, setSuggestedQuestions] =
		useState<string[]>(INITIAL_QUESTIONS);
	const [questionsKey, setQuestionsKey] = useState(0);
	const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
	const [isRateLimited, setIsRateLimited] = useState(false);
	const [isSuggestedQuestionsVisible, setIsSuggestedQuestionsVisible] =
		useState(true);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const rateLimitTimerRef = useRef<NodeJS.Timeout | null>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				if (isFullscreen) {
					setIsFullscreen(false);
				} else if (isOpen) {
					setIsOpen(false);
				}
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, isFullscreen]);

	useEffect(() => {
		if (rateLimitSeconds > 0) {
			rateLimitTimerRef.current = setTimeout(() => {
				setRateLimitSeconds((prev) => {
					if (prev <= 1) {
						setIsRateLimited(false);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (rateLimitTimerRef.current) {
				clearTimeout(rateLimitTimerRef.current);
			}
		};
	}, [rateLimitSeconds]);

	useEffect(() => {
		return () => {
			if (rateLimitTimerRef.current) {
				clearTimeout(rateLimitTimerRef.current);
			}
		};
	}, []);

	const sendMessage = async (content: string) => {
		if (!content.trim() || isLoading || isRateLimited) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: content.trim(),
			isUser: true,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsLoading(true);

		setIsRateLimited(true);
		setRateLimitSeconds(15);

		setSuggestedQuestions([]);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [...messages, userMessage].map((msg) => ({
						role: msg.isUser ? "user" : "assistant",
						content: msg.content,
					})),
					systemPrompt: SYSTEM_PROMPT,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to get AI response");
			}

			const data = await response.json();
			let aiContent = data.content;
			let questions: string[] = [];

			let questionsMatch = aiContent.match(/QUESTIONS:\s*(\[[\s\S]*?\])/);
			if (questionsMatch) {
				try {
					questions = JSON.parse(questionsMatch[1]);
					aiContent = aiContent.replace(/QUESTIONS:\s*\[[\s\S]*?\]/, "").trim();
				} catch (e) {
					console.warn("Failed to parse JSON questions format:", e);
					console.warn(
						'Expected format: QUESTIONS: ["Question 1?", "Question 2?", ...]'
					);
				}
			} else {
				console.warn(
					'No valid QUESTIONS format found. Expected: QUESTIONS: ["Question 1?", "Question 2?", ...]'
				);
			}

			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: aiContent,
				isUser: false,
				timestamp: new Date(),
				suggestedQuestions: questions,
			};

			setMessages((prev) => [...prev, aiMessage]);

			if (questions.length > 0) {
				setSuggestedQuestions(questions);
				setQuestionsKey((prev) => prev + 1);
			} else {
				const fallbackQuestions = [
					"How do I customize MultiSelect styling?",
					"What are the key MultiSelect props?",
					"How to integrate MultiSelect with forms?",
					"What animation options are available?",
					"How to handle MultiSelect validation?",
				];
				setSuggestedQuestions(fallbackQuestions);
				setQuestionsKey((prev) => prev + 1);
			}
		} catch (error) {
			console.error("AI Chat Error:", error);
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				content:
					"Sorry, I'm having trouble connecting right now. Please try again later.",
				isUser: false,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);

			const errorFallbackQuestions = [
				"How do I get started with MultiSelect?",
				"What are the basic MultiSelect props?",
				"How to style MultiSelect component?",
				"How to handle MultiSelect events?",
				"What are common MultiSelect issues?",
			];
			setSuggestedQuestions(errorFallbackQuestions);
			setQuestionsKey((prev) => prev + 1);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		sendMessage(inputValue);
	};

	const handleSuggestedQuestion = (question: string) => {
		sendMessage(question);
	};

	if (!isOpen) {
		return (
			<div className={cn("fixed bottom-6 right-6 z-50", className)}>
				<div className="relative">
					{/* Pulsing ring effect */}
					<div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 animate-ping opacity-20"></div>
					<Button
						onClick={() => setIsOpen(true)}
						size="lg"
						className="relative rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-110 group flex items-center justify-center text-white font-bold">
						<span className="text-2xl transition-transform group-hover:scale-110">
							💬
						</span>
						<span className="sr-only">Open AI Chat</span>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"fixed z-50 transition-all duration-300",
				isFullscreen
					? "inset-0 bg-background/80 backdrop-blur-sm"
					: "bottom-6 right-6"
			)}>
			<Card
				className={cn(
					"flex flex-col shadow-2xl border-2 transition-all duration-300",
					isFullscreen
						? "m-4 h-[calc(100vh-2rem)] w-[calc(100vw-2rem)]"
						: "w-96 h-[600px]"
				)}>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
					<div className="flex items-center gap-2">
						<div className="relative">
							<Icons.zap className="h-5 w-5 text-purple-600" />
							<div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
						</div>
						<div>
							<h3 className="font-semibold text-sm">AI Assistant</h3>
							<p className="text-xs text-muted-foreground">
								MultiSelect Expert
							</p>
						</div>
					</div>
					<div className="flex items-center gap-1">
						{isFullscreen && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setHideScrollbar(!hideScrollbar)}
								className="h-8 w-8 p-0"
								title={hideScrollbar ? "Show scrollbar" : "Hide scrollbar"}>
								{hideScrollbar ? (
									<Icons.eye className="h-4 w-4" />
								) : (
									<Icons.eyeOff className="h-4 w-4" />
								)}
							</Button>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsFullscreen(!isFullscreen)}
							className="h-8 w-8 p-0"
							title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
							{isFullscreen ? (
								<Icons.minimize className="h-4 w-4" />
							) : (
								<Icons.maximize className="h-4 w-4" />
							)}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsOpen(false)}
							className="h-8 w-8 p-0">
							<Icons.x className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Messages */}
				<div
					className={cn(
						"flex-1 overflow-y-auto p-4 space-y-4",
						isFullscreen
							? `max-w-4xl mx-auto w-full ${
									hideScrollbar
										? "chat-scrollbar-hidden"
										: "chat-scrollbar-fullscreen"
							  }`
							: "chat-scrollbar"
					)}>
					{messages.length === 0 && (
						<div className="text-center text-muted-foreground py-8">
							<Icons.zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p className="text-sm font-medium mb-2">
								Hi! I&apos;m your MultiSelect AI Assistant
							</p>
							<p className="text-xs">
								I specialize in helping with the MultiSelect component only. Ask
								me about props, styling, integration, animations, or
								troubleshooting!
							</p>
						</div>
					)}

					{messages.map((message) => (
						<div
							key={message.id}
							className={cn(
								"flex gap-2",
								message.isUser ? "justify-end" : "justify-start"
							)}>
							{!message.isUser && (
								<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold mt-1">
									AI
								</div>
							)}
							<div
								className={cn(
									"max-w-[80%] rounded-lg px-3 py-2 text-sm",
									message.isUser
										? "bg-primary text-primary-foreground ml-12"
										: "bg-muted"
								)}>
								{message.isUser ? (
									<div className="whitespace-pre-wrap">{message.content}</div>
								) : (
									<div className="prose prose-sm max-w-none dark:prose-invert">
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											rehypePlugins={[rehypeHighlight]}
											components={{
												code: ({
													node,
													className,
													children,
													...props
												}: any) => {
													const match = /language-(\w+)/.exec(className || "");
													const isInline = !match;
													const codeText = String(children).replace(/\n$/, "");

													if (isInline) {
														if (codeText.length > 20) {
															return (
																<span className="relative group inline-block">
																	<code
																		className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono pr-8"
																		{...props}>
																		{children}
																	</code>
																	<button
																		onClick={async () => {
																			try {
																				const textToCopy =
																					extractTextFromNode(children);
																				await navigator.clipboard.writeText(
																					textToCopy
																				);
																			} catch (err) {
																				console.error("Failed to copy:", err);
																			}
																		}}
																		className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-gray-600 hover:bg-gray-500"
																		title="Copy code">
																		<Icons.copy className="h-2.5 w-2.5 text-gray-300" />
																	</button>
																</span>
															);
														}

														return (
															<code
																className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono"
																{...props}>
																{children}
															</code>
														);
													}

													return (
														<div className="relative group my-2">
															<pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto pr-14">
																<code className={className} {...props}>
																	{children}
																</code>
															</pre>
															<CopyButton>{children}</CopyButton>
														</div>
													);
												},
												pre: ({ children }) => <div>{children}</div>,
												p: ({ children }) => (
													<p className="mb-2 last:mb-0 leading-relaxed">
														{children}
													</p>
												),
												ul: ({ children }) => (
													<ul className="list-disc ml-4 mb-2 space-y-1">
														{children}
													</ul>
												),
												ol: ({ children }) => (
													<ol className="list-decimal ml-4 mb-2 space-y-1">
														{children}
													</ol>
												),
												li: ({ children }) => (
													<li className="leading-relaxed">{children}</li>
												),
												h1: ({ children }) => (
													<h1 className="text-lg font-bold mb-2 text-foreground">
														{children}
													</h1>
												),
												h2: ({ children }) => (
													<h2 className="text-base font-semibold mb-2 text-foreground">
														{children}
													</h2>
												),
												h3: ({ children }) => (
													<h3 className="text-sm font-medium mb-1 text-foreground">
														{children}
													</h3>
												),
												strong: ({ children }) => (
													<strong className="font-semibold text-foreground">
														{children}
													</strong>
												),
												em: ({ children }) => (
													<em className="italic">{children}</em>
												),
												blockquote: ({ children }) => (
													<blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic my-2 text-muted-foreground">
														{children}
													</blockquote>
												),
												table: ({ children }) => (
													<div className="overflow-x-auto my-2">
														<table className="min-w-full border border-gray-300 dark:border-gray-600">
															{children}
														</table>
													</div>
												),
												thead: ({ children }) => (
													<thead className="bg-gray-100 dark:bg-gray-800">
														{children}
													</thead>
												),
												tbody: ({ children }) => <tbody>{children}</tbody>,
												tr: ({ children }) => (
													<tr className="border-b border-gray-200 dark:border-gray-700">
														{children}
													</tr>
												),
												td: ({ children }) => (
													<td className="px-3 py-2 text-sm">{children}</td>
												),
												th: ({ children }) => (
													<th className="px-3 py-2 text-sm font-medium text-left">
														{children}
													</th>
												),
											}}>
											{message.content}
										</ReactMarkdown>
									</div>
								)}
								{message.suggestedQuestions &&
									message.suggestedQuestions.length > 0 && (
										<div className="mt-3 pt-3 border-t border-border/30">
											<p className="text-xs font-medium mb-2 opacity-70">
												Suggested questions:
											</p>
											<div className="space-y-1">
												{message.suggestedQuestions
													.slice(0, 3)
													.map((question, index) => (
														<button
															key={index}
															onClick={() => handleSuggestedQuestion(question)}
															className="block text-left text-xs p-2 rounded bg-background/50 hover:bg-background/80 transition-colors w-full">
															{question}
														</button>
													))}
											</div>
										</div>
									)}
							</div>
							{message.isUser && (
								<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold mt-1">
									U
								</div>
							)}
						</div>
					))}

					{isLoading && (
						<div className="flex gap-2 justify-start">
							<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
								AI
							</div>
							<div className="bg-muted rounded-lg px-3 py-2 text-sm">
								<div className="flex items-center gap-2">
									<div className="flex space-x-1">
										<div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
										<div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
										<div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
									</div>
									<span className="text-xs opacity-70">Thinking...</span>
								</div>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Suggested Questions */}
				{!isLoading && suggestedQuestions.length > 0 && (
					<div
						key={questionsKey}
						className={cn(
							"border-t bg-muted/30",
							isFullscreen && "max-w-4xl mx-auto w-full",
							isRateLimited && "opacity-60"
						)}>
						{/* Toggle Header */}
						<div className="flex items-center justify-between px-4 py-2">
							<p className="text-xs font-medium text-muted-foreground">
								💡 Suggested questions:
								{isRateLimited && (
									<span className="ml-2 text-orange-500">
										(Rate limited - {rateLimitSeconds}s)
									</span>
								)}
							</p>
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									setIsSuggestedQuestionsVisible(!isSuggestedQuestionsVisible)
								}
								className="h-6 w-6 p-0 hover:bg-muted/50"
								title={
									isSuggestedQuestionsVisible
										? "Hide suggestions"
										: "Show suggestions"
								}>
								{isSuggestedQuestionsVisible ? (
									<Icons.chevronDown className="h-3 w-3" />
								) : (
									<Icons.chevronUp className="h-3 w-3" />
								)}
							</Button>
						</div>

						{/* Collapsible Content */}
						{isSuggestedQuestionsVisible && (
							<div className="px-4 pb-2 animate-in fade-in slide-in-from-top-2 duration-300">
								<div className="flex flex-wrap gap-1">
									{suggestedQuestions.slice(0, 5).map((question, index) => (
										<Badge
											key={`${questionsKey}-${question}-${index}`}
											variant="secondary"
											className={cn(
												"text-xs transition-all duration-200 animate-in fade-in",
												isRateLimited
													? "cursor-not-allowed opacity-50"
													: "cursor-pointer hover:bg-secondary/80 hover:scale-105"
											)}
											style={{
												animationDelay: `${index * 100}ms`,
												animationDuration: "300ms",
											}}
											onClick={() =>
												!isRateLimited && handleSuggestedQuestion(question)
											}>
											{question.length > 100
												? question.substring(0, 100) + "..."
												: question}
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Input */}
				<div
					className={cn(
						"p-4 border-t",
						isFullscreen && "max-w-4xl mx-auto w-full"
					)}>
					<form onSubmit={handleSubmit} className="flex gap-2">
						<input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							placeholder={
								isRateLimited
									? `Rate limited - wait ${rateLimitSeconds}s...`
									: "Ask about MultiSelect props, styling, integration..."
							}
							className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							disabled={isLoading || isRateLimited}
						/>
						<Button
							type="submit"
							size="sm"
							disabled={!inputValue.trim() || isLoading || isRateLimited}
							className={cn(
								isRateLimited && "relative overflow-hidden",
								"transition-all duration-200"
							)}>
							{isRateLimited ? (
								<div className="flex items-center gap-1">
									<Icons.clock className="h-4 w-4" />
									<span className="text-xs font-mono">{rateLimitSeconds}</span>
								</div>
							) : (
								<Icons.zap className="h-4 w-4" />
							)}
						</Button>
					</form>
					{isRateLimited && (
						<div className="mt-2 text-xs text-muted-foreground text-center animate-in fade-in slide-in-from-bottom-1 duration-300">
							⏱️ Rate limit active - you can send another message in{" "}
							<span className="font-mono font-semibold text-orange-500">
								{rateLimitSeconds}s
							</span>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}
