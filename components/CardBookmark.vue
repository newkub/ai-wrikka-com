<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Tag } from "~/components/primitive";
import type { Bookmark } from "~/types/bookmark";

interface Props {
	bookmark: Bookmark;
	showEditButton?: boolean;
}

interface Emits {
	(e: "click", bookmark: Bookmark): void;
	(e: "menu-click", event: MouseEvent): void;
	(e: "edit-click", bookmark: Bookmark): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const ogImage = ref<string | null>(null);
const imageError = ref(false);

// ฟังก์ชันสำหรับดึงรูปภาพจาก OpenGraph/Twitter Card
const fetchOgImage = async (url: string) => {
	try {
		// ใช้ CORS proxy เพื่อหลีกเลี่ยงปัญหา CORS
		const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
		const response = await fetch(proxyUrl);
		const html = await response.text();

		// สร้าง DOM parser เพื่ออ่าน HTML
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");

		// ค้นหา OpenGraph image
		const ogImageEl =
			doc.querySelector('meta[property="og:image"]') ||
			doc.querySelector('meta[name="twitter:image"]');

		if (ogImageEl) {
			const imageUrl = ogImageEl.getAttribute("content");
			if (imageUrl) {
				// แปลงเป็น absolute URL ถ้าจำเป็น
				try {
					const baseUrl = new URL(url);
					const absoluteUrl = new URL(imageUrl, baseUrl.origin);
					ogImage.value = absoluteUrl.toString();
				} catch (e) {
					console.error("Error creating image URL:", e);
					ogImage.value = imageUrl;
				}
			}
		}
	} catch (error) {
		console.error("Error fetching OG image:", error);
	}
};

// ฟังก์ชันจัดการเมื่อโหลดรูปภาพไม่สำเร็จ
const handleImageError = () => {
	imageError.value = true;
	ogImage.value = null;
};

// ดึงรูปภาพเมื่อ component ถูก mount
onMounted(() => {
	if (!props.bookmark.image && props.bookmark.url) {
		fetchOgImage(props.bookmark.url);
	}
});
</script>


<template>
  <div 
    class="bg-block rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full group cursor-pointer"
    @click="$emit('click', props.bookmark)"
  >
    <!-- Bookmark Image/Gradient -->
    <div 
      class="h-40 relative overflow-hidden"
      :class="bookmark.gradient ? `bg-gradient-to-r ${bookmark.gradient.from} ${bookmark.gradient.to}` : 'bg-gray-100'"
    >
      <!-- Main Image -->
      <img 
        v-if="bookmark.image"
        :src="bookmark.image" 
        :alt="bookmark.title" 
        class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        @error="handleImageError"
      />
      
      <!-- Fallback to OpenGraph/Twitter image -->
      <img 
        v-else-if="ogImage"
        :src="ogImage" 
        :alt="bookmark.title" 
        class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        @error="handleImageError"
      />
      
      <!-- Fallback to gradient background if no image -->
      <div 
        v-else
        class="w-full h-full"
        :class="bookmark.gradient ? `bg-gradient-to-r ${bookmark.gradient.from} ${bookmark.gradient.to}` : 'bg-gray-100'"
      />

      <!-- Image overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <!-- Actions -->
      <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          class="p-1.5 bg-white/20 backdrop-blur-sm rounded-full shadow hover:bg-white/30 transition-colors"
          @click.stop="$emit('menu-click', $event)"
        >
          <i class="i-mdi-dots-vertical w-4 h-4" :class="{ 'text-white': bookmark.gradient || ogImage, 'text-gray-700': !bookmark.gradient && !ogImage }"></i>
        </button>
        <button 
          v-if="props.showEditButton"
          class="p-1.5 bg-white/20 backdrop-blur-sm rounded-full shadow hover:bg-white/30 transition-colors"
          @click.stop="$emit('edit-click', bookmark)"
        >
          <i class="i-mdi-pencil w-4 h-4" :class="{ 'text-white': bookmark.gradient || ogImage, 'text-gray-700': !bookmark.gradient && !ogImage }"></i>
        </button>
      </div>
    </div>
    
    <!-- Bookmark Content -->
    <div class="p-4 flex-1 flex flex-col bg-block/50">
      <div class="flex items-center mb-2">
        <img 
          :src="bookmark.favicon" 
          :alt="bookmark.domain" 
          class="w-4 h-4 mr-2"
          onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMC01LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTEgMTdoLTJ2LTloMnY5em0wLTEzaC0ydjZoMnYtNnoiLz48L3N2Zz4='"
        />
        <h3 class="font-medium text-sm text-gray-500 truncate">{{ bookmark.domain }}</h3>
      </div>
      
      <a 
        :href="bookmark.url" 
        target="_blank" 
        rel="noopener noreferrer"
        class="font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
        :title="bookmark.title"
      >
        {{ bookmark.title }}
      </a>
      
      <p 
        v-if="bookmark.description" 
        class="text-sm line-clamp-2 mb-3 flex-1"
      >
        {{ bookmark.description }}
      </p>
      
      <div class="flex flex-wrap gap-2">
        <Tag 
          v-for="tag in bookmark.tags" 
          :key="tag.id"
          :name="tag.name"
          :bg-color="tag.bgColor"
          :color="tag.color"
        />
      </div>
    </div>
  </div>
</template>