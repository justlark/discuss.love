<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import { questionsEndpoint } from "@/api";
import FileUpload, { type FileUploadUploaderEvent } from "primevue/fileupload";
import { ERROR_TOAST_TTL, storeKey } from "@/vars";
import { useToast } from "primevue/usetoast";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();

const questionsChecksum = ref<string>();
const isCustomQuestionsUploaded = ref(false);

const nsfw = computed(() => {
  return localStorage.getItem(storeKey.nsfw) === "true";
});

const uploadCustomQuestions = async (event: FileUploadUploaderEvent) => {
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

const startWithCustomQuestions = () => {
  router.push({
    path: "/start",
    query: {
      q: questionsChecksum.value,
    },
  });
};
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading" class="text-center mb-8">What kind of discussion do you want to have?</h1>
    <div class="flex flex-col gap-4 max-w-3xl">
      <section aria-labelledby="relationship-question-choice">
        <Card class="recommended-choice">
          <template #title
            ><span id="relationship-question-choice">Negotiate a relationship</span></template
          >
          <template #subtitle>
            <i class="pi pi-star" aria-hidden></i>
            Recommended
          </template>
          <template #content>
            <p>
              These questions are for negotiating a relationship of any sort: romantic partners,
              platonic partners, friends, family, acquaintances, and so on.
            </p>
          </template>
          <template #footer>
            <div
              data-umami-event="Choose questionnaire"
              data-umami-event-questionnaire="relationship"
            >
              <Button
                as="RouterLink"
                :to="{ path: '/start', query: { q: 'relationship' } }"
                label="Start"
              />
            </div>
          </template>
        </Card>
      </section>
      <section v-if="nsfw" aria-labelledby="scene-question-choice">
        <Card>
          <template #title><span id="scene-question-choice">Negotiate a scene</span></template>
          <template #subtitle>
            <span class="flex gap-2 items-baseline">
              <i class="pi pi-exclamation-triangle" aria-hidden></i>
              <span>NSFW</span>
            </span>
          </template>
          <template #content>
            <p>
              These questions are for negotiating a BDSM encounter. They focus on an individual
              scene rather than an ongoing dynamic, and the goal is to assess compatibility at a
              high level rather than be the final word in negotiation.
            </p>
          </template>
          <template #footer>
            <div data-umami-event="Choose questionnaire" data-umami-event-questionnaire="scene">
              <Button
                as="RouterLink"
                :to="{ path: '/start', query: { q: 'scene' } }"
                label="Start"
              />
            </div>
          </template>
        </Card>
      </section>
      <section aria-labelledby="custom-question-choice">
        <Card>
          <template #title
            ><span id="custom-question-choice">Negotiate something else</span></template
          >
          <template #subtitle>
            <span class="flex gap-2 items-baseline">
              <i class="pi pi-exclamation-triangle" aria-hidden></i>
              <span>Advanced</span>
            </span>
          </template>
          <template #content>
            <p>
              Write your own questions and negotiate whatever you want!
              <a
                href="https://github.com/justlark/discuss.love/blob/main/docs/custom-questions.md"
                target="_blank"
                >Read the docs</a
              >
              to learn how to write your own questions.
            </p>
          </template>
          <template #footer>
            <div class="flex gap-2">
              <FileUpload
                mode="basic"
                accept="application/json"
                custom-upload
                auto
                @uploader="uploadCustomQuestions"
              />
              <div data-umami-event="Choose questionnaire" data-umami-event-questionnaire="custom">
                <Button
                  @click="startWithCustomQuestions"
                  :disabled="!isCustomQuestionsUploaded"
                  label="Start"
                />
              </div>
            </div>
          </template>
        </Card>
      </section>
    </div>
  </main>
</template>

<style scoped>
.p-card:hover {
  @apply shadow-lg;
  transition: box-shadow 0.25s ease-in-out;
}
</style>
