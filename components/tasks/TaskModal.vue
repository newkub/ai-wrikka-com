<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-headline">
                {{ task?.id ? 'Edit Task' : 'New Task' }}
              </h3>
              
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    id="title"
                    v-model="formData.title"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Task title"
                  >
                </div>

                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    v-model="formData.description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Task description"
                  ></textarea>
                </div>


                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      id="priority"
                      v-model="formData.priority"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      v-model="formData.dueDate"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                  </div>
                </div>

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    {{ task?.id ? 'Update' : 'Create' }} Task
                  </button>
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, watch } from 'vue';
import type { Task } from '~/types/task';

type Status = 'todo' | 'inProgress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high';

const props = defineProps<{
  task: Partial<Task> | null;
  status: Status;
}>();

const emit = defineEmits<{
  (e: 'save', data: { task: Partial<Task>; status: Status }): void;
  (e: 'close'): void;
}>();

interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: Status;
}

const formData = ref<Partial<Task>>({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Update form data when task prop changes
watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = { 
      ...newTask,
      description: newTask.description || '',
      dueDate: newTask.dueDate || ''
    };
  } else {
    formData.value = {
      title: '',
      description: '',
      priority: 'medium',
      status: props.status || 'todo',
      dueDate: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}, { immediate: true });

function handleSubmit() {
  emit('save', {
    task: { ...formData.value },
    status: props.status,
  });
}
</script>
