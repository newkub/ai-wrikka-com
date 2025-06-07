<script setup lang="ts">
import { ref } from "vue";
import ModalAuth from "~/components/modal/ModalAuth.vue";
import type { AuthSuccessData } from "~/components/modal/ModalAuth.vue";

const isModalOpen = ref(false);

const openAuthModal = () => {
	isModalOpen.value = true;
};

const onAuthSuccess = (data: AuthSuccessData) => {
	// Handle successful authentication
	console.log("Authentication successful:", data);
	isModalOpen.value = false;
};

const onModalClose = () => {
	isModalOpen.value = false;
};
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <Button 
      @click="openAuthModal"
      class="text-white bg-primary hover:bg-primary-hover transition-colors duration-200 px-4 py-2 rounded-md"
    >
      <slot>Sign In</slot>
    </Button>

    <ModalAuth
      v-model="isModalOpen"
      @success="onAuthSuccess"
      @close="onModalClose"
    />
  </div>
</template>