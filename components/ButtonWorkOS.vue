
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Avatar, Dropdown } from './primitive';
import AuthUI from './AuthUI.vue';
import Account from './Account.vue';

const isAuthModalOpen = ref(false);
const isAuthenticated = ref(false);
let authMode: 'signin' | 'signup' = 'signin';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

const user = ref<User>({
  name: '',
  email: '',
  avatar: undefined,
});

// No longer using localStorage

const openAuthModal = (mode: 'signin' | 'signup') => {
  authMode = mode;
  isAuthModalOpen.value = true;
};

const handleAuthSuccess = (data: { user: { name: string; email: string; avatar?: string } }) => {
  console.log('handleAuthSuccess called with data:', data);
  const userData = {
    ...data.user,
    name: data.user.name || data.user.email.split('@')[0],
    avatar: data.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || data.user.email.split('@')[0])}&background=random`
  };
  
  user.value = userData;
  isAuthenticated.value = true;
  isAuthModalOpen.value = false;
  
  console.log('Auth success, user data:', userData);
}

const handleSignOut = () => {
  isAuthenticated.value = false;
  user.value = { name: '', email: '', avatar: undefined };
  console.log('User signed out');
};

defineExpose({
  isAuthenticated,
  user,
  handleAuthSuccess
});
</script>


<template>
  <div class="flex items-center space-x-2">
    <Button 
      v-if="!isAuthenticated" 
      variant="secondary" 
      @click="openAuthModal('signin')"
      class="hidden md:flex"
    >
      Sign in
    </Button>
    
    <div v-if="isAuthenticated" class="md:block">
      <Dropdown>
        <template #trigger="{ open }">
          <Button variant="secondary" class="flex items-center space-x-2">
            <div class="flex items-center">
              <Avatar 
                :name="user.name" 
                :image-url="user.avatar"
                class="border-2 border-blue-500"
              />
            </div>
            <span class="text-sm font-medium">
              {{ user.name }}
            </span>
          </Button>
        </template>
        <div class="py-1">
          <Account @signout="handleSignOut" />
          <div class="border-t border-gray-100 dark:border-gray-700"></div>
          <button
            @click="handleSignOut"
            class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Sign out
          </button>
        </div>
      </Dropdown>
    </div>
  </div>

  <!-- Auth Modal -->
  <AuthUI 
    v-if="isAuthModalOpen"
    :is-open="isAuthModalOpen"
    :mode="authMode"
    @close="isAuthModalOpen = false"
    @success="handleAuthSuccess"
    @update:mode="(newMode: 'signin' | 'signup') => {
      authMode = newMode;
    }"
  />
</template>
