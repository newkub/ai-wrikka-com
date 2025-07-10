<script setup lang="ts">
interface ImageApp {
	id: string;
	title: string;
	description: string;
	icon: string;
	path: string;
	color: string;
}

const imageApps: ImageApp[] = [
	{
		id: "gen",
		title: "Image Generation",
		description: "Create stunning AI-generated images from text prompts",
		icon: "i-mdi-image-auto-adjust",
		path: "/image/gen",
		color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	},
	{
		id: "editor",
		title: "Image Editor",
		description: "Edit and enhance your photos with powerful tools",
		icon: "i-mdi-image-edit",
		path: "/image/editor",
		color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
	},
	{
		id: "upscale",
		title: "Upscale",
		description: "Enhance image resolution without losing quality",
		icon: "i-mdi-vector-square-edit",
		path: "/image/upscale",
		color: "bg-green-500/10 text-green-600 dark:text-green-400",
	},
	{
		id: "restore",
		title: "Restore",
		description: "Fix and restore old or damaged photos",
		icon: "i-mdi-image-refresh",
		path: "/image/restore",
		color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	},
	{
		id: "remove-bg",
		title: "Remove Background",
		description: "Instantly remove background from any image",
		icon: "i-mdi-image-remove",
		path: "/image/remove-bg",
		color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
	},
	{
		id: "sketch",
		title: "Sketch to Image",
		description: "Transform your sketches into realistic images",
		icon: "i-mdi-drawing",
		path: "/image/sketch",
		color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
	},
	{
		id: "style-transfer",
		title: "Style Transfer",
		description: "Apply artistic styles to your photos",
		icon: "i-mdi-palette",
		path: "/image/style-transfer",
		color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
	},
	{
		id: "inpaint",
		title: "Inpainting",
		description: "Remove unwanted objects from your images",
		icon: "i-mdi-brush",
		path: "/image/inpaint",
		color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
	},
];

const navigateTo = (path: string) => {
	navigateTo(path);
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Image Tools</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <NuxtLink 
        v-for="app in imageApps" 
        :key="app.id"
        :to="app.path"
        class="group block"
      >
        <div class="h-full rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-transparent">
          <div class="p-6">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" :class="app.color">
              <div :class="app.icon" class="text-2xl" />
            </div>
            <h3 class="text-lg font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ app.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ app.description }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>