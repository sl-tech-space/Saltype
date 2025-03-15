import { useUserInfo } from "../common/useUserInfo";

/**
 * ログイン時のトークン認証処理
 * @returns authToken
 */
export function useAuthToken() {
  const { setUser, clearUser } = useUserInfo();
  const config = useRuntimeConfig();

  const authToken = async (): Promise<void> => {
    if (!useCookie("auth_token").value) {
      clearUser();
      return;
    }

    try {
      const response = await fetch(
        `${config.public.baseURL}/api/django/authentication/auth-token/`,
        {
          headers: {
            Authorization: `Token ${useCookie("auth_token").value}`,
          },
        }
      );

      if (!response.ok) {
        useCookie("auth_token").value = null;
        return;
      }

      const userData = await response.json();
      setUser(userData);

      await navigateTo({ name: "home" });
    } catch {
      useCookie("auth_token").value = null;
      clearUser();
    }
  };

  return {
    authToken,
  };
}
