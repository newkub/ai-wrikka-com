<script setup lang="ts">
import { useNavigation } from "~/composables/useNavigation";

const props = defineProps<{
	vertical?: boolean;
}>();

const { navigation, isActive } = useNavigation();
</script>

<template>
  <template v-if="!vertical">
    <NuxtLink
      v-for="item in navigation"
      :key="item.href"
      :to="item.href"
      class="text-text hover:text-brand px-3 py-2 rounded-md text-sm font-medium"
      :class="{ 'text-brand font-semibold': isActive(item.href) }"
    >
      {{ item.name }}
    </NuxtLink>
  </template>
  <template v-else>
    <NuxtLink
      v-for="item in navigation"
      :key="item.href"
      :to="item.href"
      class="text-text hover:bg-surface block px-3 py-2 rounded-md text-base font-medium"
      :class="{ 'bg-surface text-brand': isActive(item.href) }"
    >
      <div class="flex items-center space-x-3">
        <div :class="[item.icon, 'h-5 w-5']" />
        <span>{{ item.name }}</span>
      </div>
    </NuxtLink>
  </template>
</template>
