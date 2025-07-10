import { ref } from "vue";
import { useFetch } from "#imports";
import type { Command } from "~/types/command";

export default function useCommandData() {
	const commands = ref<Command[]>([]);

	const fetchCommands = async () => {
		try {
			const { data, error } = await useFetch<Command[]>("/api/commands");

			if (error.value) throw error.value;
			commands.value = data.value || [];
		} catch (error) {
			console.error("Error fetching commands:", error);
			commands.value = [];
		}
	};

	const fetchPages = async (): Promise<
		{ path: string; title: string; icon: string }[]
	> => {
		try {
			const pages = await import.meta.glob<{
				default: {
					title?: string;
					icon?: string;
				};
			}>("../../pages/**/*.vue", { eager: true });

			return Object.entries(pages)
				.filter(([path]) => !path.includes("__"))
				.map(([path, module]) => {
					return {
						path: path.replace("../../pages", "").replace(".vue", ""),
						title:
							module.default?.title ||
							path.split("/").pop()?.replace(".vue", "") ||
							"",
						icon: module.default?.icon || "i-mdi-file",
					};
				});
		} catch (error) {
			console.error("Error fetching pages:", error);
			return [];
		}
	};

	const getIconForPath = (path: string): string => {
		const iconMap: Record<string, string> = {
			"/": "i-mdi-home",
			"/email": "i-mdi-email",
			"/video": "i-mdi-video",
			"/settings": "i-mdi-cog",
			"/contact": "i-mdi-email",
			"/chat": "i-mdi-forum",
			"/api-docs": "i-mdi-api",
		};

		return iconMap[path] || "i-mdi-file";
	};

	fetchCommands();

	return {
		commands,
		fetchPages,
	};
}
