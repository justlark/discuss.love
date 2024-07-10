<script setup lang="ts">
import { ref, computed } from "vue";
import rawQuestions from "../assets/questions.json";
import { type AnswerType, type QuestionDefinition, humanReadableAnswer } from "@/types";

const props = defineProps<{
  id: string;
  playerName: string;
  questionAnswer: AnswerType;
  notes: string;
}>();

const questions: Array<QuestionDefinition> = rawQuestions;

const questionMap = computed(
  () => new Map(questions.map((q) => [q.id, { title: q.title, description: q.description }])),
);

const questionDef = computed(() => questionMap.value.get(props.id));

if (questionDef.value === undefined) {
  throw new Error(`Question with id '${props.id}' not found.`);
}

const title = ref(questionDef.value.title);
const description = ref(questionDef.value.description);
</script>

<template>
  <div class="question-answer">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <p><strong>Answer</strong>: {{ humanReadableAnswer(questionAnswer) }}</p>
    <p>{{ props.notes }}</p>
  </div>
</template>

<style scoped>
.name-input {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
}
</style>
