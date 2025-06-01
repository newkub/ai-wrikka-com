---
title: "Getting Started with Vue 3 Composition API"
description: "Learn how to use the new Composition API in Vue 3 to build more maintainable and reusable components."
date: 2023-05-15
category: "Vue"
readTime: "5 min read"
image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
tags:
  - Vue 3
  - Composition API
  - JavaScript
  - Frontend
author:
  name: "John Doe"
  avatar: "https://randomuser.me/api/portraits/men/1.jpg"
---

# Getting Started with Vue 3 Composition API

Vue 3's Composition API is a powerful new way to organize and reuse component logic. In this article, we'll explore how to get started with the Composition API and how it can improve your Vue applications.

## What is the Composition API?

The Composition API is a set of additive, function-based APIs that allow flexible composition of component logic. It was introduced in Vue 3 as an alternative to the Options API, providing better code organization and reusability, especially in large applications.

## Basic Setup

To use the Composition API, you'll need to import the necessary functions from Vue:

```js
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    // Your component logic here
    
    return {
      // Expose to template
    }
  }
}
```

## Reactivity with `ref` and `reactive`

The Composition API provides two main ways to create reactive state:

```js
import { ref, reactive } from 'vue';

// For primitive values
const count = ref(0);

// For objects
const state = reactive({
  firstName: 'John',
  lastName: 'Doe'
});
```

## Computed Properties and Watchers

```js
import { computed, watch } from 'vue';

// Computed property
const fullName = computed(() => {
  return `${state.firstName} ${state.lastName}`;
});

// Watcher
watch(
  () => state.firstName,
  (newValue, oldValue) => {
    console.log(`Name changed from ${oldValue} to ${newValue}`);
  }
);
```

## Lifecycle Hooks

Lifecycle hooks are available as functions in the Composition API:

```js
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  console.log('Component is mounted!');
});

onUpdated(() => {
  console.log('Component has been updated!');
});

onUnmounted(() => {
  console.log('Component is being unmounted!');
});
```

## Composable Functions

One of the biggest advantages of the Composition API is the ability to extract and reuse logic:

```js
// useCounter.js
import { ref } from 'vue';

export default function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  
  function increment() {
    count.value++;
  }
  
  function decrement() {
    count.value--;
  }
  
  return {
    count,
    increment,
    decrement
  };
}

// In your component
import useCounter from './useCounter';

export default {
  setup() {
    const { count, increment, decrement } = useCounter(0);
    
    return {
      count,
      increment,
      decrement
    };
  }
};
```

## When to Use Composition API

While the Options API is still fully supported, consider using the Composition API when:

- You're building large applications with many components
- You need to share logic between components
- You want better TypeScript support
- You prefer a more functional programming style

## Conclusion

The Composition API brings a more flexible way to organize and reuse code in Vue 3 applications. While it has a learning curve, it offers significant benefits for larger applications and team workflows.

## Further Reading

- [Vue 3 Composition API Documentation](https://v3.vuejs.org/guide/composition-api-introduction.html)
- [Vue Mastery: Vue 3 Composition API Course](https://www.vuemastery.com/courses/vue-3-essentials/why-the-composition-api/)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
