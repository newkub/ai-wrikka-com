<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

const route = useRoute();
const projectId = computed(() => route.params.id);

// Mock auth providers data
const providers = [
	{
		id: "google",
		name: "Google",
		enabled: true,
		icon: "i-mdi-google",
		description: "Allow users to sign in with Google",
		clientId:
			"1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com",
		clientSecret: "GOCSPX-abcdefghijklmnopqrstuvwxyz1234",
		redirectUri: `https://${projectId.value}.vercel.app/api/auth/callback/google`,
	},
	{
		id: "github",
		name: "GitHub",
		enabled: false,
		icon: "i-mdi-github",
		description: "Allow users to sign in with GitHub",
		clientId: "Iv1.abcdefghijklmnop",
		clientSecret: "abcdefghijklmnopqrstuvwxyz1234567890abcd",
		redirectUri: `https://${projectId.value}.vercel.app/api/auth/callback/github`,
	},
	{
		id: "facebook",
		name: "Facebook",
		enabled: false,
		icon: "i-mdi-facebook",
		description: "Allow users to sign in with Facebook",
		clientId: "123456789012345",
		clientSecret: "abcdefghijklmnopqrstuvwxyz123456",
		redirectUri: `https://${projectId.value}.vercel.app/api/auth/callback/facebook`,
	},
	{
		id: "email",
		name: "Email",
		enabled: true,
		icon: "i-mdi-email",
		description: "Allow users to sign in with email and password",
		requireVerification: true,
	},
];

const showProviderForm = ref<string>("");
const form = ref({
	clientId: "",
	clientSecret: "",
});

const toggleProvider = (providerId: string) => {
	const provider = providers.find((p) => p.id === providerId);
	if (provider) {
		provider.enabled = !provider.enabled;
		if (provider.enabled) {
			showProviderForm.value = providerId;
		}
	}
};

const saveProvider = (providerId: string) => {
	const provider = providers.find((p) => p.id === providerId);
	if (provider) {
		provider.clientId = form.value.clientId;
		provider.clientSecret = form.value.clientSecret;
		showProviderForm.value = "";
	}
};

const editProvider = (provider: any) => {
	form.value = {
		clientId: provider.clientId || "",
		clientSecret: provider.clientSecret || "",
	};
	showProviderForm.value = provider.id;
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg leading-6 font-medium text-gray-900">Authentication</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Configure authentication providers for your application</p>
    </div>
    
    <div class="space-y-6">
      <!-- Email/Password Authentication -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Email/Password</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Allow users to sign in with email and password</p>
          </div>
          <div>
            <button 
              type="button"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              :class="providers.find(p => p.id === 'email')?.enabled ? 'bg-indigo-600' : 'bg-gray-200'"
              @click="toggleProvider('email')"
              role="switch"
              :aria-checked="providers.find(p => p.id === 'email')?.enabled"
            >
              <span 
                class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                :class="providers.find(p => p.id === 'email')?.enabled ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- OAuth Providers -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">OAuth Providers</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Configure third-party authentication providers</p>
        </div>
        <div class="border-t border-gray-200">
          <ul class="divide-y divide-gray-200">
            <li v-for="provider in providers.filter(p => p.id !== 'email')" :key="provider.id">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" :class="'bg-gray-100 text-gray-600'">
                      <span :class="[provider.icon, 'h-6 w-6']" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ provider.name }}</div>
                      <div class="text-sm text-gray-500">{{ provider.description }}</div>
                    </div>
                  </div>
                  <div>
                    <button 
                      type="button"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      :class="provider.enabled ? 'bg-indigo-600' : 'bg-gray-200'"
                      @click="toggleProvider(provider.id)"
                      role="switch"
                      :aria-checked="provider.enabled"
                    >
                      <span 
                        class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                        :class="provider.enabled ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </button>
                  </div>
                </div>

                <!-- Provider Configuration Form -->
                <div v-if="provider.enabled" class="mt-4 bg-gray-50 p-4 rounded-md">
                  <div v-if="showProviderForm !== provider.id">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Client ID</label>
                        <div class="mt-1 text-sm text-gray-900 truncate">{{ provider.clientId || 'Not configured' }}</div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Client Secret</label>
                        <div class="mt-1 text-sm text-gray-900 truncate">{{ provider.clientSecret ? '••••••••••••' : 'Not configured' }}</div>
                      </div>
                    </div>
                    <div class="mt-4 flex justify-end">
                      <button 
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        @click="editProvider(provider)"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div v-else class="space-y-4">
                    <div>
                      <label for="client-id" class="block text-sm font-medium text-gray-700">Client ID</label>
                      <input 
                        type="text" 
                        id="client-id"
                        v-model="form.clientId"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter client ID"
                      />
                    </div>
                    <div>
                      <label for="client-secret" class="block text-sm font-medium text-gray-700">Client Secret</label>
                      <input 
                        type="text" 
                        id="client-secret"
                        v-model="form.clientSecret"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter client secret"
                      />
                    </div>
                    <div class="flex justify-end space-x-3">
                      <button 
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        @click="saveProvider(provider.id)"
                      >
                        Save
                      </button>
                      <button 
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        @click="showProviderForm = ''"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Advanced Settings -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Advanced Settings</h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Allowed Domains</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <input 
                  type="text" 
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="example.com, sub.example.com"
                />
              </dd>
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Session Timeout</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option selected>2 hours</option>
                  <option>1 day</option>
                  <option>1 week</option>
                </select>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
