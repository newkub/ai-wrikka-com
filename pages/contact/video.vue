<script setup lang="ts">
interface Video {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	duration: string;
	views: string;
	date: string;
	category: string;
}

const videos: Video[] = [
	{
		id: "dQw4w9WgXcQ",
		title: "Getting Started with Our Platform",
		description:
			"Learn the basics of our platform and how to get started with your first project.",
		thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
		duration: "12:34",
		views: "1.2K",
		date: "2 weeks ago",
		category: "Tutorials",
	},
	{
		id: "9bZkp7q19f0",
		title: "Advanced Features Walkthrough",
		description: "Discover advanced features and hidden gems in our platform.",
		thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
		duration: "18:45",
		views: "3.5K",
		date: "1 month ago",
		category: "Features",
	},
	{
		id: "JGwWNGJdvx8",
		title: "Mobile App Tutorial",
		description:
			"Learn how to use our mobile app on the go with this comprehensive tutorial.",
		thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg",
		duration: "22:15",
		views: "2.1K",
		date: "3 weeks ago",
		category: "Mobile",
	},
	{
		id: "kJQP7kiw5Fk",
		title: "Product Demo",
		description:
			"Watch our product in action with this detailed demonstration.",
		thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
		duration: "15:20",
		views: "5.7K",
		date: "2 months ago",
		category: "Demos",
	},
	{
		id: "RgKAFK5djSk",
		title: "Customer Success Stories",
		description:
			"Hear from our customers about their success using our platform.",
		thumbnail: "https://img.youtube.com/vi/RgKAFK5djSk/maxresdefault.jpg",
		duration: "8:45",
		views: "3.2K",
		date: "1 month ago",
		category: "Testimonials",
	},
	{
		id: "OPf0YbXqDm0",
		title: "Latest Features Update",
		description:
			"Check out all the new features in our latest platform update.",
		thumbnail: "https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg",
		duration: "10:30",
		views: "4.1K",
		date: "2 weeks ago",
		category: "Updates",
	},
];

const categories = [
	"All",
	"Tutorials",
	"Features",
	"Mobile",
	"Demos",
	"Testimonials",
	"Updates",
];
const selectedCategory = ref("All");

const filteredVideos = computed(() => {
	if (selectedCategory.value === "All") return videos;
	return videos.filter((video) => video.category === selectedCategory.value);
});

const formatDuration = (duration: string) => {
	const [minutes, seconds] = duration.split(":").map(Number);
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const openVideoModal = (videoId: string) => {
	// In a real app, you would open a modal with the video player
	window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
};
</script>

<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Video Library</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Explore our collection of tutorials, demos, and feature walkthroughs to get the most out of our platform.
      </p>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap justify-center gap-2 mb-8">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
        :class="{
          'bg-blue-600 text-white': selectedCategory === category,
          'bg-white text-gray-700 hover:bg-gray-100': selectedCategory !== category
        }"
      >
        {{ category }}
      </button>
    </div>

    <!-- Video Grid -->
    <div 
      v-if="filteredVideos.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div 
        v-for="video in filteredVideos" 
        :key="video.id"
        class="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="relative aspect-video">
          <img 
            :src="video.thumbnail" 
            :alt="video.title"
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click="openVideoModal(video.id)"
              class="w-16 h-16 bg-blue-600 bg-opacity-90 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              aria-label="Play video"
            >
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          </div>
          <span class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {{ formatDuration(video.duration) }}
          </span>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900 mb-1 line-clamp-2" :title="video.title">
            {{ video.title }}
          </h3>
          <p class="text-sm text-gray-600 mb-2 line-clamp-2">
            {{ video.description }}
          </p>
          <div class="flex items-center text-xs text-gray-500">
            <span>{{ video.views }} views</span>
            <span class="mx-2">•</span>
            <span>{{ video.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-else
      class="text-center py-16 bg-gray-50 rounded-xl"
    >
      <svg 
        class="mx-auto h-12 w-12 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
      <p class="mt-1 text-sm text-gray-500">
        There are no videos in this category. Try selecting a different category.
      </p>
      <div class="mt-6">
        <button 
          @click="selectedCategory = 'All'"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View All Videos
        </button>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="filteredVideos.length > 0" class="flex justify-center mt-8">
      <button 
        class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Load More Videos
      </button>
    </div>
  </div>
</template>
