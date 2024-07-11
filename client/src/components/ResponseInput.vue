<script setup lang="ts">
import { humanReadableAnswer, type AnswerType } from "@/types";
import { ref, defineEmits } from "vue";

const props = defineProps<{
  id: string;
  title: string;
  description: string;
  initialAnswer?: AnswerType;
  initialNotes?: string;
}>();

const answer = ref<AnswerType>(props.initialAnswer ?? "no");
const notes = ref<string>(props.initialNotes ?? "");

defineExpose({
  id: props.id,
  answer,
  notes,
});

const emit = defineEmits(["input"]);

const onAnswerInput = (event: Event) => {
  // This should be unnecessary, but exists to work around an issue I was having
  // where the value being persisted in the browser local storage was being set
  // to the *previous* value of the radio fieldset instead of the current one.
  const inputElement = event.target as HTMLInputElement;
  answer.value = inputElement.value as AnswerType;

  emit("input");
};

const onNotesInput = () => emit("input");
</script>

<template>
  <section>
    <h2>{{ props.title }}</h2>
    <p>{{ props.description }}</p>
    <fieldset class="response-scale">
      <div class="scale-input">
        <input
          type="radio"
          :id="`response-yes-${props.id}`"
          v-model="answer"
          value="yes"
          @input="onAnswerInput"
        />
        <label :for="`response-yes-${props.id}`">{{ humanReadableAnswer("yes") }}</label>
      </div>

      <div class="scale-input">
        <input
          type="radio"
          :id="`response-no-${props.id}`"
          v-model="answer"
          value="no"
          @input="onAnswerInput"
        />
        <label :for="`response-no-${props.id}`">{{ humanReadableAnswer("no") }}</label>
      </div>

      <div class="scale-input">
        <input
          type="radio"
          :id="`response-later-${props.id}`"
          v-model="answer"
          value="later"
          @input="onAnswerInput"
        />
        <label :for="`response-later-${props.id}`">{{ humanReadableAnswer("later") }}</label>
      </div>
    </fieldset>
    <p :id="`notes-label-${props.id}`">Give some more detail</p>
    <textarea v-model="notes" @input="onNotesInput" :aria-describedby="`notes-label-${props.id}`" />
  </section>
</template>

<style scoped>
section {
  padding: 0;
}

.response-scale {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem;
}

.scale-input {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
}

.scale-input > * {
  margin: 0;
}
</style>
