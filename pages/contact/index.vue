<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

interface ContactItem {
	id: string;
	title: string;
	description: string;
	icon: string;
	route: string;
	cover: string;
	gradient: string;
}

const items: ContactItem[] = [
	{
		id: "changelog",
		title: "Changelog Update",
		description: "Latest updates and version history",
		icon: "i-mdi-update",
		route: "/contact/changelog",
		cover:
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
		gradient: "from-blue-500/20 to-blue-600/20",
	},
	{
		id: "contact",
		title: "Contact",
		description: "Get in touch with our team",
		icon: "i-mdi-email-outline",
		route: "/contact/contact",
		cover:
			"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
		gradient: "from-emerald-500/20 to-emerald-600/20",
	},
	{
		id: "blog",
		title: "Blog",
		description: "Read our latest articles and tutorials",
		icon: "i-mdi-post-outline",
		route: "/contact/blog",
		cover:
			"https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
		gradient: "from-purple-500/20 to-purple-600/20",
	},
	{
		id: "video",
		title: "Video",
		description: "Watch our video content",
		icon: "i-mdi-play-circle-outline",
		route: "/contact/video",
		cover:
			"https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
		gradient: "from-red-500/20 to-red-600/20",
	},
	{
		id: "policy",
		title: "Policy",
		description: "Our privacy and policy information",
		icon: "i-mdi-shield-account-outline",
		route: "/contact/policy",
		cover:
			"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
		gradient: "from-amber-500/20 to-amber-600/20",
	},
	{
		id: "career",
		title: "Career",
		description: "Join our team",
		icon: "i-mdi-briefcase-outline",
		route: "/contact/career",
		cover:
			"https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
		gradient: "from-indigo-500/20 to-indigo-600/20",
	},
	{
		id: "feedback",
		title: "Feedback",
		description: "Share your thoughts with us",
		icon: "i-mdi-comment-text-outline",
		route: "/contact/feedback",
		cover:
			"https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
		gradient: "from-pink-500/20 to-pink-600/20",
	},
];

const navigateTo = (route: string) => {
	router.push(route);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
    <div class="container mx-auto py-8 max-w-7xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
      
      <!-- 4-Column Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="item in items" 
          :key="item.id"
          @click="navigateTo(item.route)"
          class="group relative bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-lg"
        >
          <!-- Image Cover with Gradient Overlay -->
          <div class="relative w-full aspect-video overflow-hidden">
            <img 
              :src="item.cover" 
              :alt="item.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-br" :class="item.gradient"></div>
          </div>
          
          <!-- Content -->
          <div class="p-4">
            <div class="flex items-center mb-2">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="item.gradient.replace('/20', '/30')">
                <span :class="item.icon + ' text-xl text-white'"></span>
              </div>
              <h2 class="text-lg font-semibold ml-3 text-gray-800">{{ item.title }}</h2>
            </div>
            <p class="text-sm text-gray-600">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
