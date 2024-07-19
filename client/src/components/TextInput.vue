<script setup lang="ts">
import InputText from "primevue/inputtext";

const model = defineModel<string>();

const props = defineProps<{
  id: string;
  label: string;
  required?: boolean;
  errorMessage?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="props.id" class="flex gap-2">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="danger-text">*</span>
    </label>
    <InputText
      :id="props.id"
      class="w-72"
      type="text"
      v-model="model"
      :required="props.required"
      :aria-describedby="`${props.id}-validation-message`"
    />
    <small v-if="props.errorMessage" :id="`${props.id}-validation-message`" class="danger-text">
      {{ props.errorMessage }}
    </small>
  </div>
</template>

<style scoped>
.danger-text {
  @apply text-red-500 dark:text-red-300;
}
</style>
