import { ref, computed } from "vue";

export interface EmailAccount {
	id: string;
	email: string;
	provider: "gmail" | "outlook" | "imap";
	name: string;
	avatar?: string;
	connected: boolean;
	lastSync?: Date;
}

export default function useEmailAccounts() {
	const accounts = ref<EmailAccount[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const connectedAccounts = computed(() =>
		accounts.value.filter((account) => account.connected),
	);

	const addAccount = async (provider: "gmail" | "outlook" | "imap") => {
		loading.value = true;
		error.value = null;

		try {
			// This is a placeholder for actual OAuth flow
			// In a real app, you would redirect to the provider's OAuth page
			// and handle the callback to get the access token

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Mock response
			const newAccount: EmailAccount = {
				id: `acc-${Date.now()}`,
				email: `user@${provider}.com`,
				provider,
				name:
					provider === "gmail"
						? "Gmail Account"
						: provider === "outlook"
							? "Outlook Account"
							: "IMAP Account",
				connected: true,
				lastSync: new Date(),
			};

			accounts.value.push(newAccount);
			return newAccount;
		} catch (err) {
			error.value = `Failed to connect ${provider} account`;
			console.error("Auth error:", err);
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const removeAccount = (accountId: string) => {
		const index = accounts.value.findIndex((acc) => acc.id === accountId);
		if (index !== -1) {
			accounts.value.splice(index, 1);
		}
	};

	const refreshAccount = async (accountId: string) => {
		const account = accounts.value.find((acc) => acc.id === accountId);
		if (!account) return;

		try {
			loading.value = true;
			// Simulate API call to refresh emails
			await new Promise((resolve) => setTimeout(resolve, 800));
			account.lastSync = new Date();
		} finally {
			loading.value = false;
		}
	};

	return {
		accounts,
		connectedAccounts,
		loading,
		error,
		addAccount,
		removeAccount,
		refreshAccount,
	};
}
