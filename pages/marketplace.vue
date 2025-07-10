<script setup lang="ts">
const router = useRouter();
const searchQuery = ref("");
const selectedCategory = ref("all");

interface AppItem {
	id: string;
	name: string;
	icon: string;
	description: string;
	category: string;
	rating: number;
	downloads: string;
	isInstalled: boolean;
	action: () => void;
}

const categories = [
	{ id: "all", name: "All Apps" },
	{ id: "productivity", name: "Productivity" },
	{ id: "communication", name: "Communication" },
	{ id: "design", name: "Design" },
	{ id: "development", name: "Development" },
	{ id: "utilities", name: "Utilities" },
];

const appItems: AppItem[] = [
	{
		id: "chat",
		name: "Chat",
		icon: "i-mdi-forum",
		description: "Real-time messaging and communication",
		category: "communication",
		rating: 4.8,
		downloads: "10K+",
		isInstalled: false,
		action: () => router.push("/chat"),
	},
	{
		id: "docs",
		name: "Documents",
		icon: "i-mdi-file-document",
		description: "Create and edit documents",
		category: "productivity",
		rating: 4.5,
		downloads: "50K+",
		isInstalled: true,
		action: () => router.push("/documents"),
	},
	{
		id: "notes",
		name: "Notes",
		icon: "i-mdi-note",
		description: "Quick notes and memos",
		category: "productivity",
		rating: 4.3,
		downloads: "25K+",
		isInstalled: true,
		action: () => router.push("/notes"),
	},
	{
		id: "tasks",
		name: "Tasks",
		icon: "i-mdi-check-circle",
		description: "Task and project management",
		category: "productivity",
		rating: 4.6,
		downloads: "30K+",
		isInstalled: false,
		action: () => router.push("/tasks"),
	},
	{
		id: "image-editor",
		name: "Image Editor",
		icon: "i-mdi-image-edit",
		description: "Edit and enhance your images",
		category: "design",
		rating: 4.7,
		downloads: "15K+",
		isInstalled: false,
		action: () => router.push("/image-editor"),
	},
	{
		id: "video-editor",
		name: "Video Editor",
		icon: "i-mdi-video-edit",
		description: "Edit and create videos",
		category: "design",
		rating: 4.4,
		downloads: "8K+",
		isInstalled: false,
		action: () => router.push("/video-editor"),
	},
	{
		id: "whiteboard",
		name: "Whiteboard",
		icon: "i-mdi-chart-box",
		description: "Collaborative whiteboarding",
		category: "productivity",
		rating: 4.2,
		downloads: "12K+",
		isInstalled: true,
		action: () => router.push("/whiteboard"),
	},
	{
		id: "hosting",
		name: "Cloud Hosting",
		icon: "i-mdi-server",
		description: "Deploy and manage your apps",
		category: "development",
		rating: 4.9,
		downloads: "20K+",
		isInstalled: false,
		action: () => router.push("/hosting"),
	},
];

const filteredApps = computed(() => {
	return appItems.filter((app) => {
		const matchesSearch =
			app.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			app.description.toLowerCase().includes(searchQuery.value.toLowerCase());
		const matchesCategory =
			selectedCategory.value === "all" ||
			app.category === selectedCategory.value;
		return matchesSearch && matchesCategory;
	});
});

const installApp = (app: AppItem) => {
	const index = appItems.findIndex((a) => a.id === app.id);
	if (index !== -1) {
		appItems[index].isInstalled = true;
	}
};

const uninstallApp = (app: AppItem) => {
	const index = appItems.findIndex((a) => a.id === app.id);
	if (index !== -1) {
		appItems[index].isInstalled = false;
	}
};
</script>

<template>
  <div class="min-h-screen p-4 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">App Marketplace</h1>
      <p class="text-muted-foreground">Discover and install apps to enhance your experience</p>
    </div>

    <!-- Search and Filter -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search apps..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
        <span class="i-mdi-magnify absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      </div>
      <select
        v-model="selectedCategory"
        class="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Categories -->
    <div class="mb-8 overflow-x-auto">
      <div class="flex space-x-2 pb-2">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-4 py-2 rounded-full whitespace-nowrap',
            selectedCategory === category.id 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted/50 hover:bg-muted'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- App Grid -->
    <div v-if="filteredApps.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="app in filteredApps" 
        :key="app.id"
        class="relative group rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- App Header -->
        <div class="p-5">
          <div class="flex items-start justify-between mb-4">
            <span :class="[app.icon, 'text-4xl text-primary']" />
            <span class="px-2 py-1 text-xs rounded-full bg-muted">{{ app.downloads }}</span>
          </div>
          
          <!-- App Info -->
          <div class="mb-4">
            <h3 class="font-semibold text-lg">{{ app.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ app.description }}</p>
          </div>
          
          <!-- Rating -->
          <div class="flex items-center mb-4">
            <div class="flex">
              <span 
                v-for="i in 5" 
                :key="i" 
                :class="[
                  'i-mdi-star', 
                  i <= Math.floor(app.rating) ? 'text-yellow-400' : 'text-muted-foreground/30'
                ]"
              />
            </div>
            <span class="ml-2 text-sm text-muted-foreground">{{ app.rating }}</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="px-5 py-3 bg-muted/20 border-t border-border">
          <button
            v-if="!app.isInstalled"
            @click.stop="installApp(app)"
            class="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Install
          </button>
          <div v-else class="flex gap-2">
            <button
              @click.stop="app.action()"
              class="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Open
            </button>
            <button
              @click.stop="uninstallApp(app)"
              class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              title="Uninstall"
            >
              <span class="i-mdi-trash-can" />
            </button>
          </div>
        </div>
        
        <!-- Featured Badge -->
        <div 
          v-if="app.rating >= 4.5" 
          class="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          Featured
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <span class="i-mdi-package-variant text-5xl text-muted-foreground/50 mb-4" />
      <h3 class="text-xl font-medium mb-2">No apps found</h3>
      <p class="text-muted-foreground max-w-md">
        We couldn't find any apps matching your search. Try adjusting your filters.
      </p>
    </div>
  </div>
</template>