import { useUserInfo } from "../common/useUserInfo";

/**
 * ログアウト処理
 * ローカルストレージのトークン、サーバセッションを削除
 * @returns logout
 */
export async function useLogout() {
  const { clearUser } = useUserInfo();

  /**
   * ログアウト処理
   */
  const logout = async (): Promise<void> => {
    try {
      useCookie("auth_token").value = null;
      clearUser();

      await navigateTo({
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
