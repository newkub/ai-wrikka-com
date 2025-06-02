<script lang="ts" setup>
import { useRoute } from "vue-router";
import type { BlogPost } from "~/types/content";

const route = useRoute();
const { data: post } = await useAsyncData<BlogPost>(
	`blog-${route.params.id}`,
	async () => {
		// @ts-ignore - queryContent will be available at runtime from Nuxt Content
		return await queryContent<BlogPost>("blog", route.params.id).findOne();
	},
);

useHead({
	title: post.value?.title || "Blog Post",
	meta: [
		{ name: "description", content: post.value?.description || "" },
		{ property: "og:type", content: "article" },
		{ property: "og:title", content: post.value?.title || "" },
		{ property: "og:description", content: post.value?.description || "" },
		{ property: "og:image", content: post.value?.image || "" },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: post.value?.title || "" },
		{ name: "twitter:description", content: post.value?.description || "" },
		{ name: "twitter:image", content: post.value?.image || "" },
	],
});

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const headings = ref<{ id: string; text: string; level: number }[]>([]);

onMounted(() => {
	const article = document.querySelector("article");
	if (article) {
		const elements = Array.from(article.querySelectorAll("h2, h3, h4"));
		headings.value = elements.map((el) => ({
			id: el.id,
			text: el.textContent || "",
			level: Number.parseInt(el.tagName.substring(1), 10),
		}));
	}
});

const scrollToHeading = (id: string) => {
	document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};
</script>

<template>
  <div v-if="post" class="min-h-screen bg-background py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <article class="bg-surface rounded-xl shadow-md overflow-hidden">
        <!-- Featured Image -->
        <div class="relative h-64 md:h-96 overflow-hidden">
          <img
            :src="post.image"
            :alt="post.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div class="absolute bottom-0 left-0 p-6 w-full">
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="inline-block px-3 py-1 text-sm font-medium text-surface bg-brand rounded-full"
              >
                {{ tag }}
              </span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-surface">
              {{ post.title }}
            </h1>
            <div class="mt-4 flex items-center text-surface">
              <img
                :src="post.author.avatar"
                :alt="post.author.name"
                class="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p class="font-medium">{{ post.author.name }}</p>
                <p class="text-sm opacity-80">
                  {{ formatDate(post.date) }} • {{ post.readTime }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Article Content -->
        <div class="p-6 md:p-8 lg:p-12">
          <div class="prose prose-headings:mt-8 prose-headings:mb-4 prose-headings:text-text prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-text prose-p:leading-relaxed prose-p:mb-4 prose-a:text-brand hover:prose-a:underline prose-ul:my-4 prose-ul:pl-6 prose-ol:my-4 prose-ol:pl-6 prose-li:mb-2 prose-li:text-text prose-blockquote:border-l-4 prose-blockquote:border-brand prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-text prose-blockquote:my-6 prose-img:rounded-lg prose-img:my-6 max-w-none">
            <ContentRenderer :value="post">
              <template #empty>
                <p class="text-text">No content found.</p>
              </template>
            </ContentRenderer>
          </div>

          <!-- Author Bio -->
          <div class="mt-12 pt-8 border-t border-border">
            <div class="flex items-center">
              <img
                :src="post.author.avatar"
                :alt="post.author.name"
                class="w-16 h-16 rounded-full"
              />
              <div class="ml-4">
                <h3 class="text-lg font-medium text-text">
                  {{ post.author.name }}
                </h3>
                <p class="text-text">
                  {{ post.author.bio || 'Author bio goes here...' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Table of Contents (Desktop) -->
      <div class="hidden lg:block fixed right-8 top-32 w-64">
        <div class="bg-surface rounded-lg shadow-md p-4">
          <h3 class="font-medium text-text mb-3">Table of Contents</h3>
          <nav class="space-y-2">
            <a
              v-for="heading in headings"
              :key="heading.id"
              :href="`#${heading.id}`"
              class="block text-sm text-text hover:text-brand transition-colors"
              :class="{
                'pl-2': heading.level === 3,
                'pl-4': heading.level === 4,
              }"
              @click.prevent="scrollToHeading(heading.id)"
            >
              {{ heading.text }}
            </a>
          </nav>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-text">Loading post...</p>
  </div>
</template>

<!-- Code highlighting styles will be added via Nuxt Content configuration -->