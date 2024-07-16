<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import type { FormAnswers, SessionInfo, ResponseStatus } from "@/types";
import AnswerComparison from "@/components/AnswerComparison.vue";
import { sessionsEndpoint, submissionsEndpoint } from "@/api";
import { useRoute, useRouter } from "vue-router";
import { NButton, NDivider } from "naive-ui";
import ErrorCard from "@/components/ErrorCard.vue";

const route = useRoute();

const sharingCode = ref<string>(route.query.code as string);

const status = ref<ResponseStatus<["loading" | "waiting" | "expired" | "success"]>>({
  status: "loading",
});

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

const hasPreviouslyCompleted = computed(
  () => localStorage.getItem("completed") === sharingCode.value,
);

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
    status.value = {
      status: "expired",
    };
    return;
  }

  if (sessionResponse.status !== 200) {
    status.value = {
      status: "error",
      error: sessionResponseBody.error,
    };
    return;
  }

  if (submissionResponse.status === 404) {
    status.value = {
      status: "waiting",
    };
    return;
  }

  if (submissionResponse.status !== 200) {
    status.value = {
      status: "error",
      error: submissionResponseBody.error,
    };
    return;
  }

  status.value = {
    status: "success",
  };

  // Everyone has completed and submitted the form. We need to track this
  // information persistently so that we can inform the current player that the
  // other player has reset the form and the current player needs to edit and
  // resubmit.
  //
  // We include the sharing code so the app doesn't get confused when a user is
  // attempting to join multiple sessions.
  localStorage.setItem("completed", sharingCode.value);

  sessionInfo.value = sessionResponseBody;
  formAnswers.value = submissionResponseBody;
});
</script>

<template>
  <div>
    <error-card
      v-if="status?.status === 'error'"
      status="error"
      title="Error"
      :description="status.error"
    />
    <div v-else>
      <h1>Compare answers</h1>
      <n-button v-if="status?.status !== 'expired'" @click="navigateEditPage"
        >Edit Answers</n-button
      >
      <n-divider />
      <div v-if="status?.status === 'waiting'">
        <div v-if="hasPreviouslyCompleted">
          <p>
            The other person has edited their answers. Edit your answers and resubmit to compare
            them.
          </p>
        </div>
        <div v-else>
          <p>
            The other person hasn't submitted their answers yet. Wait until they're done, and then
            reload this page.
          </p>
        </div>
      </div>
      <div v-else-if="status?.status === 'expired'">
        <p>This session has expired; you can no longer see each others' answers.</p>
      </div>
      <div v-else-if="status?.status === 'success'">
        <answer-comparison
          :id="pair.id"
          :sender-answer="pair.sender"
          :recipient-answer="pair.recipient"
          v-for="pair in answerPairs"
          :key="pair.id"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
