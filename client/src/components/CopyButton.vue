<script setup lang="ts">
import { NButton, useMessage } from "naive-ui";

const message = useMessage();

const props = defineProps<{
  text: string;
  link: string;
}>();

const copyLink = () => {
  navigator.clipboard.writeText(props.link);
  message.success("Link copied!");
};
</script>

<template>
  <n-button @click="copyLink">{{ props.text }}</n-button>
</template>

<style scoped></style>
