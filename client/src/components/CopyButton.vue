<script setup lang="ts">
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const props = defineProps<{
  text: string;
  link: string;
}>();

const copyLink = () => {
  navigator.clipboard.writeText(props.link);
  toast.add({ severity: "info", summary: "Link copied!", life: 1500 });
};
</script>

<template>
  <Button severity="secondary" @click="copyLink" :label="props.text" />
</template>

<style scoped></style>
