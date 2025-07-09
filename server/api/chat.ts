import { type H3Event, defineEventHandler } from "h3";

export default defineEventHandler(async (_event: H3Event) => {
	return {
		message: "Chat API endpoint",
		data: [],
	};
});
