<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading" class="text-center mb-8">What kind of discussion do you want to have?</h1>
    <div class="flex flex-col gap-4 max-w-3xl">
      <Card class="recommended-question-list">
        <template #title>Negotiate a relationship</template>
        <template #content>
          <p>
            These questions are for negotiating a relationship of any sort: romantic partners,
            platonic partners, friends, family, acquaintances, and so on.
          </p>
        </template>
        <template #footer>
          <Button as="router-link" to="/start?q=relationship" label="Start" />
        </template>
      </Card>
      <Card>
        <template #title>Negotiate a scene</template>
        <template #content>
          <p>
            These questions are for negotiating a kink/BDSM scene. They focus on an individual scene
            rather than an ongoing dynamic.
          </p>
        </template>
        <template #footer>
          <Button as="router-link" to="/start?q=kink" label="Start" />
        </template>
      </Card>
    </div>
  </main>
</template>

<style scoped>
.p-card.recommended-question-list {
  border: 2px solid var(--p-primary-color);
}
</style>
