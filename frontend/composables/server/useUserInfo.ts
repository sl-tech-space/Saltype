import { useUser } from "../conf/useUser";

export function useUserInfo() {
  const { user } = useUser();

  /**
   * ユーザ情報が利用可能になるまで待機する関数
   */
  const waitForUser = async () => {
    return new Promise<void>((resolve) => {
      // user.value が利用可能になるまで監視
      const interval = setInterval(() => {
        if (user.value) {
          clearInterval(interval);
          resolve(); // ユーザ情報が取得できたら解決
        }
      }, 100);
    });
  };

  return {
    waitForUser,
  };
}
