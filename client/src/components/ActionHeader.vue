<script setup lang="ts">
import Divider from "primevue/divider";
import ResultCard from "@/components/ResultCard.vue";

const props = defineProps<{
  title: string;
  errorText?: string;
}>();
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading">{{ props.title }}</h1>
    <div v-if="!props.errorText">
      <p v-if="$slots.subtitle">
        <i>
          <slot name="subtitle" />
        </i>
      </p>
      <div class="flex flex-wrap gap-4 my-4" v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>
    <Divider />
    <result-card
      v-if="props.errorText"
      status="error"
      title="Error"
      :description="props.errorText"
    />
    <slot name="body" v-if="!props.errorText" />
  </main>
</template>

<style scoped></style>
