import { type H3Event, defineEventHandler, createError, readBody } from "h3";
import { useRuntimeConfig } from "#imports";

interface ChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig();
	const body = await readBody(event);

	if (!config.openaiApiKey) {
		throw createError({
			statusCode: 500,
			statusMessage: "OpenAI API key is not configured",
		});
	}

	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${config.openaiApiKey}`,
			},
			body: JSON.stringify({
				...body,
				messages: (body.messages as ChatMessage[]).map((msg) => ({
					role: msg.role,
					content: msg.content,
				})),
			}),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				error.error?.message || "Failed to fetch from OpenAI API",
			);
		}

		return await response.json();
	} catch (error) {
		console.error("OpenAI API error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Internal Server Error";
		const statusCode =
			error && typeof error === "object" && "statusCode" in error
				? (error as { statusCode: number }).statusCode
				: 500;

		throw createError({
			statusCode,
			statusMessage: errorMessage,
		});
	}
});
