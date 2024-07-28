<script setup lang="ts">
import { type AnswerType } from "@/types";
import { computed } from "vue";

const props = defineProps<{
  playerName: string;
  questionAnswer: AnswerType;
  notes: string;
}>();

const humanReadableAnswer = computed(() => {
  switch (props.questionAnswer) {
    case "yes":
      return "Yes";
    case "no":
      return "No";
    case "open":
      return "Open to it";
    case "later":
      return "Not right now";
    case "unsure":
      return "Undecided";
    default:
      throw new Error(`Invalid answer: ${props.questionAnswer}`);
  }
});
</script>

<template>
  <div>
    <p>
      <span>
        <strong>{{ props.playerName }}</strong
        >: {{ humanReadableAnswer }}
      </span>
    </p>
    <blockquote v-if="props.notes" class="text-justify whitespace-pre-line">
      {{ props.notes }}
    </blockquote>
  </div>
</template>

<style scoped></style>
