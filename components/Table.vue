<script lang="ts" setup>
import { computed, ref } from "vue";

interface TableData {
	[key: string]: string | number | boolean | Date | null | undefined;
}

interface Column {
	key: string;
	label: string;
	sortable?: boolean;
	align?: "left" | "center" | "right";
	width?: string | number;
	format?: <T = unknown>(value: T) => string;
}

interface Props {
	columns: Column[];
	data: TableData[];
	loading?: boolean;
	selectable?: boolean;
	pagination?: boolean;
	itemsPerPage?: number;
	currentPage?: number;
	totalItems?: number;
	hoverable?: boolean;
	striped?: boolean;
	bordered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
	selectable: false,
	pagination: true,
	itemsPerPage: 10,
	currentPage: 1,
	totalItems: 0,
	hoverable: true,
	striped: true,
	bordered: true,
});

const emit = defineEmits<{
	(e: "update:currentPage", page: number): void;
	(e: "sort", column: Column, direction: "asc" | "desc"): void;
	(e: "row-click", row: TableData, event: Event): void;
	(e: "selection-change", selection: TableData[]): void;
}>();

const selectedRows = ref<Set<TableData>>(new Set());
const sortColumn = ref<string>("");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedData = computed(() => {
	if (!sortColumn.value) return props.data;

	return [...props.data].sort((a, b) => {
		const aValue = a[sortColumn.value];
		const bValue = b[sortColumn.value];

		// Handle null/undefined values for proper comparison
		if (aValue === bValue) return 0;
		if (aValue == null) return sortDirection.value === "asc" ? -1 : 1;
		if (bValue == null) return sortDirection.value === "asc" ? 1 : -1;

		return sortDirection.value === "asc"
			? aValue > bValue
				? 1
				: -1
			: aValue < bValue
				? 1
				: -1;
	});
});

const handleSort = (column: Column) => {
	if (!column.sortable) return;

	if (sortColumn.value === column.key) {
		sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
	} else {
		sortColumn.value = column.key;
		sortDirection.value = "asc";
	}

	emit("sort", column, sortDirection.value);
};

const handleRowClick = (row: TableData, event: Event) => {
	emit("row-click", row, event);
};

const handleSelectAll = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.checked) {
		selectedRows.value = new Set(props.data);
	} else {
		selectedRows.value.clear();
	}
	emitSelectionChange();
};

const handleSelectRow = (row: TableData, event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.checked) {
		selectedRows.value.add(row);
	} else {
		selectedRows.value.delete(row);
	}
	emitSelectionChange();
};

const emitSelectionChange = (): void => {
	emit("selection-change", Array.from(selectedRows.value));
};

const isRowSelected = (row: TableData): boolean => {
	return selectedRows.value.has(row);
};

const getCellAlignment = (column: Column) => {
	return column.align || "left";
};
</script>

<template>
  <div class="overflow-x-auto">
    <div class="inline-block min-w-full">
      <div class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-if="selectable" class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  @change="handleSelectAll"
                >
              </th>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  { 'cursor-pointer': column.sortable },
                  { 'text-right': column.align === 'right' },
                  { 'text-center': column.align === 'center' }
                ]"
                :style="{ width: column.width }"
                @click="handleSort(column)"
              >
                <div
                  class="flex items-center"
                  :class="{
                    'justify-end': column.align === 'right',
                    'justify-center': column.align === 'center',
                    'justify-start': !column.align || column.align === 'left'
                  }"
                >
                  {{ column.label }}
                  <span v-if="column.sortable" class="ml-1">
                    <span v-if="sortColumn === column.key">
                      <span v-if="sortDirection === 'asc'" class="i-mdi-chevron-up" />
                      <span v-else class="i-mdi-chevron-down" />
                    </span>
                    <span v-else class="i-mdi-unfold-more-horizontal" />
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td :colspan="columns.length + (selectable ? 1 : 0)" class="px-6 py-4 text-center">
                <div class="flex justify-center">
                  <div class="i-mdi-loading animate-spin text-2xl text-primary-500" />
                </div>
              </td>
            </tr>
            <tr v-else-if="!data.length">
              <td :colspan="columns.length + (selectable ? 1 : 0)" class="px-6 py-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
            <tr
              v-for="(row, index) in sortedData"
              v-else
              :key="index"
              :class="[
                'transition-colors duration-150',
                { 'hover:bg-gray-50': hoverable },
                { 'bg-gray-50': striped && index % 2 === 1 },
                { 'border': bordered }
              ]"
              @click="handleRowClick(row, $event)"
            >
              <td v-if="selectable" class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  :checked="isRowSelected(row)"
                  @click.stop
                  @change="handleSelectRow(row, $event)"
                >
              </td>
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'px-6 py-4 whitespace-nowrap',
                  { 'text-right': column.align === 'right' },
                  { 'text-center': column.align === 'center' }
                ]"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  {{ column.format ? column.format(row[column.key]) : row[column.key] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        to
        <span class="font-medium">
          {{ Math.min(currentPage * itemsPerPage, totalItems) }}
        </span>
        of
        <span class="font-medium">{{ totalItems }}</span>
        results
      </div>
      <div class="flex space-x-2">
        <button
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-1 rounded border',
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
          @click="emit('update:currentPage', currentPage - 1)"
        >
          Previous
        </button>
        <button
          :disabled="currentPage * itemsPerPage >= totalItems"
          :class="[
            'px-3 py-1 rounded border',
            currentPage * itemsPerPage >= totalItems
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
          @click="emit('update:currentPage', currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>