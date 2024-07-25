<script setup lang="ts">
import { RouterView } from "vue-router";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
</script>

<template>
  <header class="flex flex-wrap gap-x-4 gap-y-2 mb-10 items-baseline">
    <router-link to="/" class="text-lg font-medium">Discuss.love</router-link>
    <span class="text-muted">A tool for negotiating relationships</span>
  </header>
  <div class="flex justify-center">
    <ConfirmDialog />
    <Toast position="bottom-center" />
    <router-view class="grow flex flex-col items-center" />
  </div>
</template>

<style scoped></style>
