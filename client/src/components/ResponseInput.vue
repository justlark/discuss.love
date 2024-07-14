<script setup lang="ts">
import { humanReadableAnswer, type AnswerType } from "@/types";
import { NForm, NRadioGroup, NRadio, NInput, NFormItem, NFlex } from "naive-ui";
import { ref } from "vue";
import seedrandom from "seedrandom";

const yesPrompts = [
  "I want this becase…",
  "I want this, except…",
  "I want this, but also…",
  "To me, this means…",
  "I'm specifically looking for…",
  "This is important to me becase…",
];

const laterPrompts = [
  "I might be okay with this if…",
  "I'll be ready for this when…",
  "I don't want this right now, but…",
  "Before we do this, we need to…",
  "For this to change, I need…",
];

const props = defineProps<{
  id: string;
  sharingCode: string;
  title: string;
  description: string;
  initialAnswer?: AnswerType;
  initialNotes?: string;
}>();

const response = ref<{ answer?: AnswerType; notes: string }>({
  answer: props.initialAnswer,
  notes: props.initialNotes ?? "",
});

// TODO: This is too random. We should be shuffling a deck of questions and then
// cycling through them.
const getRandomPrompt = (answer: AnswerType | undefined) => {
  if (!answer || answer === "no") {
    return "";
  }

  const rng = seedrandom(`${props.sharingCode}.${props.id}`);
  const prompts = answer === "yes" ? yesPrompts : laterPrompts;

  return prompts[Math.floor(rng() * prompts.length)];
};

defineExpose({
  id: props.id,
  response,
});

const emit = defineEmits(["input"]);
</script>

<template>
  <h2>{{ props.title }}</h2>
  <n-form :model="response">
    <n-form-item :label="props.description" path="answer">
      <n-radio-group v-model:value="response.answer" @update:value="emit('input')">
        <n-flex vertical>
          <n-radio value="yes">
            {{ humanReadableAnswer("yes") }}
          </n-radio>
          <n-radio value="no">
            {{ humanReadableAnswer("no") }}
          </n-radio>
          <n-radio value="later">
            {{ humanReadableAnswer("later") }}
          </n-radio>
        </n-flex>
      </n-radio-group>
    </n-form-item>
    <!--
      Naive UI doesn't do accessibility properly with form inputs:
      https://github.com/tusen-ai/naive-ui/issues/4598
    -->
    <n-form-item
      label="Give some more detail"
      path="notes"
      :label-props="{ for: `notes-input-${props.id}` }"
    >
      <n-input
        type="textarea"
        v-model:value="response.notes"
        :placeholder="getRandomPrompt(response.answer)"
        @input="emit('input')"
        :input-props="{ id: `notes-input-${props.id}` }"
      />
    </n-form-item>
  </n-form>
</template>

<style scoped></style>
