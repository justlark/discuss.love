<script setup lang="ts">
import ResponseInput from '../components/ResponseInput.vue'
</script>

<template>
  <main>
    <h1>What are you looking for?</h1>
    <div class="form">
      <ResponseInput
        id="friendship"
        title="Friendship"
        description="Companionship, playfulness, shared activities and interests."
      />
      <ResponseInput
        id="sexual"
        title="Sexual"
        description="Playing with genitals, anuses, orgasms, etc."
      />
      <ResponseInput id="domestic" title="Domestic" description="Cohabitating, sharing a home." />
    </div>
  </main>
</template>

<style scoped></style>
