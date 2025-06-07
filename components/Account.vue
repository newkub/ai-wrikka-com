<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<(e: 'signout') => void>()

const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
});

const signOut = () => {
  // Handle sign out logic here
  console.log('Sign out');
  // Emit event to parent
  emit('signout');
};
</script>

<template>
  <div class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
    <div class="font-medium">{{ user.name }}</div>
    <div class="truncate text-gray-500 dark:text-gray-400">{{ user.email }}</div>
  </div>
</template>
