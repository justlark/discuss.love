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
    <h3>{{ props.playerName }}</h3>
    <p><strong>Answer</strong>: {{ humanReadableAnswer(props.questionAnswer) }}</p>
    <p>{{ props.notes }}</p>
  </div>
</template>

<style scoped></style>
