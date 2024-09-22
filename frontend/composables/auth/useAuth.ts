import { useRouter } from "vue-router";
import { useToken } from "./useToken";
import { useSession } from "../server/useSession";

/**
 * ローカルストレージのトークンを使った自動認証処理
 * @returns authToken
 */
export function useAuthToken() {
  const config = useRuntimeConfig();
  const { getToken, isTokenAvailable } = useToken();
  const { saveSession } = useSession();
  const router = useRouter();

  const authToken = async () => {
    try {
      if (isTokenAvailable()) {
        const token = await getToken();
        const response = await fetch(
          `${config.public.baseURL}/api/auth-token/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token,
            }),
            signal: AbortSignal.timeout(5000),
          }
        );

        if (response.ok) {
          const data = await response.json();
          saveSession(data);

          router.push({ name: "home" });
        }
      }
    } catch (error) {
      console.error(
        "ネットワークエラーまたはその他の例外が発生しました:",
        error
      );
    }
  };

  return {
    authToken,
  };
}
