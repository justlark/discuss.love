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
    <p>
      <strong>{{ props.playerName }}</strong
      >: {{ humanReadableAnswer(props.questionAnswer) }}
    </p>
    <p>{{ props.notes }}</p>
  </div>
</template>

<style scoped></style>
