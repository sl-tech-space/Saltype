import { useUser } from "~/composables/conf/useUser";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const { setUser, clearUser } = useUser();

  const initAuth = async () => {
    const token = useCookie("auth_token").value;

    if (token) {
      try {
        const response = await fetch(
          `${config.public.baseURL}/api/django/authentication/auth-token/`,
          {
            headers: {
              Authorization: `Token ${token}`,
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
      } catch (e) {
        useCookie("auth_token").value = null;
        clearUser();
        try {
          await router.push({ name: "login" });
        } catch (e) {
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
