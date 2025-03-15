import { useUserInfo } from "../common/useUserInfo";

/**
 * 要望画面処理
 * @returns isLoading, sendContentToServer
 */
export function useContact() {
  const config = useRuntimeConfig();
  const { user } = useUserInfo();
  const isLoading = ref(false);
  const message = ref("");

  /**
   * サーバーに要望内容を送信
   * @param content
   * @returns message.value
   */
  const sendContentToServer = async (content: string): Promise<string> => {
    isLoading.value = true;

    try {
      if (!user.value) {
        message.value = "ユーザ情報が存在しません";
        return message.value;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/django/contact/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value.user_id,
            request_content: content.trim(),
          }),
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!response.ok) {
        message.value = "要望の送信に失敗しました。";
      }

      message.value = "送信成功";
    } catch {
      message.value = "送信失敗";
    } finally {
      isLoading.value = false;
      return message.value;
    }
  };

  return {
    isLoading,
    sendContentToServer,
  };
}
