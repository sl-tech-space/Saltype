import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToken } from "./useToken";
import { useRuntimeConfig } from "nuxt/app";
import { useCrypto } from "../conf/useCrypto";

export async function useLogin() {
  const config = useRuntimeConfig();
  const { getToken, saveToken } = useToken();
  const router = useRouter();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  //オリジナルフォームログイン処理
  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${config.public.baseURL}/api/login/`, {
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

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          saveToken(data.token);
          await saveSessionOnServer(data);
          router.push({ name: "home" });
        } else {
          error.value = "トークンが発行されませんでした";
        }
      } else {
        const errorData = await response.json();
        error.value = errorData.message || "ログインに失敗しました。";
      }
    } catch (err) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
      console.error(err); // TODO: Remove in production
    } finally {
      isLoading.value = false;
    }
  };

  //Nodeサーバサイドセッション保存処理
  const saveSessionOnServer = async (userData: any) => {
    try {
      const response = await fetch('/api/session/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          email: userData.email,
          username: userData.username
        }),
      });

      if (!response.ok) {
        console.error('セッションの保存に失敗しました');
      }
    } catch (err) {
      console.error('セッションの保存中にエラーが発生しました', err);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}
