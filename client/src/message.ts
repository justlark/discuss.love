import { useMessage as useMessageInaccessible } from "naive-ui";
import { h } from "vue";

// The purpose of this wrapper is to work around the fact that Naive UI message
// toasts don't properly set `role="alert"` or `aria-live` on the message
// popups, making them invisible to screen readers, which is unacceptable.

export const useMessage = () => {
  const inaccessibleMessage = useMessageInaccessible();

  return {
    info(message: string) {
      inaccessibleMessage.success(() => h("span", { role: "alert" }, message));
    },
    error(message: string) {
      inaccessibleMessage.error(() =>
        h("span", { role: "alert" }, [h("span", { class: "visually-hidden" }, "Error: "), message]),
      );
    },
  };
};
