<script setup lang="ts">
import { ref } from "vue";

interface Tab {
	id: string;
	label: string;
	icon: string;
}

interface SettingsProps {
	isOpen: boolean;
}

const props = defineProps<SettingsProps>();

const emit = defineEmits<(e: "close") => void>();

const activeTab = ref("profile");

const tabs: Tab[] = [
	{ id: "profile", label: "Profile", icon: "i-mdi-account" },
	{ id: "billing", label: "Billing", icon: "i-mdi-credit-card" },
	{ id: "appearance", label: "Appearance", icon: "i-mdi-palette" },
	{ id: "accounts", label: "Accounts", icon: "i-mdi-account-group" },
	{ id: "security", label: "Security", icon: "i-mdi-shield-lock" },
	{ id: "data-privacy", label: "Data & Privacy", icon: "i-mdi-shield-account" },
	{ id: "wallet", label: "Wallet", icon: "i-mdi-wallet" },
];

const closeModal = () => {
	emit("close");
};

const setActiveTab = (tabId: string) => {
	activeTab.value = tabId;
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
      <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Settings</h3>
        <button 
          @click.stop="closeModal" 
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
        >
          <span class="sr-only">Close</span>
          <div class="i-mdi-close h-6 w-6" />
        </button>
      </div>
      
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar Navigation -->
        <div class="w-56 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 overflow-y-auto">
          <nav class="p-2 space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="setActiveTab(tab.id)"
              class="w-full text-left px-3 py-2.5 text-sm rounded-md flex items-center space-x-3 transition-colors"
              :class="{
                'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200': activeTab === tab.id,
                'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeTab !== tab.id
              }"
            >
              <div :class="tab.icon" class="h-5 w-5" />
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">Profile Settings</h4>
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <div class="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-white">
                  U
                </div>
                <div>
                  <button class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                    Change photo
                  </button>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First name</label>
                  <input type="text" id="first-name" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div>
                  <label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last name</label>
                  <input type="text" id="last-name" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div class="md:col-span-2">
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                  <input type="email" id="email" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                </div>
              </div>
              
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Save changes
                </button>
              </div>
            </div>
          </div>

          <!-- Billing Tab -->
          <div v-else-if="activeTab === 'billing'" class="space-y-6">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">Billing Information</h4>
            <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <div class="i-mdi-information text-yellow-400 h-5 w-5" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700 dark:text-yellow-400">
                    This is a demo billing section. No actual payment information is collected.
                  </p>
                </div>
              </div>
            </div>
            <!-- Billing content would go here -->
          </div>

          <!-- Appearance Tab -->
          <div v-else-if="activeTab === 'appearance'" class="space-y-6">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">Appearance</h4>
            <div class="space-y-4">
              <div>
                <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</h5>
                <div class="grid grid-cols-3 gap-4">
                  <button class="p-4 border rounded-lg text-center hover:border-indigo-500 dark:border-gray-600 dark:hover:border-indigo-500">
                    <div class="mx-auto h-6 w-6 text-gray-900 dark:text-gray-300">
                      <i class="mdi mdi-weather-sunny"></i>
                    </div>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Light</p>
                  </button>
                  <button class="p-4 border rounded-lg text-center hover:border-indigo-500 dark:border-gray-600 dark:hover:border-indigo-500">
                    <div class="mx-auto h-6 w-6 text-gray-900 dark:text-gray-300">
                      <i class="mdi mdi-weather-night"></i>
                    </div>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Dark</p>
                  </button>
                  <button class="p-4 border rounded-lg text-center hover:border-indigo-500 dark:border-gray-600 dark:hover:border-indigo-500">
                    <div class="mx-auto h-6 w-6 text-gray-900 dark:text-gray-300">
                      <i class="mdi mdi-monitor"></i>
                    </div>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">System</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Tabs - Placeholder Content -->
          <div v-else class="flex items-center justify-center h-64">
            <div class="text-center">
              <div class="i-mdi-cog text-4xl text-gray-400 dark:text-gray-500 mx-auto h-12 w-12" />
              <h4 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">{{ tabs.find(t => t.id === activeTab)?.label }} Settings</h4>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">This section is under development.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex justify-end space-x-3" @click.stop>
        <button 
          @click="closeModal" 
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save changes
        </button>
      </div>
    </div>
  </div>
</template>
