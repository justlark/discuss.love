<script setup lang="ts">
import { newRandomID } from '@/utils/id'
import NameInput from '../components/NameInput.vue'

const newClientId = () => {
  return newRandomID(8)
}
</script>

<template>
  <main>
    <NameInput :id="newClientId()" label="Your name" />
    <NameInput :id="newClientId()" label="Their name" />
    <button>Start</button>
  </main>
</template>

<style scoped></style>
