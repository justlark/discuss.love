<script setup lang="ts">
import { ref, computed } from "vue";
import type { AttributedAnswer } from "@/types";
import QuestionAnswer from "@/components/QuestionAnswer.vue";
import { questionMap } from "@/questions";
import Divider from "primevue/divider";

const props = defineProps<{
  id: string;
  senderAnswer?: AttributedAnswer;
  recipientAnswer?: AttributedAnswer;
}>();

const questionDef = computed(() => questionMap.get(props.id));

if (questionDef.value === undefined) {
  throw new Error(`Question with id '${props.id}' not found.`);
}

const title = ref(questionDef.value.title);
const description = ref(questionDef.value.description);
</script>

<template>
  <section :aria-labelledby="`answer-section-heading-${props.id}`">
    <h2 :id="`answer-section-heading-${props.id}`">{{ title }}</h2>
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
    <Divider />
  </section>
</template>

<style scoped></style>
