<script setup lang="ts">
import Nav from "~/components/Nav.vue";
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <Nav />
    <main class="flex-1 overflow-hidden">
      <slot />
    </main>
  </div>
</template>
