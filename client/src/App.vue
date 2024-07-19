<script setup lang="ts">
import { NDialogProvider } from "naive-ui";
import TopNav from "@/components/TopNav.vue";
</script>

<template>
  <n-dialog-provider>
    <TopNav />
  </n-dialog-provider>
</template>

<style scoped></style>
