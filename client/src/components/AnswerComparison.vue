<script setup lang="ts">
import { ref, computed } from "vue";
import type { AttributedAnswer } from "@/types";
import QuestionAnswer from "@/components/QuestionAnswer.vue";
import { questionMap } from "@/questions";
import { NDivider } from "naive-ui";

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
    <div class="answer" v-if="!props.senderAnswer || !props.recipientAnswer">
      <i>Someone didn't answer this question.</i>
    </div>
    <!--
      If either player answered "No" to a question, the worker will return
      "no" for both players in the API response. This prevents users from
      inspecting the API response to see the actual answers.
    -->
    <div
      class="answer"
      v-else-if="props.senderAnswer?.answer === 'no' || props.recipientAnswer?.answer === 'no'"
    >
      <i>Someone said "No" to this.</i>
    </div>
    <div class="answer answer-pair" v-else>
      <question-answer
        :player-name="props.senderAnswer.playerName"
        :question-answer="props.senderAnswer.answer"
        :notes="props.senderAnswer.notes"
      />
      <question-answer
        :player-name="props.recipientAnswer.playerName"
        :question-answer="props.recipientAnswer.answer"
        :notes="props.recipientAnswer.notes"
      />
    </div>
    <n-divider />
  </section>
</template>

<style scoped>
.answer {
  margin-left: 2rem;
}

.answer-pair {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
}

.answer-pair > * {
  flex: 1 0;
}

@media (max-width: 768px) {
  .answer {
    margin-left: 0;
  }

  .answer-pair {
    flex-direction: column;
    gap: 0;
  }
}
</style>
