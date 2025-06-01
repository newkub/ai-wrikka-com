<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Ref } from "vue";

type AuthMode = "signin" | "signup" | "forgot-password";

interface AuthSuccessData {
	email: string;
	name?: string;
	token?: string;
	// Add other fields that your auth API returns on success
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
	(e: "success", data: AuthSuccessData): void;
	(e: "close"): void;
	(e: "open"): void;
}>();

const route = useRoute();
const router = useRouter();

// Use a computed property to handle v-model
const isOpen = computed({
	get: () => props.modelValue,
	set: (value: boolean) => emit("update:modelValue", value),
});

const mode = ref<AuthMode>("signin");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const name = ref("");
const isLoading = ref(false);
const error = ref("");

// Title based on auth mode
const pageTitle = computed(() => {
	switch (mode.value) {
		case "signin":
			return "Sign in to your account";
		case "signup":
			return "Create an account";
		case "forgot-password":
			return "Reset your password";
		default:
			return "";
	}
});

// Sync route hash with auth mode
watch(
	() => route.hash,
	(newHash) => {
		const modeFromHash = newHash.replace("#", "") as AuthMode;
		if (["signin", "signup", "forgot-password"].includes(modeFromHash)) {
			mode.value = modeFromHash as AuthMode;
		}
	},
	{ immediate: true },
);

// Mock features for the right panel
const features = [
	"Secure authentication",
	"Personalized dashboard",
	"24/7 customer support",
];

const tabs = [
	{ id: "signin", name: "Sign In" },
	{ id: "signup", name: "Create Account" },
];

const title = computed(() => {
	switch (mode.value) {
		case "signin":
			return "Sign in to your account";
		case "signup":
			return "Create an account";
		case "forgot-password":
			return "Reset your password";
		default:
			return "";
	}
});

const submitButtonText = computed(() => {
	switch (mode.value) {
		case "signin":
			return "Sign In";
		case "signup":
			return "Sign Up";
		case "forgot-password":
			return "Send Reset Link";
		default:
			return "Submit";
	}
});

const switchMode = (newMode: AuthMode) => {
	mode.value = newMode;
	error.value = "";
	router.push({ hash: newMode });
};

const handleSubmit = async () => {
	if (!email.value) {
		error.value = "Email is required";
		return;
	}

	if (mode.value !== "forgot-password" && !password.value) {
		error.value = "Password is required";
		return;
	}

	if (mode.value === "signup" && !name.value) {
		error.value = "Name is required";
		return;
	}

	isLoading.value = true;
	error.value = "";

	try {
		// TODO: Implement actual auth logic
		// This is a mock implementation
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// On successful auth
		emit("success", { email: email.value });
		emit("update:modelValue", false);
	} catch (err) {
		if (err instanceof Error) {
			error.value = err.message;
		} else {
			error.value = "An error occurred. Please try again.";
		}
	} finally {
		isLoading.value = false;
	}
};

const closeModal = () => {
	isOpen.value = false;
	emit("close");
	// Reset form when closing
	mode.value = "signin";
	email.value = "";
	password.value = "";
	name.value = "";
	error.value = "";

	// Clear the hash when closing modal
	if (window.history.pushState) {
		window.history.pushState(
			"",
			document.title,
			window.location.pathname + window.location.search,
		);
	} else {
		window.location.hash = "";
	}
};

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
    :title="pageTitle"
    :show-close-button="true"
    :close-on-backdrop="true"
    :close-on-esc="true"
    class="max-w-5xl"
  >
    <div class="flex flex-col md:flex-row min-h-[500px]">
      <!-- Left Panel - Auth Form -->
      <div class="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
        <!-- Tabs -->
        <div class="border-b border-border mb-6">
          <nav class="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="switchMode(tab.id as AuthMode)"
              :class="[
                'whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium',
                mode === tab.id
                  ? 'border-brand text-brand'
                  : 'border-transparent text-text/60 hover:border-gray-300 hover:text-text/80',
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="rounded-md bg-red-50 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="i-mdi-alert-circle h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name Field (only for signup) -->
          <div v-if="mode === 'signup'">
            <label for="name" class="block text-sm font-medium text-text/80">
              Full Name
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="name"
                type="text"
                autocomplete="name"
                class="block w-full rounded-md border border-border bg-surface px-3 py-2 text-text placeholder-text/50 shadow-sm focus:border-brand focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 sm:text-sm"
              />
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-text/80">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                class="block w-full rounded-md border border-border bg-surface px-3 py-2 text-text placeholder-text/50 shadow-sm focus:border-brand focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 sm:text-sm"
              />
            </div>
          </div>

          <!-- Password Field (not shown in forgot password) -->
          <div v-if="mode !== 'forgot-password'">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-text/80">
                Password
              </label>
              <div v-if="mode === 'signin'" class="text-sm">
                <button
                  type="button"
                  @click="switchMode('forgot-password')"
                  class="font-medium text-brand hover:text-brand/80"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
                class="block w-full rounded-md border border-border bg-surface px-3 py-2 text-text placeholder-text/50 shadow-sm focus:border-brand focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 sm:text-sm"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md border border-transparent bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isLoading" class="i-mdi-loading h-5 w-5 animate-spin mr-2"></span>
              {{ submitButtonText }}
            </button>
          </div>
        </form>

        <!-- Switch Mode Links -->
        <div v-if="mode !== 'forgot-password'" class="text-center text-sm mt-6">
          <p class="text-text/70">
            {{ mode === 'signin' ? "Don't have an account?" : 'Already have an account?' }}
            <button
              type="button"
              @click="switchMode(mode === 'signin' ? 'signup' : 'signin')"
              class="font-medium text-brand hover:text-brand/80 ml-1"
            >
              {{ mode === 'signin' ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>
        <div v-else class="text-center text-sm mt-6">
          <button
            type="button"
            @click="switchMode('signin')"
            class="font-medium text-brand hover:text-brand/80 flex items-center justify-center w-full"
          >
            <span class="i-mdi-arrow-left mr-1"></span>
            Back to sign in
          </button>
        </div>
      </div>

      <!-- Right Panel - Info -->
      <div class="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-brand/5 to-brand/10 text-brand p-8 w-1/2 border-l border-border">
        <div class="max-w-xs mx-auto text-center">
          <div class="mb-6">
            <div class="i-mdi-account-lock w-24 h-24 mx-auto text-brand"></div>
          </div>
          <h3 class="text-2xl font-bold mb-4">
            {{ mode === 'signin' ? 'Welcome Back!' : mode === 'signup' ? 'Join Us Today' : 'Reset Password' }}
          </h3>
          <p class="text-text/70 mb-6">
            <template v-if="mode === 'signin'">
              Sign in to access your account and continue your journey with us.
            </template>
            <template v-else-if="mode === 'signup'">
              Create an account to get started and unlock all features.
            </template>
            <template v-else>
              Enter your email to receive a password reset link.
            </template>
          </p>
          <ul class="space-y-3 text-left">
            <li class="flex items-start">
              <div class="i-mdi-check-circle text-brand mt-0.5 mr-2 flex-shrink-0"></div>
              <span>Access all premium features</span>
            </li>
            <li class="flex items-start">
              <div class="i-mdi-check-circle text-brand mt-0.5 mr-2 flex-shrink-0"></div>
              <span>Save and sync your preferences</span>
            </li>
            <li class="flex items-start">
              <div class="i-mdi-check-circle text-brand mt-0.5 mr-2 flex-shrink-0"></div>
              <span>Get personalized recommendations</span>
            </li>
            <li class="flex items-start">
              <div class="i-mdi-check-circle text-brand mt-0.5 mr-2 flex-shrink-0"></div>
              <span>24/7 customer support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Modal>
</template>
