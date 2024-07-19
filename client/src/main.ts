import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { definePreset, palette } from "@primevue/themes";
import ToastService from "primevue/toastservice";

const app = createApp(App);

const preset = definePreset(Aura, {
  semantic: {
    primary: palette("#63e2b7"),
  },
});

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset,
  },
});
app.use(ToastService);

app.mount("#app");
