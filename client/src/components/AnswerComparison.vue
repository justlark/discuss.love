<script setup lang="ts">
import { ref, computed } from "vue";
import type { AttributedAnswer, QuestionDefinition } from "@/types";
import QuestionAnswer from "@/components/QuestionAnswer.vue";
import { getQuestionMap } from "@/questions";

const props = defineProps<{
  id: string;
  questions: Array<QuestionDefinition>;
  senderAnswer?: AttributedAnswer;
  recipientAnswer?: AttributedAnswer;
}>();

const questionDef = computed(() => getQuestionMap(props.questions).get(props.id));

if (questionDef.value === undefined) {
  throw new Error(`Question with id '${props.id}' not found.`);
}

const title = ref(questionDef.value.title);
const description = ref(questionDef.value.description);

const answerStatus = computed(() => {
  if (
    !props.senderAnswer ||
    !props.recipientAnswer ||
    (props.senderAnswer.answer === "unsure" && props.recipientAnswer.answer === "unsure")
  ) {
    return "unsure";
  }

  if (props.senderAnswer.answer === "no" || props.recipientAnswer.answer === "no") {
    return "no";
  }

  if (
    (props.senderAnswer.answer === "yes" &&
      props.recipientAnswer.answer !== "yes" &&
      props.recipientAnswer.answer !== "open") ||
    (props.recipientAnswer.answer === "yes" &&
      props.senderAnswer.answer !== "yes" &&
      props.senderAnswer.answer !== "open")
  ) {
    return "disagreement";
  }

  return "agreement";
});
</script>

<template>
  <section :aria-labelledby="`answer-section-heading-${props.id}`" class="ml-20">
    <div class="flex items-baseline gap-2">
      <i
        v-if="answerStatus === 'unsure'"
        class="pi pi-question-circle response-icon icon-muted"
        aria-hidden
      ></i>
      <i
        v-else-if="answerStatus === 'no'"
        class="pi pi-minus-circle response-icon icon-bad"
        aria-hidden
      ></i>
      <i
        v-else-if="answerStatus === 'agreement'"
        class="pi pi-check-circle response-icon icon-good"
        aria-hidden
      ></i>
      <i
        v-else-if="answerStatus === 'disagreement'"
        class="pi pi-exclamation-circle response-icon icon-warn"
        aria-hidden
      ></i>
      <h2 :id="`answer-section-heading-${props.id}`">{{ title }}</h2>
    </div>
    <p>{{ description }}</p>
    <div class="sm:ml-8" v-if="!props.senderAnswer || !props.recipientAnswer">
      <i>Someone didn't answer this question.</i>
    </div>
    <!--
      If either player answered "No" to a question, the worker will return
      "no" for both players in the API response. This prevents users from
      inspecting the API response to see the actual answers.
    -->
    <div
      class="sm:ml-8"
      v-else-if="props.senderAnswer?.answer === 'no' || props.recipientAnswer?.answer === 'no'"
    >
      <i>Someone said "No" to this.</i>
    </div>
    <div class="flex flex-col sm:flex-row justify-around gap-x-8 gap-y-4 sm:ml-8" v-else>
      <QuestionAnswer
        class="grow basis-0"
        :player-name="props.senderAnswer.playerName"
        :question-answer="props.senderAnswer.answer"
        :notes="props.senderAnswer.notes"
      />
      <QuestionAnswer
        class="grow basis-0"
        :player-name="props.recipientAnswer.playerName"
        :question-answer="props.recipientAnswer.answer"
        :notes="props.recipientAnswer.notes"
      />
    </div>
  </section>
</template>

<style scoped>
.response-icon {
  @apply text-xl;
}
</style>
