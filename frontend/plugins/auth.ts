import { useUser } from "~/composables/conf/useUser";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const app = nuxtApp.vueApp;
  const { setUser, clearUser } = useUser();

  await nuxtApp.hooks.callHook('app:created', app);

  const token = useCookie("auth_token").value;
  if (token) {
    try {
      const response = await fetch(`${config.public.baseURL}/api/auth-token/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        useCookie("auth_token").value = null;
        clearUser();
        await router.push({ name: "login" });
      }

      const userData = await response.json();
      setUser(userData);
      
      if (router.currentRoute.value.path === "/login") {
        await router.push({ name: "home" });
      }
    } catch (error) {
      console.error("トークン検証エラー:", error);
      useCookie("auth_token").value = null;
      clearUser();
    }
  }
});
