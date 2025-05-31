
<script setup lang="ts">
import Nav from "~/components/Nav.vue";
</script>

<template>
  <div class="h-screen w-full flex flex-col">
    <!-- Navbar Component -->
    <Nav />

    <!-- Page Content -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
