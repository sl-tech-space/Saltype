import { useRuntimeConfig } from "nuxt/app";
import { useAuthToken } from "./useAuthToken";
import type { GoogleUserInfo } from "~/types/user.d";

/**
 * Google認証処理
 * @returns user, error, loginWithGoogle
 */
export const useGoogleAuth = () => {
  const { authToken } = useAuthToken();
  const config = useRuntimeConfig();
  const user = ref<GoogleUserInfo | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Google認証処理
   */
  const loginWithGoogle = async (): Promise<void> => {
    try {
      isLoading.value = true;
      const google = (window as any).google;
      if (!google) throw new Error("Google Identity Services not loaded");

      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.public.googleClientId,
        scope:
          "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        callback: async (response: any) => {
          if (!response.access_token) {
            error.value = "ユーザ情報が存在しません。";
          }

          const userInfo = await $fetch<GoogleUserInfo>(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${response.access_token}` },
            }
          );

          if (userInfo) {
            const response = await fetch(
              `${config.public.baseURL}/api/django/authentication/google-auth/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: userInfo.name,
                  email: userInfo.email,
                }),
              }
            );

            if (!response.ok) {
              error.value = "認証に失敗しました。";
            }

            const data = await response.json();

            if (!data.token) {
              error.value = "トークンが存在しません。";
            }

            useCookie("auth_token").value = data.token;
            await nextTick();

            await authToken();
          }
        },
      });
      client.requestAccessToken();
    } catch {
      error.value = "ログインに失敗しました。";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    error,
    isLoading,
    loginWithGoogle,
  };
};
