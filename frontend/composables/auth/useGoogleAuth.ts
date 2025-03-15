import { useRuntimeConfig } from "nuxt/app";
import { useAuthToken } from "./useAuthToken";
import type { GoogleUserInfo } from "~/types/user.d";

/**
 * Google認証処理
 * @returns user, error, isLoading, loginWithGoogle
 */
export const useGoogleAuth = () => {
  const { authToken } = useAuthToken();
  const config = useRuntimeConfig();
  const user = ref<GoogleUserInfo | null>(null);
  const isLoading = useState("googleAuthLoading", () => false);
  const error = ref<string | null>(null);

  // ウィンドウのフォーカス監視を設定
  if (process.client) {
    window.addEventListener("focus", () => {
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
    });
  }

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
          try {
            // ユーザーがキャンセルした場合
            if (!response || !response.access_token) {
              isLoading.value = false;
              error.value = "ユーザ情報が存在しません。";
              return;
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
                return;
              }

              const data = await response.json();

              if (!data.token) {
                error.value = "トークンが存在しません。";
                return;
              }

              useCookie("auth_token").value = data.token;
              await nextTick();
              await authToken();
            }
          } catch (e) {
            error.value = "ログインに失敗しました。";
          } finally {
            isLoading.value = false;
          }
        },
      });

      // キャンセルイベントのハンドリングを追加
      client.canceled_callback = () => {
        isLoading.value = false;
      };

      client.requestAccessToken();
    } catch (e) {
      error.value = "ログインに失敗しました。";
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
