<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import ResponseInput from "@/components/ResponseInput.vue";
import type { QuestionAnswer, SessionInfo, WithQuestionId } from "@/types";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { randomizedQuestions } from "@/questions";
import { API_URL } from "@/api";

const route = useRoute();
const router = useRouter();

const sharingCode = ref<string>(route.query.code as string);
const player = ref<string>();

const sessionStatus = ref<
  { state: "error"; error: string } | { state: "nonexistent" } | { state: "success" }
>();
const otherPlayerName = ref<string>();

const responseInputs = ref<Array<InstanceType<typeof ResponseInput>>>([]);

type Response = WithQuestionId<QuestionAnswer>;
type StoredResponses = { code: string; responses: Array<Response> };

const collectResponses = (): Array<Response> => {
  return responseInputs.value.map((element) => ({
    id: element.id,
    answer: element.answer ?? "no",
    notes: element.notes ?? "",
  }));
};

const storeResponses = () => {
  localStorage.setItem(
    "responses",
    JSON.stringify({ code: sharingCode.value, responses: collectResponses() }),
  );
};

const initialStoredResponses = ref<StoredResponses | undefined>();

const storedResponses = computed((): Map<string, QuestionAnswer> | undefined => {
  if (!initialStoredResponses.value) {
    return undefined;
  }

  const { code: storedCode, responses } = initialStoredResponses.value;

  if (storedCode !== sharingCode.value) {
    return undefined;
  }

  return new Map(
    responses.map((response) => [response.id, { answer: response.answer, notes: response.notes }]),
  );
});

const getStoredResponse = (id: string): QuestionAnswer | undefined => {
  if (!storedResponses.value) {
    return undefined;
  }

  return storedResponses.value.get(id);
};

const submitForm = () => {
  const responses = collectResponses();

  fetch(`${API_URL}/submissions/${sharingCode.value}/${player.value}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responses),
  });

  router.push({ path: "/compare", query: { code: sharingCode.value } });
};

const isCopied = ref(false);

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);

  isCopied.value = true;

  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};

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

  const sessionResponse = await fetch(`${API_URL}/sessions/${sharingCode.value}`);

  if (sessionResponse.status === 404) {
    sessionStatus.value = {
      state: "nonexistent",
    };
  } else if (sessionResponse.status !== 200) {
    const { error } = await sessionResponse.json();

    sessionStatus.value = {
      state: "error",
      error: error ?? "Unknown error fetching session data. This may be a bug.",
    };

    return;
  } else {
    const sessionInfo: SessionInfo = await sessionResponse.json();

    sessionStatus.value = {
      state: "success",
    };
    otherPlayerName.value =
      player.value === "sender" ? sessionInfo.players.recipient : sessionInfo.players.sender;
  }
});
</script>

<template>
  <main>
    <h1>What are you looking for?</h1>
    <div v-if="sessionStatus?.state == 'success'">
      <div v-if="player == 'sender'">
        <p>
          <i>
            Send <strong>{{ otherPlayerName }}</strong> a link to this page so they can join the
            discussion. Want to start over with a new person?
            <RouterLink to="/start">Click here</RouterLink>.
          </i>
        </p>
        <span class="copy-button">
          <button @click="copyLink">Copy Link</button>
          <span class="copy-confirmation" v-if="isCopied">Copied!</span>
        </span>
      </div>
      <div v-else>
        <p>
          <i
            >You're answering these questions for <strong>{{ otherPlayerName }}</strong
            >. Want to start over with a new person?
            <RouterLink to="/start">Click here</RouterLink>.</i
          >
        </p>
      </div>
      <hr />
      <ResponseInput
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
      <button @click="submitForm">Submit</button>
    </div>
    <div v-else-if="sessionStatus?.state == 'nonexistent'">
      <p>
        The link you followed to get here is invalid or has expired. To start a new discussion,
        <RouterLink to="/start">click here</RouterLink>.
      </p>
    </div>
    <div v-else-if="sessionStatus?.state == 'error'">
      <p>Error: {{ sessionStatus.error }}</p>
    </div>
  </main>
</template>

<style scoped>
.copy-button {
  display: flex;
  gap: 1rem;
  align-items: baseline;
}

.copy-confirmation {
  font-size: 13pt;
  filter: brightness(80%);
}
</style>
