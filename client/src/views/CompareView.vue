<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import type { FormAnswers, SessionInfo, ResponseStatus } from "@/types";
import AnswerComparison from "@/components/AnswerComparison.vue";
import { sessionsEndpoint, submissionsEndpoint } from "@/api";
import { useRoute, useRouter } from "vue-router";
import { NButton, useDialog } from "naive-ui";
import { useToast } from "primevue/usetoast";
import { useVueToPrint } from "vue-to-print";
import concrete from "concrete.css?raw";
import ActionHeader from "@/components/ActionHeader.vue";

const ERROR_TOAST_TTL = 3000;

const route = useRoute();
const toast = useToast();
const dialog = useDialog();

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

const deleteSubmissions = async () => {
  const submissionDeleteResponse = await fetch(submissionsEndpoint(sharingCode.value), {
    method: "DELETE",
  });

  if (submissionDeleteResponse.status !== 204) {
    const { error } = await submissionDeleteResponse.json();

    toast.add({ severity: "error", summary: "Error", detail: error, life: ERROR_TOAST_TTL });

    return;
  }

  const sessionDeleteResponse = await fetch(sessionsEndpoint(sharingCode.value), {
    method: "DELETE",
  });

  if (sessionDeleteResponse.status !== 204) {
    const { error } = await sessionDeleteResponse.json();

    toast.add({ severity: "error", summary: "Error", detail: error, life: ERROR_TOAST_TTL });

    return;
  }

  // Go back to the homepage.
  router.push("/");
};

const openDeleteDialog = () => {
  dialog.error({
    title: "Delete everyone's answers",
    content:
      "To protect your privacy, everyone's answers are automatically deleted after 7 days. Alternatively, you can delete them now. This cannot be undone.",
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick: deleteSubmissions,
  });
};

const answersRef = ref();

const { handlePrint } = useVueToPrint({
  content: () => answersRef.value,
  documentTitle: "Discuss.love Answers",
  copyStyles: false,
  pageStyle: concrete,
});

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
  <ActionHeader
    title="Compare answers"
    :error-text="status?.status === 'error' ? status.error : undefined"
  >
    <template #actions v-if="status?.status !== 'expired'">
      <n-button @click="navigateEditPage">Edit Answers</n-button>
      <n-button v-if="status?.status === 'success'" @click="handlePrint">Print Answers</n-button>
      <n-button type="error" @click="openDeleteDialog">Delete Answers</n-button>
    </template>

    <template #body>
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
      <div v-else-if="status?.status === 'success'" ref="answersRef">
        <answer-comparison
          :id="pair.id"
          :sender-answer="pair.sender"
          :recipient-answer="pair.recipient"
          v-for="pair in answerPairs"
          :key="pair.id"
        />
      </div>
    </template>
  </ActionHeader>
</template>

<style scoped></style>
