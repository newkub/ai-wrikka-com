<script setup lang="ts">
import { computed, ref, watch } from "vue";
// Icons will be used from UnoCSS

interface Props {
	/** Current page number (1-based) */
	currentPage: number;
	/** Total number of items */
	totalItems: number;
	/** Number of items per page */
	pageSize: number;
	/** Available page size options */
	pageSizeOptions?: number[];
	/** Show page size selector */
	showPageSize?: boolean;
	/** Show page info */
	showInfo?: boolean;
	/** Maximum number of page buttons to show */
	maxButtons?: number;
	/** Custom class for the pagination container */
	class?: string;
}

const props = withDefaults(defineProps<Props>(), {
	pageSizeOptions: () => [10, 20, 30, 50, 100],
	showPageSize: true,
	showInfo: true,
	maxButtons: 5,
	class: "",
});

const emit = defineEmits<{
	/** Emitted when page changes */
	(e: "update:currentPage", page: number): void;
	/** Emitted when page size changes */
	(e: "update:pageSize", size: number): void;
	/** Emitted when either page or page size changes */
	(e: "change", { page, pageSize }: { page: number; pageSize: number }): void;
}>();

const localPageSize = ref(props.pageSize);

// Ensure page size is one of the available options
watch(
	() => props.pageSize,
	(newSize) => {
		if (props.pageSizeOptions.includes(newSize)) {
			localPageSize.value = newSize;
		} else {
			// If the provided page size is not in options, use the first available option
			localPageSize.value = props.pageSizeOptions[0] || 10;
			emit("update:pageSize", localPageSize.value);
		}
	},
	{ immediate: true },
);

const totalPages = computed(() =>
	Math.ceil(props.totalItems / localPageSize.value),
);

// Ensure current page is within valid range
const currentPage = computed({
	get: () => Math.min(Math.max(props.currentPage, 1), totalPages.value || 1),
	set: (page) => {
		const newPage = Math.max(1, Math.min(page, totalPages.value || 1));
		if (newPage !== props.currentPage) {
			emit("update:currentPage", newPage);
			emit("change", { page: newPage, pageSize: localPageSize.value });
		}
	},
});

// Handle page size change
const handlePageSizeChange = (event: Event) => {
	const newSize = Number((event.target as HTMLSelectElement).value);
	if (newSize !== localPageSize.value) {
		localPageSize.value = newSize;
		emit("update:pageSize", newSize);

		// Adjust current page if needed after page size change
		const firstItemIndex = (currentPage.value - 1) * props.pageSize;
		const newPage = Math.floor(firstItemIndex / newSize) + 1;

		if (newPage !== currentPage.value) {
			emit("update:currentPage", newPage);
		}

		emit("change", { page: newPage, pageSize: newSize });
	}
};

// Generate page numbers to display
const pageNumbers = computed(() => {
	const pages: (number | "...")[] = [];
	const maxButtons = Math.min(props.maxButtons, totalPages.value);

	if (totalPages.value <= maxButtons) {
		// Show all pages if there are fewer than maxButtons
		for (let i = 1; i <= totalPages.value; i++) {
			pages.push(i);
		}
	} else {
		// Always show first page
		pages.push(1);

		// Calculate start and end of the middle section
		const start = Math.max(
			2,
			currentPage.value - Math.floor((maxButtons - 2) / 2),
		);
		let end = Math.min(totalPages.value - 1, start + maxButtons - 3);

		// Adjust if we're at the end
		if (end === totalPages.value - 1) {
			const newStart = Math.max(2, end - (maxButtons - 3));
			end = Math.min(end, newStart + maxButtons - 3);
		}

		// Add ellipsis if needed
		if (start > 2) {
			pages.push("...");
		}

		// Add middle pages
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		// Add ellipsis if needed
		if (end < totalPages.value - 1) {
			pages.push("...");
		}

		// Always show last page
		if (totalPages.value > 1) {
			pages.push(totalPages.value);
		}
	}

	return pages;
});

// Navigation methods
const goToPage = (page: number) => {
	currentPage.value = page;
};

const goToFirst = () => {
	currentPage.value = 1;
};

const goToLast = () => {
	currentPage.value = totalPages.value;
};

const goToPrev = () => {
	currentPage.value = Math.max(1, currentPage.value - 1);
};

const goToNext = () => {
	currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
};
</script>

<template>
  <div 
    class="flex flex-col sm:flex-row items-center justify-between gap-4 p-2"
    :class="props.class"
    role="navigation"
    aria-label="Pagination"
  >
    <!-- Page size selector -->
    <div v-if="showPageSize" class="flex items-center gap-2">
      <label for="pageSize" class="text-sm text-gray-600 dark:text-gray-300">
        Rows per page:
      </label>
      <select
        id="pageSize"
        :value="localPageSize"
        @change="handlePageSizeChange"
        class="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        aria-label="Items per page"
      >
        <option 
          v-for="size in pageSizeOptions" 
          :key="size" 
          :value="size"
        >
          {{ size }}
        </option>
      </select>
    </div>

    <!-- Page info -->
    <div v-if="showInfo" class="text-sm text-gray-600 dark:text-gray-300">
      Showing {{ Math.min((currentPage - 1) * localPageSize + 1, totalItems) }} to
      {{ Math.min(currentPage * localPageSize, totalItems) }} of
      {{ totalItems }} items
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center gap-1">
      <!-- First page button -->
      <button
        v-if="totalPages > 1"
        @click="goToFirst"
        :disabled="currentPage === 1"
        class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :class="{ 'text-gray-400 dark:text-gray-500': currentPage === 1 }"
        aria-label="Go to first page"
      >
        <span class="i-mdi-chevron-double-left w-4 h-4" />
      </button>

      <!-- Previous page button -->
      <button
        @click="goToPrev"
        :disabled="currentPage === 1"
        class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :class="{ 'text-gray-400 dark:text-gray-500': currentPage === 1 }"
        aria-label="Go to previous page"
      >
        <span class="i-mdi-chevron-left w-4 h-4" />
      </button>

      <!-- Page numbers -->
      <template v-for="(page, index) in pageNumbers" :key="index">
        <button
          v-if="page === '...'"
          disabled
          class="px-3 py-1 rounded-md text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        >
          {{ page }}
        </button>
        <button
          v-else
          @click="goToPage(page as number)"
          :aria-current="currentPage === page ? 'page' : undefined"
          class="w-10 h-10 rounded-md transition-colors"
          :class="{
            'bg-primary-500 text-white': currentPage === page,
            'hover:bg-gray-100 dark:hover:bg-gray-700': currentPage !== page,
            'text-gray-900 dark:text-white': currentPage !== page
          }"
          :aria-label="`Go to page ${page}`"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next page button -->
      <button
        @click="goToNext"
        :disabled="currentPage >= totalPages"
        class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :class="{ 'text-gray-400 dark:text-gray-500': currentPage >= totalPages }"
        aria-label="Go to next page"
      >
        <span class="i-mdi-chevron-right w-4 h-4" />
      </button>

      <!-- Last page button -->
      <button
        v-if="totalPages > 1"
        @click="goToLast"
        :disabled="currentPage >= totalPages"
        class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :class="{ 'text-gray-400 dark:text-gray-500': currentPage >= totalPages }"
        aria-label="Go to last page"
      >
        <span class="i-mdi-chevron-double-right w-4 h-4" />
      </button>
    </div>
  </div>
</template>