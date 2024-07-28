<script setup lang="ts">
import Textarea from "primevue/textarea";

const model = defineModel<string>();

const props = defineProps<{
  id: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  textareaProps?: Record<string, string>;
}>();

const emit = defineEmits(["update"]);
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="props.id" class="flex gap-2">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="text-bad">*</span>
    </label>
    <Textarea
      :id="props.id"
      v-model="model"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :required="props.required"
      v-bind="props.textareaProps"
      @update:model-value="emit('update')"
    />
  </div>
</template>

<style scoped></style>
