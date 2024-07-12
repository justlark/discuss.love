<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  text: string;
  link: string;
}>();

const isCopied = ref(false);

const copyLink = () => {
  navigator.clipboard.writeText(props.link);

  isCopied.value = true;

  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};
</script>

<template>
  <span class="copy-button">
    <button @click="copyLink">{{ props.text }}</button>
    <span class="copy-confirmation" v-if="isCopied">Copied!</span>
  </span>
</template>

<style scoped>
.copy-button {
  display: flex;
  gap: 1rem;
  align-items: baseline;
}

.copy-confirmation {
  font-size: 13pt;
  filter: brightness(80%);
}
</style>
