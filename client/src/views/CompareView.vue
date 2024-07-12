<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import type { FormAnswers, SessionInfo } from "@/types";
import AnswerComparison from "@/components/AnswerComparison.vue";
import { sessionsEndpoint, submissionsEndpoint } from "@/api";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const sharingCode = ref<string>(route.query.code as string);

const responseStatus = ref<
  | { status: "error"; error: string }
  | { status: "waiting" }
  | { status: "expired" }
  | { status: "success" }
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
      status: "expired",
    };
    return;
  }

  if (sessionResponse.status !== 200) {
    responseStatus.value = {
      status: "error",
      error: sessionResponseBody.error,
    };
    return;
  }

  if (submissionResponse.status === 404) {
    responseStatus.value = {
      status: "waiting",
    };
    return;
  }

  if (submissionResponse.status !== 200) {
    responseStatus.value = {
      status: "error",
      error: submissionResponseBody.error,
    };
    return;
  }

  responseStatus.value = {
    status: "success",
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
    <div v-if="responseStatus?.status == 'success'">
      <AnswerComparison
        :id="pair.id"
        :senderAnswer="pair.sender"
        :recipientAnswer="pair.recipient"
        v-for="pair in answerPairs"
        :key="pair.id"
      />
    </div>
    <div v-else-if="responseStatus?.status == 'waiting'">
      <p>
        The other person hasn't submitted their answers yet. Wait until they're done, and then
        reload this page.
      </p>
    </div>
    <div v-else-if="responseStatus?.status == 'expired'">
      <p>This session has expired; you can no longer see each others' answers.</p>
    </div>
    <div v-else-if="responseStatus?.status == 'error'">
      <p class="error-message">Error: {{ responseStatus.error }}</p>
    </div>
  </div>
</template>

<style scoped></style>
