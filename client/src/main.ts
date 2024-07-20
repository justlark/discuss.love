import "./assets/main.css";
import "primeicons/primeicons.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);

const preset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          color: "{indigo.600}",
          hoverColor: "{indigo.500}",
          activeColor: "{indigo.400}",
        },
      },
      dark: {
        primary: {
          color: "{teal.200}",
          hoverColor: "{teal.300}",
          activeColor: "{teal.400}",
        },
      },
    },
  },
});

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset,
  },
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount("#app");
