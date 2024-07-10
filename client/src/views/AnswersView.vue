<script setup lang="ts">
import { ref } from "vue";
import rawQuestions from "@/assets/questions.json";
import type { QuestionDefinition } from "@/types";
import QuestionAnswer from "@/components/QuestionAnswer.vue";

const questions = ref<Array<QuestionDefinition>>(rawQuestions);
</script>

<template>
  <div class="answer-list" v-for="question in questions" :key="question.id">
    <QuestionAnswer
      :id="question.id"
      playerName="Lark"
      questionAnswer="yes"
      notes="These are my notes!"
    />
  </div>
</template>

<style scoped></style>
