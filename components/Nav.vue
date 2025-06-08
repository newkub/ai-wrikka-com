
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Logo, ToggleTheme } from "./primitive";
import type ButtonWorkOS from "./ButtonWorkOS.vue";

const menuItems = [
	{ name: "Chat", path: "/chat" },
	{ name: "Blog", path: "/blog" },
	{ name: "Bookmark", path: "/bookmark" },
	{ name: "Code", path: "/code" },
	{ name: "Docs", path: "/docs" },
	{ name: "Learn", path: "/learn" },
	{ name: "Notes", path: "/notes" },
	{ name: "Search", path: "/search" },
	{ name: "Task", path: "/task" },
	{ name: "Image", path: "/image" },
	{ name: "Video", path: "/video" },
	{ name: "Whiteboard", path: "/whiteboard" },
];

const route = useRoute();
const isDark = ref(false);
const isMobileMenuOpen = ref(false);
const buttonWorkOSRef = ref<typeof ButtonWorkOS | null>(null);

// Watch for theme changes
watch(isDark, (newVal) => {
	if (newVal) {
		document.documentElement.classList.add("dark");
		localStorage.theme = "dark";
	} else {
		document.documentElement.classList.remove("dark");
		localStorage.theme = "light";
	}
});

// Close mobile menu when route changes
watch(
	() => route.path,
	() => {
		isMobileMenuOpen.value = false;
	},
);

// Check for saved theme preference
onMounted(() => {
	if (typeof window !== "undefined") {
		isDark.value =
			localStorage.theme === "dark" ||
			(!("theme" in localStorage) &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
	}
});

const signIn = () => {
	// Handle sign in
	console.log("Sign in clicked");
	// Example: navigate to sign in page
	// navigateTo('/signin');
};

const getStarted = () => {
	// Handle get started
	console.log("Get started clicked");
	// Example: navigate to sign up page
	// navigateTo('/signup');
};
</script>

<template>
  <nav class="shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between py-4">
        <!-- Left section - Logo -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <Logo />
          </NuxtLink>
        </div>

        <!-- Center section - Navigation Links -->
        <div class="hidden md:flex items-center justify-center flex-1">
          <div class="flex space-x-8">
            <NuxtLink 
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 text-sm font-medium"
              :class="{ 'font-bold': $route.path === item.path }"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Right section - Theme Toggle and Buttons -->
        <div class="flex items-center justify-end ml-auto space-x-2">
          <!-- Theme Toggle -->
          <div class="flex items-center">
            <ToggleTheme v-model="isDark" />
          </div>
          
          <!-- Auth Buttons -->
          <div class="ml-2">
            <ButtonWorkOS ref="buttonWorkOSRef" />
          </div>
          
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button 
              class="focus:outline-none"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            >
              <div class="i-mdi-menu text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-t">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <NuxtLink 
          v-for="item in menuItems"
          :key="`mobile-${item.path}`"
          :to="item.path"
          class="block px-3 py-2 rounded-md text-base font-medium"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </NuxtLink>
        
        <div class="pt-4 pb-2">
          <Button 
            variant="secondary" 
            class="w-full mb-2"
            @click="signIn"
          >
            Sign In
          </Button>
          <Button
            class="w-full"
            @click="getStarted"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Auth Modal is now handled inside ButtonWorkOS component -->
</template>
