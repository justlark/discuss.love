<script setup lang="ts">
import { ref } from "vue";
import { API_URL } from "@/api";
import NameInput from "@/components/NameInput.vue";

const senderName = ref<string>();
const recipientName = ref<string>();
const sharingCode = ref<string>();

const startSession = async () => {
  const response = await fetch(`${API_URL}/sessions`, {
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

  const { code } = await response.json();

  sharingCode.value = code;
};
</script>

<template>
  <main>
    <h1>Start a new discussion</h1>
    <NameInput id="sender" label="Your name" v-model="senderName" />
    <NameInput id="recipient" label="Their name" v-model="recipientName" />
    <button @click="startSession">Start</button>
    <p v-if="sharingCode">
      <strong>Your sharing code</strong>: <code>{{ sharingCode }}</code>
    </p>
  </main>
</template>

<style scoped></style>
