import { getAllRomajiPatterns } from "jp-transliterator";

/**
 * 文章パターンの判定処理
 * @returns getPatternList, getAllCombinations
 */
export function useSentencePattern() {
  /**
   * 全ての入力パターンを返す
   * @param sentence
   * @returns combinations
   */
  async function getAllCombinations(sentence: string): Promise<string[]> {
    try {
      const result = getAllRomajiPatterns(sentence);

      if (!Array.isArray(result)) {
        if (result && "error" in result) {
          throw new Error(result.error);
        }
        return [];
      }

      // 最適化: 一度の反復で直接結果を抽出し、新しい配列を1回だけ生成
      const patterns: string[] = [];
      const length = result.length;

      for (let i = 0; i < length; i++) {
        const pattern = result[i];
        if (Array.isArray(pattern) && pattern.length > 0) {
          const firstElement = pattern[0];
          if (typeof firstElement === "string" && firstElement) {
            patterns.push(firstElement);
          }
        }
      }

      return patterns;
    } catch (error) {
      console.error("パターン変換エラー:", error);
      return [];
    }
  }

  return { getAllCombinations };
}
