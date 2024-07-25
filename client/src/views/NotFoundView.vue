<script setup lang="ts">
import ActionHeader from "@/components/ActionHeader.vue";

const errorProps = {
  title: "Not Found",
  icon: "question",
  message: "This page doesn't exist. Did you copy a URL wrong?",
} as const;
</script>

<template>
  <ActionHeader title="Not found" :error="errorProps" />
</template>

<style scoped></style>
