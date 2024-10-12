import { useUser } from "../conf/useUser";

export function useAuthToken() {
  const { setUser, clearUser } = useUser();
  const config = useRuntimeConfig();
  const router = useRouter();

  const authToken = async () => {

    if (!useCookie("auth_token").value) {
      clearUser();
      return;
    }

    try {
      const response = await fetch(`${config.public.baseURL}/api/auth-token/`, {
        headers: {
          Authorization: `Token ${useCookie("auth_token").value}`,
        },
      });

      if (!response.ok) {
        useCookie("auth_token").value = null;
        return;
      }

      const userData = await response.json();
      setUser(userData);

      router.push({ name: "home" });
    } catch (e) {
      console.error("トークン検証エラー:");
      useCookie("auth_token").value = null;
      clearUser();
    }
  };

  return {
    authToken,
  };
}
