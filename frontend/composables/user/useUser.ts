import { useUserInfo } from "../common/useUserInfo";

/**
 * ユーザ設定、ユーザ管理画面の共通関数
 * @returns
 */
export function useUser() {
  const config = useRuntimeConfig();
  const { user } = useUserInfo();
  const userInfo = ref();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * ストアの情報からユーザ情報をすべて取得
   * getAllUserInfo, isLoading, error,
   * @returns getAllUserInfo, userInfo, isLoading, error,
   */
  const getAllUserInfo = async () => {
    isLoading.value = true;

    try {
      if (!user.value) {
        throw new Error("ユーザ情報が存在しません");
      }

      const response = await fetch(
        `${config.public.baseURL}/api/django/user/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        error.value = errorData.error;
        return;
      }

      userInfo.value = await response.json();
    } catch (e) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    getAllUserInfo,
    userInfo,
    isLoading,
    error,
  };
}
