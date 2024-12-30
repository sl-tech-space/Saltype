import { useAuthToken } from "./useAuthToken";
import { useUserInfo } from "../common/useUserInfo";

/**
 * オリジナルフォームログイン処理
 * @returns login, checkAdminPermission
 * isLoading, isAdmin, error
 */
export function useLogin() {
  const { authToken } = useAuthToken();
  const { user } = useUserInfo();
  const config = useRuntimeConfig();
  const router = useRouter();
  const isLoading = ref(false);
  const isAdmin = ref(false);
  const error = ref<string | null>(null);

  /**
   * ログイン処理
   * @param email
   * @param password
   */
  const login = async (email: string, password: string): Promise<void> => {
    isLoading.value = true;

    try {
      const response = await fetch(
        `${config.public.baseURL}/api/django/authentication/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        error.value = errorData.details?.non_field_errors?.[0] || "ログインに失敗しました。";
        return;
      }

      const data = await response.json();

      if (!data.token) {
        error.value = "トークンが発行されませんでした。";
        return;
      }

      useCookie("auth_token").value = data.token;
      await nextTick();

      await authToken();

      await router.push({ name: "home" });
    } catch (e) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 管理者権限があるかどうか確認
   */
  const checkAdminPermission = async () => {
    try {
      if (!user.value) {
        error.value = "ユーザ情報が存在しません。";
        return;
      }

      const response = await fetch("/api/nuxt/check-admin-permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.value.user_id,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        error.value = "権限チェックエラーが発生しました。";
        return;
      }

      isAdmin.value = true;
    } catch (e) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    }
  };

  return {
    login,
    checkAdminPermission,
    isLoading,
    isAdmin,
    error,
  };
}
