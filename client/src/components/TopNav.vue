<script setup lang="ts">
import { NFlex } from "naive-ui";
import NavLink from "@/components/NavLink.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <n-flex justify="space-between">
        <nav-link to="/">Discuss.love</nav-link>
        <nav-link to="https://github.com/justlark/discuss.love" target="_blank">GitHub</nav-link>
      </n-flex>
    </nav>
  </header>
  <n-flex justify="center">
    <router-view />
  </n-flex>
</template>

<style scoped>
header {
  margin-bottom: 2rem;
}
</style>
