import type { SentenceArray } from "@/types/typing";

/**
 * AIによる文章生成
 */
export function useAISentence(input: string): { sentences: () => Promise<SentenceArray> } {
  const sentences = async () => {
    try {
      const response = await fetch("/api/nuxt/generate-sentences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
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
