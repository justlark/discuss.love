<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import type { FormAnswers, SessionInfo } from "@/types";
import AnswerComparison from "@/components/AnswerComparison.vue";
import { sessionsEndpoint, submissionsEndpoint } from "@/api";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const sharingCode = ref<string>(route.query.code as string);

const responseStatus = ref<
  | { state: "error"; error: string }
  | { state: "waiting" }
  | { state: "expired" }
  | { state: "success" }
>();

const sessionInfo = ref<SessionInfo>();
const formAnswers = ref<FormAnswers>();

const answerPairs = computed(() => {
  if (!sessionInfo.value || !formAnswers.value) return [];

  const {
    players: { sender: senderName, recipient: recipientName },
  } = sessionInfo.value;

  return formAnswers.value.map(({ id, sender, recipient }) => {
    if (!sender || !recipient) {
      return { id };
    } else {
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
    }
  });
});

const router = useRouter();

const navigateEditPage = () => {
  router.push(`/join?code=${sharingCode.value}`);
};

onBeforeMount(async () => {
  const [sessionResponse, submissionResponse] = await Promise.all([
    fetch(sessionsEndpoint(sharingCode.value)),
    fetch(submissionsEndpoint(sharingCode.value)),
  ]);

  const [sessionResponseBody, submissionResponseBody] = await Promise.all([
    sessionResponse.json(),
    submissionResponse.json(),
  ]);

  if (sessionResponse.status === 404) {
    responseStatus.value = {
      state: "expired",
    };
    return;
  }

  if (sessionResponse.status !== 200) {
    responseStatus.value = {
      state: "error",
      error: sessionResponseBody.error ?? "Unknown error fetching session data. This may be a bug.",
    };
    return;
  }

  if (submissionResponse.status === 404) {
    responseStatus.value = {
      state: "waiting",
    };
    return;
  }

  if (submissionResponse.status !== 200) {
    responseStatus.value = {
      state: "error",
      error:
        submissionResponseBody.error ?? "Unknown error fetching your answers. This may be a bug.",
    };
    return;
  }

  responseStatus.value = {
    state: "success",
  };

  sessionInfo.value = sessionResponseBody;
  formAnswers.value = submissionResponseBody;
});
</script>

<template>
  <div>
    <h1>Compare answers</h1>
    <button @click="navigateEditPage">Edit Answers</button>
    <hr />
    <div v-if="responseStatus?.state == 'success'">
      <AnswerComparison
        :id="pair.id"
        :senderAnswer="pair.sender"
        :recipientAnswer="pair.recipient"
        v-for="pair in answerPairs"
        :key="pair.id"
      />
    </div>
    <div v-else-if="responseStatus?.state == 'waiting'">
      <p>
        The other person hasn't submitted their answers yet. Wait until they're done, and then
        reload this page.
      </p>
    </div>
    <div v-else-if="responseStatus?.state == 'expired'">
      <p>This session has expired; you can no longer see each others' answers.</p>
    </div>
    <div v-else-if="responseStatus?.state == 'error'">
      <p class="error-message">Error: {{ responseStatus.error }}</p>
    </div>
  </div>
</template>

<style scoped></style>
