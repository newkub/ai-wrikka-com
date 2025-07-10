<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import useEmailAccounts from "~/composables/useEmailAccounts";

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

const route = useRoute();
const router = useRouter();
const accounts = ref(mockAccounts);
const currentAccount = ref<string | null>(null);

// สุ่มเลือก account เมื่อ route เปลี่ยน
onMounted(() => {
	// ใช้ random ID จาก route หรือสุ่มใหม่
	const randomId = Array.isArray(route.params.randomId)
		? route.params.randomId[0]
		: route.params.randomId ||
			mockAccounts[Math.floor(Math.random() * mockAccounts.length)].id;

	currentAccount.value = randomId as string;
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

const switchAccount = (accountId: string) => {
	currentAccount.value = accountId;
	showAccountMenu.value = false;
	router.push(`/email/${accountId}`);
};

const connectAccount = async (provider: "gmail" | "outlook" | "imap") => {
	try {
		const account = await addAccount(provider);
		if (!currentAccount.value) {
			currentAccount.value = account.id;
		}
		showAddAccountMenu.value = false;
	} catch (error) {
		console.error("Failed to connect account:", error);
	}
};

interface Email {
	id: string;
	from: string;
	subject: string;
	preview: string;
	time: string;
	read: boolean;
	starred: boolean;
	labels: string[];
}

// Mock emails data
const emails = ref([
	{
		id: "1",
		from: "john.doe@gmail.com",
		subject: "Weekly Team Meeting",
		preview:
			"Hi team, just a reminder about our weekly sync tomorrow at 10 AM...",
		time: "10:30 AM",
		read: false,
		starred: true,
		labels: ["work"],
	},
	{
		id: "2",
		from: "notifications@github.com",
		subject: "Pull Request: Update README.md",
		preview: "A new pull request has been opened in your repository...",
		time: "Yesterday",
		read: true,
		starred: false,
		labels: ["github", "dev"],
	},
	{
		id: "3",
		from: "newsletter@medium.com",
		subject: "Top stories for you this week",
		preview: "Check out the most popular articles in your network...",
		time: "Jul 8",
		read: true,
		starred: false,
		labels: ["newsletter"],
	},
]);

const selectedEmail = ref<Email | null>(null);
const selectedFolder = ref("inbox");
const searchQuery = ref("");

const filteredEmails = computed(() => {
	return emails.value.filter((email) => {
		const matchesSearch =
			!searchQuery.value ||
			email.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			email.from.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			email.preview.toLowerCase().includes(searchQuery.value.toLowerCase());

		if (selectedFolder.value === "inbox") return matchesSearch;
		if (selectedFolder.value === "starred")
			return email.starred && matchesSearch;
		if (selectedFolder.value === "unread") return !email.read && matchesSearch;

		return matchesSearch && email.labels.includes(selectedFolder.value);
	});
});

const markAsRead = (email: Email) => {
	email.read = true;
};

const toggleStar = (email: Email, event: Event) => {
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
	// ในที่นี้เป็นตัวอย่างเท่านั้น ควรเชื่อมต่อกับ API จริง
	console.log("Sending email:", composeEmail.value);
	closeCompose();
};

// Set first account as default
onMounted(() => {
	if (accounts.value.length > 0 && !currentAccount.value) {
		currentAccount.value = accounts.value[0].id;
	}
});
</script>

<template>
  <div class="flex h-screen bg-background">
    <!-- Left sidebar -->
    <div class="w-64 border-r border-border p-4 flex flex-col flex-shrink-0">
      <!-- Account Icons -->
      <div class="flex flex-wrap gap-2 mb-4">
        <Tooltip 
          v-for="account in accounts" 
          :key="account.id"
          :content="account.name"
          placement="bottom"
        >
          <button
            @click="switchAccount(account.id)"
            class="p-2 rounded-full transition-colors"
            :class="{
              'bg-primary/20 ring-2 ring-primary': account.id === currentAccount,
              'hover:bg-muted/50': account.id !== currentAccount
            }"
          >
            <span 
              :class="{
                'i-mdi-gmail text-red-500 text-xl': account.provider === 'gmail',
                'i-mdi-microsoft-outlook text-blue-600 text-xl': account.provider === 'outlook',
                'i-mdi-email text-primary text-xl': account.provider === 'imap'
              }"
            />
          </button>
        </Tooltip>
        
        <Tooltip content="Add Account" placement="bottom">
          <button
            @click="showAddAccountMenu = !showAddAccountMenu"
            class="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <span class="i-mdi-plus text-xl" />
          </button>
        </Tooltip>
      </div>

      <!-- Add Account Menu -->
      <div 
        v-if="showAddAccountMenu"
        class="mb-4 bg-popover rounded-md shadow-lg border border-border p-2"
      >
        <button 
          v-for="provider in ['gmail', 'outlook', 'imap']" 
          :key="provider"
          @click="connectAccount(provider as 'gmail' | 'outlook' | 'imap')"
          class="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center rounded"
        >
          <span 
            :class="{
              'i-mdi-gmail text-red-500': provider === 'gmail',
              'i-mdi-microsoft-outlook text-blue-600': provider === 'outlook',
              'i-mdi-email': provider === 'imap',
              'mr-2': true
            }"
          />
          {{ provider.charAt(0).toUpperCase() + provider.slice(1) }}
        </button>
      </div>
      
      <!-- แก้ไขปุ่ม Sent Email -->
      <button 
        @click="openCompose" 
        class="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md mb-4"
      >
        Sent Email
      </button>
      
      <div class="space-y-1">
        <button 
          v-for="folder in [
            { id: 'inbox', name: 'Inbox', icon: 'i-mdi-inbox' },
            { id: 'starred', name: 'Starred', icon: 'i-mdi-star' },
            { id: 'unread', name: 'Unread', icon: 'i-mdi-email' },
            { id: 'drafts', name: 'Drafts', icon: 'i-mdi-file-document' },
            { id: 'sent', name: 'Sent', icon: 'i-mdi-send' },
            { id: 'trash', name: 'Trash', icon: 'i-mdi-delete' },
          ]" 
          :key="folder.id"
          @click="selectedFolder = folder.id"
          class="w-full text-left py-2 px-3 rounded-md transition-colors flex items-center"
          :class="{
            'bg-muted': selectedFolder === folder.id,
            'hover:bg-muted/50': selectedFolder !== folder.id
          }"
        >
          <span :class="folder.icon" class="mr-2" />
          {{ folder.name }}
        </button>
      </div>
      
      <div class="mt-6">
        <h3 class="text-sm font-medium px-3 mb-2">Labels</h3>
        <div class="space-y-1">
          <button 
            v-for="label in ['work', 'personal', 'important', 'github']" 
            :key="label"
            @click="selectedFolder = label"
            class="w-full text-left py-1 px-3 rounded-md text-sm flex items-center"
            :class="{
              'bg-muted': selectedFolder === label,
              'hover:bg-muted/50': selectedFolder !== label
            }"
          >
            <span class="w-3 h-3 rounded-full bg-primary mr-2" />
            {{ label }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Email list -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <span class="i-mdi-magnify" />
          </span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search mail"
            class="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto h-0">
        <!-- Mobile empty state -->
        <div v-if="!selectedEmail" class="md:hidden p-8 text-center text-muted-foreground">
          <div class="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <span class="i-mdi-email text-3xl opacity-50" />
          </div>
          <h3 class="text-lg font-medium mb-1">Select an email to read</h3>
          <p class="text-sm">Choose an email from the list to view its contents</p>
        </div>
        <div 
          v-for="email in filteredEmails" 
          :key="email.id"
          @click="() => {
            selectedEmail = email
            markAsRead(email)
          }"
          class="border-b border-border p-3 cursor-pointer hover:bg-muted/30 transition-colors"
          :class="{ 'bg-muted/20': selectedEmail?.id === email.id, 'font-semibold': !email.read }"
        >
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center">
              <button 
                @click.stop="toggleStar(email, $event)"
                class="text-muted-foreground hover:text-yellow-500 mr-2"
                :class="{ 'text-yellow-500': email.starred }"
              >
                <span class="i-mdi-star" />
              </button>
              <span class="mr-2">{{ email.from }}</span>
            </div>
            <span class="text-sm text-muted-foreground">{{ email.time }}</span>
          </div>
          <div class="text-sm">{{ email.subject }}</div>
          <div class="text-sm text-muted-foreground truncate">{{ email.preview }}</div>
          <div class="flex mt-1 space-x-2">
            <span 
              v-for="label in email.labels" 
              :key="label"
              class="text-xs px-2 py-0.5 rounded-full bg-muted"
            >
              {{ label }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Email content modal -->
    <div v-if="selectedEmail" class="fixed inset-0 z-50 flex justify-end">
      <!-- Overlay -->
      <div 
        class="absolute inset-0 bg-black/50"
        @click="selectedEmail = null"
      ></div>
      
      <!-- Email content -->
      <div class="relative w-full max-w-2xl h-full bg-background flex flex-col overflow-hidden">
        <div class="p-4 border-b border-border">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">{{ selectedEmail.subject }}</h2>
            <div class="flex space-x-2">
              <button class="p-1 rounded-full hover:bg-muted">
                <span class="i-mdi-archive" />
              </button>
              <button class="p-1 rounded-full hover:bg-muted">
                <span class="i-mdi-trash-can" />
              </button>
              <button class="p-1 rounded-full hover:bg-muted">
                <span class="i-mdi-email-mark-as-unread" />
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                <span class="i-mdi-account text-xl" />
              </div>
              <div>
                <div class="font-medium">{{ selectedEmail.from }}</div>
                <div class="text-sm text-muted-foreground">to me</div>
              </div>
            </div>
            <div class="text-sm text-muted-foreground">{{ selectedEmail.time }}</div>
          </div>
        </div>
        
        <div class="p-4 flex-1 overflow-y-auto">
          <div class="prose max-w-none">
            <p>Hello,</p>
            <p>This is a sample email content. In a real application, this would be the actual email body.</p>
            <p>Best regards,<br>Sender</p>
          </div>
        </div>
        
        <div class="p-4 border-t border-border">
          <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Reply
          </button>
          <button class="px-4 py-2 ml-2 border border-border rounded-md">
            Forward
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty state for desktop -->
    <div v-if="!selectedEmail" class="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
      <div class="text-center p-8">
        <div class="i-mdi-email-outline text-4xl mb-4 mx-auto text-gray-400"></div>
      </div>
    </div>
    
    <!-- เพิ่ม Compose Modal -->
    <div 
      v-if="showComposeModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeCompose"
    >
      <div 
        class="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        @click.stop
      >
        <div class="p-4 border-b border-border flex justify-between items-center">
          <h3 class="text-lg font-medium">New Message</h3>
          <button @click="closeCompose" class="text-muted-foreground hover:text-foreground">
            <span class="i-mdi-close text-xl" />
          </button>
        </div>
        
        <div class="p-4 flex-1 overflow-y-auto">
          <div class="space-y-4">
            <div class="flex items-center border-b border-border py-2">
              <span class="w-20 text-sm text-muted-foreground">To:</span>
              <input 
                v-model="composeEmail.to" 
                type="text" 
                class="flex-1 bg-transparent focus:outline-none"
                placeholder="recipient@example.com"
              >
            </div>
            
            <div class="flex items-center border-b border-border py-2">
              <span class="w-20 text-sm text-muted-foreground">Subject:</span>
              <input 
                v-model="composeEmail.subject" 
                type="text" 
                class="flex-1 bg-transparent focus:outline-none"
                placeholder="Subject"
              >
            </div>
            
            <textarea 
              v-model="composeEmail.body" 
              class="w-full h-64 p-2 bg-transparent focus:outline-none resize-none"
              placeholder="Write your message here..."
            ></textarea>
          </div>
        </div>
        
        <div class="p-4 border-t border-border flex justify-end space-x-2">
          <button 
            @click="closeCompose" 
            class="px-4 py-2 border border-border rounded-md hover:bg-muted/50"
          >
            Discard
          </button>
          <button 
            @click="sendEmail" 
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            :disabled="!composeEmail.to"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    
    <!-- แสดง dynamic route ใน title -->
    <div class="p-4 border-b border-border">
      <h2 class="text-lg font-medium">
        Gmail Account: {{ currentAccount ? accounts.find(a => a.id === currentAccount)?.name : 'Loading...' }}
      </h2>
      <p class="text-sm text-muted-foreground">
        Route ID: {{ route.params.randomId || 'random' }}
      </p>
    </div>
  </div>
</template>