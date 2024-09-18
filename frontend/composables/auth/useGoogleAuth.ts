import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "nuxt/app";
import { useSession } from "../server/useSession";

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
  const { saveSession, getSession } = useSession();
  const user = ref<GoogleUserInfo | null>(null);
  const router = useRouter();
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
          if (response.access_token) {
            const userInfo = await $fetch<GoogleUserInfo>(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: { Authorization: `Bearer ${response.access_token}` },
              }
            );

            if (userInfo) {
              console.log("User Info:", userInfo);

              const data = await $fetch(
                `${config.public.baseURL}/api/google-auth/`,
                {
                  lazy: true,
                  method: "POST",
                  body: {
                    username: userInfo.name,
                    email: userInfo.email,
                  },
                }
              );

              saveSession(data);

              user.value = data as GoogleUserInfo;

              router.push({ name: "home" });
            } else {
              throw new Error("User info is null");
            }
          }
        },
      });

      client.requestAccessToken();
    } catch (err) {
      console.error("Google login error:", err);
      error.value =
        err instanceof Error ? err : new Error("An unknown error occurred");
    }
  };

  return {
    user,
    error,
    loginWithGoogle,
  };
};
