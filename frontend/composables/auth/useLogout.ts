import { useRouter } from "vue-router";
import { useUserInfo } from "../conf/useUserInfo";

/**
 * ログアウト処理
 * ローカルストレージのトークン、サーバセッションを削除
 * @returns logout
 */
export async function useLogout() {
  const router = useRouter();
  const { clearUser } = useUserInfo();

  /**
   * ログアウト処理
   */
  const logout = async (): Promise<void> => {
    try {
      useCookie("auth_token").value = null;
      clearUser();

      await router.push({
        path: "/login",
        query: { reason: "logout" },
      });
    } catch (e) {
      alert("ログアウトに失敗：管理者に連絡してください");
    }
  };

  return {
    logout,
  };
}
