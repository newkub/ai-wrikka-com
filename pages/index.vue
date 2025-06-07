
<script setup lang="ts">
// No script needed for static content
</script>

<template>
  <div class="">
    <!-- Hero Section -->
    <div >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          สร้างสรรค์ผลงานด้วย AI
        </h1>
        <p class="text-xl max-w-3xl mx-auto mb-8">
          พบกับเครื่องมือ AI ที่ช่วยให้การทำงานของคุณง่ายขึ้น รวดเร็วยิ่งขึ้น และมีประสิทธิภาพมากขึ้น
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button class="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors">
            เริ่มต้นใช้งาน
          </button>
          <button class="bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors">
            เรียนรู้เพิ่มเติม
          </button>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-3xl font-bold text-center text-black mb-12">เครื่องมือ AI สำหรับคุณ</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <div class="i-mdi-robot-happy text-6xl text-white"></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">AI Chat</h3>
            <p class="text-sm mb-4">
              สนทนากับ AI ที่สามารถตอบคำถามและช่วยแก้ปัญหาต่างๆ ได้อย่างชาญฉลาด
            </p>
            <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              เริ่มใช้งาน <span class="i-mdi-arrow-right ml-1"></span>
            </button>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            <div class="i-mdi-image-edit text-6xl text-white"></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">สร้างรูปภาพ</h3>
            <p class="text-sm mb-4">
              สร้างภาพสวยๆ จากข้อความด้วย AI ตามที่คุณต้องการ
            </p>
            <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              เริ่มใช้งาน <span class="i-mdi-arrow-right ml-1"></span>
            </button>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
            <div class="i-mdi-file-document-edit text-6xl text-white"></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">เขียนบทความ</h3>
            <p class="text-sm mb-4">
              สร้างเนื้อหาบทความคุณภาพสูงด้วยความช่วยเหลือจาก AI
            </p>
            <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              เริ่มใช้งาน <span class="i-mdi-arrow-right ml-1"></span>
            </button>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div class="h-48 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
            <div class="i-mdi-code-tags text-6xl text-white"></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">เขียนโค้ด</h3>
            <p class="text-sm mb-4">
              สร้างและแก้ไขโค้ดด้วย AI ช่วยเหลือการเขียนโปรแกรม
            </p>
            <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              เริ่มใช้งาน <span class="i-mdi-arrow-right ml-1"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-indigo-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 class="text-3xl font-bold text-white mb-6">พร้อมเริ่มต้นใช้งานหรือยัง?</h2>
        <p class="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
          ลงทะเบียนวันนี้และเริ่มใช้เครื่องมือ AI ของเราเพื่อเพิ่มประสิทธิภาพการทำงานของคุณ
        </p>
        <button class="bg-white text-indigo-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-50 transition-colors">
          สมัครสมาชิกฟรี
        </button>
      </div>
    </div>
  </div>
</template>
