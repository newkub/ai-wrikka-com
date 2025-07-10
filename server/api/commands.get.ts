import type { Command } from "~/types/command";

export default defineEventHandler(async (): Promise<Command[]> => {
	// ข้อมูลตัวอย่างแบ่งตาม categories/tags
	return [
		// Pages
		{
			id: "home",
			title: "Home Page",
			icon: "i-mdi-home",
			path: "/",
			tags: ["pages"],
		},
		{
			id: "dashboard",
			title: "Dashboard",
			icon: "i-mdi-view-dashboard",
			path: "/dashboard",
			tags: ["pages"],
		},

		// Settings
		{
			id: "settings",
			title: "Settings",
			icon: "i-mdi-cog",
			path: "/settings",
			tags: ["settings"],
		},
		{
			id: "profile",
			title: "User Profile",
			icon: "i-mdi-account",
			path: "/profile",
			tags: ["settings", "user"],
		},

		// Communication
		{
			id: "chat",
			title: "Chat",
			icon: "i-mdi-forum",
			path: "/chat",
			tags: ["communication"],
		},
		{
			id: "notifications",
			title: "Notifications",
			icon: "i-mdi-bell",
			path: "/notifications",
			tags: ["communication"],
		},

		// Documents
		{
			id: "documents",
			title: "Documents",
			icon: "i-mdi-file-document",
			path: "/documents",
			tags: ["documents"],
		},
		{
			id: "templates",
			title: "Templates",
			icon: "i-mdi-file-cog",
			path: "/templates",
			tags: ["documents"],
		},

		// Analytics
		{
			id: "analytics",
			title: "Analytics",
			icon: "i-mdi-chart-bar",
			path: "/analytics",
			tags: ["analytics"],
		},
		{
			id: "reports",
			title: "Reports",
			icon: "i-mdi-chart-pie",
			path: "/reports",
			tags: ["analytics"],
		},
	];
});
