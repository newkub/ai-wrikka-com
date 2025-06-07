<script setup lang="ts">
const posts = [
  {
    id: 1,
    title: 'เริ่มต้นใช้งาน AI Wrikka ฉบับมือใหม่',
    excerpt: 'เรียนรู้วิธีใช้งาน AI Wrikka ตั้งแต่เริ่มต้นจนสร้างเนื้อหาได้อย่างมืออาชีพ',
    date: '2025-06-01',
    views: '1.2k',
    category: 'คู่มือ',
    slug: 'getting-started-with-ai-wrikka',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: '10 เทคนิคสร้างคอนเทนต์ให้ปังด้วย AI',
    excerpt: 'เคล็ดลับการใช้งาน AI ในการสร้างคอนเทนต์ที่น่าสนใจและมีประสิทธิภาพ',
    date: '2025-05-28',
    views: '2.4k',
    category: 'เทคนิค',
    slug: '10-ai-content-creation-tips',
    image: 'https://images.unsplash.com/photo-1516321318423-f06a85f50859?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: 'เปรียบเทียบ AI Tools สำหรับนักเขียน',
    excerpt: 'มารู้จักกับเครื่องมือ AI สำหรับนักเขียนที่ควรมีติดเครื่อง',
    date: '2025-05-20',
    views: '1.8k',
    category: 'รีวิว',
    slug: 'ai-tools-for-writers',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    title: 'วิธีเพิ่มประสิทธิภาพการทำงานด้วย AI',
    excerpt: 'เทคนิคการใช้ AI เพื่อเพิ่มประสิทธิภาพในการทำงานให้เร็วขึ้น',
    date: '2025-05-15',
    views: '3.1k',
    category: 'ประสิทธิภาพ',
    slug: 'boost-productivity-with-ai',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 5,
    title: 'การเขียนบทความ SEO ด้วย AI',
    excerpt: 'เรียนรู้เทคนิคการเขียนบทความ SEO ที่ติดอันดับด้วยความช่วยเหลือจาก AI',
    date: '2025-05-10',
    views: '2.7k',
    category: 'SEO',
    slug: 'ai-seo-article-writing',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 6,
    title: 'สร้างกราฟิกสำหรับโซเชียลมีเดียด้วย AI',
    excerpt: 'วิธีสร้างกราฟิกสวยๆ สำหรับโพสต์โซเชียลมีเดียด้วย AI ง่ายๆ',
    date: '2025-05-05',
    views: '1.9k',
    category: 'กราฟิก',
    slug: 'ai-graphic-design',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 7,
    title: 'เทรนด์ AI ที่น่าจับตามองในปี 2025',
    excerpt: 'อัปเดตเทรนด์ AI และเทคโนโลยีใหม่ๆ ที่จะมาเปลี่ยนโลกการทำงาน',
    date: '2025-04-28',
    views: '3.5k',
    category: 'เทรนด์',
    slug: 'ai-trends-2025',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 8,
    title: 'วิธีใช้ AI ช่วยในการตลาดออนไลน์',
    excerpt: 'นำ AI มาใช้ในการวางกลยุทธ์ทางการตลาดออนไลน์ให้มีประสิทธิภาพมากขึ้น',
    date: '2025-04-20',
    views: '2.2k',
    category: 'การตลาด',
    slug: 'ai-in-digital-marketing',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
]

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date(dateString).toLocaleDateString('th-TH', options)
}
</script>

<template>
  <div class="">
    <!-- Navigation -->
    <nav class="bg-block shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-xl font-bold text-primary">AI Wrikka</span>
          </div>
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/" class="text hover:text-primary font-medium">หน้าแรก</NuxtLink>
            <NuxtLink to="/chat" class="text hover:text-primary font-medium">แชท</NuxtLink>
            <NuxtLink to="/about" class="text hover:text-primary font-medium">เกี่ยวกับเรา</NuxtLink>
          </div>
          <div class="flex items-center">
            <button class="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
              เริ่มต้นใช้งาน
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Blog Header -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text mb-4">
          บทความล่าสุด
        </h1>
        <p class="text-xl text max-w-3xl mx-auto">
          อัปเดตบทความ เทคนิค และความรู้ใหม่ๆ เกี่ยวกับ AI และเทคโนโลยีล่าสุด
        </p>
      </div>

      <!-- Blog Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article v-for="post in posts" :key="post.id" class="bg-block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div class="h-48 bg-block overflow-hidden">
            <img :src="post.image" :alt="post.title" class="w-full h-full object-cover">
          </div>
          <div class="p-5">
            <div class="flex items-center text-sm text mb-2">
              <span class="i-mdi-calendar mr-1"></span>
              <span>{{ formatDate(post.date) }}</span>
              <span class="mx-2">•</span>
              <span class="flex items-center">
                <span class="i-mdi-eye mr-1"></span>
                {{ post.views }}
              </span>
            </div>
            <h2 class="text-xl font-bold text mb-2 line-clamp-2">
              {{ post.title }}
            </h2>
            <p class="text text-sm mb-4 line-clamp-3">
              {{ post.excerpt }}
            </p>
            <div class="flex items-center justify-between">
              <span class="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                {{ post.category }}
              </span>
              <NuxtLink 
                :to="`/blog/${post.slug}`" 
                class="text-primary hover:opacity-80 text-sm font-medium flex items-center transition-opacity"
              >
                อ่านต่อ
                <span class="i-mdi-arrow-right ml-1"></span>
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div class="mt-12 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button class="px-4 py-2 border rounded-md bg-secondary hover:bg-secondary-dark transition-opacity">
            <span class="i-mdi-chevron-left"></span>
            ก่อนหน้า
          </button>
          <button class="px-4 py-2 border rounded-md bg-primary text-white">
            1
          </button>
          <button class="px-4 py-2 border rounded-md bg-block/50 hover:bg-block/70 transition-opacity">
            2
          </button>
          <button class="px-4 py-2 border rounded-md bg-block/50 hover:bg-block/70 transition-opacity">
            3
          </button>
          <button class="px-4 py-2 border rounded-md text bg-block hover:opacity-90 transition-opacity">
            ถัดไป
            <span class="i-mdi-chevron-right"></span>
          </button>
        </nav>
      </div>

      <!-- Popular Categories -->
      <div class="mt-24">
        <h2 class="text-3xl font-bold text-center text mb-12">หมวดหมู่ยอดนิยม</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <a href="#" class="bg-block p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <div class="i-mdi-book-open-page-variant text-2xl text-primary"></div>
            </div>
            <span class="text font-medium">คู่มือ</span>
          </a>
          <a href="#" class="bg-block p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <div class="i-mdi-lightbulb-on text-2xl text-primary"></div>
            </div>
            <span class="text font-medium">เทคนิค</span>
          </a>
          <a href="#" class="bg-block p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <div class="i-mdi-star text-2xl text-primary"></div>
            </div>
            <span class="text font-medium">รีวิว</span>
          </a>
          <a href="#" class="bg-block p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <div class="i-mdi-chart-line text-2xl text-primary"></div>
            </div>
            <span class="text font-medium">ประสิทธิภาพ</span>
          </a>
          <a href="#" class="bg-block p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <div class="i-mdi-magnify text-2xl text-primary"></div>
            </div>
            <span class="text font-medium">SEO</span>
          </a>
          <a href="#" class="bg-block p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <div class="i-mdi-trending-up text-2xl text-primary"></div>
            </div>
            <span class="text font-medium">เทรนด์</span>
          </a>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-block/50 border-t border mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-center text text-sm">
          &copy; 2025 AI Wrikka. สงวนลิขสิทธิ์ทุกประการ
        </p>
      </div>
    </footer>
  </div>
</template>
