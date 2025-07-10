<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import CardBookmark from "~/components/CardBookmark.vue";
import { Tag } from "~/components/primitive";
import Search from "~/components/Search.vue";
import Button from "~/components/Button.vue"; // Import Button component
import type { Bookmark, Tag as TagType } from "~/types/bookmark";

const STORAGE_KEY = "bookmarks";

// Mock data - ควรดึงจาก API จริงในอนาคต
const bookmarks = ref<Bookmark[]>([]);
const searchQuery = ref("");
const activeTag = ref<string | null>("all"); // เริ่มต้นด้วย all

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

// ฟังก์ชันคำนวณจำนวนบุ๊กมาร์กสำหรับแต่ละแท็ก
const getBookmarkCountForTag = (tagId: string) => {
	return bookmarks.value.filter((bookmark) =>
		bookmark.tags?.some((tag) => tag.id === tagId),
	).length;
};

// คำนวณรายการบุ๊กมาร์กที่ผ่านการกรอง
const filteredBookmarks = computed(() => {
	if (activeTag.value === "all") return bookmarks.value;
	if (!activeTag.value) return bookmarks.value;
	return bookmarks.value.filter((bookmark) =>
		bookmark.tags?.some((tag) => tag.id === activeTag.value),
	);
});

// Load bookmarks from local storage
const loadBookmarks = () => {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) {
		bookmarks.value = JSON.parse(saved);
	} else {
		// Default mock data if no saved bookmarks
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
	}
};

// Save bookmarks to local storage
const saveBookmarks = () => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value));
};

// Load bookmarks when component mounts
onMounted(() => {
	loadBookmarks();
});

const showModal = ref(false);
const newBookmark = ref({
	url: "",
	title: "",
	description: "",
	tags: [],
});

const openAddBookmarkModal = () => {
	showModal.value = true;
};

const addBookmark = () => {
	if (!newBookmark.value.url || !newBookmark.value.title) {
		alert("Please fill in required fields");
		return;
	}

	// Extract domain from URL
	let domain = "";
	try {
		domain = new URL(newBookmark.value.url).hostname.replace("www.", "");
	} catch (e) {
		domain = "unknown";
	}

	const bookmark: Bookmark = {
		id: Date.now().toString(),
		title: newBookmark.value.title,
		url: newBookmark.value.url,
		domain,
		description: newBookmark.value.description || "",
		favicon: `https://${domain}/favicon.ico`,
		tags: [], // Can implement tag adding later
	};

	bookmarks.value.unshift(bookmark);
	saveBookmarks();

	showModal.value = false;
	newBookmark.value = { url: "", title: "", description: "", tags: [] };
};

// State สำหรับแก้ไข bookmark
const selectedBookmark = ref<Bookmark | null>(null);
const showEditModal = ref(false);

// ฟังก์ชันเปิด modal แก้ไข
const openEditModal = (bookmark: Bookmark) => {
	selectedBookmark.value = bookmark;
	showEditModal.value = true;
};

// ฟังก์ชันบันทึกการแก้ไข
const saveEditedBookmark = () => {
	if (!selectedBookmark.value) return;

	const index = bookmarks.value.findIndex(
		(b) => b.id === selectedBookmark.value?.id,
	);
	if (index !== -1) {
		bookmarks.value[index] = { ...selectedBookmark.value };
		saveBookmarks();
	}

	showEditModal.value = false;
	selectedBookmark.value = null;
};

const openInNewTab = (url: string) => {
	window.open(url, "_blank", "noopener,noreferrer");
};

const handleEditBookmark = (bookmark: Bookmark) => {
	openEditModal(bookmark);
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Search and Add Bookmark -->
    <div class="flex justify-end mb-6">
      <button 
        @click="openAddBookmarkModal"
        class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        <div class="i-mdi-plus"></div>
        <span>Add Bookmark</span>
      </button>
    </div>

    <!-- Add Bookmark Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add New Bookmark</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input 
              v-model="newBookmark.url"
              type="text" 
              placeholder="https://example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              v-model="newBookmark.title"
              type="text" 
              placeholder="My Bookmark"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input 
              v-model="newBookmark.description"
              type="text" 
              placeholder="Description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div class="flex justify-end gap-2 pt-4">
            <button 
              @click="showModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button 
              @click="addBookmark"
              class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
            >
              Save Bookmark
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal แก้ไข bookmark ชิดขวา -->
    <div v-if="showEditModal && selectedBookmark" class="fixed inset-0 z-50 flex justify-end">
      <!-- Overlay -->
      <div 
        class="absolute inset-0 bg-black/50"
        @click="showEditModal = false"
      ></div>
      
      <!-- เนื้อหา modal -->
      <div class="relative w-full max-w-md h-full bg-background flex flex-col overflow-hidden">
        <div class="p-6 border-b border-border">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Edit Bookmark</h2>
            <button 
              @click="showEditModal = false"
              class="p-1 rounded-full hover:bg-muted"
            >
              <span class="i-mdi-close" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input 
                v-model="selectedBookmark.url"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                v-model="selectedBookmark.title"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input 
                v-model="selectedBookmark.description"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t border-border flex justify-end gap-2">
          <button 
            @click="showEditModal = false"
            class="px-4 py-2 border border-border rounded-md"
          >
            Cancel
          </button>
          <button 
            @click="saveEditedBookmark"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- All Tags -->
    <div class="mb-6">
      <h2 class="text-lg font-medium mb-3">All Tags</h2>
      <div class="flex flex-wrap gap-2 items-center mb-4">
        <Tag 
          :name="`all (${filteredBookmarks.length})`"
          :active="activeTag === 'all'"
          :clickable="true"
          active-bg-color="bg-color-primary"
          active-text-color="text-white"
          inactive-bg-color="bg-block/80"
          inactive-text-color="text-text/70"
          class="transition-all duration-200"
          @click="setActiveTag('all')"
        />
        <Tag 
          v-for="tag in getAllTags()" 
          :key="tag.id"
          :name="`${tag.name} (${getBookmarkCountForTag(tag.id)})`"
          :active="tag.id === activeTag"
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
        :show-edit-button="true"
        @click="openInNewTab(bookmark.url)"
        @edit-click="handleEditBookmark"
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
  </div>
</template>
