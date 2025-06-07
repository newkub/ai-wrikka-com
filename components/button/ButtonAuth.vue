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
  <div>
    <Button @click="openAuthModal">
      <slot>Sign In</slot>
    </Button>

    <ModalAuth
      v-model="isModalOpen"
      @success="onAuthSuccess"
      @close="onModalClose"
    />
  </div>
</template>