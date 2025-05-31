import { defineStore } from 'pinia';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  image?: string;
  tags: string[];
  collection: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  isFavorite: boolean;
}

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = ref<Bookmark[]>([
    {
      id: '1',
      title: 'Vue.js - The Progressive JavaScript Framework',
      url: 'https://vuejs.org/',
      description: 'An approachable, performant and versatile framework for building web user interfaces.',
      favicon: 'https://vuejs.org/logo.svg',
      image: 'https://vuejs.org/images/logo.png',
      tags: ['vue', 'javascript', 'framework'],
      collection: 'Development',
      createdAt: '2023-05-10T15:30:00Z',
      updatedAt: '2023-05-10T15:30:00Z',
      isRead: true,
      isFavorite: true
    },
    {
      id: '2',
      title: 'Nuxt - The Intuitive Vue Framework',
      url: 'https://nuxt.com/',
      description: 'Build your next Vue.js application with confidence using Nuxt.',
      favicon: 'https://nuxt.com/icon.png',
      image: 'https://nuxt.com/assets/design-kit/logo/icon-green.svg',
      tags: ['nuxt', 'vue', 'framework'],
      collection: 'Development',
      createdAt: '2023-05-15T10:20:00Z',
      updatedAt: '2023-05-15T10:20:00Z',
      isRead: true,
      isFavorite: false
    },
    {
      id: '3',
      title: 'Pinia - The intuitive store for Vue.js',
      url: 'https://pinia.vuejs.org/',
      description: 'Intuitive, type safe, light and flexible Store for Vue',
      favicon: 'https://pinia.vuejs.org/logo.svg',
      image: 'https://pinia.vuejs.org/logo.png',
      tags: ['pinia', 'state-management', 'vue'],
      collection: 'Development',
      createdAt: '2023-05-20T09:15:00Z',
      updatedAt: '2023-05-20T09:15:00Z',
      isRead: false,
      isFavorite: true
    },
    {
      id: '4',
      title: 'CSS-Tricks - A website about websites',
      url: 'https://css-tricks.com/',
      description: 'CSS-Tricks is a website about websites',
      favicon: 'https://css-tricks.com/favicon.ico',
      image: 'https://css-tricks.com/wp-content/uploads/2019/06/akqRGyta_400x400.jpg',
      tags: ['css', 'design', 'web'],
      collection: 'Design',
      createdAt: '2023-06-05T14:20:00Z',
      updatedAt: '2023-06-05T14:20:00Z',
      isRead: false,
      isFavorite: false
    },
    {
      id: '5',
      title: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/',
      description: 'Resources for developers, by developers',
      favicon: 'https://developer.mozilla.org/favicon.ico',
      image: 'https://developer.mozilla.org/mdn-social-share.png',
      tags: ['documentation', 'web', 'reference'],
      collection: 'Resources',
      createdAt: '2023-06-10T11:45:00Z',
      updatedAt: '2023-06-10T11:45:00Z',
      isRead: true,
      isFavorite: true
    },
    {
      id: '6',
      title: 'Smashing Magazine',
      url: 'https://www.smashingmagazine.com/',
      description: 'For web designers and developers',
      favicon: 'https://www.smashingmagazine.com/favicon.ico',
      image: 'https://www.smashingmagazine.com/images/logo.png',
      tags: ['design', 'development', 'articles'],
      collection: 'Design',
      createdAt: '2023-06-15T16:30:00Z',
      updatedAt: '2023-06-15T16:30:00Z',
      isRead: false,
      isFavorite: false
    }
  ]);

  const collections = computed(() => {
    const allCollections = bookmarks.value.map(bookmark => bookmark.collection);
    return ['All', ...new Set(allCollections)];
  });

  const allTags = computed(() => {
    const tags = bookmarks.value.flatMap(bookmark => bookmark.tags);
    return [...new Set(tags)];
  });

  // Add a new bookmark
  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    bookmarks.value.push(newBookmark);
  };

  // Update an existing bookmark
  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    const index = bookmarks.value.findIndex(b => b.id === id);
    if (index !== -1) {
      bookmarks.value[index] = {
        ...bookmarks.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
  };

  // Delete a bookmark
  const deleteBookmark = (id: string) => {
    bookmarks.value = bookmarks.value.filter(b => b.id !== id);
  };

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const bookmark = bookmarks.value.find(b => b.id === id);
    if (bookmark) {
      bookmark.isFavorite = !bookmark.isFavorite;
      bookmark.updatedAt = new Date().toISOString();
    }
  };

  // Toggle read status
  const toggleRead = (id: string) => {
    const bookmark = bookmarks.value.find(b => b.id === id);
    if (bookmark) {
      bookmark.isRead = !bookmark.isRead;
      bookmark.updatedAt = new Date().toISOString();
    }
  };

  // Add tag to bookmark
  const addTag = (bookmarkId: string, tag: string) => {
    const bookmark = bookmarks.value.find(b => b.id === bookmarkId);
    if (bookmark && !bookmark.tags.includes(tag)) {
      bookmark.tags.push(tag);
      bookmark.updatedAt = new Date().toISOString();
    }
  };

  // Remove tag from bookmark
  const removeTag = (bookmarkId: string, tag: string) => {
    const bookmark = bookmarks.value.find(b => b.id === bookmarkId);
    if (bookmark) {
      bookmark.tags = bookmark.tags.filter(t => t !== tag);
      bookmark.updatedAt = new Date().toISOString();
    }
  };

  return {
    bookmarks,
    collections,
    allTags,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    toggleRead,
    addTag,
    removeTag
  };
});
