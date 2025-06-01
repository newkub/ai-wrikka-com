<script setup lang="ts">
// Redirect to the introduction page
const router = useRouter();

onMounted(() => {
  router.replace('/docs/introduction');
});
</script>

<template>
  <div class="flex items-center justify-center h-64">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading documentation...</p>
    </div>
  </div>
</template>
