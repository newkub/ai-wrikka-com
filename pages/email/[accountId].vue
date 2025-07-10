<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import useEmailAccounts from "~/composables/useEmailAccounts";

const route = useRoute();
const accountId = ref<string>(route.params.accountId as string);

// Mock data สำหรับ Gmail accounts
const mockAccounts = [
	{
		id: "gmail-1",
		name: "Personal",
		email: "user@gmail.com",
		provider: "gmail",
	},
	{ id: "gmail-2", name: "Work", email: "work@gmail.com", provider: "gmail" },
	{
		id: "gmail-3",
		name: "Backup",
		email: "backup@gmail.com",
		provider: "gmail",
	},
];

const currentAccount = computed(() => {
	return mockAccounts.find((acc) => acc.id === accountId.value) || null;
});

const {
	connectedAccounts,
	loading,
	addAccount,
	removeAccount,
	refreshAccount,
} = useEmailAccounts();

const showAccountMenu = ref(false);
const showAddAccountMenu = ref(false);

// Mock emails data
const emails = ref([
	{
		id: "1",
		from: "john@example.com",
		to: "me@gmail.com",
		subject: "Meeting Tomorrow",
		body: "Hi there, just reminding you about our meeting tomorrow at 10am.",
		date: "10:30 AM",
		read: false,
		starred: false,
	},
	// ...เพิ่ม emails อื่นๆ ตามต้องการ
]);

const selectedEmail = ref<any>(null);

const markAsRead = (email: any) => {
	email.read = true;
};

const toggleStar = (email: any, event: Event) => {
	event.stopPropagation();
	email.starred = !email.starred;
};

// เพิ่ม state สำหรับ compose
const showComposeModal = ref(false);
const composeEmail = ref({
	to: "",
	subject: "",
	body: "",
});

const openCompose = () => {
	showComposeModal.value = true;
};

const closeCompose = () => {
	showComposeModal.value = false;
	composeEmail.value = { to: "", subject: "", body: "" };
};

const sendEmail = () => {
	// Logic ส่งอีเมล
	closeCompose();
};
</script>

<template>
  <div class="flex h-screen bg-background">
    <!-- Left sidebar -->
    <div class="w-64 border-r border-border p-4 flex flex-col flex-shrink-0">
      <!-- Account Icons -->
      <div class="flex flex-wrap gap-2 mb-4">
        <div 
          v-for="account in mockAccounts" 
          :key="account.id"
          class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer"
          :class="{ 'ring-2 ring-offset-2 ring-primary': account.id === accountId }"
        >
          {{ account.name.charAt(0) }}
        </div>
      </div>

      <!-- Compose Button -->
      <button 
        @click="openCompose"
        class="w-full bg-primary text-white py-2 px-4 rounded-md mb-4 flex items-center justify-center gap-2"
      >
        <span class="i-mdi-pencil"></span>
        <span>Compose</span>
      </button>

      <!-- Email Folders -->
      <div class="space-y-1">
        <div class="text-sm font-medium text-muted-foreground px-2 py-1">FOLDERS</div>
        <div class="flex items-center px-2 py-1 rounded hover:bg-accent cursor-pointer">
          <span class="i-mdi-inbox mr-2"></span>
          <span>Inbox</span>
        </div>
        <!-- เพิ่ม folders อื่นๆ ตามต้องการ -->
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Email List -->
      <div class="border-b border-border">
        <div class="p-2 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div class="relative flex-1 max-w-md">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <span class="i-mdi-magnify" />
            </span>
            <input 
              type="text" 
              placeholder="Search emails"
              class="w-full pl-10 pr-4 py-2 bg-background rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <!-- Email Items -->
        <div 
          v-for="email in emails" 
          :key="email.id"
          @click="() => {
            selectedEmail = email
            markAsRead(email)
          }"
          class="border-b border-border px-4 py-3 flex items-start hover:bg-accent/50 cursor-pointer"
          :class="{ 'bg-accent/20': selectedEmail?.id === email.id }"
        >
          <div class="flex-shrink-0 pt-1 pr-3">
            <button 
              @click.stop="toggleStar(email, $event)"
              class="text-muted-foreground hover:text-yellow-400"
              :class="{ 'text-yellow-400': email.starred }"
            >
              <span class="i-mdi-star" />
            </button>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="truncate font-medium" :class="{ 'font-semibold': !email.read }">
                {{ email.from }}
              </p>
              <p class="text-xs text-muted-foreground ml-2">{{ email.date }}</p>
            </div>
            <p class="truncate" :class="{ 'font-medium': !email.read }">{{ email.subject }}</p>
            <p class="truncate text-sm text-muted-foreground">{{ email.body }}</p>
          </div>
        </div>
      </div>

      <!-- Email Detail View -->
      <div v-if="selectedEmail" class="flex-1 overflow-auto p-4">
        <div class="max-w-4xl mx-auto">
          <div class="mb-6">
            <h1 class="text-2xl font-bold mb-4">{{ selectedEmail.subject }}</h1>
            <div class="flex items-start justify-between">
              <div>
                <p class="font-medium">{{ selectedEmail.from }}</p>
                <p class="text-sm text-muted-foreground">to me</p>
              </div>
              <p class="text-sm text-muted-foreground">{{ selectedEmail.date }}</p>
            </div>
          </div>
          <div class="prose max-w-none">
            <p>{{ selectedEmail.body }}</p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!selectedEmail" class="flex-1 flex items-center justify-center text-muted-foreground">
        <div class="text-center p-8">
          <div class="i-mdi-email-outline text-4xl mb-4 mx-auto text-gray-400"></div>
          <h2 class="text-xl font-medium mb-2">No email selected</h2>
          <p class="text-sm">Select an email to read</p>
        </div>
      </div>
    </div>

    <!-- Compose Modal -->
    <div 
      v-if="showComposeModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeCompose"
    >
      <div class="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="border-b border-border px-4 py-3 flex items-center justify-between">
          <h2 class="font-medium">New Message</h2>
          <button @click="closeCompose" class="text-muted-foreground hover:text-foreground">
            <span class="i-mdi-close" />
          </button>
        </div>
        <div class="p-4 flex-1 overflow-auto">
          <div class="space-y-4">
            <div>
              <input 
                v-model="composeEmail.to"
                type="text" 
                placeholder="To"
                class="w-full px-3 py-2 bg-background rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <input 
                v-model="composeEmail.subject"
                type="text" 
                placeholder="Subject"
                class="w-full px-3 py-2 bg-background rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <textarea 
                v-model="composeEmail.body"
                placeholder="Message"
                rows="10"
                class="w-full px-3 py-2 bg-background rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="border-t border-border px-4 py-3 flex justify-end">
          <button 
            @click="sendEmail"
            class="bg-primary text-white py-2 px-4 rounded-md flex items-center gap-2"
          >
            <span class="i-mdi-send"></span>
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>