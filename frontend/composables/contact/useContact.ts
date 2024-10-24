import { useUser } from "../conf/useUser";

export function useContact() {
  const config = useRuntimeConfig();
  const { user } = useUser();
  const isLoading = ref(false);
  const message = ref("");

  const sendContentToServer = async (content: string): Promise<string> => {
    isLoading.value = true;

    try {
      if (!user.value) {
        message.value = "ユーザ情報が存在しません";
        return message.value;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/django/request/submit/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value.user_id,
            request_content: content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("要望の送信に失敗しました");
      }

      message.value = "送信成功";
    } catch (e) {
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
