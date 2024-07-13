<script setup lang="ts">
import { humanReadableAnswer, type AnswerType } from "@/types";
import { NForm, NRadioGroup, NRadio, NInput, NFormItem, NFlex } from "naive-ui";
import { ref } from "vue";

const props = defineProps<{
  id: string;
  title: string;
  description: string;
  initialAnswer?: AnswerType;
  initialNotes?: string;
}>();

const response = ref<{ answer?: AnswerType; notes: string }>({
  answer: props.initialAnswer,
  notes: props.initialNotes ?? "",
});

defineExpose({
  id: props.id,
  response,
});

const emit = defineEmits(["input"]);
</script>

<template>
  <h2>{{ props.title }}</h2>
  <n-form :model="response">
    <n-form-item :label="props.description" path="answer">
      <n-radio-group v-model:value="response.answer" @update:value="emit('input')">
        <n-flex vertical>
          <n-radio value="yes">
            {{ humanReadableAnswer("yes") }}
          </n-radio>
          <n-radio value="no">
            {{ humanReadableAnswer("no") }}
          </n-radio>
          <n-radio value="later">
            {{ humanReadableAnswer("later") }}
          </n-radio>
        </n-flex>
      </n-radio-group>
    </n-form-item>
    <n-form-item label="Give some more detail" path="notes">
      <n-input type="textarea" v-model:value="response.notes" @input="emit('input')" />
    </n-form-item>
  </n-form>
</template>

<style scoped></style>
