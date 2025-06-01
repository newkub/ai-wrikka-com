<script setup lang="ts">
import { useBookmarkStore, type Bookmark } from "~/stores/bookmark";

definePageMeta({
	layout: "default",
});

const bookmarkStore = useBookmarkStore();

// State
const selectedCollection = ref<string>("All");
const selectedTags = ref<string[]>([]);
const searchQuery = ref<string>("");
const viewMode = ref<"grid" | "list">("grid");
const showAddModal = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const currentBookmarkId = ref<string | null>(null);

// Grouping and Sorting
const groupBy = ref<"none" | "date" | "collection" | "tag">("none");
const sortBy = ref<"date" | "title" | "url" | "collection">("date");
const sortDirection = ref<"asc" | "desc">("desc");

// Grouping options
const groupOptions = [
	{ value: "none", label: "No Grouping", icon: "i-ri-apps-line" },
	{ value: "date", label: "Group by Date", icon: "i-ri-calendar-line" },
	{
		value: "collection",
		label: "Group by Collection",
		icon: "i-ri-folder-line",
	},
	{ value: "tag", label: "Group by Tag", icon: "i-ri-price-tag-3-line" },
];

// Sort options
const sortOptions = [
	{ value: "date", label: "Date", icon: "i-ri-calendar-line" },
	{ value: "title", label: "Title", icon: "i-ri-text" },
	{ value: "url", label: "URL", icon: "i-ri-link" },
	{ value: "collection", label: "Collection", icon: "i-ri-folder-line" },
];

// New bookmark form
const newBookmark = ref<Partial<Bookmark>>({
	title: "",
	url: "",
	description: "",
	tags: [],
	collection: "Uncategorized",
	isRead: false,
	isFavorite: false,
});

// Temp tag input
const tagInput = ref<string>("");

// Computed
const filteredBookmarks = computed(() => {
	let result = bookmarkStore.bookmarks;

	// Filter by collection
	if (selectedCollection.value !== "All") {
		result = result.filter(
			(bookmark) => bookmark.collection === selectedCollection.value,
		);
	}

	// Filter by tags
	if (selectedTags.value.length > 0) {
		result = result.filter((bookmark) =>
			selectedTags.value.every((tag) => bookmark.tags.includes(tag)),
		);
	}

	// Search by title, url or description
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(
			(bookmark) =>
				bookmark.title.toLowerCase().includes(query) ||
				bookmark.url.toLowerCase().includes(query) ||
				bookmark.description?.toLowerCase().includes(query),
		);
	}

	return result;
});

// Group bookmarks
const groupedBookmarks = computed(() => {
	const bookmarks = [...filteredBookmarks.value];

	// Sort bookmarks first
	const sortedBookmarks = bookmarks.sort((a, b) => {
		let valueA: string | number;
		let valueB: string | number;

		if (sortBy.value === "date") {
			valueA = new Date(a.updatedAt).getTime();
			valueB = new Date(b.updatedAt).getTime();
		} else if (sortBy.value === "title") {
			valueA = a.title.toLowerCase();
			valueB = b.title.toLowerCase();
		} else if (sortBy.value === "collection") {
			valueA = a.collection.toLowerCase();
			valueB = b.collection.toLowerCase();
		} else {
			valueA = a.url.toLowerCase();
			valueB = b.url.toLowerCase();
		}

		return sortDirection.value === "asc"
			? valueA > valueB
				? 1
				: -1
			: valueA < valueB
				? 1
				: -1;
	});

	// Group if needed
	if (groupBy.value === "none") {
		return { "All Bookmarks": sortedBookmarks };
	}

	const groups: Record<string, typeof sortedBookmarks> = {};

	for (const bookmark of sortedBookmarks) {
		let groupKey = "Uncategorized";

		if (groupBy.value === "date") {
			const date = new Date(bookmark.updatedAt);
			groupKey = date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} else if (groupBy.value === "collection") {
			groupKey = bookmark.collection || "Uncategorized";
		} else if (groupBy.value === "tag") {
			if (bookmark.tags.length === 0) {
				groupKey = "No Tags";
			} else {
				// For tag grouping, we'll create a group for each tag
				for (const tag of bookmark.tags) {
					if (!groups[tag]) groups[tag] = [];
					groups[tag].push(bookmark);
				}
				return; // Skip the default push
			}
		}

		if (groupKey) {
			if (!groups[groupKey]) {
				groups[groupKey] = [];
			}
			groups[groupKey].push(bookmark);
		}
	}

	// Sort groups
	const sortedGroups: Record<string, typeof sortedBookmarks> = {};
	for (const key of Object.keys(groups).sort()) {
		sortedGroups[key] = groups[key];
	}

	return sortedGroups;
});

// Methods
const addTag = () => {
	if (tagInput.value && !newBookmark.value.tags?.includes(tagInput.value)) {
		if (!newBookmark.value.tags) {
			newBookmark.value.tags = [];
		}
		newBookmark.value.tags.push(tagInput.value);
		tagInput.value = "";
	}
};

const removeTag = (tag: string) => {
	if (newBookmark.value.tags) {
		newBookmark.value.tags = newBookmark.value.tags.filter((t) => t !== tag);
	}
};

const toggleTagFilter = (tag: string) => {
	if (selectedTags.value.includes(tag)) {
		selectedTags.value = selectedTags.value.filter((t) => t !== tag);
	} else {
		selectedTags.value.push(tag);
	}
};

const openAddModal = () => {
	isEditing.value = false;
	currentBookmarkId.value = null;
	newBookmark.value = {
		title: "",
		url: "",
		description: "",
		tags: [],
		collection: "Uncategorized",
		isRead: false,
		isFavorite: false,
	};
	showAddModal.value = true;
};

const openEditModal = (bookmark: Bookmark) => {
	isEditing.value = true;
	currentBookmarkId.value = bookmark.id;
	newBookmark.value = {
		title: bookmark.title,
		url: bookmark.url,
		description: bookmark.description || "",
		tags: [...bookmark.tags],
		collection: bookmark.collection,
		isRead: bookmark.isRead,
		isFavorite: bookmark.isFavorite,
	};
	showAddModal.value = true;
};

const closeAddModal = () => {
	showAddModal.value = false;
};

const saveBookmark = () => {
	if (newBookmark.value.title && newBookmark.value.url) {
		if (isEditing.value && currentBookmarkId.value) {
			bookmarkStore.updateBookmark(
				currentBookmarkId.value,
				newBookmark.value as Partial<
					Omit<Bookmark, "id" | "createdAt" | "updatedAt">
				>,
			);
		} else {
			bookmarkStore.addBookmark(
				newBookmark.value as Omit<Bookmark, "id" | "createdAt" | "updatedAt">,
			);
		}
		showAddModal.value = false;
	}
};

const toggleFavorite = (id: string) => {
	bookmarkStore.toggleFavorite(id);
};

const toggleRead = (id: string) => {
	bookmarkStore.toggleRead(id);
};

const deleteBookmark = (id: string) => {
	if (confirm("Are you sure you want to delete this bookmark?")) {
		bookmarkStore.deleteBookmark(id);
	}
};

const changeSortOrder = (field: "date" | "title" | "url" | "collection") => {
	if (sortBy.value === field) {
		sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
	} else {
		sortBy.value = field;
		sortDirection.value = "desc";
	}
};

// Helper functions
const getTimeAgo = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 60) return "just now";

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

	const months = Math.floor(days / 30);
	if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

	const years = Math.floor(months / 12);
	return `${years} year${years > 1 ? "s" : ""} ago`;
};

const extractDomain = (url: string) => {
	try {
		const domain = new URL(url).hostname;
		return domain.replace("www.", "");
	} catch {
		return url;
	}
};
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- Top Navigation -->
    <div class="bg-slate-50 border-b border-slate-200 p-4">
      <!-- Collections Row -->
      <div class="mb-4">
        <h2 class="text-xl font-bold text-slate-900 mb-6">{{ isEditing ? 'Edit Bookmark' : 'Add New Bookmark' }}</h2>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="collection in bookmarkStore.collections" 
            :key="collection"
            @click="selectedCollection = collection"
            class="flex items-center px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap"
            :class="selectedCollection === collection 
              ? 'bg-blue-50 text-blue-600 border border-blue-200' 
              : 'bg-white border border-slate-200 hover:bg-slate-50'"
          >
            <span class="mr-2">
              <i :class="collection !== 'All' ? 'i-ri-folder-line' : 'i-ri-apps-line'" class="text-sm"></i>
            </span>
            <span class="mr-1.5">{{ collection }}</span>
            <span 
              class="rounded-full px-1.5 py-0.5 text-xs min-w-[20px] text-center"
              :class="selectedCollection === collection 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-slate-100 text-slate-600'"
            >
              {{ collection === 'All' 
                ? bookmarkStore.bookmarks.length 
                : bookmarkStore.bookmarks.filter(b => b.collection === collection).length }}
            </span>
          </button>
        </div>
      </div>
      
      <!-- Tags Row -->
      <div>
        <h3 class="text-sm font-medium text-slate-500 mb-2">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="tag in bookmarkStore.allTags" 
            :key="tag"
            @click="toggleTagFilter(tag)"
            class="flex items-center px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap"
            :class="selectedTags.includes(tag)
              ? 'bg-blue-50 text-blue-600 border border-blue-200' 
              : 'bg-white border border-slate-200 hover:bg-slate-50'"
          >
            <i class="i-ri-price-tag-3-line text-sm mr-1.5"></i>
            <span>{{ tag }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="flex justify-between items-center mb-8 gap-4">
        <div class="relative flex-1 max-w-md">
          <i class="i-ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search bookmarks..." 
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex border border-slate-200 rounded-md overflow-hidden">
            <button 
              @click="viewMode = 'grid'" 
              class="p-2 transition-colors"
              :class="viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-slate-500 hover:bg-slate-50'"
            >
              <i class="i-ri-grid-line"></i>
            </button>
            <button 
              @click="viewMode = 'list'" 
              class="p-2 transition-colors"
              :class="viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-slate-500 hover:bg-slate-50'"
            >
              <i class="i-ri-list-check"></i>
            </button>
          </div>
          
          <button 
            @click="openAddModal"
            class="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <i class="i-ri-add-line mr-2"></i>
            <span>Add</span>
          </button>
        </div>
      </div>
      
      <!-- Group and Sort Controls -->
      <div class="flex flex-wrap gap-3 items-center">
        <!-- Group By -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-600">Group by:</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="option in groupOptions"
              :key="option.value"
              @click="groupBy = option.value as any"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors"
              :class="groupBy === option.value 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'"
              :title="option.label"
            >
              <i :class="option.icon"></i>
              <span class="hidden sm:inline">{{ option.label }}</span>
            </button>
          </div>
        </div>

        <!-- Sort By -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-600">Sort by:</span>
          <div class="flex items-center gap-1">
            <select 
              v-model="sortBy"
              class="text-sm rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <button 
              @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'"
              class="p-1.5 rounded-md hover:bg-slate-100"
              :title="sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'"
            >
              <i :class="sortDirection === 'asc' ? 'i-ri-sort-asc' : 'i-ri-sort-desc'"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Grouped View -->
      <div v-if="groupBy !== 'none'" class="space-y-8">
        <div v-for="(bookmarks, group) in groupedBookmarks || {}" :key="group" class="space-y-4">
          <h3 class="text-lg font-medium text-slate-800 flex items-center gap-2">
            <template v-if="groupBy === 'date'">
              <i class="i-ri-calendar-line text-blue-500"></i>
              {{ group }}
            </template>
            <template v-else-if="groupBy === 'collection'">
              <i class="i-ri-folder-line text-blue-500"></i>
              {{ group }}
            </template>
            <template v-else-if="groupBy === 'tag'">
              <i class="i-ri-price-tag-3-line text-blue-500"></i>
              {{ group }}
            </template>
            <span class="text-sm font-normal text-slate-500 ml-1">
              ({{ bookmarks.length }} {{ bookmarks.length === 1 ? 'item' : 'items' }})
            </span>
          </h3>
          
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            <div 
              v-for="bookmark in bookmarks" 
              :key="bookmark.id" 
              class="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
          <div class="flex justify-between items-center p-3 border-b border-slate-100 bg-slate-50">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 flex items-center justify-center text-slate-500">
                <img v-if="bookmark.favicon" :src="bookmark.favicon" :alt="bookmark.title" class="w-full h-full object-contain" />
                <i v-else class="i-ri-global-line text-lg"></i>
              </div>
              <button 
                @click.stop="openEditModal(bookmark)" 
                class="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                title="Edit bookmark"
              >
                <i class="i-ri-edit-line text-xs"></i>
                <span>Edit</span>
              </button>
            </div>
            <div class="flex gap-2">
              <button 
                @click.stop="toggleFavorite(bookmark.id)" 
                class="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-200"
                :class="bookmark.isFavorite ? 'text-yellow-500 hover:bg-yellow-50' : 'text-slate-500 hover:bg-slate-100'"
                :title="bookmark.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
              >
                <i :class="bookmark.isFavorite ? 'i-ri-star-fill' : 'i-ri-star-line'"></i>
              </button>
              <button 
                @click.stop="toggleRead(bookmark.id)" 
                class="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-200"
                :class="bookmark.isRead ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-500 hover:bg-slate-100'"
                :title="bookmark.isRead ? 'Mark as unread' : 'Mark as read'"
              >
                <i :class="bookmark.isRead ? 'i-ri-check-double-line' : 'i-ri-check-line'"></i>
              </button>
              <button 
                @click.stop="deleteBookmark(bookmark.id)" 
                class="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                title="Delete bookmark"
              >
                <i class="i-ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
          
          <a :href="bookmark.url" target="_blank" class="flex flex-col flex-grow p-4 no-underline text-inherit">
            <div v-if="bookmark.image" class="w-full h-36 mb-3 rounded-lg bg-slate-50 overflow-hidden">
              <img :src="bookmark.image" :alt="bookmark.title" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col flex-grow">
              <h3 class="font-medium text-slate-900 mb-2 line-clamp-2 leading-snug">
                {{ bookmark.title }}
              </h3>
              <p v-if="bookmark.description" class="text-sm text-slate-500 mb-3 line-clamp-3 leading-relaxed">
                {{ bookmark.description }}
              </p>
              <div class="flex items-center gap-2 text-xs text-slate-400 mt-auto">
                <div class="text-blue-500 truncate">{{ extractDomain(bookmark.url) }}</div>
                <div class="whitespace-nowrap">{{ getTimeAgo(bookmark.updatedAt) }}</div>
              </div>
            </div>
          </a>
          
          <div class="p-3 border-t border-slate-100 flex justify-between items-center gap-3">
            <div class="flex flex-wrap gap-1.5 flex-1 min-w-0">
              <span 
                v-for="tag in bookmark.tags.slice(0, 3)" 
                :key="tag"
                class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                @click.stop="toggleTagFilter(tag)"
              >
                {{ tag }}
              </span>
              <span v-if="bookmark.tags.length > 3" class="text-xs text-slate-400 self-center">
                +{{ bookmark.tags.length - 3 }}
              </span>
            </div>
            <div class="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
              {{ bookmark.collection }}
            </div>
          </div>
        </div>
        
        <div v-if="filteredBookmarks.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center text-slate-400">
          <i class="i-ri-inbox-line text-5xl opacity-50 mb-4"></i>
          <p>No bookmarks found</p>
        </div>
      </div>
      
        </div>
      </div>
      
      <!-- List View -->
      <div v-else class="flex flex-col gap-2 w-full">
        <div 
          v-for="bookmark in (groupedBookmarks || {'All Bookmarks': []})['All Bookmarks']" 
          :key="bookmark.id" 
          class="bg-white rounded-lg border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow duration-200">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <div class="w-5 h-5 flex-shrink-0 flex items-center justify-center text-slate-400 mt-0.5">
              <img v-if="bookmark.favicon" :src="bookmark.favicon" :alt="bookmark.title" class="w-full h-full object-contain" />
              <i v-else class="i-ri-global-line text-base"></i>
            </div>
            <div class="min-w-0">
              <a 
                :href="bookmark.url" 
                target="_blank" 
                class="text-slate-900 font-medium hover:text-blue-600 hover:underline block truncate"
              >
                {{ bookmark.title }}
              </a>
              <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
                <span class="text-blue-500 truncate">{{ extractDomain(bookmark.url) }}</span>
                <span class="text-slate-300">•</span>
                <span class="text-slate-400">{{ bookmark.collection }}</span>
                <span class="text-slate-300">•</span>
                <span class="text-slate-400">{{ getTimeAgo(bookmark.updatedAt) }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 sm:ml-auto">
            <div class="flex flex-wrap gap-1.5 mr-2">
              <span 
                v-for="tag in bookmark.tags.slice(0, 2)" 
                :key="tag"
                class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap cursor-pointer hover:bg-slate-200 transition-colors duration-200"
                @click.stop="toggleTagFilter(tag)"
              >
                {{ tag }}
              </span>
              <span v-if="bookmark.tags.length > 2" class="text-xs text-slate-400 self-center">
                +{{ bookmark.tags.length - 2 }}
              </span>
            </div>
            
            <div class="flex items-center gap-1 border-l border-slate-100 pl-2">
              <button 
                @click="toggleFavorite(bookmark.id)" 
                class="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-200"
                :class="bookmark.isFavorite ? 'text-yellow-500 hover:bg-yellow-50' : 'text-slate-500 hover:bg-slate-100'"
              >
                <i :class="bookmark.isFavorite ? 'i-ri-star-fill' : 'i-ri-star-line'" class="text-base"></i>
              </button>
              <button 
                @click="toggleRead(bookmark.id)" 
                class="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-200"
                :class="bookmark.isRead ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-500 hover:bg-slate-100'"
              >
                <i :class="bookmark.isRead ? 'i-ri-check-double-line' : 'i-ri-check-line'" class="text-base"></i>
              </button>
              <button 
                @click="deleteBookmark(bookmark.id)" 
                class="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
              >
                <i class="i-ri-delete-bin-line text-base"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredBookmarks.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center text-slate-400">
          <i class="i-ri-inbox-line text-5xl opacity-50 mb-4"></i>
          <p>No bookmarks found</p>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Bookmark Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 class="text-lg font-medium text-slate-900">{{ isEditing ? 'Edit Bookmark' : 'Add New Bookmark' }}</h2>
          <button 
            @click="closeAddModal" 
            class="p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <i class="i-ri-close-line text-xl text-slate-500"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label for="url" class="block text-sm font-medium text-slate-700 mb-1">URL</label>
            <input 
              type="url" 
              id="url" 
              v-model="newBookmark.url" 
              placeholder="https://example.com" 
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label for="title" class="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              type="text" 
              id="title" 
              v-model="newBookmark.title" 
              placeholder="Page title" 
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              id="description" 
              v-model="newBookmark.description" 
              placeholder="Optional description"
              rows="3"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          
          <div>
            <label for="collection" class="block text-sm font-medium text-slate-700 mb-1">Collection</label>
            <select 
              id="collection" 
              v-model="newBookmark.collection"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option 
                v-for="collection in bookmarkStore.collections.filter(c => c !== 'All')" 
                :key="collection" 
                :value="collection"
              >
                {{ collection }}
              </option>
              <option value="Uncategorized">Uncategorized</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Tags</label>
            <div class="flex border border-slate-300 rounded-md overflow-hidden">
              <input 
                type="text" 
                v-model="tagInput" 
                @keyup.enter="addTag" 
                placeholder="Add tag and press Enter"
                class="flex-1 px-3 py-2 focus:outline-none"
              />
              <button 
                @click="addTag" 
                class="px-3 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <i class="i-ri-add-line"></i>
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span 
                v-for="tag in newBookmark.tags" 
                :key="tag" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ tag }}
                <button 
                  @click.stop="removeTag(tag)" 
                  class="ml-1.5 text-blue-600 hover:text-blue-900"
                >
                  <i class="i-ri-close-line text-sm"></i>
                </button>
              </span>
            </div>
          </div>
          
          <div class="space-y-2 mt-4">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="favorite" 
                v-model="newBookmark.isFavorite" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label for="favorite" class="ml-2 block text-sm text-slate-700">Add to favorites</label>
            </div>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="read" 
                v-model="newBookmark.isRead" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label for="read" class="ml-2 block text-sm text-slate-700">Mark as read</label>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 bg-slate-50 rounded-b-xl flex justify-end space-x-3">
          <button 
            @click="closeAddModal" 
            class="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button 
            @click="saveBookmark" 
            :disabled="!newBookmark.title || !newBookmark.url"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Bookmark
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
