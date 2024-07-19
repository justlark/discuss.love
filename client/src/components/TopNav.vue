<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <header class="flex gap-4 mb-10 items-baseline">
    <router-link to="/" class="text-lg font-medium">Discuss.love</router-link>
    <span class="text-muted-color">A tool for negotiating relationships</span>
  </header>
  <div class="flex justify-center">
    <router-view />
  </div>
</template>

<style scoped></style>
