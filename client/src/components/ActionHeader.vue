<script setup lang="ts">
import Divider from "primevue/divider";
import Card from "primevue/card";

export interface ErrorProps {
  title: string;
  icon: "error" | "question";
  message: string;
}

const props = defineProps<{
  title: string;
  error?: ErrorProps;
}>();
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading">{{ props.title }}</h1>
    <div v-if="!props.error && ($slots.subtitle || $slots.actions)">
      <p v-if="$slots.subtitle">
        <i>
          <slot name="subtitle" />
        </i>
      </p>
      <div class="flex flex-wrap justify-center gap-4 my-4" v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>
    <Divider />
    <Card v-if="props.error !== undefined" class="self-center w-[90vw] sm:w-[28rem] mt-8">
      <template #header>
        <div class="flex justify-center">
          <i
            v-if="props.error.icon === 'error'"
            class="pi pi-exclamation-circle icon-bad error-icon"
          ></i>
          <i
            v-else-if="props.error.icon === 'question'"
            class="pi pi-question-circle icon-info error-icon"
          ></i>
        </div>
      </template>
      <template #title>{{ props.error.title }}</template>
      <template #content>{{ props.error.message }}</template>
    </Card>
    <slot name="body" v-if="!props.error" />
  </main>
</template>

<style scoped>
.error-icon {
  @apply mt-8 text-8xl;
}
</style>
