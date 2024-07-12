<script setup lang="ts">
import { ref } from "vue";
import { sessionsEndpoint } from "@/api";
import NameInput from "@/components/NameInput.vue";
import { useRouter } from "vue-router";

const senderName = ref<string>();
const recipientName = ref<string>();

const router = useRouter();

const sessionStatus = ref<{ state: "success" } | { state: "error"; error: string }>();

const startSession = async () => {
  if (!senderName.value || !recipientName.value) {
    return;
  }

  const response = await fetch(sessionsEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      players: {
        sender: senderName.value,
        recipient: recipientName.value,
      },
    }),
  });

  if (response.status !== 201) {
    const { error } = await response.json();

    sessionStatus.value = {
      state: "error",
      error: error,
    };

    return;
  }

  const { code } = await response.json();

  sessionStatus.value = { state: "success" };

  // When a user starts a session, the sharing code is stored in their local
  // storage so we can differentiate the sender from the recipient.
  localStorage.setItem("code", code);

  await router.push({ path: "/join", query: { code } });
};
</script>

<template>
  <main>
    <h1>Start a new discussion</h1>
    <NameInput id="sender" label="Your name" v-model="senderName" />
    <NameInput id="recipient" label="Their name" v-model="recipientName" />
    <div v-if="sessionStatus?.state == 'error'">
      <p class="error-message">Error: {{ sessionStatus.error }}</p>
    </div>
    <button @click="startSession">Start</button>
  </main>
</template>

<style scoped></style>
