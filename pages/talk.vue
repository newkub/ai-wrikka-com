<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

definePageMeta({
	layout: "fullscreen",
});

// AI Model State
const selectedModel = ref("gpt-4");
const isRecording = ref(false);
const isMuted = ref(false);
const isCameraOn = ref(true);
const isScreenSharing = ref(false);

// Messages
const messages = ref([
	{
		id: 1,
		sender: "ai",
		text: "สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?",
		timestamp: new Date(),
	},
]);

// Available AI Models
const aiModels = [
	{ id: "gpt-4", name: "GPT-4", icon: "i-mdi-robot-outline" },
	{ id: "gpt-3.5", name: "GPT-3.5", icon: "i-mdi-robot" },
	{ id: "claude", name: "Claude", icon: "i-mdi-account-circle-outline" },
];

// Video Refs
const videoRef = ref<HTMLVideoElement | null>(null);
let stream: MediaStream | null = null;

// Initialize Camera
const initCamera = async () => {
	try {
		stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		if (videoRef.value) {
			videoRef.value.srcObject = stream;
		}
	} catch (err) {
		console.error("Error accessing camera:", err);
	}
};

// Toggle Camera
const toggleCamera = () => {
	if (stream) {
		const videoTrack = stream.getVideoTracks()[0];
		if (videoTrack) {
			videoTrack.enabled = !videoTrack.enabled;
			isCameraOn.value = videoTrack.enabled;
		}
	}
};

// Toggle Microphone
const toggleMicrophone = () => {
	if (stream) {
		const audioTrack = stream.getAudioTracks()[0];
		if (audioTrack) {
			audioTrack.enabled = !audioTrack.enabled;
			isMuted.value = !audioTrack.enabled;
		}
	}
};

// Toggle Screen Sharing
const toggleScreenShare = async () => {
	try {
		if (!isScreenSharing.value) {
			const screenStream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true,
			});

			if (stream) {
				// Stop existing tracks
				for (const track of stream.getTracks()) {
					track.stop();
				}
			}

			stream = screenStream;
			if (videoRef.value) {
				videoRef.value.srcObject = stream;
			}

			// Handle when screen sharing is stopped
			screenStream.getVideoTracks()[0].onended = () => {
				isScreenSharing.value = false;
				initCamera();
			};

			isScreenSharing.value = true;
		} else {
			if (stream) {
				for (const track of stream.getTracks()) {
					track.stop();
				}
				initCamera();
				isScreenSharing.value = false;
			}
		}
	} catch (err) {
		console.error("Error sharing screen:", err);
	}
};

// Start/Stop Recording
const toggleRecording = () => {
	isRecording.value = !isRecording.value;
	// TODO: Implement recording functionality
};

// Send message to AI
const sendMessage = (message: string) => {
	if (!message.trim()) return;

	// Add user message
	messages.value.push({
		id: Date.now(),
		sender: "user",
		text: message,
		timestamp: new Date(),
	});

	// Simulate AI response
	setTimeout(() => {
		messages.value.push({
			id: Date.now() + 1,
			sender: "ai",
			text: "ผมเข้าใจที่คุณพูดครับ. มีอะไรให้ช่วยอีกไหมครับ?",
			timestamp: new Date(),
		});
	}, 1000);
};

// Clean up on component unmount
onUnmounted(() => {
	if (stream) {
		for (const track of stream.getTracks()) {
			track.stop();
		}
	}
});

// Initialize camera when component mounts
onMounted(() => {
	initCamera();
});
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Left Panel (3/4) - Video Feed -->
    <div class="flex-1 flex flex-col bg-black relative overflow-hidden">
      <!-- Video Container -->
      <div class="flex-1 flex items-center justify-center bg-gray-900 relative">
        <video 
          ref="videoRef" 
          autoplay 
          playsinline 
          muted 
          class="h-full w-full object-contain"
        />
        
        <!-- User Controls Overlay -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/70 rounded-full px-6 py-2">
          <button 
            @click="toggleMicrophone" 
            class="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            :class="{ 'bg-red-500': isMuted }"
          >
            <div v-if="isMuted" class="i-mdi-microphone-off h-6 w-6" />
            <div v-else class="i-mdi-microphone h-6 w-6" />
          </button>
          
          <button 
            @click="toggleCamera" 
            class="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            :class="{ 'bg-red-500': !isCameraOn }"
          >
            <div v-if="isCameraOn" class="i-mdi-video h-6 w-6" />
            <div v-else class="i-mdi-video-off h-6 w-6" />
          </button>
          
          <button 
            @click="toggleScreenShare" 
            class="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            :class="{ 'bg-blue-500': isScreenSharing }"
          >
            <div class="i-mdi-monitor-share h-6 w-6" />
          </button>
          
          <div class="h-8 w-px bg-white/30 mx-2"></div>
          
          <button 
            @click="toggleRecording" 
            class="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            :class="{ 'bg-red-500 animate-pulse': isRecording }"
          >
            <div v-if="isRecording" class="i-mdi-stop h-6 w-6" />
            <div v-else class="i-mdi-record-rec h-6 w-6" />
          </button>
        </div>
        
        <!-- AI Status Indicator -->
        <div class="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <div class="w-2 h-2 bg-white rounded-full mr-1"></div>
          AI กำลังฟังอยู่
        </div>
      </div>
      
      <!-- Chat Input -->
      <div class="bg-white p-4 border-t border-gray-200">
        <div class="flex items-center space-x-2">
          <input 
            type="text" 
            placeholder="พิมพ์ข้อความ..." 
            class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="sendMessage(($event.target as HTMLInputElement).value); ($event.target as HTMLInputElement).value = ''"
          >
          <button class="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
            <div class="i-mdi-send h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Right Panel (1/4) - AI Controls & Info -->
    <div class="w-80 bg-white border-l border-gray-200 flex flex-col">
      <!-- AI Model Selector -->
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-700 mb-2">AI Model</h3>
        <div class="space-y-2">
          <button 
            v-for="model in aiModels" 
            :key="model.id"
            @click="selectedModel = model.id"
            class="w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors"
            :class="{
              'bg-blue-50 text-blue-700': selectedModel === model.id,
              'text-gray-700 hover:bg-gray-50': selectedModel !== model.id
            }"
          >
            <div :class="model.icon + ' mr-2 text-lg'" />
            {{ model.name }}
          </button>
        </div>
      </div>
      
      <!-- Chat History -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="flex"
          :class="{ 'justify-end': message.sender === 'user' }"
        >
          <div 
            class="max-w-[80%] p-3 rounded-lg"
            :class="{
              'bg-blue-500 text-white rounded-tr-none': message.sender === 'user',
              'bg-gray-100 text-gray-800 rounded-tl-none': message.sender === 'ai' 
            }"
          >
            {{ message.text }}
            <div class="text-xs mt-1 opacity-70" :class="{ 'text-blue-100': message.sender === 'user', 'text-gray-500': message.sender === 'ai' }">
              {{ new Date(message.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- AI Controls -->
      <div class="p-4 border-t border-gray-200 space-y-3">
        <button class="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
          <div class="i-mdi-robot-happy h-5 w-5" />
          <span>ขอคำแนะนำจาก AI</span>
        </button>
        
        <div class="grid grid-cols-2 gap-2">
          <button class="flex items-center justify-center space-x-1 text-sm text-gray-600 hover:bg-gray-50 p-2 rounded-md transition-colors">
            <div class="i-mdi-translate h-4 w-4" />
            <span>แปลภาษา</span>
          </button>
          <button class="flex items-center justify-center space-x-1 text-sm text-gray-600 hover:bg-gray-50 p-2 rounded-md transition-colors">
            <div class="i-mdi-note-text h-4 w-4" />
            <span>สรุปการสนทนา</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>