<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main>
    <h1 class="site-title">Negotiate your relationships</h1>
    <RouterLink to="/start" class="start-button nav-link">Start a discussion</RouterLink>
    <p class="warning">🚧 This site is under construction 🚧</p>
    <p>
      This is a tool for negotiating relationships. Each of you pick and choose what you want out of
      your relationship from a menu of options, and once you're both done, you can compare answers
      to see if you're on the same page or not.
    </p>
    <p>
      The purpose of this tool is to start a discussion, not to replace one! Once you compare
      answers, take the time to ask each other clarifying questions.
    </p>
    <p>
      You'll only see the answers that you agree on. If one of you selects "No" to a particular
      question, you won't see how the other person responded. Don't be afraid to say "Yes" to
      something just because you're worried the other person will say "No"!
    </p>
    <p>
      This tool isn't just for romantic relationships! Use it with your friends, your platonic
      partners, your play partners, or anyone else you want to build a healthier relationship with.
    </p>
    <p>
      You'll often see this exercise referred to as the "relationship smorgasbord," referring to the
      way you can pick and choose what you want from a buffet of options. The concept comes from the
      <a
        href="https://theanarchistlibrary.org/library/andie-nordgren-the-short-instructional-manifesto-for-relationship-anarchy"
        target="_blank"
        >relationship anarchy</a
      >
      community.
    </p>
  </main>
</template>

<style scoped>
.warning {
  display: block;
  text-align: center;
}

.site-title {
  display: block;
  text-align: center;
}

.start-button {
  display: block;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

p {
  text-align: justify;
}
</style>
