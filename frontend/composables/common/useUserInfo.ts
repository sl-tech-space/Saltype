import type { UserData } from "~/types/user";

/**
 * ユーザ情報を取り扱う
 * ストアで管理を行う
 * @returns user, setUser, clearUser, waitForUser
 */
export function useUserInfo() {
  /**
   * ユーザ定義
   */
  const user = useState<UserData | null>("user", () => null);

  /**
   * ユーザ情報をセット
   * @param userData
   */
  const setUser = (userData: UserData): void => {
    user.value = userData;
  };

  /**
   * ユーザ情報を空にする
   */
  const clearUser = (): void => {
    user.value = null;
  };

  /**
   * ユーザ情報が利用可能になるまで待機する関数
   * 最大10秒まで待機し、それを過ぎるとタイムアウトとして処理を中断
   */
  const waitForUser = async (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new Error("ユーザ情報の取得に失敗しました。タイムアウトしました。")
        );
      }, 10000); // 10秒間のタイムアウト

      // user.value が利用可能になるまで監視
      const interval = setInterval(() => {
        if (user.value) {
          clearInterval(interval);
          clearTimeout(timeout);
          resolve();
        }
      }, 100);
    });
  };

  return {
    user,
    setUser,
    clearUser,
    waitForUser,
  };
}
