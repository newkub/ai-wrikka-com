<script setup>
import Nav from '~/components/Nav.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">

    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>
