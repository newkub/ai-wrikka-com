<script lang="ts" setup>
import type { BlogPost } from "~/types/content";

const { data: blogPosts } = await useAsyncData<BlogPost[]>(
	"blog-posts",
	async () => {
		// @ts-ignore - queryContent will be available at runtime from Nuxt Content
		return await queryContent<BlogPost>("blog").sort({ date: -1 }).find();
	},
);

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-text mb-4">Blog</h1>
        <p class="text-xl text-text">Latest articles and tutorials</p>
      </div>

      <div v-if="blogPosts?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="post in blogPosts"
          :key="post._path"
          :to="post._path"
          class="group block overflow-hidden rounded-xl bg-surface shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div class="relative h-48 overflow-hidden">
            <img
              :src="post.image"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-4">
              <span class="inline-block px-3 py-1 text-sm font-medium text-surface bg-brand rounded-full">
                {{ post.category }}
              </span>
            </div>
          </div>
          <div class="p-6">
            <div class="flex items-center text-sm text-text mb-2">
              <span>{{ formatDate(post.date) }}</span>
              <span class="mx-2">•</span>
              <span>{{ post.readTime }}</span>
            </div>
            <h2 class="text-xl font-bold text-text mb-2 group-hover:text-brand transition-colors">
              {{ post.title }}
            </h2>
            <p class="text-text line-clamp-2">
              {{ post.description }}
            </p>
            <div class="mt-4 flex items-center">
              <img
                :src="post.author.avatar"
                :alt="post.author.name"
                class="w-8 h-8 rounded-full mr-2"
              />
              <span class="text-sm font-medium text-text">
                {{ post.author.name }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-text">No blog posts found.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles here if needed */
</style>