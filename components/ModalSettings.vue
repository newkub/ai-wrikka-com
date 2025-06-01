<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Tab {
	id: string;
	label: string;
	icon: string;
}

interface SearchableItem {
	id: string;
	label: string;
	icon?: string;
	keywords: string[];
	tab: string;
	section?: string;
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
	set: (value: boolean) => emit("update:modelValue", value),
});

const activeTab = ref("profile");
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
		keywords: ["profile", "picture", "avatar", "photo"],
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

// Filter tabs based on search query
const filteredTabs = computed(() => {
	if (!isSearching.value) return tabs;

	const query = searchQuery.value.toLowerCase();
	const matchingItems = searchableItems.filter(
		(item) =>
			item.label.toLowerCase().includes(query) ||
			item.keywords.some((keyword) => keyword.includes(query)),
	);

	const tabIds = new Set(matchingItems.map((item) => item.tab));
	return tabs.filter((tab) => tabIds.has(tab.id));
});

// Filter searchable items based on search query
const filteredItems = computed(() => {
	if (!isSearching.value) return [];

	const query = searchQuery.value.toLowerCase();
	return searchableItems.filter(
		(item) =>
			item.label.toLowerCase().includes(query) ||
			item.keywords.some((keyword) => keyword.includes(query)),
	);
});

// Group filtered items by tab
const groupedItems = computed(() => {
	const groups: Record<string, SearchableItem[]> = {};

	for (const item of filteredItems.value) {
		if (!groups[item.tab]) {
			groups[item.tab] = [];
		}
		groups[item.tab].push(item);
	}

	return Object.entries(groups).map(([tabId, items]) => ({
		tab: tabs.find((t) => t.id === tabId) as Tab,
		items,
	}));
});

// Navigate to a tab and clear search
const navigateToTab = (tabId: string) => {
	activeTab.value = tabId;
	searchQuery.value = "";
	window.location.hash = `#${tabId}`;
};

const closeModal = () => {
	isOpen.value = false;
	emit("close");
};

// Update URL hash when tab changes
const setActiveTab = (tabId: string) => {
	if (activeTab.value !== tabId) {
		activeTab.value = tabId;
		window.location.hash = `#${tabId}`;
	}
};

// Sync active tab with URL hash
const syncTabFromHash = () => {
	const hash = window.location.hash.replace("#", "");
	if (hash && tabs.some((tab) => tab.id === hash)) {
		activeTab.value = hash;
	} else {
		// Default to first tab if no valid hash
		activeTab.value = tabs[0].id;
		window.location.hash = `#${tabs[0].id}`;
	}
};

// Initialize tab from URL hash on mount
onMounted(() => {
	syncTabFromHash();

	// Handle browser back/forward navigation
	window.addEventListener("popstate", syncTabFromHash);

	// Cleanup event listener
	return () => {
		window.removeEventListener("popstate", syncTabFromHash);
	};
});

// Watch for route hash changes
watch(
	() => route.hash,
	(newHash) => {
		const tabId = newHash.replace("#", "");
		if (
			tabId &&
			tabId !== activeTab.value &&
			tabs.some((tab) => tab.id === tabId)
		) {
			activeTab.value = tabId;
		}
	},
);

// Handle modal open/close
watch(
	() => props.modelValue,
	(newVal) => {
		if (newVal) {
			emit("open");
		} else {
			emit("close");
		}
	},
);
</script>

<template>
  <Modal
    v-model="isOpen"
    title="Settings"
    :show-close-button="true"
    :close-on-backdrop="true"
    :close-on-esc="true"
    content-class="max-w-4xl w-full max-h-[90vh] overflow-hidden p-0"
    no-padding
    @close="closeModal"
  >
    <div class="border-b border-border p-4">
      <div class="relative">
        <div class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
          <div class="i-mdi-magnify h-5 w-5 text-text/40" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-surface text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
          placeholder="Search settings..."
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-text/40 hover:text-text/60 transition-colors"
        >
          <div class="i-mdi-close-circle h-5 w-5" />
        </button>
      </div>
    </div>
      
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar Navigation -->
        <div class="w-56 border-r border-border bg-surface/50 overflow-y-auto flex flex-col">
          <div class="p-2 space-y-1 flex-1 overflow-y-auto">
            <template v-if="!isSearching">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="setActiveTab(tab.id)"
                class="w-full text-left px-3 py-2.5 text-sm rounded-md flex items-center space-x-3 transition-colors"
                :class="{
                  'bg-brand/10 text-brand': activeTab === tab.id,
                  'text-text/70 hover:bg-surface/50': activeTab !== tab.id
                }"
              >
                <div :class="tab.icon" class="h-5 w-5" />
                <span>{{ tab.label }}</span>
              </button>
            </template>
            <template v-else>
              <div v-if="filteredTabs.length > 0" class="px-2 py-1 text-xs font-medium text-text/50 uppercase tracking-wider">
                Tabs
              </div>
              <div v-for="tab in filteredTabs" :key="`tab-${tab.id}`" class="mb-1">
                <button
                  @click="navigateToTab(tab.id)"
                  class="w-full text-left px-3 py-2 text-sm rounded-md flex items-center space-x-3 transition-colors hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <div :class="tab.icon" class="h-5 w-5 text-brand" />
                  <span class="font-medium">{{ tab.label }}</span>
                </button>
              </div>
              <div v-if="filteredItems.length > 0" class="px-2 py-1 mt-4 text-xs font-medium text-text/50 uppercase tracking-wider">
                Settings
              </div>
              <div v-for="(group, index) in groupedItems" :key="`group-${index}`" class="mb-1">
                <div class="px-3 py-1.5 text-xs font-medium text-text/70">
                  {{ group.tab.label }}
                </div>
                <div v-for="item in group.items" :key="item.id" class="pl-3">
                  <button
                    @click="navigateToTab(group.tab.id)"
                    class="w-full text-left px-3 py-2 text-sm rounded-md flex items-center space-x-3 transition-colors hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <div class="h-2 w-2 rounded-full bg-text/30" />
                    <span>{{ item.label }}</span>
                  </button>
                </div>
              </div>
            </template>
          </div>
          <div v-if="isSearching && filteredItems.length === 0" class="p-4 text-center text-text/50">
            No results found for "{{ searchQuery }}"
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Search Results -->
          <div v-if="isSearching" class="space-y-8">
            <div v-if="filteredItems.length === 0" class="text-center py-12">
              <div class="i-mdi-magnify-remove-outline mx-auto h-12 w-12 text-text/30" />
              <h3 class="mt-2 text-lg font-medium text-text">No results found</h3>
              <p class="mt-1 text-text/50">We couldn't find any settings matching "{{ searchQuery }}"</p>
            </div>

            <div v-else v-for="group in groupedItems" :key="`result-group-${group.tab.id}`" class="space-y-4">
              <div class="flex items-center space-x-2 mb-2">
                <div :class="group.tab.icon" class="h-5 w-5 text-brand" />
                <h3 class="text-base font-medium text-text">{{ group.tab.label }}</h3>
              </div>
              
              <div class="grid gap-3 pl-7">
                <div 
                  v-for="(item, itemIndex) in group.items" 
                  :key="`result-${itemIndex}`"
                  class="p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                  @click="navigateToTab(group.tab.id)">
                  <h4 class="font-medium text-text">{{ item.label }}</h4>
                  <p class="text-sm text-text/50 mt-1">
                    {{ group.tab.label }} • {{ item.keywords.slice(0, 3).join(', ') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Regular Tab Content -->
          <template v-else>
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <h4 class="text-lg font-medium text-text">Profile Settings</h4>
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <div class="h-16 w-16 rounded-full bg-surface-200 flex items-center justify-center text-2xl font-bold text-text">
                  U
                </div>
                <div>
                  <button class="text-sm font-medium text-brand hover:text-brand/80 transition-colors">
                    Change photo
                  </button>
                  <p class="text-xs text-text/50 mt-1">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="first-name" class="block text-sm font-medium text-text mb-1">First name</label>
                  <input type="text" id="first-name" class="w-full rounded-md border border-border bg-surface text-text shadow-sm focus:border-brand focus:ring-brand">
                </div>
                <div>
                  <label for="last-name" class="block text-sm font-medium text-text mb-1">Last name</label>
                  <input type="text" id="last-name" class="w-full rounded-md border border-border bg-surface text-text shadow-sm focus:border-brand focus:ring-brand">
                </div>
                <div class="md:col-span-2">
                  <label for="email" class="block text-sm font-medium text-text mb-1">Email address</label>
                  <input type="email" id="email" class="w-full rounded-md border border-border bg-surface text-text shadow-sm focus:border-brand focus:ring-brand">
                </div>
              </div>
              
              <div class="pt-4 border-t border-border">
                <button class="px-4 py-2 bg-brand text-white text-sm font-medium rounded-md hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand/50 transition-colors">
                  Save changes
                </button>
              </div>
            </div>
          </div>

          <!-- Billing Tab -->
          <div v-else-if="activeTab === 'billing'" class="space-y-6">
            <h4 class="text-lg font-medium text-text">Billing Information</h4>
            <div class="bg-alert/10 border-l-4 border-alert p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <div class="i-mdi-information text-alert h-5 w-5" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-alert">
                    This is a demo billing section. No actual payment information is collected.
                  </p>
                </div>
              </div>
            </div>
            <!-- Billing content would go here -->
          </div>

          <!-- Integration Tab -->
          <div v-else-if="activeTab === 'integration'" class="space-y-6">
            <h4 class="text-lg font-medium text-text">Integrations</h4>
            <div class="space-y-4">
              <div class="bg-surface-100 dark:bg-surface-800 p-4 rounded-lg border border-border">
                <div class="flex items-start justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
                      <div class="i-mdi-github h-5 w-5 text-text" />
                    </div>
                    <div>
                      <h5 class="font-medium text-text">GitHub</h5>
                      <p class="text-sm text-text/70">Connect your GitHub account to sync your repositories</p>
                    </div>
                  </div>
                  <button class="px-3 py-1.5 text-sm font-medium rounded-md border border-border bg-surface hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                    Connect
                  </button>
                </div>
              </div>

              <div class="bg-surface-100 dark:bg-surface-800 p-4 rounded-lg border border-border">
                <div class="flex items-start justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
                      <div class="i-mdi-google h-5 w-5 text-text" />
                    </div>
                    <div>
                      <h5 class="font-medium text-text">Google Workspace</h5>
                      <p class="text-sm text-text/70">Connect your Google account to access Google Drive and Calendar</p>
                    </div>
                  </div>
                  <button class="px-3 py-1.5 text-sm font-medium rounded-md border border-border bg-surface hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                    Connect
                  </button>
                </div>
              </div>

              <div class="bg-surface-100 dark:bg-surface-800 p-4 rounded-lg border border-border">
                <div class="flex items-start justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
                      <div class="i-mdi-slack h-5 w-5 text-text" />
                    </div>
                    <div>
                      <h5 class="font-medium text-text">Slack</h5>
                      <p class="text-sm text-text/70">Connect your Slack workspace to receive notifications</p>
                    </div>
                  </div>
                  <button class="px-3 py-1.5 text-sm font-medium rounded-md border border-border bg-surface hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Appearance Tab -->
          <div v-else-if="activeTab === 'appearance'" class="space-y-6">
            <h4 class="text-lg font-medium text-text">Appearance</h4>
            <div class="space-y-4">
              <div>
                <h5 class="text-sm font-medium text-text mb-2">Theme</h5>
                <div class="grid grid-cols-3 gap-4">
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
              <h4 class="mt-2 text-lg font-medium text-text">{{ tabs.find(t => t.id === activeTab)?.label }} Settings</h4>
              <p class="mt-1 text-sm text-text/50">This section is under development.</p>
            </div>
          </div>
          </template> <!-- Close v-else template -->
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
