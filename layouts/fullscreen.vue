<script setup>
import Nav from "~/components/ui/Nav.vue";
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">

    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>