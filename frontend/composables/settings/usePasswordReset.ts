/**
 * パスワード再設定処理
 */
export function usePasswordReset() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const successNotification = ref<{ message: string; content: string } | null>(
    null
  );

  /**
   * パスワード再設定のリクエストを送信する
   * @param email パスワード再設定のメールアドレス
   * @returns 成功の通知
   */
  const requestResetPassword = async (email: string): Promise<void> => {
    isLoading.value = true;
    successNotification.value = null;
    error.value = null;

    try {
      const { error: fetchError } = await useFetch(
        `${config.public.baseURL}/api/django/user/password_reset/`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "リクエストエラー");
      }

      // 成功時の通知用オブジェクトをセット
      successNotification.value = {
        message: "成功",
        content: `パスワード再設定のリンクをお送りしました。<br>メールを確認してください。<br>${email}`,
      };
    } catch {
      successNotification.value = {
        message: "成功",
        content: `パスワード再設定のリンクをお送りしました。<br>メールを確認してください。<br>${email}`,
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * トークンの有効性を確認する
   * @param token パスワード再設定のトークン
   * @returns トークンの有効性
   */
  const tokenIsValid = async (token: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    if (!token) {
      return false;
    }

    try {
      const { error: fetchError } = await useFetch(
        `${config.public.baseURL}/api/django/authentication/auth-token/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (fetchError.value) {
        throw new Error(fetchError.value.message || "リクエストエラー");
      }

      return true;
    } catch {
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    requestResetPassword,
    tokenIsValid,
    isLoading,
    error,
    successNotification,
  };
}
