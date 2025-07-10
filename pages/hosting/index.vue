<script setup lang="ts">
const menuItems = [
	{ title: "Projects", icon: "i-mdi-folder", path: "/hosting/projects" },
	{ title: "Analytics", icon: "i-mdi-chart-bar", path: "/hosting/analytics" },
	{ title: "Overview", icon: "i-mdi-home", path: "/hosting/overview" },
	{ title: "Settings", icon: "i-mdi-cog", path: "/hosting/settings" },
	{ title: "Usage", icon: "i-mdi-chart-pie", path: "/hosting/usage" },
];
</script>

<template>
  <div class="p-4">
    <div class="grid grid-cols-4 gap-4">
      <NuxtLink 
        v-for="(item, index) in menuItems" 
        :key="index"
        :to="item.path"
        class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center"
      >
        <div :class="item.icon" class="text-2xl mb-2"></div>
        <span class="font-medium">{{ item.title }}</span>
      </NuxtLink>
    </div>
  </div>
</template>