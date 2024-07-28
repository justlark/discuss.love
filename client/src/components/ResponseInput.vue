<script setup lang="ts">
import { type AnswerType, type Player, humanizeAnswer } from "@/types";
import RadioButton from "@/components/RadioButton.vue";
import RadioGroup from "@/components/RadioGroup.vue";
import TextArea from "@/components/TextArea.vue";
import { computed, ref } from "vue";

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

const required = computed(
  () =>
    response.value.answer && response.value.answer !== "no" && response.value.answer !== "unsure",
);

defineExpose({
  id: props.id,
  title: props.title,
  response,
  required,
});

const emit = defineEmits(["update"]);
</script>

<template>
  <form :id="`response-form-${props.id}`" :aria-labelledby="`response-input-heading-${props.id}`">
    <h3 :id="`response-input-heading-${props.id}`">{{ props.title }}</h3>
    <RadioGroup :form-id="`response-form-${props.id}`" :label="props.description">
      <!--
        TODO: We should be using `aria-expanded` and `aria-controls` to indicate
        that the notes field and prompt list are collapsed unless the "Yes" or
        "Maybe later" radio buttons are selected, but those ARIA attributes
        aren't valid on the radio role.

        I tried adding those attributes anyways, but Orca didn't announce them.

        There seems to be an issue open to extend support for these attributes
        to the radio role:

        https://github.com/w3c/aria/issues/1404
      -->
      <RadioButton
        :id="`answer-input-yes-${props.id}`"
        class="flex gap-2"
        v-model="response.answer"
        value="yes"
        @update="emit('update')"
      >
        <span class="flex gap-2 items-baseline">
          <span>{{ humanizeAnswer("yes") }}</span>
          <small class="text-muted">(I want some or all of this)</small>
        </span>
      </RadioButton>
      <RadioButton
        :id="`answer-input-no-${props.id}`"
        v-model="response.answer"
        value="no"
        @update="emit('update')"
      >
        <span class="flex gap-2 items-baseline">
          <span>{{ humanizeAnswer("no") }}</span>
          <small class="text-muted">(I don't want this and don't expect that to change)</small>
        </span>
      </RadioButton>
      <RadioButton
        :id="`answer-input-open-${props.id}`"
        v-model="response.answer"
        value="open"
        @update="emit('update')"
      >
        <span class="flex gap-2 items-baseline">
          <span>{{ humanizeAnswer("open") }}</span>
          <small class="text-muted">(I'm open to this, but indifferent)</small>
        </span>
      </RadioButton>
      <RadioButton
        :id="`answer-input-later-${props.id}`"
        v-model="response.answer"
        value="later"
        @update="emit('update')"
      >
        <span class="flex gap-2 items-baseline">
          <span>{{ humanizeAnswer("later") }}</span>
          <small class="text-muted"
            >(I don't want this right now, but I'm open to revisiting it)</small
          >
        </span>
      </RadioButton>
      <RadioButton
        :id="`answer-input-unsure-${props.id}`"
        v-model="response.answer"
        value="unsure"
        @update="emit('update')"
      >
        <span class="flex gap-2 items-baseline">
          <span>{{ humanizeAnswer("unsure") }}</span>
          <small class="text-muted">(I need more time to think about this)</small>
        </span>
      </RadioButton>
    </RadioGroup>
    <div :class="{ collapsible: true, expanded: response.answer && response.answer !== 'no' }">
      <TextArea
        class="my-4"
        :id="`notes-input-${props.id}`"
        :required="required"
        :textarea-props="{ 'aria-details': `prompt-list-${props.id}` }"
        label="Give some more detail"
        v-model="response.notes"
        @update="emit('update')"
      />
      <div :id="`prompt-list-${props.id}`">
        <span>Some prompts to get you started</span>
        <ul class="ml-4 mt-2">
          <li v-for="prompt in props.prompts" :key="prompt">{{ prompt }}</li>
        </ul>
      </div>
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
