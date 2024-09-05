import { useRouter } from "vue-router";
import { getToken, isTokenAvailable } from "~/composables/auth/useToken";
import { useRuntimeConfig } from 'nuxt/app'

export function useAuthToken() {
  const config = useRuntimeConfig()
  const router = useRouter();

  const authToken = async () => {
    try {
      if (isTokenAvailable() && await getToken()) {
        const token = await getToken();
        const response = await fetch(`${config.public.baseURL}/api/auth-token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          const data = await response.json();//TODO test
          console.log(data.username);//TODO test
          alert("テスト：" + data.username + "で自動ログイン");//TODO test
          router.push({ name: "home" });
        } else {
          const errorData = await response.json();//TODO test
          console.error("Error:", errorData.userName);//TODO test
          console.log("ログインに失敗しました。");//TODO test
        }
      }
    } catch (error) {
      console.error("ネットワークエラーまたはその他の例外が発生しました:", error);
    }
  };

  return {
    authToken
  };
}