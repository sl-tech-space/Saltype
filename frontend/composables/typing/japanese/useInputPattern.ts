/**
 * 単一文字入力パターン
 * @returns getPatternArray - 全ての入力パターンを取得
 * @returns getVowelPatternArray - 母音の入力パターンを取得
 * @returns getSymbolsPatternArray - 記号の入力パターンを取得
 */
export function useInputPattern() {
  const vowelInputPattern: string[] = ["a", "i", "u", "e", "o"];
  const symbolsInputPattern: string[] = [
    "?",
    ",",
    ".",
    "-",
    "!",
    "#",
    "%",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
  ];

  function getVowelPatternArray(): string[] {
    return vowelInputPattern;
  }

  function getSymbolsPatternArray(): string[] {
    return symbolsInputPattern;
  }

  return {
    getVowelPatternArray,
    getSymbolsPatternArray,
  };
}
