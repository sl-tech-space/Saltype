import type { RankingItem } from "../../types/ranking";
import { useLanguageAndDifficulty } from "~/composables/typing/useLanguageAndDifficulty";

/**
 * ランキング画面処理
 * @returns isLoading, error, getRankingByLimitParam,
 * japaneseRankings, englishRankings,
 * rankingDetails, getRankingDetailsByIdAndLimitParam, detailsTitle,
 * dailyJapaneseRankings, dailyEnglishRankings
 */
export function useRanking() {
  const config = useRuntimeConfig();
  const { generateAllCombinations } = useLanguageAndDifficulty();

  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const rankingsByCombination = ref<Record<string, RankingItem[]>>({});
  const japaneseRankings = ref<Record<string, RankingItem[]>>({});
  const englishRankings = ref<Record<string, RankingItem[]>>({});
  const dailyJapaneseRankings = ref<Record<string, RankingItem[]>>({});
  const dailyEnglishRankings = ref<Record<string, RankingItem[]>>({});
  const rankingDetails = ref<RankingItem[]>([]);
  const detailsTitle = ref<string>();

  /**
   * 全言語、全難易度のランキングデータ取得
   * @param limit
   */
  const getRankingByLimitParam = async (limit: number): Promise<void> => {
    const allCombinations = generateAllCombinations();

    // すべての組み合わせでランキングデータを取得
    for (const { languageId, difficultyId } of allCombinations) {
      const key = `${languageId}-${difficultyId}`;
      const rankings = await _getRanking(languageId, difficultyId, limit);
      rankingsByCombination.value[key] = rankings.data;

      switch (key.charAt(0)) {
        case "1":
          japaneseRankings.value[key] = rankingsByCombination.value[key];
          break;
        case "2":
          englishRankings.value[key] = rankingsByCombination.value[key];
          break;
      }
    }

    isLoading.value = false;
  };

  /**
   * 今日のランキングデータ(全言語、全難易度)取得
   * @param limit
   */
  const getDailyRankingByLimitParam = async (limit: number): Promise<void> => {
    const allCombinations = generateAllCombinations();

    // 日付取得
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    // すべての組み合わせでランキングデータを取得
    for (const { languageId, difficultyId } of allCombinations) {
      const key = `${languageId}-${difficultyId}`;
      const rankings = await _getRanking(
        languageId,
        difficultyId,
        limit,
        formattedDate
      );
      rankingsByCombination.value[key] = rankings.data;

      switch (key.charAt(0)) {
        case "1":
          dailyJapaneseRankings.value[key] = rankingsByCombination.value[key];
          break;
        case "2":
          dailyEnglishRankings.value[key] = rankingsByCombination.value[key];
          break;
      }
    }
  };

  /**
   * 指定した言語＋難易度のランキング詳細データ取得
   * @param id
   * @param limit
   */
  const getRankingDetailsByIdAndLimitParam = async (
    id: string,
    limit: number
  ): Promise<void> => {
    const splitedId = splitId(id);

    const rankings = await _getRanking(splitedId.left, splitedId.right, limit);

    rankingDetails.value = rankings.data;

    detailsTitle.value =
      convertNumberToJapaneseLanguageName(splitedId.left.toString()) +
      " - " +
      convertNumberToJapaneseDifficultyLevelName(splitedId.right.toString());
  };

  /**
   * ランキングデータ取得
   * @param language
   * @param difficulty
   * @param limit
   * @param date デイリーランキング取得用
   * @returns data
   */
  const _getRanking = async (
    language: number,
    difficulty: number,
    limit: number,
    date?: string
  ) => {
    try {
      const body = {
        lang_id: language,
        diff_id: difficulty,
        limit: limit,
        ...(date && { date }),
      };

      const response = await fetch(
        `${config.public.baseURL}/api/django/ranking/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        error.value = "ランキングデータ取得に失敗しました";
      }

      const data = await response.json();

      return data;
    } catch (e) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    }
  };

  return {
    isLoading,
    error,
    japaneseRankings,
    englishRankings,
    dailyJapaneseRankings,
    dailyEnglishRankings,
    rankingDetails,
    detailsTitle,
    getRankingByLimitParam,
    getDailyRankingByLimitParam,
    getRankingDetailsByIdAndLimitParam,
  };
}
