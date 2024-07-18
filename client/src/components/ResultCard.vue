<script setup lang="ts">
import { NCard, NResult, NFlex } from "naive-ui";

const props = defineProps<{
  status: InstanceType<typeof NResult>["status"];
  title: string;
  description: string;
}>();
</script>

<template>
  <n-flex justify="center">
    <n-card class="card">
      <n-result :status="props.status" :title="props.title" :description="props.description" />
    </n-card>
  </n-flex>
</template>

<style scoped>
.card {
  margin-top: 10vh;
  max-width: 35rem;
}
</style>
