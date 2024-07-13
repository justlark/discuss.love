<script setup lang="ts">
import {
  NConfigProvider,
  NThemeEditor,
  NGlobalStyle,
  darkTheme,
  useOsTheme,
  type GlobalThemeOverrides,
  NMessageProvider,
} from "naive-ui";
import { computed, ref } from "vue";
import TopNav from "@/components/TopNav.vue";

const isDev = ref(import.meta.env.DEV);

const themeRef = useOsTheme();
const theme = computed(() => {
  return themeRef.value === "dark" ? darkTheme : undefined;
});

const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontSize: "12pt",
    fontSizeMini: "8pt",
    fontSizeTiny: "10pt",
    fontSizeSmall: "10pt",
    fontSizeMedium: "12pt",
    fontSizeLarge: "14pt",
    fontSizeHuge: "16pt",
  },
};
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider placement="bottom">
      <n-theme-editor v-if="isDev">
        <TopNav />
        <n-global-style />
      </n-theme-editor>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>
