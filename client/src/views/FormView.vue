<script setup lang="ts">
import { ref } from "vue";
import ResponseInput from "@/components/ResponseInput.vue";
import type { QuestionDefinition } from "@/types";
import rawQuestions from "@/assets/questions.json";

const questions = ref<Array<QuestionDefinition>>(rawQuestions);
</script>

<template>
  <main>
    <h1>What are you looking for?</h1>
    <div class="form" v-for="question in questions" :key="question.id">
      <ResponseInput
        :id="question.id"
        :title="question.title"
        :description="question.description"
      />
    </div>
  </main>
</template>

<style scoped></style>
