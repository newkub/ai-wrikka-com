<script setup lang="ts">
interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  author: string
  image: string
}

const posts: BlogPost[] = [
  {
    id: 1,
    title: 'Getting Started with Vue 3',
    excerpt: 'Learn the basics of Vue 3 composition API',
    date: '2023-05-15',
    author: 'John Doe',
    image: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: 2,
    title: 'Advanced TypeScript Patterns',
    excerpt: 'Explore advanced TypeScript techniques',
    date: '2023-06-20',
    author: 'Jane Smith',
    image: 'https://picsum.photos/300/200?random=2'
  },
  {
    id: 3,
    title: 'UnoCSS for Rapid Styling',
    excerpt: 'How to use UnoCSS in your projects',
    date: '2023-07-10',
    author: 'Mike Johnson',
    image: 'https://picsum.photos/300/200?random=3'
  },
  {
    id: 4,
    title: 'Nuxt 3 Best Practices',
    excerpt: 'Tips and tricks for Nuxt 3 development',
    date: '2023-08-05',
    author: 'Sarah Williams',
    image: 'https://picsum.photos/300/200?random=4'
  }
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Blog</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <img 
          :src="post.image" 
          :alt="post.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
          <p class="text-gray-600 text-sm mb-3">{{ post.excerpt }}</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ post.author }}</span>
            <span>{{ post.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>