<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import ResponseInput from "@/components/ResponseInput.vue";
import {
  humanizeAnswer,
  type Optional,
  type Player,
  type QuestionAnswer,
  type QuestionDefinition,
  type ResponseStatus,
  type SessionInfo,
  type WithQuestionId,
} from "@/types";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { defaultQuestions, getRandomizedQuestionCategories } from "@/questions";
import { questionsEndpoint, sessionsEndpoint, submissionsEndpoint } from "@/api";
import Button from "primevue/button";
import Panel from "primevue/panel";
import CopyButton from "@/components/CopyButton.vue";
import ActionHeader from "@/components/ActionHeader.vue";
import { useToast } from "primevue/usetoast";

const ERROR_TOAST_TTL = 3000;

const route = useRoute();
const router = useRouter();
const toast = useToast();

const sharingCode = ref<string>(route.query.code as string);
const player = ref<Player>();
const questions = ref<Array<QuestionDefinition>>();
const randomizedQuestionCategories = computed(() =>
  questions.value === undefined
    ? undefined
    : getRandomizedQuestionCategories(questions.value, sharingCode.value),
);

const status = ref<
  ResponseStatus<["loading" | "session-nonexistent" | "already-submitted" | "success"]>
>({
  status: "loading",
});

const otherPlayerName = ref<string>();

const responseInputs = ref<Array<InstanceType<typeof ResponseInput>>>([]);

type Response = WithQuestionId<Optional<QuestionAnswer, "answer">>;
type StoredResponses = { code: string; responses: Array<Response> };

const collectResponses = (validate: boolean): Array<Response> | undefined => {
  const responses = [];

  for (const element of responseInputs.value) {
    if (validate && element.response.answer && element.required && !element.response.notes.trim()) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: `Because you answered "${humanizeAnswer(element.response.answer)}", you need provide details for "${element.title}".`,
        life: ERROR_TOAST_TTL,
      });

      return undefined;
    }

    responses.push({
      id: element.id,
      answer: element.response.answer,
      notes: element.response.notes,
    });
  }

  return responses;
};

const storeResponses = () => {
  localStorage.setItem(
    "responses",
    JSON.stringify({ code: sharingCode.value, responses: collectResponses(false) }),
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

const viewSubmissions = () => {
  router.push({ path: "/compare", query: { code: sharingCode.value } });
};

const submitForm = async () => {
  const responses = collectResponses(true);

  if (responses === undefined) {
    return;
  }

  const response = await fetch(submissionsEndpoint(sharingCode.value, player.value), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responses),
  });

  if (response.status !== 201) {
    const { error } = await response.json();

    toast.add({ severity: "error", summary: "Error", detail: error, life: ERROR_TOAST_TTL });

    return;
  }

  // This value is set when retrieving the submissions (after all users have
  // submitted) and unset here, on form submission. It's used when a player
  // restarts the session to track which player has resubmitted the form and
  // which hasn't, to control what message they see.
  localStorage.removeItem("completed");

  viewSubmissions();
};

const resetForm = async () => {
  const response = await fetch(submissionsEndpoint(sharingCode.value), {
    method: "DELETE",
  });

  if (response.status !== 204) {
    const { error } = await response.json();

    toast.add({ severity: "error", summary: "Error", detail: error, life: ERROR_TOAST_TTL });

    return;
  }

  status.value = { status: "success" };
};

const pageLink = ref(window.location.href);

const errorProps = computed(() =>
  status.value.status === "error"
    ? ({
        title: "Error",
        icon: "error",
        message: status.value.error,
      } as const)
    : undefined,
);

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

  const [sessionResponse, submissionResponse] = await Promise.all([
    fetch(sessionsEndpoint(sharingCode.value)),
    fetch(submissionsEndpoint(sharingCode.value)),
  ]);

  if (sessionResponse.status === 404) {
    status.value = { status: "session-nonexistent" };
  } else if (sessionResponse.status !== 200) {
    const { error } = await sessionResponse.json();

    status.value = { status: "error", error };

    return;
  } else if (submissionResponse.status === 200) {
    status.value = { status: "already-submitted" };
  } else if (submissionResponse.status !== 404) {
    const { error } = await submissionResponse.json();

    status.value = { status: "error", error };

    return;
  } else {
    status.value = { status: "success" };
  }

  const sessionInfo: SessionInfo = await sessionResponse.json();

  const questionsResponse = await fetch(questionsEndpoint(sessionInfo.questions));

  if (questionsResponse.status === 200) {
    questions.value = await questionsResponse.json();
  } else if (questionsResponse.status === 404) {
    questions.value = defaultQuestions;
  } else {
    const { error } = await questionsResponse.json();

    status.value = { status: "error", error };

    return;
  }

  otherPlayerName.value =
    player.value === "sender" ? sessionInfo.players.recipient : sessionInfo.players.sender;
});
</script>

<template>
  <ActionHeader title="What are you looking for?" :error="errorProps">
    <template #subtitle v-if="status?.status === 'success'">
      <div v-if="player === 'sender'">
        Send <strong>{{ otherPlayerName }}</strong> a link to this page so they can join the
        discussion. Want to start over with a new person?
        <RouterLink to="/start">Click here</RouterLink>.
      </div>
      <div v-else>
        You're answering these questions for <strong>{{ otherPlayerName }}</strong
        >. Want to start over with a new person? <RouterLink to="/start">Click here</RouterLink>.
      </div>
    </template>

    <template
      #actions
      v-if="
        (status?.status === 'success' && player === 'sender') ||
        status?.status === 'already-submitted'
      "
    >
      <CopyButton
        text="Copy Link"
        :link="pageLink"
        v-if="status?.status === 'success' && player === 'sender'"
      />
      <Button
        severity="danger"
        @click="resetForm"
        v-if="status?.status === 'already-submitted'"
        label="Start Over"
      />
      <Button
        severity="secondary"
        @click="viewSubmissions"
        v-if="status?.status === 'already-submitted'"
        label="See Answers"
      />
    </template>

    <template #body>
      <div v-if="status?.status === 'session-nonexistent'">
        <p>
          The link you followed to get here is invalid or has expired. To start a new discussion,
          <RouterLink to="/start">click here</RouterLink>.
        </p>
      </div>
      <div v-else-if="status?.status === 'already-submitted'">
        <p>
          Everyone has already submitted their answers for this discussion. You can edit and
          resubmit your answers, but you'll have to wait for the other person to resubmit theirs as
          well. Your previous answers will be pre-filled in.
        </p>
      </div>
      <div class="max-w-2xl w-full mt-2" v-else-if="status?.status === 'success'">
        <div class="flex flex-col gap-4">
          <Panel
            toggleable
            collapsed
            :header="category.name"
            v-for="category in randomizedQuestionCategories"
            :key="category.name"
          >
            <template #header>
              <div class="flex gap-4 items-center">
                <h2 class="my-auto">{{ category.name }}</h2>
                <small class="text-muted">({{ category.questions.length }} questions)</small>
              </div>
            </template>
            <div class="flex flex-col gap-8">
              <ResponseInput
                :id="question.id"
                :title="question.title"
                :description="question.description"
                :prompts="question.prompts"
                :initial-answer="getStoredResponse(question.id)?.answer"
                :initial-notes="getStoredResponse(question.id)?.notes"
                :sharing-code="sharingCode"
                :player="player"
                v-for="question in category.questions"
                :key="question.id"
                ref="responseInputs"
                @update="storeResponses"
              />
            </div>
          </Panel>
        </div>
        <Button class="mt-4" @click="submitForm" label="Submit" />
      </div>
    </template>
  </ActionHeader>
</template>

<style scoped></style>
