import { useUserInfo } from "../common/useUserInfo";

/**
 * ユーザ設定、ユーザ管理画面の共通関数
 * @returns
 */
export function useUser() {
  const config = useRuntimeConfig();
  const { user } = useUserInfo();
  const message = ref("");
  const userInfo = ref();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const updateUserInfo = async (userId: string, userName?: string, password?: string, email?: string): Promise<string> => {
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

  return {
    updateUserInfo,
    userInfo,
    isLoading,
    error,
  };
}
