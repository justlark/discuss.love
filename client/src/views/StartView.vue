<script setup lang="ts">
import { ref } from "vue";
import { sessionsEndpoint, questionsEndpoint } from "@/api";
import TextInput from "@/components/TextInput.vue";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import FileUpload, { type FileUploadUploadEvent } from "primevue/fileupload";

const ERROR_TOAST_TTL = 3000;

const names = ref({ sender: "", recipient: "" });
const validationErrors = ref({ sender: "", recipient: "" });

const isAdvancedOptionsExpanded = ref(false);
const fileUpload = ref();
const isCustomQuestionsUploaded = ref(false);
const questionsChecksum = ref<string>();

const router = useRouter();
const toast = useToast();

const startSession = async () => {
  if (!names.value.sender) {
    validationErrors.value.sender = "Please enter your name.";
  }

  if (!names.value.recipient) {
    validationErrors.value.recipient = "Please enter their name.";
  }

  if (!names.value.sender || !names.value.recipient) {
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
      questions: questionsChecksum.value,
    }),
  });

  if (response.status !== 201) {
    const { error } = await response.json();

    toast.add({ severity: "error", summary: "Error", detail: error, life: ERROR_TOAST_TTL });

    return;
  }

  const { code } = await response.json();

  // When a user starts a session, the sharing code is stored in their local
  // storage so we can differentiate the sender from the recipient.
  localStorage.setItem("code", code);

  await router.push({ path: "/join", query: { code } });
};

const uploadQuestions = async (event: FileUploadUploadEvent) => {
  const response = await fetch(questionsEndpoint(), {
    method: "POST",
    body: Array.isArray(event.files) ? event.files[0] : event.files,
  });

  if (response.status !== 201) {
    const { error } = await response.json();

    toast.add({ severity: "error", summary: "Error", detail: error, life: ERROR_TOAST_TTL });

    return;
  }

  const { checksum } = await response.json();
  questionsChecksum.value = checksum;

  isCustomQuestionsUploaded.value = true;

  toast.add({ severity: "success", summary: "Custom questions uploaded!", life: 2000 });
};
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading" class="text-center mb-8">Start a new discussion</h1>
    <div class="flex flex-wrap gap-10 justify-around">
      <form
        class="flex flex-col items-start basis-1/4 gap-4"
        aria-labelledby="main-heading"
        :model="names"
      >
        <TextInput
          id="name-input-sender"
          label="Your name"
          v-model="names.sender"
          :error-message="validationErrors.sender"
          required
        />
        <TextInput
          id="name-input-recipient"
          label="Their name"
          v-model="names.recipient"
          :error-message="validationErrors.recipient"
          required
        />
        <div>
          <button
            type="button"
            class="appearance-none flex gap-2 items-baseline"
            @click="isAdvancedOptionsExpanded = !isAdvancedOptionsExpanded"
            aria-controls="advanced-options"
          >
            <i class="pi pi-caret-down" v-if="!isAdvancedOptionsExpanded"></i>
            <i class="pi pi-caret-up" v-if="isAdvancedOptionsExpanded"></i>
            <span>Advanced options</span>
          </button>
          <div
            id="advanced-options"
            :class="{
              collapsible: true,
              expanded: isAdvancedOptionsExpanded,
              flex: true,
              ['flex-col']: true,
              ['items-start']: true,
              ['mb-4']: isAdvancedOptionsExpanded,
            }"
            :aria-expanded="isAdvancedOptionsExpanded"
          >
            <p class="text-muted">
              You can upload a list of custom questions to use instead of the default ones.
              <a
                href="https://github.com/justlark/discuss.love/blob/main/docs/custom-questions.md"
                target="_blank"
                >Read the docs</a
              >
              for more information about how to create custom questions.
            </p>
            <FileUpload
              ref="fileUpload"
              mode="basic"
              accept="application/json"
              custom-upload
              auto
              @uploader="uploadQuestions"
            />
          </div>
        </div>
        <span class="flex gap-4 items-baseline">
          <Button @click="startSession" label="Start" />
          <span v-if="isCustomQuestionsUploaded" class="text-muted">With custom questions</span>
        </span>
      </form>
      <aside class="text-justify sm:basis-1/2">
        <ul>
          <li>
            <p>You won't be able to see each other's answers until you're both done answering.</p>
          </li>
          <li>
            <p>
              If one of you selects "No" to a particular question, you won't see how the other
              person responded. Don't be afraid to say yes to something just because you're worried
              the other person will say no!
            </p>
          </li>
          <li>
            <p>
              If you want to change your answers, you'll both have the opportunity to go back and
              make changes before you can compare answers again.
            </p>
          </li>
          <li>
            <p>
              The purpose of this tool is to start a discussion, not to replace one! Once you
              compare answers, take the time to ask each other clarifying questions.
            </p>
          </li>
          <li>
            <p>
              Are you polyamorous? Do this exercise separately with each of your partners. Every
              relationship is unique, so your answers may differ depending on the person.
            </p>
          </li>
          <li>
            <p>
              You can delete your data from this website at any time. It will auto-delete after 7
              days.
            </p>
          </li>
        </ul>
      </aside>
    </div>
  </main>
</template>

<style scoped></style>
