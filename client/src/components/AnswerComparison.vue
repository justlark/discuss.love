<script setup lang="ts">
import { ref, computed } from "vue";
import type { AttributedAnswer } from "@/types";
import QuestionAnswer from "@/components/QuestionAnswer.vue";
import { questionMap } from "@/questions";

const props = defineProps<{
  id: string;
  senderAnswer: AttributedAnswer;
  recipientAnswer: AttributedAnswer;
}>();

const questionDef = computed(() => questionMap.get(props.id));

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
