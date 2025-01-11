import type { RankingItem } from "~/types/ranking";
import type { ApiUserList } from "~/types/user";
import type { UserList } from "~/types/user";

/**
 * 受け渡した文字の変換(英語)
 * 1 → japanese, 2 → english
 * 数字 → 文字
 * @param language
 * @returns languageMap[language.toLowerCase()] || language
 */
export function convertNumberToEnglishLanguageName(
  languageCode: string
): string {
  const languageMap: { [key: string]: string } = {
    "1": "japanese",
    "2": "english",
  };
  return languageMap[languageCode.toLowerCase()] || languageCode;
}

/**
 * 受け渡した文字の変換(英語)
 * 1 → easy, 2 → normal, 3 → hard
 * 数字 → 文字
 * @param difficultyLevel
 * @returns difficultyMap[difficultyLevel.toLowerCase()] || difficultyLevel
 */
export function convertNumberToEnglishDifficultyLevelName(
  difficultyLevelCode: string
): string {
  const difficultyMap: { [key: string]: string } = {
    "1": "easy",
    "2": "normal",
    "3": "hard",
  };
  return (
    difficultyMap[difficultyLevelCode.toLowerCase()] || difficultyLevelCode
  );
}

/**
 * 受け渡した文字の変換(日本語)
 * 1 → 日本語, 2 → 英語
 * 数字 → 文字
 * @param language
 * @returns languageMap[language.toLowerCase()] || language
 */
export function convertNumberToJapaneseLanguageName(
  languageCode: string
): string {
  const languageMap: { [key: string]: string } = {
    "1": "日本語",
    "2": "英語",
  };
  return languageMap[languageCode.toLowerCase()] || languageCode;
}

/**
 * 受け渡した文字の変換(日本語)
 * 1 → イージー, 2 → ノーマル, 3 → ハード
 * 数字 → 文字
 * @param difficultyLevel
 * @returns difficultyMap[difficultyLevel.toLowerCase()] || difficultyLevel
 */
export function convertNumberToJapaneseDifficultyLevelName(
  difficultyLevelCode: string
): string {
  const difficultyMap: { [key: string]: string } = {
    "1": "イージー",
    "2": "ノーマル",
    "3": "ハード",
  };
  return (
    difficultyMap[difficultyLevelCode.toLowerCase()] || difficultyLevelCode
  );
}

/**
 * ランキングデータをオブジェクトから配列に変換
 * 元データが配列の場合は変換しない
 * @param obj 
 * @returns RankingItem
 */
export function objectToRankingItem(obj: Record<string, RankingItem> | RankingItem[]): RankingItem[] {
  if (Array.isArray(obj)) {
    return obj;
  }
  return Object.values(obj);
};

/**
 * APIで取得したユーザデータを加工
 * @param apiUser 
 * @returns UserList
 */
export function convertToUserList(apiUser: ApiUserList): UserList {
  return {
    userId: apiUser.user_id,
    userName: apiUser.username,
    email: apiUser.email,
    todaysMaxScore: apiUser.highest_score?.toString() ?? '0',
    userRank: apiUser.rank_name ?? 'N/A',
    passwordExists: apiUser.password_exists,
  };
}
