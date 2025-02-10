import { Romanizer } from "jp-transliterator";

/**
 * 文章パターンの判定処理
 * @returns getPatternList, getAllCombinations
 */
export function useSentencePattern() {
  /**
   * 全ての入力パターンを返す
   * @param patterns
   * @returns combinations
   */
  async function getAllCombinations(sentence: string): Promise<string[]> {
    const combinations = new Romanizer().transliterate(sentence);

    if (Array.isArray(combinations)) {
      return combinations.map(([romaji]) => romaji.join(""));
    } else if (combinations && "error" in combinations) {
      throw new Error(combinations.error);
    } else {
      return [];
    }
  }

  return {
    getAllCombinations,
  };
}
