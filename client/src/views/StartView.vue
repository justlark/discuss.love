<script setup lang="ts">
import { ref } from "vue";
import { sessionsEndpoint } from "@/api";
import NameInput from "@/components/NameInput.vue";
import { useRouter } from "vue-router";
import { type FormInst, NDivider, NButton, NForm, NUl, NLi, NFlex, useMessage } from "naive-ui";

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
    <h1 class="title">Start a new discussion</h1>
    <n-flex size="large" justify="space-around">
      <div class="form">
        <n-form ref="formRef" :rules="rules" :model="names">
          <name-input id="sender" label="Your name" path="sender" v-model="names.sender" />
          <name-input
            id="recipient"
            label="Their name"
            path="recipient"
            v-model="names.recipient"
          />
          <n-button @click="startSession">Start</n-button>
        </n-form>
      </div>
      <aside class="aside">
        <n-ul>
          <n-li>
            You won't be able to see each other's answers until you're both done answering.
          </n-li>
          <n-li>
            You'll only see the answers that you agree on. If one of you selects "No" to a
            particular question, you won't see how the other person responded. Don't be afraid to
            say yes to something just because you're worried the other person will say no!
          </n-li>
          <n-li
            >If you want to change your answers, you'll both have the opportunity to go back and
            make changes before you can compare answers again.</n-li
          >
          <n-li>
            The purpose of this tool is to start a discussion, not to replace one! Once you compare
            answers, take the time to ask each other clarifying questions.
          </n-li>
          <n-li
            >You can delete your data from this website at any time. It will auto-delete after 7
            days.</n-li
          >
        </n-ul>
      </aside>
    </n-flex>
  </main>
</template>

<style scoped>
.title {
  text-align: center;
  margin-bottom: 2rem;
}

.form {
  flex: 0 1 20rem;
}

.aside {
  text-align: justify;
  flex: 0 1 35rem;
}
</style>
