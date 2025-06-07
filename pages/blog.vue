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
  <div>
    <!-- Navigation -->
    <nav class="bg-block shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="font-bold text-lg">
                AI Wrikka
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="post in posts" 
          :key="post.id"
          class="bg-block rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
        >
          <NuxtLink :to="`/blog/${post.slug}`">
            <img 
              :src="post.image" 
              :alt="post.title"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <span class="text-xs uppercase tracking-wider primary">
                {{ post.category }}
              </span>
              <h3 class="mt-2 font-semibold text-lg">
                {{ post.title }}
              </h3>
              <p class="mt-2 text-sm opacity-80">
                {{ post.excerpt }}
              </p>
              <div class="mt-4 flex justify-between items-center text-xs">
                <span>{{ formatDate(post.date) }}</span>
                <span>{{ post.views }} views</span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </main>
  </div>
</template>
