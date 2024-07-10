<script setup lang="ts">
import { humanReadableAnswer, type AnswerType } from "@/types";

const answer = defineModel<AnswerType>("answer");
const notes = defineModel("notes");

const props = defineProps<{
  id: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <div>
    <h2>{{ props.title }}</h2>
    <p>{{ props.description }}</p>
    <fieldset class="response-scale">
      <div class="scale-input">
        <input type="radio" :id="`response-yes-${props.id}`" v-model="answer" value="yes" />
        <label :for="`response-yes-${props.id}`">{{ humanReadableAnswer("yes") }}</label>
      </div>

      <div class="scale-input">
        <input type="radio" :id="`response-no-${props.id}`" v-model="answer" value="no" />
        <label :for="`response-no-${props.id}`">{{ humanReadableAnswer("no") }}</label>
      </div>

      <div class="scale-input">
        <input type="radio" :id="`response-later-${props.id}`" v-model="answer" value="later" />
        <label :for="`response-later-${props.id}`">{{ humanReadableAnswer("later") }}</label>
      </div>
    </fieldset>
    <p>Give some more detail</p>
    <textarea v-model="notes" />
  </div>
</template>

<style scoped>
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
