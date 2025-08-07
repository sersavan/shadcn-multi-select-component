import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

interface Message {
	role: "user" | "assistant";
	content: string;
}

interface ChatRequest {
	messages: Message[];
	systemPrompt: string;
}

async function getKnowledgeBase(): Promise<string> {
	try {
		const knowledgeBasePath = join(process.cwd(), "knowledge-base.md");
		const readmePath = join(process.cwd(), "README.md");

		const [knowledgeBase, readme] = await Promise.all([
			readFile(knowledgeBasePath, "utf-8").catch(() => ""),
			readFile(readmePath, "utf-8").catch(() => ""),
		]);

		return `
=== KNOWLEDGE BASE ===
${knowledgeBase}

=== README ===
${readme}
		`.trim();
	} catch (error) {
		console.error("Error loading knowledge base:", error);
		return "";
	}
}

async function callGeminiAPI(
	messages: Message[],
	systemPrompt: string,
	knowledgeBase: string
): Promise<string> {
	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		throw new Error("Gemini API key not found");
	}

	const fullSystemPrompt = `${systemPrompt}

=== AVAILABLE KNOWLEDGE ===
${knowledgeBase}

CRITICAL INSTRUCTIONS:
- ONLY answer questions about the MultiSelect component
- If the question is not related to MultiSelect, respond with: "I'm specialized in helping with the MultiSelect component only. Please ask me questions about MultiSelect usage, props, styling, integration, or troubleshooting."
- Use this knowledge to provide accurate, helpful information EXCLUSIVELY about the MultiSelect component
- Do NOT provide general programming help or advice about other topics`;

	const geminiMessages = [
		{
			role: "user",
			parts: [{ text: fullSystemPrompt }],
		},
		...messages.map((msg) => ({
			role: msg.role === "assistant" ? "model" : "user",
			parts: [{ text: msg.content }],
		})),
	];

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				contents: geminiMessages,
				generationConfig: {
					temperature: 0.7,
					topK: 40,
					topP: 0.95,
					maxOutputTokens: 1024,
				},
			}),
		}
	);

	if (!response.ok) {
		const error = await response.text();
		console.error("Gemini API error:", error);
		throw new Error(`Gemini API error: ${response.status}`);
	}

	const data = await response.json();

	if (!data.candidates || data.candidates.length === 0) {
		throw new Error("No response from Gemini API");
	}

	return data.candidates[0].content.parts[0].text;
}

export async function POST(request: NextRequest) {
	try {
		const body: ChatRequest = await request.json();
		const { messages, systemPrompt } = body;

		if (!messages || !Array.isArray(messages)) {
			return NextResponse.json(
				{ error: "Invalid messages format" },
				{ status: 400 }
			);
		}

		const knowledgeBase = await getKnowledgeBase();

		const response = await callGeminiAPI(messages, systemPrompt, knowledgeBase);

		return NextResponse.json({ content: response });
	} catch (error) {
		console.error("Chat API error:", error);

		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		return NextResponse.json(
			{
				error: "Failed to process chat request",
				details: errorMessage,
			},
			{ status: 500 }
		);
	}
}
