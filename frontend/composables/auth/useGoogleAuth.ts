import { useRuntimeConfig } from "nuxt/app";
import { useAuthToken } from "./useAuthToken";

interface GoogleUserInfo {
  email: string;
  name: string;
}

/**
 * Google認証処理
 * @returns user, error, loginWithGoogle
 */
export const useGoogleAuth = () => {
  const { authToken } = useAuthToken();
  const config = useRuntimeConfig();
  const user = ref<GoogleUserInfo | null>(null);
  const error = ref<Error | null>(null);

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const google = (window as any).google;
      if (!google) throw new Error("Google Identity Services not loaded");

      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.public.googleClientId,
        scope:
          "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        callback: async (response: any) => {
          if (!response.access_token) {
            throw new Error("ユーザ情報が存在しません");
          }

          const userInfo = await $fetch<GoogleUserInfo>(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${response.access_token}` },
            }
          );

          if (userInfo) {
            const response = await fetch(
              `${config.public.baseURL}/api/django/google-auth/`,
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
              throw new Error("認証に失敗");
            }

            const data = await response.json();

            if (!data.token) {
              throw new Error("トークンが存在しません");
            }

            useCookie("auth_token").value = data.token;
            await nextTick();

            await authToken();
          }
        },
      });
      client.requestAccessToken();
    } catch (e) {
      error.value =
        e instanceof Error ? e : new Error("ログインに失敗しました");
    }
  };

  return {
    user,
    error,
    loginWithGoogle,
  };
};
