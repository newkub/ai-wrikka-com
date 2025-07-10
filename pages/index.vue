<script setup lang="ts">
import { ref, onMounted } from "vue";

const isScrolled = ref(false);

onMounted(() => {
	window.addEventListener("scroll", () => {
		isScrolled.value = window.scrollY > 10;
	});
});

const activeTab = ref("Chat");

// Pricing state
const selectedApps = ref<number>(1);
const appPrice = 29; // ราคาต่อ app ต่อเดือน

const calculatePrice = (apps: number): number => {
	// ลดราคาเมื่อเลือกมากกว่า 1 app
	if (apps === 1) return appPrice;
	if (apps === 2) return appPrice * 2 * 0.9; // ลด 10%
	if (apps >= 3) return appPrice * apps * 0.8; // ลด 20%
	return appPrice;
};

const formattedPrice = (apps: number): string => {
	return `$${calculatePrice(apps).toFixed(2)}`;
};
</script>

<template>
  <!-- Navbar -->
  <header 
    class="sticky top-0 w-full z-50 bg-white shadow-md"
  >
    <nav class="w-full">
      <div class="flex items-center h-16 w-full">
        <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div class="flex-shrink-0 flex items-center">
              <a href="#" class="flex items-center">
                <img src="/favicon.ico" alt="AIWrikka" class="h-8 w-auto mr-2">
                <span class="text-xl font-bold text-indigo-600">AIWrikka</span>
              </a>
            </div>
            
            <div class="absolute left-1/2 transform -translate-x-1/2">
              <div class="flex items-center space-x-8">
                <RouterLink to="#products" class="px-3 py-2 text-sm font-medium hover:text-indigo-600">Products</RouterLink>
                <RouterLink to="#solution" class="px-3 py-2 text-sm font-medium hover:text-indigo-600">Solutions</RouterLink>
                <RouterLink to="#developer" class="px-3 py-2 text-sm font-medium hover:text-indigo-600">Developer</RouterLink>
                <RouterLink to="#pricing" class="px-3 py-2 text-sm font-medium hover:text-indigo-600">Pricing</RouterLink>
                <RouterLink to="#resources" class="px-3 py-2 text-sm font-medium hover:text-indigo-600">Resources</RouterLink>
                <RouterLink to="/docs" class="px-3 py-2 text-sm font-medium hover:text-indigo-600">Docs</RouterLink>
              </div>
            </div>
            
            <div class="flex items-center">
              <button class="px-4 py-2 rounded-md text-sm font-medium border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors">
                Sign in
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </nav>
  </header>

  <!-- Hero Section -->
  <section class="pt-24 pb-16 md:pt-32 md:pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Supercharge Your Workflow with <span class="text-indigo-600">AI Power</span>
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
        Discover AI tools that make your work easier, faster and more efficient than ever before.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <button class="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
          Start Free Trial
        </button>
        <button class="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
          Watch Demo
        </button>
      </div>
      <div class="mt-12">
        <div class="bg-white p-1 rounded-full inline-flex items-center shadow-sm">
          <div class="flex -space-x-2">
            <img class="h-10 w-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/12.jpg" alt="User">
            <img class="h-10 w-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User">
            <img class="h-10 w-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User">
          </div>
          <div class="ml-4 text-sm text-gray-600">
            <span class="font-medium">10,000+</span> professionals trust our AI tools
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Products Section -->
  <section id="products" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Powerful AI Products for Everyone</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Our AI tools are designed to help you work smarter, not harder. Choose the perfect solution for your needs.
        </p>
      </div>
      
      <div class="flex">
        <!-- Sidebar Tabs -->
        <div class="w-48 bg-gray-50 min-h-screen p-4">
          <div class="flex flex-col space-y-2">
            <button 
              v-for="tab in ['Chat', 'Video', 'Image']" 
              :key="tab"
              @click="activeTab = tab"
              class="px-4 py-2 text-left rounded-md transition-colors"
              :class="{
                'bg-indigo-100 text-indigo-700': activeTab === tab,
                'hover:bg-gray-100': activeTab !== tab
              }"
            >
              {{ tab }}
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 bg-white rounded-lg shadow-sm p-6">
          <div v-if="activeTab === 'Chat'">
            <h3 class="text-xl font-bold mb-4">AI Chat</h3>
            <div class="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="AI Chat" class="w-full h-full object-cover">
            </div>
            <p class="text-gray-600">
              Intelligent conversations with our advanced AI assistant.
            </p>
          </div>
          
          <div v-if="activeTab === 'Video'">
            <h3 class="text-xl font-bold mb-4">AI Video</h3>
            <div class="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="AI Video" class="w-full h-full object-cover">
            </div>
            <p class="text-gray-600">
              Create professional videos with AI-powered tools.
            </p>
          </div>
          
          <div v-if="activeTab === 'Image'">
            <h3 class="text-xl font-bold mb-4">AI Image</h3>
            <div class="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="AI Image" class="w-full h-full object-cover">
            </div>
            <p class="text-gray-600">
              Generate stunning images with cutting-edge AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Solutions Section -->
  <section id="solution" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Tailored AI Solutions</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Custom AI solutions designed to solve your specific business challenges.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-indigo-50 rounded-xl p-8 text-center">
          <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div class="i-mdi-briefcase text-3xl text-indigo-600"></div>
          </div>
          <h3 class="text-xl font-bold mb-2">Business Automation</h3>
          <p class="text-gray-600">
            Streamline operations with AI-powered automation for your workflows.
          </p>
        </div>
        
        <div class="bg-indigo-50 rounded-xl p-8 text-center">
          <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div class="i-mdi-chart-bar text-3xl text-indigo-600"></div>
          </div>
          <h3 class="text-xl font-bold mb-2">Data Analytics</h3>
          <p class="text-gray-600">
            Gain insights from your data with our advanced analytics solutions.
          </p>
        </div>
        
        <div class="bg-indigo-50 rounded-xl p-8 text-center">
          <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div class="i-mdi-headset text-3xl text-indigo-600"></div>
          </div>
          <h3 class="text-xl font-bold mb-2">Customer Support</h3>
          <p class="text-gray-600">
            Enhance customer experience with AI-powered support solutions.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Developer Section -->
  <section id="developer" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Developer Tools & APIs</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Powerful tools for developers to build with our AI platform.
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <div class="i-mdi-code-braces text-2xl text-indigo-600"></div>
          </div>
          <h3 class="text-lg font-bold mb-2">API Documentation</h3>
          <p class="text-gray-600 text-sm mb-4">
            Comprehensive docs to integrate our AI services.
          </p>
          <button class="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
            View Docs →
          </button>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <div class="i-mdi-github text-2xl text-indigo-600"></div>
          </div>
          <h3 class="text-lg font-bold mb-2">SDKs & Libraries</h3>
          <p class="text-gray-600 text-sm mb-4">
            Client libraries for popular languages.
          </p>
          <button class="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
            Explore SDKs →
          </button>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <div class="i-mdi-code-tags text-2xl text-indigo-600"></div>
          </div>
          <h3 class="text-lg font-bold mb-2">Code Examples</h3>
          <p class="text-gray-600 text-sm mb-4">
            Ready-to-use code snippets.
          </p>
          <button class="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
            View Examples →
          </button>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <div class="i-mdi-play-box-outline text-2xl text-indigo-600"></div>
          </div>
          <h3 class="text-lg font-bold mb-2">API Playground</h3>
          <p class="text-gray-600 text-sm mb-4">
            Test our APIs in your browser.
          </p>
          <button class="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
            Try Playground →
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section id="testimonials" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">What Our Users Say</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Join thousands of satisfied users who have transformed their workflow with our AI tools
        </p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Testimonial 1 -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center mb-4">
            <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="User" class="w-12 h-12 rounded-full">
            <div class="ml-4">
              <h4 class="font-semibold">Sarah Johnson</h4>
              <p class="text-sm text-gray-500">Product Designer</p>
            </div>
          </div>
          <p class="text-gray-600">
            "The AI image generator has completely transformed how I create mockups. The quality is incredible and it saves me hours of work every week."
          </p>
          <div class="mt-4 flex">
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
          </div>
        </div>
        
        <!-- Testimonial 2 -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center mb-4">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" class="w-12 h-12 rounded-full">
            <div class="ml-4">
              <h4 class="font-semibold">Michael Chen</h4>
              <p class="text-sm text-gray-500">Software Engineer</p>
            </div>
          </div>
          <p class="text-gray-600">
            "As a developer, the code assistant has been a game-changer. It helps me write cleaner code and find solutions to complex problems faster."
          </p>
          <div class="mt-4 flex">
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
          </div>
        </div>
        
        <!-- Testimonial 3 -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center mb-4">
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" class="w-12 h-12 rounded-full">
            <div class="ml-4">
              <h4 class="font-semibold">Emily Rodriguez</h4>
              <p class="text-sm text-gray-500">Content Creator</p>
            </div>
          </div>
          <p class="text-gray-600">
            "I use the video tools daily for my YouTube channel. The AI-powered editing saves me so much time and the results are professional quality."
          </p>
          <div class="mt-4 flex">
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
            <div class="i-mdi-star text-yellow-400"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Resources Section -->
  <section id="resources" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Resources</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Explore all available resources
        </p>
      </div>
      
      <div class="flex flex-wrap justify-center gap-6">
        <RouterLink to="/" class="flex items-center px-4 py-2 bg-white rounded shadow hover:shadow-md">
          <div class="i-mdi-home mr-2"></div> Home
        </RouterLink>
        <RouterLink to="/api" class="flex items-center px-4 py-2 bg-white rounded shadow hover:shadow-md">
          <div class="i-mdi-api mr-2"></div> API
        </RouterLink>
        <RouterLink to="/code" class="flex items-center px-4 py-2 bg-white rounded shadow hover:shadow-md">
          <div class="i-mdi-code-braces mr-2"></div> Code
        </RouterLink>
        <RouterLink to="/docs" class="flex items-center px-4 py-2 bg-white rounded shadow hover:shadow-md">
          <div class="i-mdi-book-open mr-2"></div> Docs
        </RouterLink>
        <RouterLink to="/hosting" class="flex items-center px-4 py-2 bg-white rounded shadow hover:shadow-md">
          <div class="i-mdi-server mr-2"></div> Hosting
        </RouterLink>
        <RouterLink to="/bookmark" class="flex items-center px-4 py-2 bg-white rounded shadow hover:shadow-md">
          <div class="i-mdi-bookmark mr-2"></div> Bookmark
        </RouterLink>
        <RouterLink to="/email" class="flex items-center px-4 py-2 bg-white rounded shadow hover:shadow-md">
          <div class="i-mdi-email mr-2"></div> Email
        </RouterLink>
        <RouterLink to="/contact" class="flex items-center px-4 py-2 bg-white rounded shadow hover:shadow-md">
          <div class="i-mdi-account-box mr-2"></div> Contact
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section id="pricing" class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. No hidden fees, cancel anytime.
        </p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Free Plan -->
        <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h3 class="text-xl font-bold mb-4">Starter</h3>
          <div class="mb-6">
            <span class="text-4xl font-bold">$0</span>
            <span class="text-gray-500">/month</span>
          </div>
          <p class="text-gray-600 mb-6">Perfect for trying out our basic features</p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>Access to basic AI tools</span>
            </li>
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>10 AI generations per day</span>
            </li>
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>Community support</span>
            </li>
          </ul>
          <button class="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Get Started Free
          </button>
        </div>
        
        <!-- Pro Plan -->
        <div class="bg-white rounded-xl p-8 shadow-lg border-2 border-indigo-500 relative">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
          <h3 class="text-xl font-bold mb-4">Pro</h3>
  
          <!-- App Selector -->
          <div class="mb-4">
            <label for="apps" class="block text-sm font-medium text-gray-700 mb-2">Number of Apps</label>
            <select 
              id="apps" 
              v-model="selectedApps"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">1 App</option>
              <option value="2">2 Apps</option>
              <option value="3">3 Apps</option>
              <option value="4">4 Apps</option>
              <option value="5">5 Apps</option>
            </select>
          </div>
  
          <!-- Dynamic Pricing -->
          <div class="mb-6">
            <span class="text-4xl font-bold">{{ formattedPrice(selectedApps) }}</span>
            <span class="text-gray-500">/month</span>
            <div v-if="selectedApps > 1" class="text-sm text-green-600 mt-1">
              {{ selectedApps === 2 ? '10% discount' : '20% discount' }} applied!
            </div>
          </div>
  
          <p class="text-gray-600 mb-6">For professionals and small teams</p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>All Starter features</span>
            </li>
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>{{ selectedApps * 100 }} AI generations per day</span>
            </li>
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>Priority support</span>
            </li>
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>Commercial license</span>
            </li>
          </ul>
          <button class="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Get Started
          </button>
        </div>
        
        <!-- Enterprise Plan -->
        <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h3 class="text-xl font-bold mb-4">Enterprise</h3>
          <div class="mb-6">
            <span class="text-4xl font-bold">Custom</span>
          </div>
          <p class="text-gray-600 mb-6">For large teams with custom needs</p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>All Pro features</span>
            </li>
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>Unlimited generations</span>
            </li>
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>Dedicated account manager</span>
            </li>
            <li class="flex items-center">
              <div class="i-mdi-check text-green-500 mr-2"></div>
              <span>Custom AI model training</span>
            </li>
          </ul>
          <button class="w-full bg-white text-indigo-600 border border-indigo-600 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="bg-indigo-700 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold text-white mb-6">Ready to transform your workflow?</h2>
      <p class="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
        Join thousands of professionals already using our AI tools to save time and boost productivity.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <button class="bg-white text-indigo-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors">
          Start Free Trial
        </button>
        <button class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
          Schedule a Demo
        </button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-gray-400 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-white text-sm font-semibold mb-4">Product</h3>
          <ul class="space-y-2">
            <li><RouterLink to="#products" class="hover:text-white transition-colors">Products</RouterLink></li>
            <li><RouterLink to="#pricing" class="hover:text-white transition-colors">Pricing</RouterLink></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-white text-sm font-semibold mb-4">Company</h3>
          <ul class="space-y-2">
            <li><RouterLink to="/blog" class="hover:text-white transition-colors">Blog</RouterLink></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-white text-sm font-semibold mb-4">Legal</h3>
          <ul class="space-y-2">
            <li><RouterLink to="/policy" class="hover:text-white transition-colors">Privacy Policy</RouterLink></li>
            <li><RouterLink to="/terms" class="hover:text-white transition-colors">Terms of Service</RouterLink></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-white text-sm font-semibold mb-4">Connect</h3>
          <div class="flex space-x-6">
            <a href="#" class="hover:text-white transition-colors">
              <span class="i-mdi-twitter text-2xl"></span>
            </a>
            <a href="#" class="hover:text-white transition-colors">
              <span class="i-mdi-facebook text-2xl"></span>
            </a>
            <a href="#" class="hover:text-white transition-colors">
              <span class="i-mdi-linkedin text-2xl"></span>
            </a>
            <a href="#" class="hover:text-white transition-colors">
              <span class="i-mdi-youtube text-2xl"></span>
            </a>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center mb-4 md:mb-0">
          <a href="#" class="text-xl font-bold text-white">AIWrikka</a>
          <span class="text-gray-500 ml-2">2023 All rights reserved</span>
        </div>
        
        <div class="flex space-x-6">
          <a href="#" class="text-gray-400 hover:text-white">
            <span class="i-mdi-twitter text-2xl"></span>
          </a>
          <a href="#" class="text-gray-400 hover:text-white">
            <span class="i-mdi-facebook text-2xl"></span>
          </a>
          <a href="#" class="text-gray-400 hover:text-white">
            <span class="i-mdi-linkedin text-2xl"></span>
          </a>
          <a href="#" class="text-gray-400 hover:text-white">
            <span class="i-mdi-youtube text-2xl"></span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
