<script setup lang="ts">
import { NDialogProvider, NMessageProvider } from "naive-ui";
import TopNav from "@/components/TopNav.vue";
</script>

<template>
  <n-dialog-provider>
    <n-message-provider keep-alive-on-hover placement="bottom">
      <TopNav />
    </n-message-provider>
  </n-dialog-provider>
</template>

<style scoped></style>
