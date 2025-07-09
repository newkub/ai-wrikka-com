import { computed } from "vue";
import { useTaskStore } from "~/stores/task";
import type { TaskStatus } from "~/types/task";

export function useTaskFilters() {
	const taskStore = useTaskStore();

	const filterByWorkspace = (workspaceId: string | null) => {
		taskStore.setFilter({
			workspaceId,
			status: null, // Reset status filter when changing workspace
		});
	};

	const filterByStatus = (status: string | null) => {
		taskStore.setFilter({
			status: status as TaskStatus | null,
			workspaceId: null, // Reset workspace filter when changing status
		});
	};

	const filterByView = (view: string) => {
		taskStore.setFilter({ view });
	};

	const resetFilters = () => {
		taskStore.setFilter({
			workspaceId: null,
			status: null,
			view: "all",
		});
	};

	return {
		filterByWorkspace,
		filterByStatus,
		filterByView,
		resetFilters,
		currentFilters: computed(() => taskStore.filters),
	};
}
