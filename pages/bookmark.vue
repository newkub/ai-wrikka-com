<script setup lang="ts">
import { useBookmarkStore, type Bookmark } from '~/stores/bookmark';

definePageMeta({
  layout: 'default'
});

const bookmarkStore = useBookmarkStore();

// State
const selectedCollection = ref<string>('All');
const selectedTags = ref<string[]>([]);
const searchQuery = ref<string>('');
const viewMode = ref<'grid' | 'list'>('grid');
const showAddModal = ref<boolean>(false);
const sortBy = ref<'date' | 'title' | 'url'>('date');
const sortDirection = ref<'asc' | 'desc'>('desc');

// New bookmark form
const newBookmark = ref<Partial<Bookmark>>({
  title: '',
  url: '',
  description: '',
  tags: [],
  collection: 'Uncategorized',
  isRead: false,
  isFavorite: false
});

// Temp tag input
const tagInput = ref<string>('');

// Computed
const filteredBookmarks = computed(() => {
  let result = bookmarkStore.bookmarks;
  
  // Filter by collection
  if (selectedCollection.value !== 'All') {
    result = result.filter(bookmark => bookmark.collection === selectedCollection.value);
  }
  
  // Filter by tags
  if (selectedTags.value.length > 0) {
    result = result.filter(bookmark => 
      selectedTags.value.every(tag => bookmark.tags.includes(tag))
    );
  }
  
  // Search by title, url or description
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(bookmark => 
      bookmark.title.toLowerCase().includes(query) || 
      bookmark.url.toLowerCase().includes(query) || 
      (bookmark.description?.toLowerCase().includes(query))
    );
  }
  
  // Sort
  result = [...result].sort((a, b) => {
    let valueA: string | number;
    let valueB: string | number;
    
    if (sortBy.value === 'date') {
      valueA = new Date(a.updatedAt).getTime();
      valueB = new Date(b.updatedAt).getTime();
    } else if (sortBy.value === 'title') {
      valueA = a.title.toLowerCase();
      valueB = b.title.toLowerCase();
    } else {
      valueA = a.url.toLowerCase();
      valueB = b.url.toLowerCase();
    }
    
    if (sortDirection.value === 'asc') {
      return valueA > valueB ? 1 : -1;
    }
    return valueA < valueB ? 1 : -1;
  });
  
  return result;
});

// Methods
const addTag = () => {
  if (tagInput.value && !newBookmark.value.tags?.includes(tagInput.value)) {
    if (!newBookmark.value.tags) {
      newBookmark.value.tags = [];
    }
    newBookmark.value.tags.push(tagInput.value);
    tagInput.value = '';
  }
};

const removeTag = (tag: string) => {
  if (newBookmark.value.tags) {
    newBookmark.value.tags = newBookmark.value.tags.filter(t => t !== tag);
  }
};

const toggleTagFilter = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
};

const openAddModal = () => {
  newBookmark.value = {
    title: '',
    url: '',
    description: '',
    tags: [],
    collection: 'Uncategorized',
    isRead: false,
    isFavorite: false
  };
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const saveBookmark = () => {
  if (newBookmark.value.title && newBookmark.value.url) {
    bookmarkStore.addBookmark(newBookmark.value as Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>);
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
  if (confirm('Are you sure you want to delete this bookmark?')) {
    bookmarkStore.deleteBookmark(id);
  }
};

const changeSortOrder = (field: 'date' | 'title' | 'url') => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortDirection.value = 'desc';
  }
};

// Helper functions
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

const extractDomain = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <div class="w-70 bg-slate-50 border-r border-slate-200 h-full overflow-y-auto p-6 flex-shrink-0">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900">Collections</h2>
      </div>
      
      <div class="mb-8">
        <button 
          v-for="collection in bookmarkStore.collections" 
          :key="collection"
          @click="selectedCollection = collection"
          class="w-full flex items-center p-3 rounded-lg text-left transition-colors mb-1"
          :class="selectedCollection === collection 
            ? 'bg-blue-50 text-blue-600' 
            : 'hover:bg-slate-200'"
        >
          <span class="mr-3 text-lg">
            <i :class="collection !== 'All' ? 'i-ri-folder-line' : 'i-ri-apps-line'"></i>
          </span>
          <span class="flex-grow text-sm">{{ collection }}</span>
          <span 
            class="rounded-full px-2 py-0.5 text-xs"
            :class="selectedCollection === collection 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-slate-200 text-slate-500'"
          >
            {{ collection === 'All' 
              ? bookmarkStore.bookmarks.length 
              : bookmarkStore.bookmarks.filter(b => b.collection === collection).length }}
          </span>
        </button>
      </div>
      
      <div class="mt-6">
        <h3 class="text-base font-semibold text-slate-900 mb-4">Tags</h3>
        <div class="flex flex-col gap-2">
          <button 
            v-for="tag in bookmarkStore.allTags" 
            :key="tag"
            @click="toggleTagFilter(tag)"
            class="flex items-center px-3 py-2 rounded-md text-left transition-colors"
            :class="selectedTags.includes(tag)
              ? 'bg-blue-100 text-blue-600' 
              : 'hover:bg-slate-200'"
          >
            <span class="mr-2 text-sm">
              <i class="i-ri-price-tag-3-line"></i>
            </span>
            <span class="text-sm">{{ tag }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 p-6 overflow-y-auto flex flex-col">
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
          <button 
            @click="changeSortOrder('date')"
            class="flex items-center px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-600 text-sm hover:bg-slate-50 transition-colors"
          >
            <i class="i-ri-time-line mr-2"></i>
            <span>Date</span>
            <i 
              v-if="sortBy === 'date'"
              :class="sortDirection === 'asc' ? 'i-ri-arrow-up-s-line' : 'i-ri-arrow-down-s-line'"
              class="ml-1"
            ></i>
          </button>
          
          <button 
            @click="changeSortOrder('title')"
            class="flex items-center px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-600 text-sm hover:bg-slate-50 transition-colors"
          >
            <i class="i-ri-text mr-2"></i>
            <span>Title</span>
            <i 
              v-if="sortBy === 'title'"
              :class="sortDirection === 'asc' ? 'i-ri-arrow-up-s-line' : 'i-ri-arrow-down-s-line'"
              class="ml-1"
            ></i>
          </button>
          
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
      
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="bookmarks-grid">
        <div 
          v-for="bookmark in filteredBookmarks" 
          :key="bookmark.id" 
          class="bookmark-card"
        >
          <div class="card-header">
            <div class="favicon">
              <img v-if="bookmark.favicon" :src="bookmark.favicon" :alt="bookmark.title" />
              <i v-else class="i-ri-global-line"></i>
            </div>
            <div class="bookmark-actions">
              <button 
                @click="toggleFavorite(bookmark.id)" 
                :class="['action-icon', { 'favorited': bookmark.isFavorite }]"
              >
                <i :class="bookmark.isFavorite ? 'i-ri-star-fill' : 'i-ri-star-line'"></i>
              </button>
              <button 
                @click="toggleRead(bookmark.id)" 
                :class="['action-icon', { 'read': bookmark.isRead }]"
              >
                <i :class="bookmark.isRead ? 'i-ri-check-double-line' : 'i-ri-check-line'"></i>
              </button>
              <button @click="deleteBookmark(bookmark.id)" class="action-icon delete">
                <i class="i-ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
          
          <a :href="bookmark.url" target="_blank" class="card-content">
            <div class="image-container" v-if="bookmark.image">
              <img :src="bookmark.image" :alt="bookmark.title" class="preview-image" />
            </div>
            <div class="card-details">
              <h3 class="bookmark-title">{{ bookmark.title }}</h3>
              <p class="bookmark-description" v-if="bookmark.description">
                {{ bookmark.description }}
              </p>
              <div class="bookmark-meta">
                <div class="bookmark-url">{{ extractDomain(bookmark.url) }}</div>
                <div class="bookmark-date">{{ getTimeAgo(bookmark.updatedAt) }}</div>
              </div>
            </div>
          </a>
          
          <div class="card-footer">
            <div class="card-tags">
              <span 
                v-for="tag in bookmark.tags.slice(0, 3)" 
                :key="tag"
                class="card-tag"
                @click.stop="toggleTagFilter(tag)"
              >
                {{ tag }}
              </span>
              <span v-if="bookmark.tags.length > 3" class="more-tags">
                +{{ bookmark.tags.length - 3 }}
              </span>
            </div>
            <div class="collection-badge">{{ bookmark.collection }}</div>
          </div>
        </div>
        
        <div v-if="filteredBookmarks.length === 0" class="empty-state">
          <i class="i-ri-inbox-line empty-icon"></i>
          <p>No bookmarks found</p>
        </div>
      </div>
      
      <!-- List View -->
      <div v-else class="bookmarks-list">
        <div 
          v-for="bookmark in filteredBookmarks" 
          :key="bookmark.id" 
          class="bookmark-row"
        >
          <div class="row-start">
            <div class="favicon">
              <img v-if="bookmark.favicon" :src="bookmark.favicon" :alt="bookmark.title" />
              <i v-else class="i-ri-global-line"></i>
            </div>
            <div class="row-content">
              <a :href="bookmark.url" target="_blank" class="bookmark-title">
                {{ bookmark.title }}
              </a>
              <div class="row-meta">
                <span class="domain">{{ extractDomain(bookmark.url) }}</span>
                <span class="meta-divider">•</span>
                <span class="collection">{{ bookmark.collection }}</span>
                <span class="meta-divider">•</span>
                <span class="date">{{ getTimeAgo(bookmark.updatedAt) }}</span>
              </div>
            </div>
          </div>
          
          <div class="row-tags">
            <span 
              v-for="tag in bookmark.tags.slice(0, 2)" 
              :key="tag"
              class="row-tag"
              @click.stop="toggleTagFilter(tag)"
            >
              {{ tag }}
            </span>
            <span v-if="bookmark.tags.length > 2" class="more-tags">
              +{{ bookmark.tags.length - 2 }}
            </span>
          </div>
          
          <div class="row-actions">
            <button 
              @click="toggleFavorite(bookmark.id)" 
              :class="['action-icon', { 'favorited': bookmark.isFavorite }]"
            >
              <i :class="bookmark.isFavorite ? 'i-ri-star-fill' : 'i-ri-star-line'"></i>
            </button>
            <button 
              @click="toggleRead(bookmark.id)" 
              :class="['action-icon', { 'read': bookmark.isRead }]"
            >
              <i :class="bookmark.isRead ? 'i-ri-check-double-line' : 'i-ri-check-line'"></i>
            </button>
            <button @click="deleteBookmark(bookmark.id)" class="action-icon delete">
              <i class="i-ri-delete-bin-line"></i>
            </button>
          </div>
        </div>
        
        <div v-if="filteredBookmarks.length === 0" class="empty-state">
          <i class="i-ri-inbox-line empty-icon"></i>
          <p>No bookmarks found</p>
        </div>
      </div>
    </div>
    
    <!-- Add Bookmark Modal -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Add New Bookmark</h2>
          <button @click="closeAddModal" class="close-button">
            <i class="i-ri-close-line"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="url">URL</label>
            <input 
              type="url" 
              id="url" 
              v-model="newBookmark.url" 
              placeholder="[https://example.com](https://example.com)" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="title">Title</label>
            <input 
              type="text" 
              id="title" 
              v-model="newBookmark.title" 
              placeholder="Page title" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              v-model="newBookmark.description" 
              placeholder="Optional description"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="collection">Collection</label>
            <select id="collection" v-model="newBookmark.collection">
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
          
          <div class="form-group">
            <label>Tags</label>
            <div class="tag-input-container">
              <input 
                type="text" 
                v-model="tagInput" 
                @keyup.enter="addTag" 
                placeholder="Add tag and press Enter"
              />
              <button @click="addTag" class="tag-add-btn">
                <i class="i-ri-add-line"></i>
              </button>
            </div>
            <div class="selected-tags">
              <span 
                v-for="tag in newBookmark.tags" 
                :key="tag" 
                class="selected-tag"
              >
                {{ tag }}
                <button @click="removeTag(tag)" class="tag-remove-btn">
                  <i class="i-ri-close-line"></i>
                </button>
              </span>
            </div>
          </div>
          
          <div class="form-checkboxes">
            <div class="form-checkbox">
              <input type="checkbox" id="favorite" v-model="newBookmark.isFavorite" />
              <label for="favorite">Add to favorites</label>
            </div>
            <div class="form-checkbox">
              <input type="checkbox" id="read" v-model="newBookmark.isRead" />
              <label for="read">Mark as read</label>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeAddModal" class="cancel-btn">Cancel</button>
          <button @click="saveBookmark" class="save-btn" :disabled="!newBookmark.title || !newBookmark.url">
            Save Bookmark
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

