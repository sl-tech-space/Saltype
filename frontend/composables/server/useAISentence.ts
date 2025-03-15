import { useUserInfo } from "../common/useUserInfo";
import type { SentenceArray } from "@/types/typing";

/**
 * AIによる文章生成
 */
export function useAISentence(input: string): {
  sentences: () => Promise<SentenceArray>;
} {
  const userInfo = useUserInfo();
  const { user, waitForUser } = userInfo;

  const sentences = async () => {
    try {
      await waitForUser();

      if (!user.value) {
        throw new Error("ユーザ情報が存在しません");
      }

      const response = await fetch("/api/nuxt/generate-sentences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
          user_id: user.value.user_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー`);
      }

      const data = await response.json();

      return data;
    } catch {
      throw new Error("ネットワークエラーまたはその他例外が発生しました");
    }
  };

  return {
    sentences,
  };
}
