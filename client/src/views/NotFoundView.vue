<script setup lang="ts">
import ErrorCard from "@/components/ErrorCard.vue";
</script>

<template>
  <main>
    <error-card
      status="404"
      title="Not Found"
      description="This page doesn't exist. Did you copy a URL wrong?"
    />
  </main>
</template>

<style scoped></style>
