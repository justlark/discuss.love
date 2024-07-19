<script setup lang="ts">
import Button from "primevue/button";
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading" class="text-center">Negotiate your relationships</h1>
    <div class="flex justify-center">
      <Button as="router-link" to="/start" class="my-8" label="Start a Discussion" />
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
    <p class="text-center my-4">
      <a href="https://github.com/justlark/discuss.love" target="_blank">GitHub</a>
    </p>
  </main>
</template>

<style scoped></style>
