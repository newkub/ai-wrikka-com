<script setup lang="ts">
interface BlogPost {
	id: number;
	title: string;
	excerpt: string;
	date: string;
	author: string;
	readTime: string;
	category: string;
}

const blogPosts: BlogPost[] = [
	{
		id: 1,
		title: "Getting Started with Modern Web Development",
		excerpt:
			"Learn the fundamentals of modern web development with our comprehensive guide.",
		date: "2025-07-10",
		author: "John Doe",
		readTime: "5 min read",
		category: "Development",
	},
	{
		id: 2,
		title: "The Future of AI in Business",
		excerpt:
			"Discover how AI is transforming businesses across various industries.",
		date: "2025-07-05",
		author: "Jane Smith",
		readTime: "7 min read",
		category: "AI",
	},
	{
		id: 3,
		title: "Best Practices for UI/UX Design",
		excerpt: "Essential UI/UX design principles every developer should know.",
		date: "2025-06-28",
		author: "Mike Johnson",
		readTime: "6 min read",
		category: "Design",
	},
];
</script>

<template>
  <div class="space-y-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Our Blog</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Stay updated with the latest articles, tutorials, and insights from our team of experts.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article v-for="post in blogPosts" :key="post.id" class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
              {{ post.category }}
            </span>
            <span class="text-sm text-gray-500">{{ post.readTime }}</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {{ post.title }}
          </h3>
          <p class="text-gray-600 mb-4 line-clamp-2">
            {{ post.excerpt }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                {{ post.author.charAt(0) }}
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ post.author }}</p>
                <p class="text-xs text-gray-500">{{ post.date }}</p>
              </div>
            </div>
            <button class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
              Read more
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </article>
    </div>

    <div class="flex justify-center mt-8">
      <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        Load More Articles
      </button>
    </div>
  </div>
</template>
