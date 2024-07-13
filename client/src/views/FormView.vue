<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import ResponseInput from "@/components/ResponseInput.vue";
import type {
  Optional,
  QuestionAnswer,
  ResponseStatus,
  SessionInfo,
  WithQuestionId,
} from "@/types";
import { useRoute, useRouter } from "vue-router";
import { randomizedQuestions } from "@/questions";
import { sessionsEndpoint, submissionsEndpoint } from "@/api";
import { NButton, NDivider } from "naive-ui";
import CopyButton from "@/components/CopyButton.vue";
import NavLink from "@/components/NavLink.vue";

const route = useRoute();
const router = useRouter();

const sharingCode = ref<string>(route.query.code as string);
const player = ref<string>();

const sessionStatus =
  ref<ResponseStatus<["session-nonexistent" | "already-submitted" | "success"]>>();

const otherPlayerName = ref<string>();

const responseInputs = ref<Array<InstanceType<typeof ResponseInput>>>([]);

type Response = WithQuestionId<Optional<QuestionAnswer, "answer">>;
type StoredResponses = { code: string; responses: Array<Response> };

const collectResponses = (): Array<Response> => {
  return responseInputs.value.map((element) => ({
    id: element.id,
    answer: element.response.answer,
    notes: element.response.notes,
  }));
};

const storeResponses = () => {
  localStorage.setItem(
    "responses",
    JSON.stringify({ code: sharingCode.value, responses: collectResponses() }),
  );
};

const initialStoredResponses = ref<StoredResponses | undefined>();

const storedResponses = computed((): Map<string, Response> | undefined => {
  if (!initialStoredResponses.value) {
    return undefined;
  }

  const { code: storedCode, responses } = initialStoredResponses.value;

  if (storedCode !== sharingCode.value) {
    return undefined;
  }

  return new Map(responses.map((response) => [response.id, response]));
});

const getStoredResponse = (id: string): Response | undefined => {
  if (!storedResponses.value) {
    return undefined;
  }

  return storedResponses.value.get(id);
};

const submissionStatus = ref<ResponseStatus<["success"]>>();

const submitForm = async () => {
  const responses = collectResponses();

  const response = await fetch(submissionsEndpoint(sharingCode.value, player.value), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responses),
  });

  if (response.status !== 201) {
    const responseBody = await response.json();

    submissionStatus.value = {
      status: "error",
      error: responseBody.error,
    };

    return;
  }

  submissionStatus.value = {
    status: "success",
  };

  router.push({ path: "/compare", query: { code: sharingCode.value } });
};

const resetForm = async () => {
  await fetch(submissionsEndpoint(sharingCode.value), {
    method: "DELETE",
  });
  sessionStatus.value = {
    status: "success",
  };
};

const pageLink = ref(window.location.href);

onBeforeMount(async () => {
  const storedSharingCode = localStorage.getItem("code");

  // When a user starts a session, the sharing code is stored in their local
  // storage so we can differentiate the sender from the recipient.
  player.value = sharingCode.value === storedSharingCode ? "sender" : "recipient";

  // Load the initial responses from the browser local storage so the user can
  // pick up where they left off.
  const initialStoredResponsesString = localStorage.getItem("responses");
  initialStoredResponses.value = initialStoredResponsesString
    ? JSON.parse(initialStoredResponsesString)
    : undefined;

  const sessionResponse = await fetch(sessionsEndpoint(sharingCode.value));
  const submissionResponse = await fetch(submissionsEndpoint(sharingCode.value));

  if (sessionResponse.status === 404) {
    sessionStatus.value = {
      status: "session-nonexistent",
    };
  } else if (sessionResponse.status !== 200) {
    const { error } = await sessionResponse.json();

    sessionStatus.value = {
      status: "error",
      error: error,
    };

    return;
  } else if (submissionResponse.status === 200) {
    sessionStatus.value = {
      status: "already-submitted",
    };
  } else if (submissionResponse.status !== 404) {
    const { error } = await submissionResponse.json();

    sessionStatus.value = {
      status: "error",
      error: error,
    };

    return;
  } else {
    sessionStatus.value = {
      status: "success",
    };
  }

  const sessionInfo: SessionInfo = await sessionResponse.json();

  otherPlayerName.value =
    player.value === "sender" ? sessionInfo.players.recipient : sessionInfo.players.sender;
});
</script>

<template>
  <main>
    <h1>What are you looking for?</h1>
    <div v-if="sessionStatus?.status == 'success'">
      <div v-if="player == 'sender'">
        <p>
          <i>
            Send <strong>{{ otherPlayerName }}</strong> a link to this page so they can join the
            discussion. Want to start over with a new person?
            <nav-link to="/start">Click here</nav-link>.
          </i>
        </p>
        <copy-button text="Copy Link" :link="pageLink" />
      </div>
      <div v-else>
        <p>
          <i
            >You're answering these questions for <strong>{{ otherPlayerName }}</strong
            >. Want to start over with a new person? <nav-link to="/start">Click here</nav-link>.</i
          >
        </p>
      </div>
      <n-divider />
      <response-input
        :id="question.id"
        :title="question.title"
        :description="question.description"
        :initialAnswer="getStoredResponse(question.id)?.answer"
        :initialNotes="getStoredResponse(question.id)?.notes"
        v-for="question in randomizedQuestions(sharingCode)"
        :key="question.id"
        ref="responseInputs"
        @input="storeResponses"
      />
      <div v-if="submissionStatus?.status == 'error'">
        <p class="error-message">Error: {{ submissionStatus.error }}</p>
      </div>
      <n-button @click="submitForm">Submit</n-button>
    </div>
    <div v-else-if="sessionStatus?.status == 'session-nonexistent'">
      <p>
        The link you followed to get here is invalid or has expired. To start a new discussion,
        <nav-link to="/start">click here</nav-link>.
      </p>
    </div>
    <div v-else-if="sessionStatus?.status == 'already-submitted'">
      <p>
        Everyone has already submitted their answers for this discussion. You can edit and resubmit
        your answers, but you'll have to wait for the other person to resubmit theirs as well. Your
        previous answers will be pre-filled in.
      </p>
      <n-button @click="resetForm">Start Over</n-button>
    </div>
    <div v-else-if="sessionStatus?.status == 'error'">
      <p class="error-message">Error: {{ sessionStatus.error }}</p>
    </div>
  </main>
</template>

<style scoped></style>
