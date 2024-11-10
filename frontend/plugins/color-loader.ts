import { loadColors } from "~/store/colorStore";

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    loadColors();
  }
});
