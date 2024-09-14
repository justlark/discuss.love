<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading" class="text-center mb-8">Tip Jar</h1>
    <div class="text-justify max-w-3xl">
      <p>
        Discuss.love is free to use, forever. This site will
        <strong>never</strong> run ads or sponsored content.
      </p>
      <p>
        That being said, if you found this tool useful and would like to show your appreciation, you
        can <RouterLink to="/contact">shoot me an email</RouterLink> and let me know, or you can
        <a href="https://example.com" target="_blank">send me a tip</a>.
      </p>
      <p>
        Tips are absolutely not necessary to use this site, and I do not depend on them to pay for
        hosting or living expenses.
      </p>
    </div>
  </main>
</template>

<style scoped></style>
