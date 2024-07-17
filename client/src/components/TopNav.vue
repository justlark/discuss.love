<script setup lang="ts">
import { NFlex, NText } from "naive-ui";
import NavLink from "@/components/NavLink.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <header>
    <!--
        This is deliberately not marked as a `<nav>` because it's just a single
        link to the homepage. Signaling it as a navigation landmark might be
        misleading unless we add more links up there.
    -->
    <n-flex size="medium">
      <nav-link to="/" size="large">Discuss.love</nav-link>
      <n-text depth="2">A tool for negotiating relationships</n-text>
    </n-flex>
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
