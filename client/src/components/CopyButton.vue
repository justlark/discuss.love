<script setup lang="ts">
import Button from "primevue/button";
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
  <Button severity="secondary" @click="copyLink" :label="props.text" />
</template>

<style scoped></style>
