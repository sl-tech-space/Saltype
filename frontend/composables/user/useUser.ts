import { useUserInfo } from "../common/useUserInfo";

/**
 * ユーザ設定、ユーザ管理画面の共通関数
 * @returns
 */
export function useUser() {
  const config = useRuntimeConfig();
  const { user, waitForUser } = useUserInfo();
  const message = ref("");
  const userInfo = ref();
  const isAdmin = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * ユーザ情報を更新
   * @param userId 必須
   * @param userName 任意
   * @param email 任意
   * @param password 任意
   * @returns message
   */
  const updateUserInfo = async ({
    userId,
    userName,
    email,
    password,
    newPassword,
    googleLoginFlg,
  }: {
    userId: string;
    userName?: string;
    email?: string;
    password?: string;
    newPassword?: string;
    googleLoginFlg?: boolean;
  }): Promise<string> => {
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
            ...(userName && { username: userName }),
            ...(email && { email }),
            ...(password && { password }),
            ...(newPassword && { new_password: newPassword }),
            ...(googleLoginFlg && { google_login: googleLoginFlg }),
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        message.value = "保存に失敗しました。";
      } else {
        message.value = "保存に成功しました。";
      }
    } catch (e) {
      message.value = "保存に失敗しました。";
    } finally {
      return message.value;
    }
  };

  /**
   * ログイン中ユーザの権限をチェックする
   * @param force キャッシュを無視して強制的にチェックする
   */
  const checkAdminPermission = async (
    force: boolean = false
  ): Promise<void> => {
    isLoading.value = true;
    try {
      await waitForUser();

      if (!user.value) {
        error.value = "ユーザ情報が存在しません";
        return;
      }

      const cachedPermission = localStorage.getItem(
        `admin_permission_${user.value.user_id}`
      );

      if (cachedPermission && !force) {
        isAdmin.value = JSON.parse(cachedPermission);
        return;
      }

      const response = await fetch("/api/nuxt/check-admin-permission/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.value.user_id,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        error.value = "ミスタイプ頻度の取得に失敗しました";
        return;
      }

      const data = await response.json();
      isAdmin.value = data.isAdmin;

      localStorage.setItem(
        `admin_permission_${user.value.user_id}`,
        JSON.stringify(data.isAdmin)
      );
    } catch (e) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    updateUserInfo,
    checkAdminPermission,
    userInfo,
    isAdmin,
    isLoading,
    error,
  };
}
