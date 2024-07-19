<script setup lang="ts">
import { type AnswerType, humanReadableAnswer } from "@/types";

const props = defineProps<{
  playerName: string;
  questionAnswer: AnswerType;
  notes: string;
}>();
</script>

<template>
  <div>
    <p>
      <span>
        <strong>{{ props.playerName }}</strong
        >: {{ humanReadableAnswer(props.questionAnswer) }}
      </span>
    </p>
    <blockquote v-if="props.notes" class="text-justify">{{ props.notes }}</blockquote>
  </div>
</template>

<style scoped></style>
