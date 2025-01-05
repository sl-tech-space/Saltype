/**
 * 文字列をハイフンで区切り、左側と右側の値を取得する
 * @param id ハイフンで区切られたID文字列
 * @returns 左側と右側の値を含むオブジェクト
 */
export function splitId(id: string): { left: number; right: number } {
  const [left, right] = id.split("-").map(Number);
  return { left, right };
}

/**
 * 文字列を指定された区切り文字で分割する
 * @param str 分割する文字列
 * @param separator 区切り文字（デフォルトは','）
 * @returns 分割された文字列の配列
 */
export function splitString(str: string, separator: string = ","): string[] {
  return str.split(separator);
}

/**
 * 2つの文字列の間にハイフンを挿入する
 * @param str1 最初の文字列
 * @param str2 2番目の文字列
 * @returns ハイフンで結合された文字列
 */
export function joinWithHyphen(str1: string, str2: string): string {
  return `${str1}-${str2}`;
}

/**
 * 文字列から空白を削除する
 * @param str 処理する文字列
 * @returns 空白が削除された文字列
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s/g, "");
}
