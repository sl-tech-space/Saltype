import { useUserInfo } from "../common/useUserInfo";

/**
 * ユーザ設定、ユーザ管理画面の共通関数
 * @returns
 */
export function useUser() {
  const config = useRuntimeConfig();
  const { user, waitForUser } = useUserInfo();
  const message = ref("");
  const userInfo = ref();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * ユーザ情報を更新
   * @param userId 必須
   * @param userName 任意
   * @param email 任意
   * @param password 任意
   * @returns message
   */
  const updateUserInfo = async (userId: string, userName?: string, email?: string, password?: string): Promise<string> => {
    try {
      const response = await fetch(
        `${config.public.baseURL}/api/django/user/update/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            username: userName,
            email: email,
            password: password,
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        message.value = "保存に失敗しました。";
      }

      message.value = "保存に成功しました。"
    } catch (e) {
      message.value = "保存に失敗しました。"
    } finally {
      return message.value;
    }
  }

  const checkAdminPermission = async (userId: string) => {
    try {
      await waitForUser();

      if (!user.value) {
        error.value = "ユーザ情報が存在しません";
        return;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/django/mistype/topmistypes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value.user_id,
            limit: limit,
            action: "get_top_mistypes",
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        error.value = "ミスタイプ頻度の取得に失敗しました";
        return;
      }

      const data = await response.json();
    } catch (e) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    }
  };

  return {
    updateUserInfo,
    userInfo,
    isLoading,
    error,
  };
}
