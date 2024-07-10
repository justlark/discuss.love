<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import ResponseInput from "@/components/ResponseInput.vue";
import type { SessionInfo } from "@/types";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { questions } from "@/questions";
import { API_URL } from "@/api";

const route = useRoute();
const router = useRouter();

const currentSharingCode = ref<string>(route.query.code as string);

// We assume the user is the recipient player by default. If they are the
// sending player, they'll have that value set in their browser local storage.
const player = ref<string>("recipient");

const sessionStatus = ref<
  { state: "error"; error: string } | { state: "nonexistent" } | { state: "success" }
>();
const otherPlayerName = ref<string>();

const responseInputs = ref<Array<InstanceType<typeof ResponseInput>>>([]);

const submitForm = () => {
  const responses = responseInputs.value.map((element) => ({
    id: element.id,
    answer: element.answer ?? "no",
    notes: element.notes ?? "",
  }));

  fetch(`${API_URL}/submissions/${currentSharingCode.value}/${player.value}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responses),
  });

  router.push({ path: "/compare" });
};

const sharingLink = computed(() => {
  // We build this URL instead of just using the `window.location.href` because
  // it is possible for a user to rejoin a previous session with the session
  // code query param omitted.
  return `${window.location.origin}/join?code=${currentSharingCode.value}`;
});

const isCopied = ref(false);

const copyLink = () => {
  navigator.clipboard.writeText(sharingLink.value);

  isCopied.value = true;

  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};

onBeforeMount(async () => {
  const storedSharingCode = localStorage.getItem("code");

  if (storedSharingCode && !currentSharingCode.value) {
    // Allow the player to return to their previous session, even if they no
    // longer have the link.
    currentSharingCode.value = storedSharingCode;
  }

  if (
    storedSharingCode &&
    currentSharingCode.value &&
    currentSharingCode.value !== storedSharingCode
  ) {
    // The player is joining a new session from their previous one, as the
    // recipient player. We need to clear their stored player status in case
    // they were the sending player in their previous session.
    //
    // We know they're the recipient player in this case because if they were
    // the sending player, the sharing code in the URL would match the sharing
    // code in storage.
    localStorage.removeItem("player");

    // Store their sharing code so they can come back to this session in the
    // future.
    localStorage.setItem("code", currentSharingCode.value);
  }

  if (!storedSharingCode && currentSharingCode) {
    // Store their sharing code so they can come back to this session in the
    // future.
    localStorage.setItem("code", currentSharingCode.value);
  }

  const storedPlayer = localStorage.getItem("player");

  // If this player is the sending player, that value would have been set in
  // storage when they started the session.
  if (storedPlayer) {
    player.value = storedPlayer;
  }

  const sessionResponse = await fetch(`${API_URL}/sessions/${currentSharingCode.value}`);

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
        v-for="question in questions"
        :key="question.id"
        ref="responseInputs"
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
