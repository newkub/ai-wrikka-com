<script setup lang="ts">
import { ref, computed } from "vue";
import type { Task } from "~/stores/task";

const props = defineProps<{
	task?: Task;
	isOpen: boolean;
}>();

const emit = defineEmits<{
	(e: "update:isOpen", value: boolean): void;
	(
		e: "submit",
		task: Omit<Task, "id" | "createdAt" | "updatedAt" | "workspaceId"> & {
			workspaceId: string;
		},
	): void;
	(e: "update:task", task: Task): void;
}>();

const title = ref(props.task?.title || "");
const description = ref(props.task?.description || "");
const status = ref<Task["status"]>(props.task?.status || "todo");
const priority = ref<Task["priority"]>(props.task?.priority || "medium");
const dueDate = ref(
	props.task?.dueDate
		? new Date(props.task.dueDate).toISOString().split("T")[0]
		: "",
);

const isEditMode = computed(() => !!props.task);

const statusOptions = [
	{ value: "todo", label: "To Do" },
	{ value: "in-progress", label: "In Progress" },
	{ value: "review", label: "Review" },
	{ value: "done", label: "Done" },
];

const priorityOptions = [
	{ value: "low", label: "Low" },
	{ value: "medium", label: "Medium" },
	{ value: "high", label: "High" },
];

const handleSubmit = () => {
	const taskData = {
		title: title.value,
		description: description.value,
		status: status.value,
		priority: priority.value,
		dueDate: dueDate.value ? new Date(dueDate.value).toISOString() : undefined,
		workspaceId: props.task?.workspaceId || "", // ต้องมี workspaceId
	};

	if (isEditMode.value && props.task) {
		const updatedTask = {
			...props.task,
			...taskData,
			dueDate: taskData.dueDate || props.task.dueDate,
		};
		emit("update:task", updatedTask);
	} else {
		emit("submit", taskData);
	}

	closeModal();
};

const closeModal = () => {
	emit("update:isOpen", false);
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeModal">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:max-w-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">Close</span>
            <div class="i-mdi-close w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                v-model="title"
                type="text"
                required
                class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="description"
                rows="3"
                class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  v-model="status"
                  class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  id="priority"
                  v-model="priority"
                  class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                id="dueDate"
                v-model="dueDate"
                type="date"
                class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>


          <div class="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {{ isEditMode ? 'Update' : 'Create' }} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
