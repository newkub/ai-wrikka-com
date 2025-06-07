<script setup>
import Nav from '~/components/Nav.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-text">
    <Nav />
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>
