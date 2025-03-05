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
  const errorNotification = ref<{ message: string; content: string } | null>(
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
      await $fetch(`${config.public.baseURL}/api/django/user/password_reset/`, {
        method: "POST",
        body: { email },
      });

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
   * パスワード再設定を実行する
   * @param token パスワード再設定のトークン
   * @param newPassword 新しいパスワード
   * @returns パスワード再設定の通知
   */
  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(
        `${config.public.baseURL}/api/django/user/password_reset_confirm/`,
        {
          method: "POST",
          body: { token, new_password: newPassword },
        }
      );

      successNotification.value = {
        message: "成功",
        content: `パスワードを再設定しました。<br>新しいパスワード：${newPassword.length}桁`,
      };
    } catch {
      errorNotification.value = {
        message: "失敗",
        content: "パスワード再設定に失敗しました。",
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
      await $fetch(`${config.public.baseURL}/api/django/user/validate_token/`, {
        method: "POST",
        body: { token },
      });
      return true;
    } catch {
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    requestResetPassword,
    resetPassword,
    tokenIsValid,
    isLoading,
    error,
    successNotification,
    errorNotification,
  };
}
