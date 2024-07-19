<script setup lang="ts">
import { RouterView } from "vue-router";
import Toast from "primevue/toast";
</script>

<template>
  <header class="flex flex-wrap gap-x-4 gap-y-2 mb-10 items-baseline">
    <router-link to="/" class="text-lg font-medium">Discuss.love</router-link>
    <span class="text-muted-color">A tool for negotiating relationships</span>
  </header>
  <div class="flex justify-center">
    <Toast position="bottom-center" />
    <router-view />
  </div>
</template>

<style scoped></style>
