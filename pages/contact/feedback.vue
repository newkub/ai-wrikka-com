<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["submitted"]);

interface FeedbackForm {
	name: string;
	email: string;
	rating: number | null;
	message: string;
	category: string;
}

const form = ref<FeedbackForm>({
	name: "",
	email: "",
	rating: null,
	message: "",
	category: "general",
});

const categories = [
	{ value: "general", label: "General Feedback" },
	{ value: "bug", label: "Bug Report" },
	{ value: "feature", label: "Feature Request" },
	{ value: "other", label: "Other" },
];

const isLoading = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref("");

const validateEmail = (email: string): boolean => {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
};

const validateForm = (): boolean => {
	if (!form.value.name.trim()) {
		errorMessage.value = "Please enter your name";
		return false;
	}
	if (!form.value.email) {
		errorMessage.value = "Please enter your email";
		return false;
	}
	if (!validateEmail(form.value.email)) {
		errorMessage.value = "Please enter a valid email address";
		return false;
	}
	if (!form.value.message.trim()) {
		errorMessage.value = "Please enter your feedback";
		return false;
	}
	return true;
};

const handleSubmit = async () => {
	if (!validateForm()) return;

	try {
		isLoading.value = true;
		errorMessage.value = "";

		// Here you would typically make an API call to submit the feedback
		// For now, we'll just simulate an API call with a timeout
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Reset form after successful submission
		form.value = {
			name: "",
			email: "",
			rating: null,
			message: "",
			category: "general",
		};

		isSubmitted.value = true;
		emit("submitted");

		// Reset the submitted state after 3 seconds
		setTimeout(() => {
			isSubmitted.value = false;
		}, 3000);
	} catch (error) {
		errorMessage.value =
			"An error occurred while submitting your feedback. Please try again.";
		console.error("Feedback submission error:", error);
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="isSubmitted" class="p-4 bg-green-50 text-green-800 rounded-lg">
      <div class="flex items-center">
        <div class="i-mdi-check-circle text-green-500 text-xl mr-2"></div>
        <p>Thank you for your feedback! We appreciate your input.</p>
      </div>
    </div>
    
    <div v-else>
      <h3 class="text-lg font-medium text-gray-900 mb-4">Share Your Feedback</h3>
      
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Your Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
            >
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            v-model="form.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="category in categories" :key="category.value" :value="category.value">
              {{ category.label }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Rating (Optional)
          </label>
          <div class="flex space-x-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="form.rating = star"
              :class="{
                'text-yellow-400': star <= (form.rating || 0),
                'text-gray-300': star > (form.rating || 0)
              }"
              class="text-2xl focus:outline-none"
            >
              <div class="i-mdi-star"></div>
            </button>
          </div>
        </div>
        
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
            Your Feedback <span class="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            v-model="form.message"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your thoughts with us..."
          ></textarea>
        </div>
        
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center">
              <div class="i-mdi-loading animate-spin mr-2"></div>
              Submitting...
            </span>
            <span v-else>Submit Feedback</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>