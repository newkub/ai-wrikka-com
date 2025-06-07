<script setup lang="ts">
import ModalCommandPalette from "~/components/modal/ModalCommandPalette.vue";
import ModalAuth from "~/components/modal/ModalAuth.vue";
import ModalSettings from "~/components/modal/ModalSettings.vue";
import Avatar from "~/components/Avatar.vue";
import Dropdown from "~/components/input/Dropdown.vue";
import NavItems from "~/components/navigation/NavItems.vue";
import Button from "~/components/button/Button.vue";
import { useTheme } from "~/composables/useTheme";
import { useModal } from "~/composables/useModal";
import { useDropdown } from "~/composables/useDropdown";

// Theme
const { isDark, toggleTheme } = useTheme();

// Modals
const { isOpen: showModalSettings, toggle: toggleSettings } = useModal();
const { isOpen: showAuthModal, toggle: toggleAuth } = useModal();
const { isOpen: showModalCommandPalette, toggle: toggleCommandPalette } =
	useModal();

// Dropdown
const {
	isOpen: isProfileOpen,
	dropdownRef: profileDropdownRef,
	toggle: toggleProfile,
} = useDropdown();
const isDropdownOpen = ref(false);

// Theme toggle is now handled by useTheme composable

// Modal controls
const openModal =
	(modal: "settings" | "profile" | "commandPalette") => (event: Event) => {
		event.stopPropagation();
		closeModals();

		// Open the requested modal
		switch (modal) {
			case "settings":
				showModalSettings.value = true;
				break;
			case "profile":
				isProfileOpen.value = true;
				isDropdownOpen.value = true;
				break;
			case "commandPalette":
				showModalCommandPalette.value = true;
				break;
		}

		// Prevent body scroll when modal is open
		document.body.style.overflow = "hidden";
	};

const closeModals = () => {
	showModalSettings.value = false;
	showAuthModal.value = false;
	showModalCommandPalette.value = false;
	isProfileOpen.value = false;
	isDropdownOpen.value = false;
	document.body.style.overflow = "";
};

// User actions
const signOut = () => {
	console.log("Signing out...");
	closeModals();
};

const openBilling = (event: Event) => {
	event.stopPropagation();
	closeModals();
	console.log("Open billing page");
	// navigateTo('/billing');
};

const toggleDropdown = (event: Event) => {
	event.stopPropagation();
	isDropdownOpen.value = !isDropdownOpen.value;
	if (!isDropdownOpen.value) {
		isProfileOpen.value = false;
	}
};
</script>


<template>
  <nav class="bg-background shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex-shrink-0 flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div class="i-mdi-home h-6 w-6 text-brand" />
          <span class="text-xl font-bold text-text">AI Wrikka</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NavItems />
        </div>

        <!-- Right side items -->
        <div class="flex items-center space-x-4">
          <!-- Search Button -->
          <button 
            @click="openModal('commandPalette')($event)"
            class="p-2 rounded-full text-text hover:bg-surface"
            aria-label="Search"
          >
            <div class="i-mdi-magnify h-5 w-5" />
          </button>


          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-full text-text hover:bg-surface"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <div v-if="isDark" class="i-mdi-weather-sunny h-5 w-5" />
            <div v-else class="i-mdi-weather-night h-5 w-5" />
          </button>

          <!-- User Menu -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown($event)"
              class="flex items-center focus:outline-none"
              aria-haspopup="true"
              :aria-expanded="isDropdownOpen"
            >
              <Avatar :is-open="isDropdownOpen" />
            </button>
            
            <Dropdown 
              v-if="isDropdownOpen" 
              :is-open="isDropdownOpen" 
              position="right" 
              @close="closeModals"
              class="z-50"
            >
              <button
                @click="openModal('profile')($event)"
                class="w-full text-left px-4 py-2 text-sm text-text hover:bg-surface flex items-center space-x-2"
                role="menuitem"
                tabindex="-1"
              >
                <div class="i-mdi-account h-5 w-5" />
                <span>Your Profile</span>
              </button>
              <button
                @click="openBilling($event)"
                class="w-full text-left px-4 py-2 text-sm text-text hover:bg-surface flex items-center space-x-2"
                role="menuitem"
                tabindex="-1"
              >
                <div class="i-mdi-credit-card h-5 w-5" />
                <span>Billing</span>
              </button>
              <button
                @click="openModal('settings')($event)"
                class="w-full text-left px-4 py-2 text-sm text-text hover:bg-surface flex items-center space-x-2"
                role="menuitem"
                tabindex="-1"
              >
                <div class="i-mdi-cog h-5 w-5" />
                <span>Settings</span>
              </button>
              <div class="border-t border-border my-1"></div>
              <button
                @click="signOut"
                class="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface flex items-center space-x-2"
                role="menuitem"
                tabindex="-1"
              >
                <div class="i-mdi-logout h-5 w-5" />
                <span>Sign out</span>
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu button -->
    <div class="md:hidden">
      <button class="mobile-menu-button p-2 rounded-md text-text hover:bg-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand">
        <div class="i-mdi-menu h-6 w-6" />
      </button>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="md:hidden mobile-menu hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <NavItems vertical />
      </div>
    </div>

    <!-- Auth Modal -->
    <ModalAuth v-model="showAuthModal" @close="showAuthModal = false" />

    <!-- Command Palette Modal -->
    <ModalCommandPalette 
      v-model="showModalCommandPalette"
      @close="closeModals"
    />

    <!-- Settings Modal -->
    <ModalSettings 
      v-model="showModalSettings"
      @close="closeModals"
    />
  </nav>
</template>