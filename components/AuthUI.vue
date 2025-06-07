<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Input, Button, Checkbox, Tab } from './primitive';

const props = defineProps<{
  isOpen: boolean;
  mode?: 'signin' | 'signup';
}>();

const emit = defineEmits(['close', 'success', 'update:mode']);

const localMode = ref<'signin' | 'signup'>(props.mode || 'signin');
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const error = ref('');

// Watch for mode changes from parent
watch(() => props.mode, (newMode) => {
  if (newMode) {
    localMode.value = newMode;
  }
});

const setMode = (mode: 'signin' | 'signup') => {
  localMode.value = mode;
  emit('update:mode', mode);
  error.value = ''; // Clear error when switching modes
};

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, consider it a success
    emit('success', {
      user: {
        email: email.value,
        name: email.value.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.value.split('@')[0])}&background=random`
      }
    });
  } catch (err) {
    error.value = 'An error occurred. Please try again.';
    console.error('Auth error:', err);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  email.value = '';
  password.value = '';
  error.value = '';
  emit('close');
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div class="fixed inset-0 transition-opacity" @click="closeModal">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
        </Transition>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div class="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-xl dark:bg-gray-800">
            <!-- Tabs -->
            <Tab
              v-model="localMode"
              :tabs="[
                { id: 'signin', label: 'Sign In' },
                { id: 'signup', label: 'Create Account' },
              ]"
              @update:modelValue="setMode($event)"
              variant="underline"
              full-width
            />

            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ localMode === 'signin' ? 'Welcome back' : 'Create your account' }}
                </h2>
                <button
                  type="button"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  @click="closeModal"
                >
                  <span class="sr-only">Close</span>
                  <i class="i-mdi-close w-6 h-6" />
                </button>
              </div>

            <div v-if="error" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
              {{ error }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <Input
                v-model="email"
                id="email"
                label="Email address"
                type="email"
                required
                placeholder="you@example.com"
                autocomplete="email"
                icon="i-mdi-email-outline"
                :error="error"
              />

              <Input
                v-model="password"
                id="password"
                label="Password"
                type="password"
                required
                :placeholder="localMode === 'signin' ? 'Enter your password' : 'Create a password'"
                :autocomplete="localMode === 'signin' ? 'current-password' : 'new-password'"
                icon="i-mdi-lock-outline"
              />

              <div v-if="localMode === 'signin'" class="flex items-center justify-between">
                <Checkbox
                  v-model="rememberMe"
                  id="remember-me"
                  label="Remember me"
                  class="mr-2"
                />

                <div class="text-sm">
                  <a href="#" class="font-medium text-color-primary hover:text-color-primary-dark">
                    Forgot password?
                  </a>
                </div>
              </div>


              <Button
                type="submit"
                :loading="loading"
                :disabled="loading"
                variant="primary"
                size="lg"
                class="w-full"
              >
                {{ localMode === 'signin' ? 'Sign in' : 'Create account' }}
              </Button>
            </form>
            </div> <!-- Close p-6 div -->

            <div v-if="localMode === 'signin'" class="px-6 pb-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 text-gray-500 bg-white dark:bg-gray-800">
                    Or continue with
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-6">
                <div>
                  <a
                    href="#"
                    class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                  >
                    <span class="sr-only">Sign in with Google</span>
                    <i class="i-mdi-google w-5 h-5" />
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                  >
                    <span class="sr-only">Sign in with GitHub</span>
                    <i class="i-mdi-github w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ localMode === 'signin' ? "Don't have an account?" : 'Already have an account?' }}
                <button
                  type="button"
                  @click="setMode(localMode === 'signin' ? 'signup' : 'signin')"
                  class="font-medium text-color-primary hover:text-color-primary-dark"
                >
                  {{ localMode === 'signin' ? 'Sign up' : 'Sign in' }}
                </button>
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
