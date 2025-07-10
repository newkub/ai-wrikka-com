<script setup lang="ts">
// Contact page content

const form = reactive({
	name: "",
	email: "",
	subject: "",
	message: "",
	isSubmitting: false,
	isSuccess: false,
	error: "",
});

const contactInfo = [
	{
		icon: "i-heroicons-envelope",
		title: "Email",
		description: "contact@example.com",
		link: "mailto:contact@example.com",
	},
	{
		icon: "i-heroicons-phone",
		title: "Phone",
		description: "+66 12 345 6789",
		link: "tel:+66123456789",
	},
	{
		icon: "i-heroicons-map-pin",
		title: "Office",
		description: "123 Business Street, Bangkok 10110, Thailand",
	},
];

const socialLinks = [
	{ name: "Facebook", icon: "i-mdi-facebook", url: "#" },
	{ name: "Twitter", icon: "i-mdi-twitter", url: "#" },
	{ name: "LinkedIn", icon: "i-mdi-linkedin", url: "#" },
	{ name: "GitHub", icon: "i-mdi-github", url: "#" },
];

const handleSubmit = async () => {
	if (!form.name || !form.email || !form.message) {
		form.error = "Please fill in all required fields";
		return;
	}

	form.isSubmitting = true;
	form.error = "";

	try {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		form.isSuccess = true;
		// Reset form
		form.name = "";
		form.email = "";
		form.subject = "";
		form.message = "";
	} catch (error) {
		form.error = "An error occurred. Please try again later.";
	} finally {
		form.isSubmitting = false;
	}
};
</script>

<template>
  <div class="space-y-12">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Get in Touch</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Have questions or need assistance? Fill out the form below and we'll get back to you as soon as possible.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="form.error" class="p-4 bg-red-50 text-red-700 rounded-lg">
            {{ form.error }}
          </div>
          
          <div v-if="form.isSuccess" class="p-4 bg-green-50 text-green-700 rounded-lg">
            Thank you for your message! We'll get back to you soon.
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Your name"
              >
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your.email@example.com"
              >
            </div>
          </div>

          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="How can we help?"
            >
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="5"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Your message..."
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              :disabled="form.isSubmitting"
              class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="form.isSubmitting">
                <span class="inline-block animate-spin mr-2">↻</span> Sending...
              </span>
              <span v-else>Send Message</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          
          <div class="space-y-6">
            <div v-for="(info, index) in contactInfo" :key="index" class="flex">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <div :class="info.icon" class="w-6 h-6"></div>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">{{ info.title }}</h3>
                <a 
                  v-if="info.link" 
                  :href="info.link" 
                  class="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {{ info.description }}
                </a>
                <p v-else class="text-gray-600">{{ info.description }}</p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-100">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Follow Us</h3>
            <div class="flex space-x-4">
              <a 
                v-for="social in socialLinks" 
                :key="social.name"
                :href="social.url" 
                :title="social.name"
                class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                <div :class="social.icon" class="w-5 h-5"></div>
                <span class="sr-only">{{ social.name }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
          <ul class="space-y-2">
            <li v-for="day in ['Monday - Friday', 'Saturday', 'Sunday']" :key="day" class="flex justify-between">
              <span class="text-gray-600">{{ day }}</span>
              <span class="font-medium text-gray-900">
                {{ day === 'Sunday' ? 'Closed' : '9:00 AM - 6:00 PM' }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
