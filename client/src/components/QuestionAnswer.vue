<script setup lang="ts">
import { type AnswerType, humanReadableAnswer } from "@/types";

const props = defineProps<{
  playerName: string;
  questionAnswer: AnswerType;
  notes: string;
}>();
</script>

<template>
  <p>
    <span>
      <strong>{{ props.playerName }}</strong>: {{ humanReadableAnswer(props.questionAnswer) }}
    </span>
    <blockquote v-if="props.notes" align="justify">{{ props.notes }}</blockquote>
  </p>
</template>

<style scoped></style>
