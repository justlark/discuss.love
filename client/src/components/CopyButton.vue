<script setup lang="ts">
import { NButton } from "naive-ui";
import { useMessage } from "@/message";

const message = useMessage();

const props = defineProps<{
  text: string;
  link: string;
}>();

const copyLink = () => {
  navigator.clipboard.writeText(props.link);
  message.info("Link copied!");
};
</script>

<template>
  <n-button @click="copyLink">{{ props.text }}</n-button>
</template>

<style scoped></style>
