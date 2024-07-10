<script setup lang="ts">
import { ref } from "vue";
import { API_URL } from "@/api";
import NameInput from "@/components/NameInput.vue";
import { useRouter } from "vue-router";

const senderName = ref<string>();
const recipientName = ref<string>();

const router = useRouter();

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

  localStorage.setItem("code", code);
  localStorage.setItem("player", "sender");

  await router.push({ path: "/join", query: { code } });
};
</script>

<template>
  <main>
    <h1>Start a new discussion</h1>
    <NameInput id="sender" label="Your name" v-model="senderName" />
    <NameInput id="recipient" label="Their name" v-model="recipientName" />
    <button @click="startSession">Start</button>
  </main>
</template>

<style scoped></style>
