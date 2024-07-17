<script setup lang="ts">
import { NButton } from "naive-ui";
import { useRouter } from "vue-router";
import NavLink from "@/components/NavLink.vue";

const router = useRouter();

const navigateStart = () => {
  router.push("/start");
};
</script>

<template>
  <main aria-labelledby="main-heading">
    <h1 id="main-heading" class="site-title">Negotiate your relationships</h1>
    <n-button @click="navigateStart" type="primary" class="start-button"
      >Start a Discussion</n-button
    >
    <div class="body">
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
    <p class="callout-link">
      <nav-link to="https://github.com/justlark/discuss.love" target="_blank">GitHub</nav-link>
    </p>
  </main>
</template>

<style scoped>
.site-title {
  display: block;
  text-align: center;
}

.start-button {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.callout-link {
  text-align: center;
  margin-top: 2rem;
}

.body {
  text-align: justify;
  max-width: 50rem;
}
</style>
