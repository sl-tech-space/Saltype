import { useRouter } from "vue-router";

export default defineNuxtRouteMiddleware((to) => {
  const router = useRouter();
  if (to.path === "/") {
    router.push({ name: "login" });
  }
});
