import { ref } from "vue";

interface User {
  user_id: string;
  email: string;
  username: string;
}

/**
 * Nodeサーバサイドセッションの処理
 * @returns user, error, getSession, saveSession, removeSession
 */
export function useSession() {
  const user: Ref<User | null> = ref(null);
  const error = ref(null);

  const getSession = async () => {
    try {
      const response = await fetch("/api/session/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }
      const data = await response.json();
      if (data.user) {
        user.value = data.user;
      } else {
        user.value = null;
      }
      return user;
    } catch (err) {
      console.error("セッションの取得に失敗");
    }
  };

  const saveSession = async (userData: any) => {
    try {
      const response = await fetch("/api/session/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          email: userData.email,
          username: userData.username,
        }),
      });

      if (!response.ok) {
        console.error("セッションの保存に失敗しました");
      }
    } catch (err) {
      console.error("セッションの保存中にエラーが発生しました", err);
    }
  };

  const removeSession = async () => {
    try {
      const response = await fetch("/api/session/get", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("またね！");
      }
    } catch (err) {
      console.error("セッションの削除に失敗");
    }
  };

  return {
    user,
    error,
    getSession,
    saveSession,
    removeSession,
  };
}
