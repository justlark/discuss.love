<script setup lang="ts">
import Button from "primevue/button";
import { ref, watch } from "vue";
import { RouterLink } from "vue-router";
import ToggleSwitch from "primevue/toggleswitch";
import { useConfirm } from "primevue/useconfirm";
import { storeKey } from "@/vars";

const confirm = useConfirm();

const nsfw = ref(false);
const isAdult = ref(false);

watch(nsfw, (value) => {
  if (value && !isAdult.value) {
    confirm.require({
      header: "Confirm your age",
      message: "I am over 18 years old.",
      icon: "pi pi-user",
      rejectProps: {
        label: "No",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "Yes",
        severity: "primary",
      },
      reject: () => {
        nsfw.value = false;
      },
      onHide: () => {
        nsfw.value = false;
      },
      accept: () => {
        isAdult.value = true;
        localStorage.setItem(storeKey.adult, isAdult.value.toString());
        localStorage.setItem(storeKey.nsfw, value.toString());
      },
    });
  } else if (value) {
    localStorage.setItem(storeKey.nsfw, value.toString());
  } else {
    localStorage.removeItem(storeKey.nsfw);
  }
});

nsfw.value = localStorage.getItem(storeKey.nsfw) === "true";
isAdult.value = localStorage.getItem(storeKey.adult) === "true";
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading" class="text-center">Negotiate your relationships</h1>
    <div class="flex flex-col gap-6 my-6 justify-center">
      <Button
        as="RouterLink"
        to="/choose"
        label="Start a Discussion"
        data-umami-event="View questionnaire list"
        :data-umami-event-nsfw="nsfw"
      />
      <div class="flex flex-col gap-2">
        <span class="text-center">Show NSFW content</span>
        <span class="flex justify-center gap-2">
          <span :class="{ 'text-muted': nsfw }">Safe</span>
          <ToggleSwitch v-model="nsfw" />
          <span :class="{ 'text-muted': !nsfw }">NSFW</span>
        </span>
      </div>
    </div>
    <div class="text-justify max-w-3xl">
      <p>
        This is a tool for negotiating relationships. Each of you will pick and choose what you want
        out of your relationship from a menu of options, and once you're both done, you can compare
        answers to see if you're on the same page or not.
      </p>
      <p>
        This tool isn't just for romantic relationships! Use it with your friends, platonic
        partners, play partners, or anyone else you want to build a healthier relationship with.
      </p>
      <p>
        You'll often see this exercise referred to as the "relationship smorgasbord," referring to
        the way you can pick and choose what you want from a buffet of options. The concept is often
        associated with relationship anarchy.
      </p>
    </div>
    <p class="flex gap-2 text-center mt-4">
      <RouterLink to="/contact">Contact</RouterLink>
      <span>•</span>
      <RouterLink to="/tips">Tip Jar</RouterLink>
      <span>•</span>
      <a href="https://github.com/justlark/discuss.love" target="_blank">GitHub</a>
    </p>
  </main>
</template>

<style scoped></style>
