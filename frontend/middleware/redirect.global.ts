export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();

  if (to.path === "/") {
    return navigateTo({ name: "login" });
  }

  if (to.path === "/user/admin") {
    const authToken = useCookie("auth_token").value;

    if (authToken) {
      try {
        const authValidationResponse = await fetch(
          `${config.public.baseURL}/api/django/authentication/auth-token/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );

        if (!authValidationResponse.ok) {
          throw new Error("Invalid authentication token");
        }

        const authenticatedUser = await authValidationResponse.json();

        const adminCheckResponse = await fetch(
          "/api/nuxt/check-admin-permission/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: authenticatedUser.user_id,
            }),
            signal: AbortSignal.timeout(5000),
          }
        );

        if (!adminCheckResponse.ok) {
          throw new Error("Failed to check admin permissions");
        }

        const adminCheckResult = await adminCheckResponse.json();
        const isAdminUser = adminCheckResult.isAdmin;

        if (!isAdminUser) {
          return navigateTo({ name: "home" });
        }
      } catch (error) {
        useCookie("auth_token").value = null;
        return navigateTo({ name: "login" });
      }
    }
  }
});
