<script setup lang="ts">
interface VideoApp {
	id: string;
	title: string;
	description: string;
	icon: string;
	path: string;
	color: string;
}

const videoApps: VideoApp[] = [
	{
		id: "editor",
		title: "Video Editor",
		description: "Edit and enhance your videos with powerful tools",
		icon: "i-mdi-video-edit",
		path: "/video/editor",
		color: "bg-purple-500/10 text-purple-600",
	},
	{
		id: "trim",
		title: "Trim Video",
		description: "Cut and trim your videos to the perfect length",
		icon: "i-mdi-scissors-cutting",
		path: "/video/trim",
		color: "bg-blue-500/10 text-blue-600",
	},
	{
		id: "merge",
		title: "Merge Videos",
		description: "Combine multiple video clips into one",
		icon: "i-mdi-call-merge",
		path: "/video/merge",
		color: "bg-green-500/10 text-green-600",
	},
	{
		id: "convert",
		title: "Convert Format",
		description: "Convert video to different formats",
		icon: "i-mdi-file-video",
		path: "/video/convert",
		color: "bg-amber-500/10 text-amber-600",
	},
	{
		id: "add-audio",
		title: "Add Audio",
		description: "Add background music or voiceover to your video",
		icon: "i-mdi-music-note",
		path: "/video/add-audio",
		color: "bg-rose-500/10 text-rose-600",
	},
	{
		id: "add-subtitle",
		title: "Add Subtitles",
		description: "Add subtitles to your videos",
		icon: "i-mdi-subtitles",
		path: "/video/add-subtitle",
		color: "bg-indigo-500/10 text-indigo-600",
	},
	{
		id: "effects",
		title: "Video Effects",
		description: "Add filters and effects to your videos",
		icon: "i-mdi-movie-open",
		path: "/video/effects",
		color: "bg-pink-500/10 text-pink-600",
	},
	{
		id: "compress",
		title: "Compress Video",
		description: "Reduce video file size while maintaining quality",
		icon: "i-mdi-file-compress",
		path: "/video/compress",
		color: "bg-teal-500/10 text-teal-600",
	},
	{
		id: "Recording",
		title: "Recording",
		description: "Record your screen and audio",
		icon: "i-mdi-file-compress",
		path: "/video/recording",
		color: "bg-teal-500/10 text-teal-600",
	},
];

const navigateTo = (path: string) => {
	navigateTo(path);
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Video Tools</h1>
      <p class="text-gray-600">Edit, enhance and transform your videos with our powerful tools</p>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <NuxtLink 
        v-for="app in videoApps" 
        :key="app.id"
        :to="app.path"
        class="group block"
      >
        <div class="h-full rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-transparent">
          <div class="p-6">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" :class="app.color">
              <div :class="app.icon" class="text-2xl" />
            </div>
            <h3 class="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">
              {{ app.title }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ app.description }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>