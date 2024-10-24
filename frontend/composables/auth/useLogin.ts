import { useAuthToken } from "./useAuthToken";

/**
 * オリジナルフォームログイン処理
 * @returns login, isLoading, error
 */
export function useLogin() {
  const { authToken } = useAuthToken();
  const config = useRuntimeConfig();
  const router = useRouter();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${config.public.baseURL}/api/django/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        const errorData = await response.json();
        error.value = errorData.message || "ログインに失敗しました。";
        return;
      }

      const data = await response.json();

      if (!data.token) {
        error.value = "トークンが発行されませんでした";
        return;
      }

      useCookie("auth_token").value = data.token;
      await nextTick();

      await authToken();

      router.push({ name: "home" });
    } catch (e) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}
