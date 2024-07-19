<script setup lang="ts">
import Divider from "primevue/divider";
import Card from "primevue/card";

const props = defineProps<{
  title: string;
  errorText?: string;
}>();
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading">{{ props.title }}</h1>
    <div v-if="!props.errorText && ($slots.subtitle || $slots.actions)">
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
    <Card
      v-if="props.errorText"
      class="self-stretch sm:self-center max-w-[40rem] sm:min-w-[24rem] sm:mx-8 mt-8"
    >
      <template #header>
        <div class="flex justify-center">
          <i class="pi pi-exclamation-circle color-danger mt-8 error-icon"></i>
        </div>
      </template>
      <template #title>Error</template>
      <template #content>{{ props.errorText }}</template>
    </Card>
    <slot name="body" v-if="!props.errorText" />
  </main>
</template>

<style scoped>
.error-icon {
  @apply text-8xl;
}
</style>
