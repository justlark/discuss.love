<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import type { FormAnswers, SessionInfo } from "@/types";
import AnswerComparison from "@/components/AnswerComparison.vue";
import { API_URL } from "@/api";

const sharingCode = ref(localStorage.getItem("code"));

const sessionInfo = ref<SessionInfo>();
const formAnswers = ref<FormAnswers>();

const answerPairs = computed(() => {
  if (!sessionInfo.value || !formAnswers.value) return [];

  const {
    players: { sender: senderName, recipient: recipientName },
  } = sessionInfo.value;

  return formAnswers.value.map(({ id, sender, recipient }) => {
    return {
      id,
      sender: {
        playerName: senderName,
        answer: sender.answer,
        notes: sender.notes,
      },
      recipient: {
        playerName: recipientName,
        answer: recipient.answer,
        notes: recipient.notes,
      },
    };
  });
});

onBeforeMount(async () => {
  const [sessionResponse, submissionResponse] = await Promise.all([
    fetch(`${API_URL}/sessions/${sharingCode.value}`),
    fetch(`${API_URL}/submissions/${sharingCode.value}`),
  ]);

  const [sessionResponseBody, submissionResponseBody] = await Promise.all([
    sessionResponse.json(),
    submissionResponse.json(),
  ]);

  sessionInfo.value = sessionResponseBody;
  formAnswers.value = submissionResponseBody;
});
</script>

<template>
  <div>
    <h1>Compare answers</h1>
    <AnswerComparison
      :id="pair.id"
      :senderAnswer="pair.sender"
      :recipientAnswer="pair.recipient"
      v-for="pair in answerPairs"
      :key="pair.id"
    />
  </div>
</template>

<style scoped></style>
