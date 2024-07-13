<script setup lang="ts">
import { NFlex } from "naive-ui";
import NavLink from "@/components/NavLink.vue";
</script>

<template>
  <header>
    <nav>
      <n-flex justify="space-between">
        <nav-link to="/">discuss.love</nav-link>
        <nav-link to="https://github.com/justlark/discuss.love" target="_blank">GitHub</nav-link>
      </n-flex>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped></style>
