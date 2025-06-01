<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Wrikka
          </NuxtLink>
          <nav class="hidden md:flex space-x-6">
            <NuxtLink to="/search" class="hover:text-blue-600 dark:hover:text-blue-400">Search</NuxtLink>
            <NuxtLink to="/video" class="text-blue-600 dark:text-blue-400 font-medium">Video</NuxtLink>
            <NuxtLink to="/blog" class="hover:text-blue-600 dark:hover:text-blue-400">Blog</NuxtLink>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <i class="fas fa-bell text-xl"></i>
          </button>
          <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <i class="fas fa-user text-blue-600 dark:text-blue-400"></i>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Search Bar -->
      <div class="max-w-3xl mx-auto mb-12">
        <div class="relative">
          <div class="relative flex items-center">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full px-5 py-4 pr-12 text-lg rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
              placeholder="Search videos..."
              @keyup.enter="searchVideos"
            >
            <button 
              @click="searchVideos"
              class="absolute right-3 p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <i class="fas fa-search text-xl"></i>
            </button>
          </div>
          <div class="mt-3 flex justify-center space-x-4 text-sm">
            <button 
              v-for="filter in filters" 
              :key="filter"
              @click="activeFilter = filter"
              :class="{
                'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': activeFilter === filter,
                'hover:bg-gray-100 dark:hover:bg-gray-800': activeFilter !== filter
              }"
              class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              {{ filter }}
            </button>
          </div>
        </div>
      </div>

      <!-- Video Grid -->
      <div v-if="videos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="video in videos" 
          :key="video.id"
          class="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div class="relative pt-[56.25%] bg-gray-100 dark:bg-gray-700">
            <img 
              :src="video.thumbnail" 
              :alt="video.title"
              class="absolute inset-0 w-full h-full object-cover"
            >
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <button class="w-16 h-16 rounded-full bg-white/90 text-blue-600 flex items-center justify-center hover:scale-110 transform transition-transform">
                <i class="fas fa-play text-2xl"></i>
              </button>
              <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {{ video.duration }}
              </div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-medium text-lg mb-1 line-clamp-2">{{ video.title }}</h3>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span class="truncate">{{ video.channel }}</span>
              <span class="mx-2">•</span>
              <span>{{ video.views }} views</span>
              <span class="mx-2">•</span>
              <span>{{ video.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-12">
        <i class="fas fa-video-slash text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-500 dark:text-gray-400">No videos found</h3>
        <p class="text-gray-400 dark:text-gray-500 mt-1">Try different search terms or upload your own video</p>
      </div>

      <!-- Upload Button -->
      <div class="fixed bottom-8 right-8">
        <button 
          @click="openUploadModal"
          class="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
        >
          <i class="fas fa-plus text-2xl"></i>
        </button>
      </div>
    </main>


    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Upload Video</h2>
            <button @click="showUploadModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div 
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop="handleDrop"
            :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDragging }"
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer transition-colors"
            @click="selectFile"
          >
            <input 
              type="file" 
              ref="fileInput" 
              class="hidden" 
              accept="video/*"
              @change="handleFileSelect"
            >
            <div class="space-y-4">
              <div class="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <i class="fas fa-cloud-upload-alt text-3xl text-blue-500"></i>
              </div>
              <div>
                <h3 class="text-lg font-medium">Drag and drop videos to upload</h3>
                <p class="text-gray-500 dark:text-gray-400 mt-1">
                  Your videos will be private until you publish them
                </p>
              </div>
              <button class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors">
                Select Files
              </button>
              <p class="text-xs text-gray-400">
                MP4, WebM, or MOV. Up to 10 minutes. Less than 2 GB. At least 240p.
              </p>
            </div>
          </div>

          <div v-if="uploadProgress > 0" class="mt-6">
            <div class="flex justify-between text-sm mb-1">
              <span>Uploading...</span>
              <span>{{ Math.round(uploadProgress) }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface Video {
  id: string;
  title: string;
  channel: string;
  views: string;
  date: string;
  duration: string;
  thumbnail: string;
  avatar: string;
}

// Refs
const searchQuery = ref('');
const activeFilter = ref('All');
const isLoading = ref(false);
const videos = ref<Video[]>([]);
const showUploadModal = ref(false);
const isDragging = ref(false);
const uploadProgress = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);

// Filters
const filters = ['All', 'Today', 'This week', 'This month', 'This year'];

// Mock data for demonstration
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Amazing Sunset at the Beach - 4K Drone Footage',
    channel: 'Nature Lovers',
    views: '1.2M',
    date: '2 days ago',
    duration: '4:32',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    title: 'How to Make Perfect Pasta - Quick & Easy Recipe',
    channel: 'Cooking Master',
    views: '856K',
    date: '1 week ago',
    duration: '12:45',
    thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81111?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: '3',
    title: 'Morning Yoga Routine for Beginners - 15 Minutes',
    channel: 'Yoga with Sarah',
    views: '2.3M',
    date: '3 weeks ago',
    duration: '15:20',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '4',
    title: 'Top 10 Travel Destinations for 2023',
    channel: 'Wanderlust',
    views: '3.1M',
    date: '1 month ago',
    duration: '8:56',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: '5',
    title: 'Learn JavaScript in 1 Hour - Full Beginner\'s Tutorial',
    channel: 'CodeMaster',
    views: '1.8M',
    date: '2 months ago',
    duration: '1:02:45',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '6',
    title: 'DIY Home Decoration Ideas on a Budget',
    channel: 'Home & Living',
    views: '745K',
    date: '3 months ago',
    duration: '18:12',
    thumbnail: 'https://images.unsplash.com/photo-1583847268964-28d60b8f6e5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: '7',
    title: '10-Minute Ab Workout - No Equipment Needed',
    channel: 'Fitness Pro',
    views: '1.5M',
    date: '4 months ago',
    duration: '10:30',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c6c68685a0e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: '8',
    title: 'Photography Tips for Beginners - Master Your Camera',
    channel: 'Photo Masters',
    views: '2.7M',
    date: '5 months ago',
    duration: '22:15',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  }
];

// Computed
const filteredVideos = computed(() => {
  if (!searchQuery.value) return videos.value;
  
  const query = searchQuery.value.toLowerCase();
  return videos.value.filter(video => 
    video.title.toLowerCase().includes(query) || 
    video.channel.toLowerCase().includes(query)
  );
});

// Methods
const searchVideos = () => {
  if (!searchQuery.value.trim()) {
    // If search is empty, show all videos
    videos.value = [...mockVideos];
    return;
  }
  
  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    const query = searchQuery.value.toLowerCase();
    videos.value = mockVideos.filter(video => 
      video.title.toLowerCase().includes(query) || 
      video.channel.toLowerCase().includes(query)
    );
    isLoading.value = false;
  }, 800);
};

const openUploadModal = () => {
  showUploadModal.value = true;
};

const selectFile = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadFile(target.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    uploadFile(event.dataTransfer.files[0]);
  }
};

const uploadFile = (file: File) => {
  // Check file type
  if (!file.type.startsWith('video/')) {
    alert('Please upload a video file');
    return;
  }
  
  // Check file size (max 2GB)
  if (file.size > 2 * 1024 * 1024 * 1024) {
    alert('File size should be less than 2GB');
    return;
  }
  
  // Simulate upload progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Add to videos after upload
      setTimeout(() => {
        const newVideo: Video = {
          id: (mockVideos.length + 1).toString(),
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          channel: 'You',
          views: '0',
          date: 'Just now',
          duration: '0:00',
          thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
        };
        
        videos.value.unshift(newVideo);
        showUploadModal.value = false;
        uploadProgress.value = 0;
      }, 500);
    }
    uploadProgress.value = progress;
  }, 200);
};

// Lifecycle
onMounted(() => {
  // Load initial videos
  videos.value = [...mockVideos];
});
</script>