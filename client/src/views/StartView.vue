<script setup lang="ts">
import { ref, computed } from "vue";
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

  localStorage.setItem("code", code);
  localStorage.setItem("player", "sender");

  sharingCode.value = code;
};

const sharingLink = computed(() => {
  return `${window.location.origin}/join?code=${sharingCode.value}`;
});

const isCopied = ref(false);

const copyLink = () => {
  navigator.clipboard.writeText(sharingLink.value);

  isCopied.value = true;

  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};
</script>

<template>
  <main>
    <h1>Start a new discussion</h1>
    <NameInput id="sender" label="Your name" v-model="senderName" />
    <NameInput id="recipient" label="Their name" v-model="recipientName" />
    <button @click="startSession">Start</button>
    <div v-if="sharingCode">
      <p>Send the other person this link:</p>
      <span class="copy-button">
        <button @click="copyLink">Copy Link</button>
        <span class="copy-confirmation" v-if="isCopied">Copied!</span>
      </span>
    </div>
  </main>
</template>

<style scoped>
.copy-button {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.copy-confirmation {
  font-size: 13pt;
  filter: brightness(80%);
}
</style>
