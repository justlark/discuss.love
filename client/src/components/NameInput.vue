<script setup lang="ts">
import { NInput, NFormItem } from "naive-ui";

const model = defineModel<string>();

const props = defineProps<{
  id: string;
  label: string;
  path: string;
}>();
</script>

<template>
  <!--
    Naive UI doesn't do accessibility properly with form inputs:
    https://github.com/tusen-ai/naive-ui/issues/4598
  -->
  <n-form-item
    :label="props.label"
    :path="path"
    class="name-input"
    :label-props="{ for: `name-input-${props.id}` }"
  >
    <n-input
      :id="`name-input-${props.id}`"
      type="text"
      placeholder=""
      v-model:value="model"
      :input-props="{ id: `name-input-${props.id}` }"
    />
  </n-form-item>
</template>

<style scoped>
.name-input {
  display: flex;
  flex-direction: column;
}
</style>
