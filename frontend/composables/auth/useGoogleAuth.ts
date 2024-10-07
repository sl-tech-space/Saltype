import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "nuxt/app";
import { useUser } from "../conf/useUser";

interface GoogleUserInfo {
  email: string;
  name: string;
}

/**
 * Google認証処理
 * @returns user, error, loginWithGoogle
 */
export const useGoogleAuth = () => {
  const config = useRuntimeConfig();
  const user = ref<GoogleUserInfo | null>(null);
  const router = useRouter();
  const error = ref<Error | null>(null);
  const { setUser } = useUser();

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const google = (window as any).google;
      if (!google) throw new Error("Google Identity Services not loaded");

      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.public.googleClientId,
        scope:
          "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        callback: async (response: any) => {
          if (response.access_token) {
            const userInfo = await $fetch<GoogleUserInfo>(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: { Authorization: `Bearer ${response.access_token}` },
              }
            );

            if (userInfo) {
              const response = await fetch(
                `${config.public.baseURL}/api/google-auth/`,
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
                console.log(response.json)
                throw new Error("認証に失敗");
              }

              const data = await response.json();

              if (!data.token) {
                throw new Error("トークンが存在しません");
              }

              useCookie("auth_token").value = data.token;
              router.push({ name: "home" });
            } else {
              throw new Error("ユーザ情報が存在しません");
            }
          }
        },
      });

      client.requestAccessToken();
    } catch (err) {
      error.value =
        err instanceof Error ? err : new Error("ログインに失敗しました");
    }
  };

  return {
    user,
    error,
    loginWithGoogle,
  };
};
