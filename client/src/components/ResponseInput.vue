<script setup lang="ts">
import { humanReadableAnswer, type AnswerType, type Player } from "@/types";
import RadioButton from "@/components/RadioButton.vue";
import RadioGroup from "@/components/RadioGroup.vue";
import TextArea from "@/components/TextArea.vue";
import { computed, ref } from "vue";
import seedrandom from "seedrandom";

const yesPrompts = [
  "I want this because…",
  "I want this, except…",
  "I want this, but also…",
  "To me, this means…",
  "I'm specifically looking for…",
  "This is important to me because…",
];

const laterPrompts = [
  "I might be okay with this if…",
  "I'll be ready for this when…",
  "I don't want this right now, but…",
  "Before we do this, we need to…",
  "For this to change, I need…",
];

const props = defineProps<{
  id: string;
  sharingCode: string;
  player?: Player;
  title: string;
  description: string;
  prompts: Array<string>;
  initialAnswer?: AnswerType;
  initialNotes?: string;
}>();

const response = ref<{ answer?: AnswerType; notes: string }>({
  answer: props.initialAnswer,
  notes: props.initialNotes ?? "",
});

// TODO: This is too random. We should be shuffling a deck of questions and then
// cycling through them.
const getRandomPrompt = (answer: AnswerType | undefined, player?: Player) => {
  if (!answer || !player || answer === "no") {
    return "";
  }

  // - We include the sharing code so that the prompts don't change on page
  // reload.
  // - We include the player so that each user gets different prompts, with the
  // intent that that generates different answers and stimulates discussion.
  // - We include the question ID so that the prompts don't change on page
  // reload.
  // - We include the answer so that the "Yes" and "Maybe later" answers don't
  // always get the same prompts paired together.
  const rng = seedrandom(`${props.sharingCode}.${player}.${props.id}.${answer}`);
  const prompts = answer === "yes" ? yesPrompts : laterPrompts;

  return prompts[Math.floor(rng() * prompts.length)];
};

const promptListId = computed(() => `notes-prompt-list-${props.id}`);
const answerIsNo = computed(() => !response.value.answer || response.value.answer === "no");

defineExpose({
  id: props.id,
  response,
});

const emit = defineEmits(["update"]);
</script>

<template>
  <form :id="`response-form-${props.id}`" :aria-labelledby="`response-input-heading-${props.id}`">
    <h3 :id="`response-input-heading-${props.id}`">{{ props.title }}</h3>
    <RadioGroup :form-id="`response-form-${props.id}`" :label="props.description">
      <!--
        TODO: You should be using something like `aria-expanded` and
        `aria-controls` to indicate that the prompt and notes field are hidden
        until a radio button is selected, but those ARIA attributes aren't valid
        on the radio button role.
      -->
      <RadioButton
        :id="`answer-input-yes-${props.id}`"
        v-model="response.answer"
        value="yes"
        :label="humanReadableAnswer('yes')"
        @update="emit('update')"
      />
      <RadioButton
        :id="`answer-input-no-${props.id}`"
        v-model="response.answer"
        value="no"
        :label="humanReadableAnswer('no')"
        @update="emit('update')"
      />
      <RadioButton
        :id="`answer-input-later-${props.id}`"
        v-model="response.answer"
        value="later"
        :label="humanReadableAnswer('later')"
        @update="emit('update')"
      />
    </RadioGroup>
    <div :class="{ collapsible: true, expanded: !answerIsNo }">
      <div class="my-4 ml-2">
        <span class="font-bold">Prompts</span>
        <ul>
          <li v-for="prompt in props.prompts" :key="prompt">{{ prompt }}</li>
        </ul>
      </div>
      <TextArea
        :id="`notes-input-${props.id}`"
        label="Give some more detail"
        :placeholder="getRandomPrompt(response.answer, props.player)"
        v-model="response.notes"
        @update="emit('update')"
      />
    </div>
  </form>
</template>

<style scoped>
.collapsible {
  visibility: hidden;
  transition:
    max-height 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
  max-height: 0;
  overflow: hidden;
}

.collapsible.expanded {
  visibility: visible;
  max-height: 100vh;
}
</style>
