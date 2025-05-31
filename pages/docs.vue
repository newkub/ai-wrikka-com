<script setup lang="ts">
// This page uses the docs layout
// The layout is defined in layouts/docs.vue
definePageMeta({
  layout: 'docs'
});

const route = useRoute();
const docId = computed(() => route.params.id?.[0] || 'introduction');

// Content for each documentation page
const docs = {
  'introduction': {
    title: 'Introduction',
    content: 'Welcome to the documentation. This is the introduction page.'
  },
  'installation': {
    title: 'Installation',
    content: 'Installation instructions will go here.'
  },
  'configuration': {
    title: 'Configuration',
    content: 'Configuration options will be listed here.'
  },
  'authentication': {
    title: 'Authentication',
    content: 'Authentication guide will be documented here.'
  },
  'api-reference': {
    title: 'API Reference',
    content: 'API reference documentation will be available here.'
  },
  'examples': {
    title: 'Examples',
    content: 'Code examples and usage patterns will be shown here.'
  },
  'deployment': {
    title: 'Deployment',
    content: 'Deployment guides and best practices.'
  },
  'troubleshooting': {
    title: 'Troubleshooting',
    content: 'Common issues and their solutions.'
  },
  'faq': {
    title: 'Frequently Asked Questions',
    content: 'Answers to common questions.'
  }
};

// Get the current document based on the route
const currentDoc = computed(() => {
  return docs[docId.value as keyof typeof docs] || docs.introduction;
});
</script>

<template>
  <div>
    <h1>{{ currentDoc.title }}</h1>
    <div class="leading-7 text-gray-700">
      <p>{{ currentDoc.content }}</p>
      <!-- You can replace this with your actual documentation content components -->
    </div>
  </div>
</template>