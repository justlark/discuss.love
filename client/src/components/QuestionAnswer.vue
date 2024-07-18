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
  <p>
    <span>
      <strong>{{ props.playerName }}</strong
      >: {{ humanReadableAnswer(props.questionAnswer) }}
    </span>
    <n-blockquote v-if="props.notes" align="justify">{{ props.notes }}</n-blockquote>
  </p>
</template>

<style scoped></style>
