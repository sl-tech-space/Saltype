import { useUserInfo } from "~/composables/common/useUserInfo";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const { setUser, clearUser } = useUserInfo();

  const initAuth = async () => {
    const authToken = useCookie("auth_token").value;

    if (authToken) {
      try {
        const response = await fetch(
          `${config.public.baseURL}/api/django/authentication/auth-token/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        const userData = await response.json();
        setUser(userData);

        if (router.currentRoute.value.path === "/login") {
          await router.push({ name: "home" });
        }
      } catch {
        useCookie("auth_token").value = null;
        clearUser();
        try {
          await router.push({ name: "login" });
        } catch {
          throw new Error("ルーティングエラー");
        }
      }
    }
  };

  nuxtApp.hooks.hook("app:mounted", async () => {
    initAuth().catch(() => {});
  });

  return {
    provide: {
      initAuth,
    },
  };
});
