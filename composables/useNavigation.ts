import { computed } from "vue";
import { useRoute } from "vue-router";

export interface NavItem {
	name: string;
	href: string;
	icon: string;
	children?: NavItem[];
}

export function useNavigation() {
	const route = useRoute();

	const navigation = computed<NavItem[]>(() => [
		{ name: "Chat", href: "/chat", icon: "i-mdi-chat" },
		{ name: "Media", href: "/media", icon: "i-mdi-image" },
		{ name: "Talk", href: "/talk", icon: "i-mdi-image" },
		{ name: "Code", href: "/code", icon: "i-mdi-code-braces" },
		{ name: "Search", href: "/search", icon: "i-mdi-magnify" },
		{ name: "Learn", href: "/learn", icon: "i-mdi-school" },
		{ name: "Task", href: "/task", icon: "i-mdi-format-list-checks" },
		{ name: "Whiteboard", href: "/whiteboard", icon: "i-mdi-whiteboard" },
		{ name: "Bookmark", href: "/bookmark", icon: "i-mdi-bookmark" },
		{ name: "Notes", href: "/notes", icon: "i-mdi-note" },
		{ name: "Docs", href: "/docs", icon: "i-mdi-file-document" },
		{ name: "Blog", href: "/blog", icon: "i-mdi-post" },
		{ name: "Design System", href: "/design-system", icon: "i-mdi-palette" },
	]);

	const isActive = (path: string) => {
		return route.path === path || route.path.startsWith(`${path}/`);
	};

	return {
		navigation,
		isActive,
	};
}
