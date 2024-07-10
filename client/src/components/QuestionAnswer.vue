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
    <blockquote v-if="props.notes">{{ props.notes }}</blockquote>
  </div>
</template>

<style scoped>
blockquote {
  margin-bottom: 0;
  text-align: justify;
}
</style>
