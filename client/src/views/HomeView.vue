<script setup lang="ts">
import Button from "primevue/button";
import { RouterLink } from "vue-router";
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading" class="text-center">Negotiate your relationships</h1>
    <div class="flex justify-center">
      <Button as="router-link" to="/choose" class="my-8" label="Start a Discussion" />
    </div>
    <div class="text-justify max-w-3xl">
      <p>
        This is a tool for negotiating relationships. Each of you will pick and choose what you want
        out of your relationship from a menu of options, and once you're both done, you can compare
        answers to see if you're on the same page or not.
      </p>
      <p>
        This tool isn't just for romantic relationships! Use it with your friends, platonic
        partners, play partners, or anyone else you want to build a healthier relationship with.
      </p>
      <p>
        You'll often see this exercise referred to as the "relationship smorgasbord," referring to
        the way you can pick and choose what you want from a buffet of options. The concept is often
        associated with relationship anarchy.
      </p>
    </div>
    <p class="flex gap-2 text-center mt-4">
      <RouterLink to="/contact">Contact</RouterLink>
      <span>•</span>
      <a href="https://github.com/justlark/discuss.love" target="_blank">GitHub</a>
    </p>
  </main>
</template>

<style scoped></style>
