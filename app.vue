<script setup lang="ts">
import SidebarApp from "~/components/ui/SidebarApp.vue";
import CommandPalette from "~/components/ui/CommandPalette.vue";

const customAppItems = [
	{ name: "Home", path: "/", icon: "i-mdi-home" },
	{ name: "Chat", path: "/chat", icon: "i-mdi-forum" },
	{ name: "Email", path: "/email", icon: "i-mdi-email" },
	{ name: "Automation", path: "/automation", icon: "i-mdi-robot" },
	{ name: "Bookmark", path: "/bookmark", icon: "i-mdi-bookmark-multiple" },
	{ name: "Code", path: "/code", icon: "i-mdi-code-braces" },
	{ name: "Learn", path: "/learn", icon: "i-mdi-lightbulb-on" },
	{ name: "Notes", path: "/notes", icon: "i-mdi-notebook" },
	{ name: "Calendar", path: "/calendar", icon: "i-mdi-calendar" },
	{ name: "Database", path: "/database", icon: "i-mdi-database" },
	{ name: "Search", path: "/search", icon: "i-mdi-magnify" },
	{ name: "Task", path: "/task", icon: "i-mdi-check-circle" },
	{ name: "Image", path: "/image", icon: "i-mdi-image" },
	{ name: "Hosting", path: "/hosting", icon: "i-mdi-image" },
	{ name: "Web Editor", path: "/web-editor", icon: "i-mdi-web" },
	{ name: "Video", path: "/video", icon: "i-mdi-video" },
	{ name: "Whiteboard", path: "/whiteboard", icon: "i-mdi-chart-box" },
	{ name: "Add", path: "/marketplace", icon: "i-mdi-plus" },
];

const customBelowItems = [
	{ name: "Settings", path: "/settings", icon: "i-mdi-cog" },
	{ name: "Contact", path: "/contact", icon: "i-mdi-email" },
];
</script>

<template>
  <CommandPalette />
  <NuxtLayout>
    <div class="min-h-screen flex bg-background text-text">
      <SidebarApp 
        :app-items="customAppItems" 
        :below-items="customBelowItems" 
      />
      
      <main class="flex-1 ml-24 p-6">
        <NuxtPage />
      </main>
    </div>
  </NuxtLayout>
</template>