<script setup lang="ts">
import { type AnswerType, humanReadableAnswer } from "@/types";
import { NBlockquote } from "naive-ui";

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
    <n-blockquote v-if="props.notes" align="justify">{{ props.notes }}</n-blockquote>
  </div>
</template>

<style scoped></style>
