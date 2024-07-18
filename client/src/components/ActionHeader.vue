<script setup lang="ts">
import { NDivider, NFlex } from "naive-ui";
import ResultCard from "@/components/ResultCard.vue";

const props = defineProps<{
  title: string;
  errorText?: string;
}>();
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading">{{ props.title }}</h1>
    <div v-if="!props.errorText">
      <p v-if="$slots.subtitle">
        <i>
          <slot name="subtitle" />
        </i>
      </p>
      <n-flex v-if="$slots.actions">
        <slot name="actions" />
      </n-flex>
    </div>
    <n-divider />
    <result-card
      v-if="props.errorText"
      status="error"
      title="Error"
      :description="props.errorText"
    />
    <slot name="body" v-if="!props.errorText" />
  </main>
</template>

<style scoped></style>
