<script setup lang="ts">
const props = defineProps<{ formId: string; label: string }>();
</script>

<template>
  <div>
    <fieldset :form="props.formId">
      <legend class="mb-2">{{ props.label }}</legend>
      <div class="flex flex-col gap-2">
        <slot />
      </div>
    </fieldset>
  </div>
</template>

<style scoped></style>
