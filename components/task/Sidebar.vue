<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  modelValue?: string;
  workspaces?: { id: string; name: string }[];
  statuses?: { id: string; name: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'select', value: string, type: 'workspace' | 'status' | 'view'): void;
}>();

const viewItems = [
  { id: 'all', label: 'All Tasks', icon: 'i-mdi:view-list' },
  { id: 'today', label: 'Today', icon: 'i-mdi:calendar-today' },
  { id: 'upcoming', label: 'Upcoming', icon: 'i-mdi:calendar-month' },
  { id: 'completed', label: 'Completed', icon: 'i-mdi:check-circle' },
];

const selectedView = ref('all');
const selectedWorkspace = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);

const selectView = (viewId: string) => {
  selectedView.value = viewId;
  selectedWorkspace.value = null;
  selectedStatus.value = null;
  emit('update:modelValue', viewId);
  emit('select', viewId, 'view');
};

const selectWorkspace = (workspaceId: string) => {
  selectedWorkspace.value = workspaceId;
  selectedView.value = '';
  selectedStatus.value = null;
  emit('select', workspaceId, 'workspace');
};

const selectStatus = (statusId: string) => {
  selectedStatus.value = statusId;
  selectedView.value = '';
  selectedWorkspace.value = null;
  emit('select', statusId, 'status');
};
</script>

<template>
  <div class="w-64 h-full bg-white border-r border-gray-200 overflow-y-auto">
    <!-- Workspaces Section -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Workspaces</h2>
      <ul class="space-y-1">
        <li v-for="workspace in workspaces" :key="`workspace-${workspace.id}`">
          <button
            @click="selectWorkspace(workspace.id)"
            :class="[
              'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md',
              selectedWorkspace === workspace.id
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            <span class="mr-2">
              <div class="i-mdi-folder text-lg" />
            </span>
            {{ workspace.name }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Status Section -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h2>
      <ul class="space-y-1">
        <li v-for="status in statuses" :key="`status-${status.id}`">
          <button
            @click="selectStatus(status.id)"
            :class="[
              'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md',
              selectedStatus === status.id
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            <span class="mr-2">
              <div class="i-mdi-circle-outline text-lg" />
            </span>
            {{ status.name }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Views Section -->
    <div class="p-4">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Views</h2>
      <ul class="space-y-1">
        <li v-for="item in viewItems" :key="`view-${item.id}`">
          <button
            @click="selectView(item.id)"
            :class="[
              'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md',
              selectedView === item.id
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            <span class="mr-2">
              <div :class="`${item.icon} text-lg`" />
            </span>
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
