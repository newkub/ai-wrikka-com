<script setup>
import Nav from "~/components/ui/Nav.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">

    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>
