<template>
  <div class="min-h-screen flex flex-col">
    <Nav />
    <main class="flex-grow">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import Nav from '~/components/Nav.vue'

</script>


