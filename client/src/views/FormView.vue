<script setup lang="ts">
import { ref } from "vue";
import ResponseInput from "@/components/ResponseInput.vue";
import type { QuestionDefinition } from "@/types";
import rawQuestions from "@/assets/questions.json";
import { useRoute } from "vue-router";
import { API_URL } from "@/api";

const questions = ref<Array<QuestionDefinition>>(rawQuestions);

const route = useRoute();
const sharingCode = ref<string>(route.query.code as string);

const player = ref<string>("recipient");
const storedPlayer = localStorage.getItem("player");
if (storedPlayer) {
  player.value = storedPlayer;
}

const responseInputs = ref<Array<InstanceType<typeof ResponseInput>>>([]);

const submitForm = () => {
  const responses = responseInputs.value.map((element) => ({
    id: element.id,
    answer: element.answer,
    notes: element.notes,
  }));

  fetch(`${API_URL}/submissions/${sharingCode.value}/${player.value}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responses),
  });
};
</script>

<template>
  <main>
    <div v-if="sharingCode">
      <h1>What are you looking for?</h1>
      <div class="form">
        <ResponseInput
          :id="question.id"
          :title="question.title"
          :description="question.description"
          v-for="question in questions"
          :key="question.id"
          ref="responseInputs"
        />
      </div>
      <button @click="submitForm">Submit</button>
    </div>
    <div v-else>
      <p>
        Missing sharing code. If you were sent a link to get here, make sure you copied it
        correctly.
      </p>
    </div>
  </main>
</template>

<style scoped></style>
