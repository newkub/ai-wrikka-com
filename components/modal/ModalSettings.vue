<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Tab {
	id: string;
	label: string;
	icon: string;
	keywords?: string[];
}

interface SearchableItem {
	id: string;
	label: string;
	icon?: string;
	keywords: string[];
	tab: string;
	section?: string;
	items?: SearchableItem[];
}

const props = withDefaults(
	defineProps<{
		modelValue: boolean;
	}>(),
	{
		modelValue: false,
	},
);

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "close"): void;
	(e: "open"): void;
}>();

const route = useRoute();
const router = useRouter();

// Handle v-model
const isOpen = computed({
	get: () => props.modelValue,
	set: (value: boolean) => {
		emit('update:modelValue', value)
	},
});

const activeTab = ref<string>((route.query.tab && typeof route.query.tab === 'string') ? route.query.tab : "profile");
const searchQuery = ref("");
const isSearching = computed(() => searchQuery.value.trim().length > 0);

const tabs: Tab[] = [
	{ id: "profile", label: "Profile", icon: "i-mdi-account" },
	{ id: "billing", label: "Billing", icon: "i-mdi-credit-card" },
	{ id: "appearance", label: "Appearance", icon: "i-mdi-palette" },
	{ id: "accounts", label: "Accounts", icon: "i-mdi-account-group" },
	{ id: "security", label: "Security", icon: "i-mdi-shield-lock" },
	{ id: "data-privacy", label: "Data & Privacy", icon: "i-mdi-shield-account" },
	{ id: "wallet", label: "Wallet", icon: "i-mdi-wallet" },
	{ id: "integration", label: "Integration", icon: "i-mdi-puzzle" },
];

// Searchable settings items
const searchableItems: SearchableItem[] = [
	// Profile
	{
		id: "profile-account",
		label: "Account Information",
		tab: "profile",
		keywords: ["profile", "account", "name", "email", "information"],
	},
	{
		id: "profile-avatar",
		label: "Profile Picture",
		tab: "profile",
		keywords: ["profile", "picture", "avatar", "photo", "image"],
	},
	// Billing
	{
		id: "billing-info",
		label: "Billing Information",
		tab: "billing",
		keywords: ["billing", "payment", "credit card", "subscription"],
	},
	{
		id: "billing-invoices",
		label: "Invoices",
		tab: "billing",
		keywords: ["billing", "invoices", "receipts", "payments"],
	},
	{
		id: "billing-plan",
		label: "Plan & Usage",
		tab: "billing",
		keywords: ["plan", "subscription", "usage", "upgrade", "downgrade"],
	},
	// Appearance
	{
		id: "appearance-theme",
		label: "Theme",
		tab: "appearance",
		keywords: ["appearance", "theme", "dark mode", "light mode", "system"],
	},
	{
		id: "appearance-font",
		label: "Font",
		tab: "appearance",
		keywords: ["appearance", "font", "typography", "text"],
	},
	{
		id: "appearance-density",
		label: "Density",
		tab: "appearance",
		keywords: ["appearance", "density", "compact", "spacing"],
	},
	// Accounts
	{
		id: "accounts-connected",
		label: "Connected Accounts",
		tab: "accounts",
		keywords: ["accounts", "connected", "social", "link"],
	},
	{
		id: "accounts-import",
		label: "Import Data",
		tab: "accounts",
		keywords: ["accounts", "import", "export", "data"],
	},
	// Security
	{
		id: "security-password",
		label: "Password",
		tab: "security",
		keywords: ["security", "password", "login", "authentication"],
	},
	{
		id: "security-2fa",
		label: "Two-Factor Authentication",
		tab: "security",
		keywords: ["security", "2fa", "two factor", "authentication"],
	},
	{
		id: "security-sessions",
		label: "Active Sessions",
		tab: "security",
		keywords: ["security", "sessions", "devices", "login"],
	},
	// Data & Privacy
	{
		id: "privacy-data",
		label: "Data Usage",
		tab: "data-privacy",
		keywords: ["privacy", "data", "usage", "collection"],
	},
	{
		id: "privacy-export",
		label: "Export Data",
		tab: "data-privacy",
		keywords: ["privacy", "export", "data", "download"],
	},
	{
		id: "privacy-delete",
		label: "Delete Account",
		tab: "data-privacy",
		keywords: ["privacy", "delete", "account", "remove"],
	},
	// Wallet
	{
		id: "wallet-balance",
		label: "Balance",
		tab: "wallet",
		keywords: ["wallet", "balance", "credits", "tokens"],
	},
	{
		id: "wallet-transactions",
		label: "Transaction History",
		tab: "wallet",
		keywords: ["wallet", "transactions", "history", "payments"],
	},
	// Integration
	{
		id: "integration-github",
		label: "GitHub",
		tab: "integration",
		keywords: ["integration", "github", "repository", "code"],
	},
	{
		id: "integration-google",
		label: "Google Workspace",
		tab: "integration",
		keywords: ["integration", "google", "workspace", "drive", "calendar"],
	},
	{
		id: "integration-slack",
		label: "Slack",
		tab: "integration",
		keywords: ["integration", "slack", "notifications", "messages"],
	},
];

// Filter items based on search query
const filteredItems = computed(() => {
	if (!isSearching.value) return searchableItems;
	
	const query = searchQuery.value.toLowerCase();
	return searchableItems.filter(item => {
		const matchesLabel = item.label.toLowerCase().includes(query);
		const matchesKeywords = item.keywords.some(keyword => keyword.toLowerCase().includes(query));
		return matchesLabel || matchesKeywords;
	});
});

// Get current tab
const currentTab = computed(() => {
	return tabs.find(tab => tab.id === activeTab.value);
});

// Close modal
const closeModal = () => {
	emit('close');
	emit('update:modelValue', false);
};

// Watch for route changes to update active tab
watch(() => route.query.tab, (newTab) => {
	if (newTab && typeof newTab === 'string') {
		activeTab.value = newTab;
	}
});

// Watch for active tab changes to update route
watch(activeTab, (newTab) => {
	router.replace({ query: { ...route.query, tab: newTab } });
});

// Watch for modal open/close
watch(isOpen, (value) => {
	if (value) {
		emit('open');
	} else {
		emit('close');
	}
});
</script>

<template>
  <Modal
    v-model="isOpen"
    class="max-w-3xl"
    @close="closeModal"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-text">Settings</h3>
        <button @click="closeModal" class="text-text/50 hover:text-text">
          <i class="i-mdi-close text-xl" />
        </button>
      </div>
    </template>

    <div class="flex h-[calc(100vh-12rem)]">
      <!-- Sidebar -->
      <div class="w-56 border-r border-border pr-4">
        <!-- Search -->
        <div class="relative mb-4">
          <i class="i-mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-text/50" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search settings"
            class="w-full rounded-lg border border-border bg-surface px-3 py-2 pl-9 text-sm text-text placeholder-text/50 focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>

        <!-- Tabs -->
        <div v-if="!isSearching" class="space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
            :class="{
              'bg-surface-100 text-brand dark:bg-surface-700': activeTab === tab.id,
              'text-text/70 hover:bg-surface-50 dark:hover:bg-surface-800': activeTab !== tab.id,
            }"
          >
            <i :class="tab.icon" class="text-lg" />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Search Results -->
        <div v-else class="space-y-2">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-text/50">
            Results ({{ filteredItems.length }})
          </h4>
          <div class="space-y-1">
            <button
              v-for="item in filteredItems"
              :key="item.id"
              @click="activeTab = item.tab"
              class="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-text/70 hover:bg-surface-50 dark:hover:bg-surface-800"
            >
              <i v-if="item.icon" :class="item.icon" class="text-lg" />
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto pl-6">
        <div class="py-2">
          <div v-if="isSearching">
            <div v-if="filteredItems.length === 0" class="flex h-64 items-center justify-center">
              <div class="text-center">
                <i class="i-mdi-magnify-remove text-4xl text-text/30 mx-auto h-12 w-12" />
                <h4 class="mt-2 text-lg font-medium text-text">No results found</h4>
                <p class="mt-1 text-sm text-text/50">
                  Try searching for something else
                </p>
              </div>
            </div>

            <div v-else>
              <h3 class="mb-4 text-lg font-medium text-text">
                Search results for "{{ searchQuery }}"
              </h3>
              <div v-for="item in filteredItems" :key="item.id" class="mb-6">
                <h4 class="mb-2 text-sm font-medium text-text">{{ item.label }}</h4>
                <p class="text-sm text-text/70">
                  Found in {{ tabs.find(t => t.id === item.tab)?.label || item.tab }} settings
                </p>
              </div>
            </div>
          </div>

          <div v-else>
            <!-- Appearance Tab -->
            <div v-if="activeTab === 'appearance'">
              <h3 class="mb-4 text-lg font-medium text-text">
                {{ currentTab?.label }} Settings
              </h3>

              <div class="space-y-6">
                <div>
                  <h4 class="mb-3 text-sm font-medium text-text">Theme</h4>
                  <div class="grid grid-cols-3 gap-3">
                    <button class="p-4 border border-border rounded-lg text-center hover:border-brand transition-colors">
                      <div class="mx-auto h-6 w-6 text-text">
                        <i class="i-mdi-weather-sunny"></i>
                      </div>
                      <p class="mt-2 text-sm text-text">Light</p>
                    </button>
                    <button class="p-4 border border-border rounded-lg text-center hover:border-brand transition-colors">
                      <div class="mx-auto h-6 w-6 text-text">
                        <i class="i-mdi-weather-night"></i>
                      </div>
                      <p class="mt-2 text-sm text-text">Dark</p>
                    </button>
                    <button class="p-4 border border-border rounded-lg text-center hover:border-brand transition-colors">
                      <div class="mx-auto h-6 w-6 text-text">
                        <i class="i-mdi-monitor"></i>
                      </div>
                      <p class="mt-2 text-sm text-text">System</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Other Tabs - Placeholder Content -->
            <div v-else class="flex items-center justify-center h-64">
              <div class="text-center">
                <div class="i-mdi-cog text-4xl text-text/30 mx-auto h-12 w-12" />
                <h4 class="mt-2 text-lg font-medium text-text">{{ currentTab?.label }} Settings</h4>
                <p class="mt-1 text-sm text-text/50">This section is under development.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end space-x-3">
        <button 
          @click="closeModal" 
          class="px-4 py-2 text-sm font-medium text-text/70 hover:text-text rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          Close
        </button>
        <button 
          class="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 rounded-md transition-colors"
        >
          Save Changes
        </button>
      </div>
    </template>
  </Modal>
</template>
