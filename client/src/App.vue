<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/" class="site-title">discuss.love</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.site-title {
  font-size: 16pt;
  font-weight: bold;
}
</style>
