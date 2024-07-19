<script setup lang="ts">
import RadioButton from "primevue/radiobutton";

const model = defineModel();
const props = defineProps<{ id: string; label: string; value: string }>();
</script>

<template>
  <div class="flex items-center gap-4">
    <RadioButton :id="props.id" v-model="model" :value="value" />
    <label :for="props.id">{{ props.label }}</label>
  </div>
</template>

<style scoped></style>
