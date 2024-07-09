<script setup lang="ts">
import { computed } from 'vue'

const model = defineModel()

const props = defineProps<{
  id: string
  label: string
}>()

const inputId = computed(() => `name-input-${props.id}`)
</script>

<template>
  <div class="name-input">
    <label :for="inputId">{{ props.label }}</label>
    <input v-model="model" />
  </div>
</template>

<style scoped>
.name-input {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
}
</style>
