
<script lang="ts">
import { defineComponent } from "vue";
import Nav from "~/components/Nav.vue";

export default defineComponent({
	name: "App",
	components: {
		Nav,
	},
	setup() {
		return {};
	},
});
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen w-full flex flex-col bg-background text-text">
      <!-- Fixed Navbar -->
      <div class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Nav />
        </div>
      </div>
      
      <!-- Main Content with padding-top to account for fixed navbar -->
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col pt-20">
        <main class="flex-grow">
          <NuxtPage />
        </main>
      </div>
    </div>
  </NuxtLayout>
</template>

  