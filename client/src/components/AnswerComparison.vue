<script setup lang="ts">
import { ref, computed } from "vue";
import type { AttributedAnswer } from "@/types";
import QuestionAnswer from "@/components/QuestionAnswer.vue";
import { questionMap } from "@/questions";

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
  <section>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="answer-pair" v-if="!props.senderAnswer || !props.recipientAnswer">
      <i>Someone didn't answer this question.</i>
    </div>
    <!-- If either player answered "No" to a question, the worker will return
      "no" for both players in the API response. This prevents users from
      inspecting the API response to see the actual answers. -->
    <div
      class="answer-pair"
      v-else-if="props.senderAnswer?.answer == 'no' || props.recipientAnswer?.answer == 'no'"
    >
      <i>Someone said "No" to this.</i>
    </div>
    <div class="answer-pair" v-else>
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
  </section>
</template>

<style scoped>
.answer-pair {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.answer-pair > * {
  max-width: 60%;
}

@media (max-width: 768px) {
  .answer-pair {
    flex-direction: column;
    gap: 1.5rem;
  }

  .answer-pair > * {
    max-width: 100%;
  }
}
</style>
