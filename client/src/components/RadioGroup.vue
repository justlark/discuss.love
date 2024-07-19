<script setup lang="ts">
const props = defineProps<{ label: string }>();
</script>

<template>
  <fieldset>
    <div class="flex flex-col gap-2">
      <legend>{{ props.label }}</legend>
      <div class="flex flex-col gap-2">
        <slot />
      </div>
    </div>
  </fieldset>
</template>

<style scoped></style>
