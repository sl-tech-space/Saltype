import { useRouter } from "vue-router";
import { useUser } from "~/composables/user/useUser";

export default defineNuxtRouteMiddleware(async (to) => {
  const router = useRouter();
  const { checkAdminPermission, isAdmin } = useUser();

  if (to.path === "/") {
    router.push({ name: "login" });
  }

  if (to.path === '/user/admin') {
    await checkAdminPermission(); // 権限チェック
    if (!isAdmin.value) {
      return navigateTo('/home');
    }
  }
});
