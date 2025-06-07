
<script lang="ts">
import Nav from "~/components/Nav.vue";
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-col bg-background text-text">
          <Nav />
      <main class="flex-grow">
        <NuxtPage />
      </main>
    </div>
  </NuxtLayout>
</template>

  