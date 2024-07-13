<script setup lang="ts">
import { NInput, NFormItem } from "naive-ui";

const model = defineModel<string>();

const props = defineProps<{
  label: string;
  path: string;
}>();
</script>

<template>
  <n-form-item :label="props.label" :path="path" class="name-input">
    <n-input type="text" placeholder="" v-model:value="model" />
  </n-form-item>
</template>

<style scoped>
.name-input {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
}
</style>
