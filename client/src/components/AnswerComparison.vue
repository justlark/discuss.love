<script setup lang="ts">
import { ref, computed } from "vue";
import rawQuestions from "../assets/questions.json";
import type { QuestionDefinition, AttributedAnswer } from "@/types";
import QuestionAnswer from "@/components/QuestionAnswer.vue";

const props = defineProps<{
  id: string;
  senderAnswer: AttributedAnswer;
  recipientAnswer: AttributedAnswer;
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
  <div>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="answer-pair">
      <QuestionAnswer
        :playerName="props.senderAnswer.playerName"
        :questionAnswer="props.senderAnswer.answer"
        :notes="props.senderAnswer.notes"
      />
      <QuestionAnswer
        :playerName="props.recipientAnswer.playerName"
        :questionAnswer="props.recipientAnswer.answer"
        :notes="props.recipientAnswer.notes"
      />
    </div>
    <hr />
  </div>
</template>

<style scoped>
.answer-pair {
  display: flex;
  justify-content: space-around;
}
</style>
