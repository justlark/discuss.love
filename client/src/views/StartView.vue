<script setup lang="ts">
import { ref } from "vue";
import { sessionsEndpoint } from "@/api";
import NameInput from "@/components/NameInput.vue";
import { useRouter } from "vue-router";
import type { ResponseStatus } from "@/types";
import { NButton } from "naive-ui";

const senderName = ref<string>();
const recipientName = ref<string>();

const router = useRouter();

const sessionStatus = ref<ResponseStatus<["success"]>>();

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
      status: "error",
      error: error,
    };

    return;
  }

  const { code } = await response.json();

  sessionStatus.value = { status: "success" };

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
    <div v-if="sessionStatus?.status == 'error'">
      <p class="error-message">Error: {{ sessionStatus.error }}</p>
    </div>
    <n-button @click="startSession">Start</n-button>
  </main>
</template>

<style scoped></style>
