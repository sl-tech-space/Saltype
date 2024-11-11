import { useColorStore } from "~/store/colorStore";

export default defineNuxtPlugin(() => {
  const { loadColors } = useColorStore();
  loadColors();
});
