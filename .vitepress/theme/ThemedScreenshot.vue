<!-- Select the displayed capture and full-size link with the docs theme before hydration. -->
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  light: string;
  dark: string;
  alt: string;
  width: number;
  height: number;
  imageClass?: string;
  linkClass?: string;
}>();
const themes = ["light", "dark"] as const;
const captures = computed(() => themes.map((theme) => ({ theme, src: props[theme] })));
</script>

<template>
  <a
    v-for="capture in captures"
    :key="capture.src"
    class="docs-screenshot-link"
    :class="linkClass"
    :data-screenshot-theme="capture.theme"
    :href="capture.src"
    target="_blank"
    rel="noopener"
  >
    <img :class="imageClass" :src="capture.src" :width="width" :height="height" :alt="alt" loading="lazy" />
  </a>
</template>
