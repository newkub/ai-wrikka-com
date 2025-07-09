import { ref, computed } from "vue";
import type { Task } from "~/stores/task";

export const useTable = (tasks: Task[]) => {
	const sortField = ref<keyof Task>("createdAt");
	const sortDirection = ref<"asc" | "desc">("desc");
	const searchQuery = ref("");
	const currentPage = ref(1);
	const itemsPerPage = ref(10);

	// Sort tasks
	const sortedTasks = computed(() => {
		return [...tasks].sort((a, b) => {
			let modifier = 1;
			if (sortDirection.value === "desc") modifier = -1;

			const aValue = a[sortField.value];
			const bValue = b[sortField.value];

			// Handle undefined or null values
			if (aValue === undefined || aValue === null) return 1 * modifier;
			if (bValue === undefined || bValue === null) return -1 * modifier;

			if (aValue < bValue) return -1 * modifier;
			if (aValue > bValue) return 1 * modifier;
			return 0;
		});
	});

	// Filter tasks by search query
	const filteredTasks = computed(() => {
		if (!searchQuery.value) return sortedTasks.value;

		const query = searchQuery.value.toLowerCase();
		return sortedTasks.value.filter(
			(task) =>
				task.title.toLowerCase().includes(query) ||
				task.description?.toLowerCase().includes(query) ||
				task.status.includes(query) ||
				task.priority?.includes(query),
		);
	});

	// Pagination
	const totalPages = computed(() =>
		Math.ceil(filteredTasks.value.length / itemsPerPage.value),
	);

	const paginatedTasks = computed(() => {
		const start = (currentPage.value - 1) * itemsPerPage.value;
		const end = start + itemsPerPage.value;
		return filteredTasks.value.slice(start, end);
	});

	// Change sort field and direction
	const sortBy = (field: keyof Task) => {
		if (sortField.value === field) {
			sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
		} else {
			sortField.value = field;
			sortDirection.value = "asc";
		}
	};

	// Change page
	const changePage = (page: number) => {
		if (page < 1 || page > totalPages.value) return;
		currentPage.value = page;
	};

	// Format header for display
	const formatHeader = (field: string) => {
		return field
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase())
			.trim();
	};

	return {
		sortField,
		sortDirection,
		searchQuery,
		currentPage,
		itemsPerPage,
		totalPages,
		paginatedTasks,
		filteredTasks,
		sortBy,
		changePage,
		formatHeader,
	};
};
