import { useSession } from "../server/useSession";

export function useContact() {
  const config = useRuntimeConfig();
  const { getSession } = useSession();
  const isLoading = ref(false);
  const message = ref('');
  
  const sendContentToServer = async (content: string): Promise<string> => {
    isLoading.value = true;

    try {
      const userSession = await getSession();
      const user = userSession?.value;

      if (!user || !user.user_id) {
        console.error("セッション情報が存在しません");
        message.value = "送信失敗:セッション無効"
        return message.value;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/request/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
            request_content: content
          }),
        }
      );

      if (!response.ok) {
        throw new Error("要望の送信に失敗しました");
      }

      message.value = "送信成功"
    } catch (error) {
      message.value = "送信失敗"
    } finally {
        isLoading.value = false;
        return message.value;
    }
  };

  return {
    isLoading,
    sendContentToServer
  }
}
