<script setup lang="ts">
import NameInput from "../components/NameInput.vue";
</script>

<template>
  <main>
    <h1>Start a new discussion</h1>
    <NameInput id="me" label="Your name" />
    <NameInput id="you" label="Their name" />
    <button>Start</button>
  </main>
</template>

<style scoped></style>
