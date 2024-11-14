import type { RankingItem } from "../../types/ranking";
import { useLanguageAndDifficulty } from "~/composables/typing/useLanguageAndDifficulty";

/**
 * ランキング画面処理
 * @returns isLoading, getRankingByLimitParam,
 * japaneseRankings, englishRankings,
 * dailyJapaneseRankings, dailyEnglishRankings
 */
export function useRanking() {
  const config = useRuntimeConfig();
  const { generateAllCombinations } = useLanguageAndDifficulty();

  const isLoading = ref(true);
  const rankingsByCombination = ref<Record<string, RankingItem[]>>({});
  const japaneseRankings = ref<Record<string, RankingItem[]>>({});
  const englishRankings = ref<Record<string, RankingItem[]>>({});
  const dailyJapaneseRankings = ref<Record<string, RankingItem[]>>({});
  const dailyEnglishRankings = ref<Record<string, RankingItem[]>>({});

  /**
   * 全言語、全難易度のランキングデータ取得
   * @param limit
   */
  const getRankingByLimitParam = async (limit: number) => {
    const allCombinations = generateAllCombinations();

    // すべての組み合わせでランキングデータを取得
    for (const { languageId, difficultyId } of allCombinations) {
      const key = `${languageId}-${difficultyId}`;
      const rankings = await _getRanking(languageId, difficultyId, limit);
      rankingsByCombination.value[key] = rankings;

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
   * 全言語、全難易度、今日のランキングデータ取得
   * @param limit
   */
  const getDailyRankingByLimitParam = async (limit: number) => {
    const allCombinations = generateAllCombinations();

    // 日付取得
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // すべての組み合わせでランキングデータを取得
    for (const { languageId, difficultyId } of allCombinations) {
      const key = `${languageId}-${difficultyId}`;
      const rankings = await _getRanking(languageId, difficultyId, limit, formattedDate);
      rankingsByCombination.value[key] = rankings;

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
   * ランキングデータ取得
   * @param language
   * @param difficulty
   * @param limit
   * @param date デイリーランキング取得用
   * @returns data
   */
  const _getRanking = async (
    language: Number,
    difficulty: Number,
    limit: Number,
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
        }
      );

      if (!response.ok) {
        throw new Error("ランキングデータ取得に失敗しました");
      }

      const data = await response.json();

      return data;
    } catch (e) {}
  };

  return {
    isLoading,
    japaneseRankings,
    englishRankings,
    dailyJapaneseRankings,
    dailyEnglishRankings,
    getRankingByLimitParam,
    getDailyRankingByLimitParam
  };
}
