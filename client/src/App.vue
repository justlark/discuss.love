<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="top-nav">
        <div class="pages">
          <RouterLink to="/" class="nav-link">discuss.love</RouterLink>
        </div>
        <a href="https://github.com/justlark/discuss.love" class="nav-link" target="_blank"
          >GitHub</a
        >
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.top-nav {
  display: flex;
  justify-content: space-between;
}

.pages {
  display: flex;
  gap: 1rem;
}
</style>
