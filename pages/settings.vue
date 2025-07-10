<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Active tab state
const activeTab = ref("account");

// Watch for hash changes in URL
onMounted(() => {
	updateActiveTabFromHash();
	window.addEventListener("hashchange", updateActiveTabFromHash);
});

function updateActiveTabFromHash() {
	const hash = window.location.hash.replace("#", "");
	if (
		hash &&
		["account", "appearance", "notifications", "danger"].includes(hash)
	) {
		activeTab.value = hash;
		scrollToSection(hash);
	}
}

function setActiveTab(tab: string) {
	activeTab.value = tab;
	router.push({ hash: `#${tab}` });
	scrollToSection(tab);
}

function scrollToSection(id: string) {
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({ behavior: "smooth" });
	}
}

// Theme settings
const darkMode = ref(false);
const themeColor = ref("blue");
const themeColors = [
	{ name: "Blue", value: "blue" },
	{ name: "Green", value: "green" },
	{ name: "Purple", value: "purple" },
	{ name: "Red", value: "red" },
	{ name: "Orange", value: "orange" },
];

// Notification settings
const emailNotifications = ref(true);
const pushNotifications = ref(true);
const soundEnabled = ref(true);

// Account settings
const email = ref("user@example.com");
const name = ref("John Doe");
const language = ref("en");
const languages = [
	{ name: "English", value: "en" },
	{ name: "ไทย", value: "th" },
];

// Save settings
const saveSettings = () => {
	// Here you would typically make an API call to save the settings
	console.log("Settings saved");
};
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="container mx-auto p-6 max-w-4xl">
      <div class="flex flex-col space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold">Settings</h1>
          <button 
            @click="saveSettings"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>

        <!-- Tabs Navigation -->
        <div class="border-b border-border">
          <nav class="flex space-x-8" aria-label="Settings navigation">
            <button
              v-for="tab in [
                { id: 'account', label: 'Account', icon: 'i-mdi-account-circle' },
                { id: 'appearance', label: 'Appearance', icon: 'i-mdi-palette' },
                { id: 'notifications', label: 'Notifications', icon: 'i-mdi-bell-outline' },
                { id: 'danger', label: 'Danger Zone', icon: 'i-mdi-alert-circle-outline' }
              ]"
              :key="tab.id"
              @click="setActiveTab(tab.id)"
              class="py-4 px-1 border-b-2 font-medium text-sm flex items-center"
              :class="{
                'border-primary text-primary': activeTab === tab.id,
                'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20': activeTab !== tab.id
              }"
            >
              <span :class="`${tab.icon} mr-2 text-lg`"></span>
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <div class="space-y-8 mt-6">
        <!-- Account Settings -->
        <div id="account" class="bg-card p-6 rounded-lg shadow-sm scroll-mt-24">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <span class="i-mdi-account-circle mr-2 text-2xl"></span>
            Account
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input 
                v-model="name"
                type="text" 
                class="w-full p-2 border rounded-md bg-background"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input 
                v-model="email"
                type="email" 
                class="w-full p-2 border rounded-md bg-background"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Language</label>
              <select 
                v-model="language"
                class="w-full p-2 border rounded-md bg-background"
              >
                <option v-for="lang in languages" :key="lang.value" :value="lang.value">
                  {{ lang.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Theme Settings -->
        <div id="appearance" class="bg-card p-6 rounded-lg shadow-sm scroll-mt-24">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <span class="i-mdi-palette mr-2 text-2xl"></span>
            Appearance
          </h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Dark Mode</div>
                <p class="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
              <button 
                @click="darkMode = !darkMode"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="darkMode ? 'bg-primary' : 'bg-muted'"
              >
                <span class="sr-only">Toggle dark mode</span>
                <span 
                  class="inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-transform"
                  :class="{ 'translate-x-6': darkMode, 'translate-x-1': !darkMode }"
                />
              </button>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Theme Color</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in themeColors"
                  :key="color.value"
                  @click="themeColor = color.value"
                  class="h-8 w-8 rounded-full"
                  :class="{
                    'ring-2 ring-offset-2 ring-primary': themeColor === color.value,
                    [`bg-${color.value}-500`]: true,
                    'hover:opacity-80': true
                  }"
                  :title="color.name"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div id="notifications" class="bg-card p-6 rounded-lg shadow-sm scroll-mt-24">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <span class="i-mdi-bell-outline mr-2 text-2xl"></span>
            Notifications
          </h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Email Notifications</div>
                <p class="text-sm text-muted-foreground">Receive email notifications</p>
              </div>
              <button 
                @click="emailNotifications = !emailNotifications"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="emailNotifications ? 'bg-primary' : 'bg-muted'"
              >
                <span 
                  class="inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-transform"
                  :class="{ 'translate-x-6': emailNotifications, 'translate-x-1': !emailNotifications }"
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Push Notifications</div>
                <p class="text-sm text-muted-foreground">Enable push notifications</p>
              </div>
              <button 
                @click="pushNotifications = !pushNotifications"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="pushNotifications ? 'bg-primary' : 'bg-muted'"
              >
                <span 
                  class="inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-transform"
                  :class="{ 'translate-x-6': pushNotifications, 'translate-x-1': !pushNotifications }"
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Sound</div>
                <p class="text-sm text-muted-foreground">Enable sound for notifications</p>
              </div>
              <button 
                @click="soundEnabled = !soundEnabled"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="soundEnabled ? 'bg-primary' : 'bg-muted'"
              >
                <span 
                  class="inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-transform"
                  :class="{ 'translate-x-6': soundEnabled, 'translate-x-1': !soundEnabled }"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div id="danger" class="border border-destructive/20 bg-destructive/5 p-6 rounded-lg scroll-mt-24">
          <h2 class="text-xl font-semibold mb-4 flex items-center text-destructive">
            <span class="i-mdi-alert-circle-outline mr-2 text-2xl"></span>
            Danger Zone
          </h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-medium">Delete Account</h3>
              <p class="text-sm text-muted-foreground mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 6rem;
}

/* Tab focus styles */
button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Scroll margin for section headings */
.scroll-mt-24 {
  scroll-margin-top: 6rem;
}
</style>