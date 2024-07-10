<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main>
    <h1 class="site-title">The Relationship Smorgasbord</h1>
    <RouterLink to="/start" class="start-button">Start the discussion!</RouterLink>
    <p class="warning">🚧 This site is under construction 🚧</p>
    <p>
      The relationship smorgasbord is a tool for negotiating relationships. Each of you will pick
      and choose what you want out of your relationship, and once you're both done, you can compare
      answers to make sure you're on the same page.
    </p>
    <p>
      You'll only see the answers that you agree on. If one of you selects "No" to a particular
      question, you won't see how the other person responded.
    </p>
    <p>
      The relationship smorgasbord isn't just for romantic relationships! Use it with your friends,
      your platonic partners, your play partners, or anyone else you want to build a healthier
      relationship with.
    </p>
  </main>
</template>

<style scoped>
.warning {
  display: block;
  text-align: center;
}

.site-title {
  display: block;
  text-align: center;
}

.start-button {
  display: block;
  text-align: center;
  font-size: 16pt;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

p {
  text-align: justify;
}
</style>
