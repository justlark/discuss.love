<script setup lang="ts">
import {
  NConfigProvider,
  NGlobalStyle,
  NDialogProvider,
  darkTheme,
  useOsTheme,
  type GlobalThemeOverrides,
  NMessageProvider,
} from "naive-ui";
import { computed } from "vue";
import TopNav from "@/components/TopNav.vue";

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
    <n-dialog-provider>
      <n-message-provider placement="bottom">
        <TopNav />
        <n-global-style />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped></style>
