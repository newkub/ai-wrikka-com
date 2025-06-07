<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-col bg-background">
      <Nav />
      <main class="flex-grow">
        <NuxtPage />
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Nav from '~/components/Nav.vue'

</script>


