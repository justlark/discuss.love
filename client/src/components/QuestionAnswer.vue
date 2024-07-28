<script setup lang="ts">
import { type AnswerType, humanizeAnswer } from "@/types";

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
        >: {{ humanizeAnswer(props.questionAnswer) }}
      </span>
    </p>
    <blockquote v-if="props.notes" class="text-justify whitespace-pre-line">
      {{ props.notes }}
    </blockquote>
  </div>
</template>

<style scoped></style>
