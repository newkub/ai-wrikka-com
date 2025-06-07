<template>
  <div>
    <!-- Header -->
    <header class="bg-block border-b border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Bookmarks</h1>
          <button class="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
            Add Bookmark
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Search and Filter -->
      <Search
        v-model="searchQuery"
        :tags="getAllTags()"
        :active-tag="activeTag"
        placeholder="Search bookmarks..."
        @tag-click="setActiveTag"
      />

      <!-- All Tags -->
      <div class="mb-6">
        <h2 class="text-lg font-medium mb-3">All Tags</h2>
        <div class="flex flex-wrap gap-2">
          <Tag 
            v-for="tag in getAllTags()" 
            :key="tag.id"
            :name="tag.name"
            :active="activeTag === tag.id"
            :clickable="true"
            active-bg-color="bg-color-primary"
            active-text-color="text-white"
            inactive-bg-color="bg-block/80"
            inactive-text-color="text-text/70"
            class="transition-all duration-200"
            @click="setActiveTag(tag.id === activeTag ? null : tag.id)"
          />
        </div>
      </div>

      <!-- Bookmark Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CardBookmark 
          v-for="bookmark in filteredBookmarks" 
          :key="bookmark.id"
          :bookmark="bookmark"
        />
        
        <!-- Empty State -->
        <div 
          v-if="filteredBookmarks.length === 0"
          class="col-span-full py-12 text-gray-500"
        >
          <i class="i-mdi-bookmark-outline text-4xl mx-auto mb-4"></i>
          <p class="text-lg font-medium">No bookmarks found</p>
          <p v-if="searchQuery || activeTag" class="text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Search from "~/components/Search.vue";
import CardBookmark from "~/components/CardBookmark.vue";
import { Tag } from "~/components/primitive";
import type { Bookmark, Tag as TagType } from "~/types/bookmark";

// Mock data - ควรดึงจาก API จริงในอนาคต
const bookmarks = ref<Bookmark[]>([]);
const searchQuery = ref("");
const activeTag = ref<string | null>(null);

// ฟังก์ชันสำหรับดึงแท็กทั้งหมดที่มีอยู่ในรายการบุ๊กมาร์ก
const getAllTags = (): TagType[] => {
	const tagMap = new Map<string, TagType>();

	for (const bookmark of bookmarks.value) {
		for (const tag of bookmark.tags) {
			if (!tagMap.has(tag.id)) {
				tagMap.set(tag.id, { ...tag });
			}
		}
	}

	return Array.from(tagMap.values());
};

// ฟังก์ชันสำหรับตั้งค่าแท็กที่กำลังใช้งาน
const setActiveTag = (tagId: string | null) => {
	activeTag.value = tagId;
};

// คำนวณรายการบุ๊กมาร์กที่ผ่านการกรอง
const filteredBookmarks = computed(() => {
	return bookmarks.value.filter((bookmark) => {
		// กรองด้วยคำค้นหา
		const matchesSearch =
			searchQuery.value === "" ||
			bookmark.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			bookmark.description
				?.toLowerCase()
				.includes(searchQuery.value.toLowerCase()) ||
			bookmark.tags.some((tag) =>
				tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
			);

		// กรองด้วยแท็ก
		const matchesTag =
			!activeTag.value ||
			bookmark.tags.some((tag) => tag.id === activeTag.value);

		return matchesSearch && matchesTag;
	});
});

// TODO: ควรดึงข้อมูลจาก API จริง
// ตัวอย่างข้อมูลจำลอง
bookmarks.value = [
	{
		id: "1",
		title: "Vue.js",
		url: "https://vuejs.org/",
		domain: "vuejs.org",
		description: "The Progressive JavaScript Framework",
		favicon: "https://vuejs.org/logo.svg",
		tags: [
			{
				id: "frontend",
				name: "Frontend",
				color: "#42b883",
				bgColor: "#42b8831a",
			},
			{
				id: "framework",
				name: "Framework",
				color: "#34495e",
				bgColor: "#34495e1a",
			},
		],
	},
	{
		id: "2",
		title: "Nuxt",
		url: "https://nuxt.com/",
		domain: "nuxt.com",
		description: "The Intuitive Vue Framework",
		favicon: "https://nuxt.com/icon.png",
		tags: [
			{
				id: "frontend",
				name: "Frontend",
				color: "#42b883",
				bgColor: "#42b8831a",
			},
			{ id: "ssr", name: "SSR", color: "#2c3e50", bgColor: "#2c3e501a" },
		],
	},
];
</script>
