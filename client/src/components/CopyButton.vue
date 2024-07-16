<script setup lang="ts">
import { ref } from "vue";
import { NButton, NText, NFlex } from "naive-ui";

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
  }, 1500);
};
</script>

<template>
  <n-flex size="medium" align="baseline">
    <n-button @click="copyLink">{{ props.text }}</n-button>
    <n-text depth="2" v-if="isCopied">Copied!</n-text>
  </n-flex>
</template>

<style scoped></style>
