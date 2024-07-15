<script setup lang="ts">
import { NFlex } from "naive-ui";
import NavLink from "@/components/NavLink.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <n-flex justify="space-between">
        <nav-link to="/" size="large">Discuss.love</nav-link>
        <nav-link to="https://github.com/justlark/discuss.love" target="_blank" size="large"
          >GitHub</nav-link
        >
      </n-flex>
    </nav>
  </header>
  <n-flex justify="center">
    <router-view class="body" />
  </n-flex>
</template>

<style scoped>
header {
  margin-bottom: 2rem;
}

.body {
  flex-grow: 1;
}
</style>
