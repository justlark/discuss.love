<script setup lang="ts">
import { ref } from "vue";
import { sessionsEndpoint } from "@/api";
import NameInput from "@/components/NameInput.vue";
import { useRouter } from "vue-router";
import { type FormInst, NButton, NForm, useMessage } from "naive-ui";

const formRef = ref<FormInst>();
const names = ref({ sender: "", recipient: "" });

const router = useRouter();
const message = useMessage();

const rules = {
  sender: {
    required: true,
    message: "Please enter your name",
    trigger: "input",
  },
  recipient: {
    required: true,
    message: "Please enter their name",
    trigger: "input",
  },
};

const startSession = async () => {
  const errors = await formRef.value?.validate();
  if (errors?.warnings) {
    return;
  }

  const response = await fetch(sessionsEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      players: {
        sender: names.value.sender,
        recipient: names.value.recipient,
      },
    }),
  });

  if (response.status !== 201) {
    const { error } = await response.json();

    message.error(error);

    return;
  }

  const { code } = await response.json();

  // When a user starts a session, the sharing code is stored in their local
  // storage so we can differentiate the sender from the recipient.
  localStorage.setItem("code", code);

  await router.push({ path: "/join", query: { code } });
};
</script>

<template>
  <main>
    <h1>Start a new discussion</h1>
    <n-form ref="formRef" :rules="rules" :model="names">
      <name-input label="Your name" path="sender" v-model="names.sender" />
      <name-input label="Their name" path="recipient" v-model="names.recipient" />
      <n-button @click="startSession">Start</n-button>
    </n-form>
  </main>
</template>

<style scoped></style>
