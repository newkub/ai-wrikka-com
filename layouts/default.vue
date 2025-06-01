
<script setup lang="ts">
import Nav from "~/components/Nav.vue";
</script>

<template>
  <div class="h-screen w-full flex flex-col bg-background">
    <!-- Navbar Component -->
    <Nav />

    <!-- Page Content -->
    <main class="flex-1 h-ful">
      <slot />
    </main>
  </div>
</template>
