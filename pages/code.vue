<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-xl font-bold text-indigo-600">AI Wrikka</span>
          </div>
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/" class="text-gray-700 hover:text-indigo-600 font-medium">หน้าแรก</NuxtLink>
            <NuxtLink to="/chat" class="text-gray-700 hover:text-indigo-600 font-medium">แชท</NuxtLink>
            <NuxtLink to="/about" class="text-gray-700 hover:text-indigo-600 font-medium">เกี่ยวกับเรา</NuxtLink>
          </div>
          <div class="flex items-center">
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              เริ่มต้นใช้งาน
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          ยินดีต้อนรับสู่ AI Wrikka
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          แพลตฟอร์ม AI ช่วยสร้างสรรค์เนื้อหาที่ทันสมัยและมีประสิทธิภาพ
          พร้อมให้บริการทุกความต้องการด้านการสร้างเนื้อหาของคุณ
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink 
            to="/chat" 
            class="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            เริ่มแชทตอนนี้
          </NuxtLink>
          <button class="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors">
            เรียนรู้เพิ่มเติม
          </button>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-24">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">คุณสมบัติเด่น</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(feature, index) in features" :key="index" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <div :class="`i-mdi-${feature.icon} text-2xl text-indigo-600`"></div>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-center text-gray-500 text-sm">
          &copy; 2025 AI Wrikka. สงวนลิขสิทธิ์ทุกประการ
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    icon: 'lightning-bolt',
    title: 'สร้างเนื้อหาได้รวดเร็ว',
    description: 'สร้างเนื้อหาคุณภาพสูงในเวลาเพียงไม่กี่วินาที ด้วยเทคโนโลยี AI ล้ำสมัย'
  },
  {
    icon: 'hand-okay',
    title: 'ใช้งานง่าย',
    description: 'อินเทอร์เฟซที่เรียบง่าย เข้าใจง่าย เหมาะสำหรับผู้ใช้งานทุกระดับ'
  },
  {
    icon: 'earth',
    title: 'รองรับหลายภาษา',
    description: 'สามารถสร้างและตอบกลับได้หลายภาษา พร้อมรองรับการใช้งานที่หลากหลาย'
  },
  {
    icon: 'shield-check',
    title: 'ปลอดภัยสูง',
    description: 'ระบบรักษาความปลอดภัยมาตรฐานสูง ข้อมูลของคุณจะถูกเก็บเป็นความลับ'
  }
]
</script>

<style scoped>
/* เพิ่มสไตล์เพิ่มเติมได้ตามต้องการ */
</style>