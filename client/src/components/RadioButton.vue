<script setup lang="ts">
import RadioButton from "primevue/radiobutton";

const model = defineModel<string>();
const props = defineProps<{
  id: string;
  value: string;
  inputProps?: Record<string, string | boolean>;
}>();
const emit = defineEmits(["update"]);
</script>

<template>
  <div class="flex items-center gap-4">
    <RadioButton
      :inputId="props.id"
      v-model="model"
      :value="props.value"
      @update:model-value="emit('update')"
      :pt:input="props.inputProps"
    />
    <label :for="props.id"><slot /></label>
  </div>
</template>

<style scoped></style>
