import { useInputPattern } from "./useInputPattern";

/**
 * 文章パターンの判定処理
 * @returns getPatternList, getAllCombinations
 */
export function useSentencePattern() {
  const { getPatternArray } = useInputPattern();
  const patternArray = getPatternArray();

  /**
   * 入力パターンを返す
   * @param sentence
   * @returns patterns
   */
  async function getPatternList(sentence: string): Promise<string[][]> {
    const patterns: string[][] = [];
    let i = 0;
    const nagyouChars = "なにぬねの";

    while (i < sentence.length) {
      // 「ん」の文章パターン
      if (sentence[i] === "ん") {
        if (i + 1 < sentence.length && nagyouChars.includes(sentence[i + 1])) {
          patterns.push(["nn"]);
        } else {
          patterns.push(["n", "nn"]);
        }
        i++;
        continue;
      }

      // 「っしょ」のチェック
      if (i + 2 < sentence.length && sentence.slice(i, i + 3) === "っしょ") {
        patterns.push(["ssyo", "sshyo"]);
        i += 3;
        continue;
      }

      // 拗音のチェック
      if (i + 1 < sentence.length) {
        const twoChars = sentence.slice(i, i + 2);
        const matchedPattern = patternArray.find(
          ([hiragana]) => hiragana === twoChars
        );
        if (matchedPattern) {
          patterns.push(matchedPattern[1]);
          i += 2;
          continue;
        }
      }

      // 通常の文字のチェック
      const char = sentence[i];
      const matchedPattern = patternArray.find(
        ([hiragana]) => hiragana === char
      );
      if (matchedPattern) {
        patterns.push(matchedPattern[1]);
      } else {
        patterns.push([char]);
      }
      i++;
    }

    return patterns;
  }

  /**
   * 全ての入力パターンを返す
   * @param patterns
   * @returns combinations
   */
  async function getAllCombinations(patterns: string[][]): Promise<string[]> {
    const combinations: string[] = [""];

    for (const pattern of patterns) {
      const newCombinations: string[] = [];
      for (const combination of combinations) {
        for (const romaji of pattern) {
          newCombinations.push(combination + romaji);
        }
      }
      combinations.splice(0, combinations.length, ...newCombinations);
    }

    return combinations;
  }

  return {
    getPatternList,
    getAllCombinations,
  };
}
