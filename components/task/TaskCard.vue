<script setup lang="ts">
import { computed } from "vue";
import type { Task } from "~/stores/task";

const props = defineProps<{
	task: Task;
}>();

const emit = defineEmits<{
	click: [task: Task];
	statusChange: [status: Task["status"]];
}>();

interface PriorityColors {
	[key: string]: string;
	low: string;
	medium: string;
	high: string;
}

interface StatusColors {
	[key: string]: string;
	todo: string;
	"in-progress": string;
	review: string;
	done: string;
}

interface StatusLabels {
	[key: string]: string;
	todo: string;
	"in-progress": string;
	review: string;
	done: string;
}

const priorityColors: PriorityColors = {
	low: "bg-blue-100 text-blue-800",
	medium: "bg-yellow-100 text-yellow-800",
	high: "bg-red-100 text-red-800",
};

const statusColors: StatusColors = {
	todo: "bg-gray-100 text-gray-800",
	"in-progress": "bg-blue-100 text-blue-800",
	review: "bg-purple-100 text-purple-800",
	done: "bg-green-100 text-green-800",
};

const statusLabels: StatusLabels = {
	todo: "To Do",
	"in-progress": "In Progress",
	review: "Review",
	done: "Done",
};

const priorityLabel = computed(() => {
	const priorityMap = {
		low: "Low",
		medium: "Medium",
		high: "High",
	} as const;
	return priorityMap[props.task.priority || "medium"];
});

const formattedDueDate = computed(() => {
	if (!props.task.dueDate) return null;
	return new Date(props.task.dueDate).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
});

const handleClick = () => {
	emit("click", props.task);
};

const handleStatusChange = (e: Event) => {
	const select = e.target as HTMLSelectElement;
	emit("statusChange", select.value as Task["status"]);
};
</script>

<template>
  <div
    class="p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
    @click="handleClick"
  >
    <div class="flex items-start justify-between mb-2">
      <h3 class="text-sm font-medium text-gray-900 line-clamp-2">
        {{ task.title }}
      </h3>
      <div class="flex-shrink-0 ml-2">
        <span
          :class="[
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
            priorityColors[task.priority || 'medium']
          ]"
        >
          {{ priorityLabel }}
        </span>
      </div>
    </div>

    <p v-if="task.description" class="mb-3 text-sm text-gray-500 line-clamp-2">
      {{ task.description }}
    </p>

    <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
      <div class="flex items-center">
        <span
          v-if="task.dueDate"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
        >
          <div class="i-mdi-calendar w-3 h-3 mr-1" />
          {{ formattedDueDate }}
        </span>
      </div>

      <div class="flex items-center">
        <select
          :value="task.status"
          @click.stop
          @change="handleStatusChange"
          :class="[
            'text-xs rounded-md border-0 py-0.5 pl-2 pr-6 focus:ring-1 focus:ring-primary-500',
            statusColors[task.status]
          ]"
        >
          <option
            v-for="[value, label] in Object.entries(statusLabels)"
            :key="value"
            :value="value"
            :class="{
              'bg-white text-gray-900': task.status !== value,
              [statusColors[value as keyof typeof statusColors]]: task.status === value
            }"
          >
            {{ label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
