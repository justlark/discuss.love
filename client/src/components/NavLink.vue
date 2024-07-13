<script setup lang="ts">
import { NEl, NA } from "naive-ui";
import { computed } from "vue";

const props = defineProps<{ to: string; target?: string }>();

const isExternalLink = computed(() => props.to.startsWith("https://"));
</script>

<template>
  <n-el class="nav-link">
    <n-a v-if="isExternalLink" :href="props.to" :target="props.target">
      <slot />
    </n-a>
    <router-link v-else v-slot="{ href, navigate }" :to="props.to">
      <n-a :href="href" @click="navigate">
        <slot />
      </n-a>
    </router-link>
  </n-el>
</template>

<style scoped>
.nav-link {
  font-size: var(--font-size-large);
  font-weight: 600;
}
</style>
