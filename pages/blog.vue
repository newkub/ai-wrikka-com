<script setup lang="ts">
definePageMeta({
  layout: 'blog'
});

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

const selectedCategory = ref<string>('all');

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Getting Started with Vue 3 Composition API',
    excerpt: 'Learn how to use the new Composition API in Vue 3 to build more maintainable and reusable components.',
    slug: 'getting-started-with-vue-3-composition-api',
    date: '2023-05-15',
    category: 'Vue',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: {
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    id: 2,
    title: 'Mastering TypeScript for Frontend Development',
    excerpt: 'A comprehensive guide to using TypeScript in your frontend projects for better developer experience.',
    slug: 'mastering-typescript-for-frontend',
    date: '2023-05-10',
    category: 'TypeScript',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465e2477?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: {
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    }
  },
  {
    id: 3,
    title: 'Building Scalable APIs with Nuxt 3',
    excerpt: 'Learn how to build and scale APIs using Nuxt 3 server routes and API endpoints.',
    slug: 'building-scalable-apis-with-nuxt3',
    date: '2023-05-05',
    category: 'Nuxt',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: {
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    }
  },
  {
    id: 4,
    title: 'State Management with Pinia',
    excerpt: 'A complete guide to state management in Vue 3 applications using Pinia.',
    slug: 'state-management-with-pinia',
    date: '2023-04-28',
    category: 'Vue',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324b6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: {
      name: 'Sarah Williams',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  }
];

const categories = ['all', ...new Set(blogPosts.map(post => post.category))];

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') return blogPosts;
  return blogPosts.filter(post => post.category === selectedCategory.value);
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
</script>

<template>
  <div class="max-w-1200px mx-auto px-6">
    <div class="text-center mb-12 pt-4">
      <h1 class="text-2.5rem font-800 text-gray-900 mb-2">Latest Articles</h1>
      <p class="text-lg text-gray-500 max-w-600px mx-auto">Insights, tutorials, and news about web development</p>
    </div>

    <div class="flex flex-wrap gap-3 mb-10 justify-center">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'py-2 px-4 rounded-full text-sm font-500 bg-gray-100 text-gray-600 border-none cursor-pointer transition-all duration-200',
          { 'bg-blue-500 text-white': selectedCategory === category }
        ]"
        class="hover:bg-gray-200"
      >
        {{ category }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      <article 
        v-for="post in filteredPosts" 
        :key="post.id" 
        class="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-200 hover:translate-y-[-4px] hover:shadow-lg"
      >
        <NuxtLink :to="`/blog/${post.slug}`" class="no-underline text-inherit block h-full">
          <div class="w-full h-200px overflow-hidden">
            <img 
              :src="post.image" 
              :alt="post.title" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div class="p-6">
            <div class="flex items-center text-xs text-gray-500 mb-3 flex-wrap gap-2">
              <span class="font-600 text-blue-500 uppercase tracking-wider text-[0.7rem]">{{ post.category }}</span>
              <span class="text-gray-300">•</span>
              <span>{{ formatDate(post.date) }}</span>
              <span class="text-gray-300">•</span>
              <span>{{ post.readTime }}</span>
            </div>
            <h2 class="text-xl font-700 text-gray-900 mb-3 leading-tight">{{ post.title }}</h2>
            <p class="text-gray-600 mb-5 leading-relaxed text-[0.95rem]">{{ post.excerpt }}</p>
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
              <div class="flex items-center gap-3">
                <img :src="post.author.avatar" :alt="post.author.name" class="w-8 h-8 rounded-full object-cover" />
                <span class="text-sm font-500 text-gray-700">{{ post.author.name }}</span>
              </div>
              <span class="text-sm font-600 text-blue-500 transition-colors duration-200 hover:text-blue-600">Read More →</span>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>