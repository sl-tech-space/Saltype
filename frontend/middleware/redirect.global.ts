import { useUser } from "~/composables/user/useUser";

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();

  if (to.path === "/") {
    return navigateTo({ name: "login" });
  }

  if (to.path === "/user/admin") {
    const token = useCookie("auth_token").value;

    if (token) {
      try {
        const djangoResponse = await fetch(
          `${config.public.baseURL}/api/django/authentication/auth-token/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!djangoResponse.ok) {
          throw new Error("Invalid token");
        }

        const user = await djangoResponse.json();

        const nuxtResponse = await fetch("/api/nuxt/check-admin-permission/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (!nuxtResponse.ok) {
          throw new Error("Invalid token");
        }

        const data = await nuxtResponse.json();
        const isAdmin = data.isAdmin;

        if (!isAdmin) {
          return navigateTo({ name: "home" });
        }
      } catch (e) {
        useCookie("auth_token").value = null;
        return navigateTo({ name: "login" });
      }
    }
  }
});
