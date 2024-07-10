<script setup lang="ts">
import { type AnswerType, humanReadableAnswer } from "@/types";

const props = defineProps<{
  playerName: string;
  questionAnswer: AnswerType;
  notes: string;
}>();
</script>

<template>
  <div class="question-answer">
    <strong>{{ props.playerName }}</strong
    >: {{ humanReadableAnswer(props.questionAnswer) }}
    <p v-if="props.notes">{{ props.notes }}</p>
  </div>
</template>

<style scoped></style>
