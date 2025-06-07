<script setup>
import Nav from '~/components/Nav.vue';
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-background text-text">
    <Nav />
    <main class="flex-grow overflow-auto">
      <slot />
    </main>
  </div>
</template>