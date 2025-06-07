<script setup lang="ts">
import Card from '~/components/Card.vue';

// Sample data - replace with your actual notes data
const notes = Array(12).fill(0).map((_, i) => ({
  id: i + 1,
  title: `Note ${i + 1}`,
  content: 'This is a sample note content. Click to edit or view details.'
}));
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 text-text">My Notes</h1>
    
    <div class="grid grid-cols-6 gap-4">
      <Card v-for="i in 12" :key="i" class="h-40">
        <h3 class="font-semibold mb-2">Note {{ i }}</h3>
        <div class="text-sm text-gray-600">
          <p class="text-sm text-text/80">This is a sample note content. Click to edit or view details.</p>
        </div>
      </Card>
    </div>
  </div>
</template>
