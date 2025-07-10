<script setup lang="ts">
const policies = [
	{
		title: "Privacy Policy",
		lastUpdated: "Last updated: July 10, 2025",
		sections: [
			{
				title: "Introduction",
				content:
					"We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.",
			},
			{
				title: "Information We Collect",
				content:
					"We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.",
				items: [
					"Personal identification information (name, email address, phone number, etc.)",
					"Billing and payment information",
					"Browser and device information",
					"Usage data and analytics",
				],
			},
			{
				title: "How We Use Your Information",
				content:
					"We use the information we collect for various purposes, including:",
				items: [
					"To provide and maintain our service",
					"To notify you about changes to our service",
					"To allow you to participate in interactive features",
					"To provide customer support",
					"To gather analysis or valuable information",
					"To monitor the usage of our service",
				],
			},
			{
				title: "Data Security",
				content:
					"We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.",
			},
			{
				title: "Your Data Protection Rights",
				content:
					"Depending on your location, you may have certain rights regarding your personal information, including:",
				items: [
					"The right to access, update or delete your information",
					"The right to rectification",
					"The right to object",
					"The right to data portability",
					"The right to withdraw consent",
				],
			},
		],
	},
	{
		title: "Terms of Service",
		lastUpdated: "Last updated: July 10, 2025",
		sections: [
			{
				title: "1. Agreement to Terms",
				content:
					"By accessing or using our service, you agree to be bound by these Terms of Service.",
			},
			{
				title: "2. User Accounts",
				content:
					"You are responsible for maintaining the confidentiality of your account and password.",
			},
			{
				title: "3. Intellectual Property",
				content:
					"The service and its original content, features, and functionality are and will remain the exclusive property of our company.",
			},
		],
	},
	{
		title: "Cookie Policy",
		lastUpdated: "Last updated: July 10, 2025",
		sections: [
			{
				title: "What Are Cookies",
				content:
					"Cookies are small text files stored on your device when you visit a website.",
			},
			{
				title: "How We Use Cookies",
				content:
					"We use cookies to improve your experience on our website, including:",
				items: [
					"Remembering your preferences",
					"Understanding how you use our site",
					"Personalizing content and ads",
					"Analyzing our traffic",
				],
			},
		],
	},
];

const activePolicy = ref(0);
const activeSection = ref(0);

const setActivePolicy = (index: number) => {
	activePolicy.value = index;
	activeSection.value = 0; // Reset to first section when changing policy
};
</script>

<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Policies & Terms</h1>
      <p class="text-lg text-gray-600 max-w-3xl mx-auto">
        Review our policies and terms to understand how we handle your information and what you can expect from our services.
      </p>
    </div>

    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-100">
              <h2 class="font-semibold text-gray-900">Our Policies</h2>
            </div>
            <nav class="p-2">
              <ul class="space-y-1">
                <li v-for="(policy, index) in policies" :key="index">
                  <button
                    @click="setActivePolicy(index)"
                    class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    :class="{
                      'bg-blue-50 text-blue-700': activePolicy === index,
                      'text-gray-700 hover:bg-gray-50': activePolicy !== index
                    }"
                  >
                    {{ policy.title }}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-8">
              <div class="flex justify-between items-start mb-8">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">{{ policies[activePolicy].title }}</h2>
                  <p class="text-sm text-gray-500 mt-1">{{ policies[activePolicy].lastUpdated }}</p>
                </div>
                <div class="relative lg:hidden">
                  <select 
                    v-model="activeSection"
                    class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option v-for="(section, index) in policies[activePolicy].sections" :key="index" :value="index">
                      {{ section.title }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="lg:flex gap-8">
                <!-- Desktop Section Navigation -->
                <div class="hidden lg:block w-64 flex-shrink-0">
                  <div class="sticky top-8 space-y-1">
                    <button
                      v-for="(section, index) in policies[activePolicy].sections"
                      :key="index"
                      @click="activeSection = index"
                      class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      :class="{
                        'bg-blue-50 text-blue-700': activeSection === index,
                        'text-gray-700 hover:bg-gray-50': activeSection !== index
                      }"
                    >
                      {{ section.title }}
                    </button>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1">
                  <div class="prose max-w-none">
                    <h3>{{ policies[activePolicy].sections[activeSection].title }}</h3>
                    <p class="text-gray-700">
                      {{ policies[activePolicy].sections[activeSection].content }}
                    </p>
                    
                    <ul v-if="policies[activePolicy].sections[activeSection].items" class="mt-4 space-y-2">
                      <li v-for="(item, itemIndex) in policies[activePolicy].sections[activeSection].items" :key="itemIndex" class="flex">
                        <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-gray-700">{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <p class="text-gray-600 mb-4">
        Have questions about our policies?
      </p>
      <button class="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
        Contact Us
      </button>
    </div>
  </div>
</template>
