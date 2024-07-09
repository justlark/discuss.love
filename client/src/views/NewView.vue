<script setup lang="ts">
import NameInput from "../components/NameInput.vue";
</script>

<template>
  <main>
    <h1>Start a new discussion</h1>
    <NameInput id="sender" label="Your name" />
    <NameInput id="recipient" label="Their name" />
    <button>Start</button>
  </main>
</template>

<style scoped></style>
